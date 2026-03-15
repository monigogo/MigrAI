from datetime import datetime, timezone
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
from langchain_core.messages import HumanMessage

from ..graph.orchestrator import migrai_graph
from ..tools.pdf_reader import extract_text_from_pdf
from ..db.supabase_client import supabase_manager, supabase
from ..config.cultural import construir_contexto_cultural, PAISES_IDIOMAS

router = APIRouter(prefix="/api/v1", tags=["migrai"])


# ── Modelos de datos ──────────────────────────────────────────────────────

class PerfilRequest(BaseModel):
    sesion_id:  str
    pais:       str
    rango_edad: str


class PreguntaRequest(BaseModel):
    pregunta:   str
    sesion_id:  str
    pais:       str
    rango_edad: str
    contexto:   Optional[str] = None


class PreguntaResponse(BaseModel):
    respuesta:         str
    tramite_detectado: str
    conversacion_id:   str
    idioma_usado:      str


class FeedbackRequest(BaseModel):
    conversacion_id: str
    dudas_resueltas: bool


# ── Endpoints ─────────────────────────────────────────────────────────────

@router.get("/paises")
async def listar_paises():
    """Lista de países disponibles para el selector del frontend."""
    return {
        "paises":      sorted(PAISES_IDIOMAS.keys()),
        "rangos_edad": ["18-25", "26-35", "36-50", "51+"],
    }


@router.post("/sesion")
async def crear_sesion(body: PerfilRequest):
    """
    Crea o actualiza la sesión anónima del usuario.
    Se llama al terminar la pantalla de bienvenida.
    """
    perfil = construir_contexto_cultural(body.pais, body.rango_edad)
    ahora  = datetime.now(timezone.utc).isoformat()

    datos = {
        "pais":          body.pais,
        "rango_edad":    body.rango_edad,
        "idioma":        perfil["idioma_codigo"],
        "ultimo_acceso": ahora,
    }

    existe = supabase.table("sesiones").select("id").eq("id", body.sesion_id).execute()
    if existe.data:
        supabase.table("sesiones").update(datos).eq("id", body.sesion_id).execute()
    else:
        supabase.table("sesiones").insert({
            "id":       body.sesion_id,
            "creado_en": ahora,
            **datos,
        }).execute()

    return {
        "sesion_id": body.sesion_id,
        "idioma":    perfil["idioma_nombre"],
        "status":    "ok",
    }


@router.post("/preguntar", response_model=PreguntaResponse)
async def preguntar(request: PreguntaRequest):
    """Endpoint principal: recibe la pregunta y devuelve la respuesta del agente."""
    perfil = construir_contexto_cultural(request.pais, request.rango_edad)
    try:
        # El input para el grafo ahora es un diccionario con los mensajes
        # y los datos del perfil que no cambian en la conversación.
        input_data = {
            "messages": [HumanMessage(content=request.pregunta)],
            "pais": request.pais,
            "rango_edad": request.rango_edad,
            "idioma_codigo": perfil["idioma_codigo"],
            "idioma_nombre": perfil["idioma_nombre"],
            "contexto_cultural": perfil["contexto_cultural"],
            "tono_edad": perfil["tono_edad"],
        }

        config = {"configurable": {"thread_id": request.sesion_id}}
        # Invocamos el grafo con el nuevo input. LangGraph cargará el historial.
        resultado = await migrai_graph.ainvoke(input_data, config=config)

        # La respuesta final está en el último mensaje del estado
        final_response = resultado["messages"][-1].content

        conversacion_id = supabase_manager.guardar_conversacion(
            sesion_id=        request.sesion_id,
            tramite=          resultado.get("tramite_detectado", "desconocido"),
            pregunta=         request.pregunta,
            respuesta=        final_response,
            agente_usado=     resultado.get("last_agent", "desconocido"),
            idioma_respuesta= perfil["idioma_codigo"],
            pais_usuario=     request.pais,
        )

        return PreguntaResponse(
            respuesta=         final_response,
            tramite_detectado= resultado.get("tramite_detectado", "desconocido"),
            conversacion_id=   conversacion_id,
            idioma_usado=      perfil["idioma_nombre"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/preguntar-con-documento", response_model=PreguntaResponse)
async def preguntar_con_documento(
    pregunta:   str        = Form(...),
    sesion_id:  str        = Form(...),
    pais:       str        = Form(...),
    rango_edad: str        = Form(...),
    archivo:    UploadFile = File(...),
):
    """Endpoint para cuando el usuario adjunta un PDF de su comunidad."""
    perfil = construir_contexto_cultural(pais, rango_edad)
    try:
        texto_doc = extract_text_from_pdf(await archivo.read())

        # El input para el grafo ahora es un diccionario con los mensajes
        # y los datos del perfil que no cambian en la conversación.
        input_data = {
            "messages": [HumanMessage(content=pregunta)],
            "document_content": texto_doc,
            "pais": pais,
            "rango_edad": rango_edad,
            "idioma_codigo": perfil["idioma_codigo"],
            "idioma_nombre": perfil["idioma_nombre"],
            "contexto_cultural": perfil["contexto_cultural"],
            "tono_edad": perfil["tono_edad"],
        }

        config = {"configurable": {"thread_id": sesion_id}}
        # Invocamos el grafo con el nuevo input. LangGraph cargará el historial.
        resultado = await migrai_graph.ainvoke(input_data, config=config)

        # La respuesta final está en el último mensaje del estado
        final_response = resultado["messages"][-1].content

        conversacion_id = supabase_manager.guardar_conversacion(
            sesion_id=        sesion_id,
            tramite=          resultado.get("tramite_detectado", "documentos"),
            pregunta=         pregunta,
            respuesta=        final_response,
            agente_usado=     resultado.get("last_agent", "documentos"),
            idioma_respuesta= perfil["idioma_codigo"],
            pais_usuario=     pais,
        )

        return PreguntaResponse(
            respuesta=         final_response,
            tramite_detectado= resultado.get("tramite_detectado", "documentos"),
            conversacion_id=   conversacion_id,
            idioma_usado=      perfil["idioma_nombre"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/feedback")
async def guardar_feedback(request: FeedbackRequest):
    """
    Guarda si el usuario resolvió sus dudas.
    Si dice NO → la conversación se marca para análisis y mejora.
    """
    supabase_manager.guardar_feedback(
        conversacion_id= request.conversacion_id,
        dudas_resueltas= request.dudas_resueltas,
    )

    if not request.dudas_resueltas:
        return {
            "status":  "guardado",
            "mensaje": "Hemos registrado tu consulta para mejorar el servicio.",
        }
    return {
        "status":  "guardado",
        "mensaje": "Nos alegra haberte podido ayudar.",
    }


@router.get("/historial/{sesion_id}")
async def obtener_historial(sesion_id: str):
    """Devuelve el historial completo de conversaciones de una sesión."""
    return {"historial": supabase_manager.obtener_historial(sesion_id)}


@router.get("/health")
async def health():
    return {"status": "ok", "servicio": "migrai-backend"}