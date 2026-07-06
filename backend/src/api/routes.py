from datetime import datetime, timezone
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
from langchain_core.messages import HumanMessage
from ..tools.pdf_reader import extract_text_from_pdf
from ..db.supabase_client import supabase_manager, supabase
from ..config.cultural import construir_contexto_cultural, PAISES_IDIOMAS
from ..config.llm import get_langfuse_callback
from fastapi.responses import StreamingResponse
import json

# ✅ Lazy load del grafo (CLAVE para evitar Out of Memory)
migrai_graph = None

def get_graph():
    global migrai_graph
    if migrai_graph is None:
        from ..graph.orchestrator import migrai_graph as graph
        migrai_graph = graph
    return migrai_graph

router = APIRouter(prefix="/api/v1", tags=["migrai"])


# ── Modelos de datos ──────────────────────────────────────────────────────

class PerfilRequest(BaseModel):
    sesion_id: str
    pais: str
    rango_edad: str


class PreguntaRequest(BaseModel):
    pregunta: str
    sesion_id: str
    pais: str
    rango_edad: str
    contexto: Optional[str] = None


class PreguntaResponse(BaseModel):
    respuesta: str
    tramite_detectado: str
    conversacion_id: str
    idioma_usado: str


class FeedbackRequest(BaseModel):
    conversacion_id: str
    dudas_resueltas: bool


# ── Endpoints ─────────────────────────────────────────────────────────────

@router.get("/paises")
async def listar_paises():
    return {
        "paises": sorted(PAISES_IDIOMAS.keys()),
        "rangos_edad": ["18-25", "26-35", "36-50", "51+"],
    }


@router.post("/sesion")
async def crear_sesion(body: PerfilRequest):
    perfil = construir_contexto_cultural(body.pais, body.rango_edad)
    ahora = datetime.now(timezone.utc).isoformat()

    datos = {
        "pais": body.pais,
        "rango_edad": body.rango_edad,
        "idioma": perfil["idioma_codigo"],
        "ultimo_acceso": ahora,
    }

    existe = supabase.table("sesiones").select("id").eq("id", body.sesion_id).execute()
    if existe.data:
        supabase.table("sesiones").update(datos).eq("id", body.sesion_id).execute()
    else:
        supabase.table("sesiones").insert({
            "id": body.sesion_id,
            "creado_en": ahora,
            **datos,
        }).execute()

    return {
        "sesion_id": body.sesion_id,
        "idioma": perfil["idioma_nombre"],
        "status": "ok",
    }


@router.post("/preguntar", response_model=PreguntaResponse)
async def preguntar(request: PreguntaRequest):
    perfil = construir_contexto_cultural(request.pais, request.rango_edad)

    try:
        graph = get_graph()  # ✅ SIEMPRE usar esto

        input_data = {
            "messages": [HumanMessage(content=request.pregunta)],
            "pais": request.pais,
            "rango_edad": request.rango_edad,
            "idioma_codigo": perfil["idioma_codigo"],
            "idioma_nombre": perfil["idioma_nombre"],
            "contexto_cultural": perfil["contexto_cultural"],
            "tono_edad": perfil["tono_edad"],
        }

        config = {
            "configurable": {"thread_id": request.sesion_id},
            "callbacks": [get_langfuse_callback()] if get_langfuse_callback() else [],
            "metadata": {
                "session_id": request.sesion_id,
                "user_id": request.sesion_id,
                "pais": request.pais
            }
        }

        resultado = await graph.ainvoke(input_data, config=config)

        final_response = resultado["messages"][-1].content

        conversacion_id = supabase_manager.guardar_conversacion(
            sesion_id=request.sesion_id,
            tramite=resultado.get("tramite_detectado", "desconocido"),
            pregunta=request.pregunta,
            respuesta=final_response,
            agente_usado=resultado.get("last_agent", "desconocido"),
            idioma_respuesta=perfil["idioma_codigo"],
            pais_usuario=request.pais,
        )

        return PreguntaResponse(
            respuesta=final_response,
            tramite_detectado=resultado.get("tramite_detectado", "desconocido"),
            conversacion_id=conversacion_id,
            idioma_usado=perfil["idioma_nombre"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/preguntar-stream")
async def preguntar_stream(request: PreguntaRequest):

    perfil = construir_contexto_cultural(request.pais, request.rango_edad)

    async def generar():
        try:
            graph = get_graph()  # ✅ CLAVE

            input_data = {
                "messages": [HumanMessage(content=request.pregunta)],
                "pais": request.pais,
                "rango_edad": request.rango_edad,
                "idioma_codigo": perfil["idioma_codigo"],
                "idioma_nombre": perfil["idioma_nombre"],
                "contexto_cultural": perfil["contexto_cultural"],
                "tono_edad": perfil["tono_edad"],
            }

            config = {
                "configurable": {"thread_id": request.sesion_id},
                "callbacks": [get_langfuse_callback()] if get_langfuse_callback() else [],
                "metadata": {
                    "session_id": request.sesion_id,
                    "user_id": request.sesion_id,
                    "pais": request.pais
                }
            }

            respuesta_completa = ""
            tramite_detectado = "desconocido"
            last_agent = "desconocido"

            async for evento in graph.astream_events(input_data, config=config, version="v2"):
                tipo = evento.get("event")

                if tipo == "on_chat_model_stream" and evento.get("name", "").startswith("llm_respuesta_final"):
                    chunk = evento.get("data", {}).get("chunk", {}).get("content")
                    if chunk:
                        respuesta_completa += chunk
                        yield f"data: {json.dumps({'token': chunk})}\n\n"

                elif tipo == "on_chain_end" and evento.get("name") == "LangGraph":
                    estado_final = evento.get("data", {}).get("output", {})
                    tramite_detectado = estado_final.get("tramite_detectado", "desconocido")
                    last_agent = estado_final.get("last_agent", "desconocido")

            conversacion_id = supabase_manager.guardar_conversacion(
                sesion_id=request.sesion_id,
                tramite=tramite_detectado,
                pregunta=request.pregunta,
                respuesta=respuesta_completa,
                agente_usado=last_agent,
                idioma_respuesta=perfil["idioma_codigo"],
                pais_usuario=request.pais,
            )

            yield f"data: {json.dumps({'fin': True, 'conversacion_id': conversacion_id})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(generar(), media_type="text/event-stream")


@router.post("/preguntar-con-documento", response_model=PreguntaResponse)
async def preguntar_con_documento(
    pregunta: str = Form(...),
    sesion_id: str = Form(...),
    pais: str = Form(...),
    rango_edad: str = Form(...),
    archivo: UploadFile = File(...),
):

    perfil = construir_contexto_cultural(pais, rango_edad)

    try:
        graph = get_graph()  # ✅ CLAVE

        texto_doc = extract_text_from_pdf(await archivo.read())

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

        resultado = await graph.ainvoke(input_data, config=config)

        final_response = resultado["messages"][-1].content

        conversacion_id = supabase_manager.guardar_conversacion(
            sesion_id=sesion_id,
            tramite=resultado.get("tramite_detectado", "documentos"),
            pregunta=pregunta,
            respuesta=final_response,
            agente_usado=resultado.get("last_agent", "documentos"),
            idioma_respuesta=perfil["idioma_codigo"],
            pais_usuario=pais,
        )

        return PreguntaResponse(
            respuesta=final_response,
            tramite_detectado=resultado.get("tramite_detectado", "documentos"),
            conversacion_id=conversacion_id,
            idioma_usado=perfil["idioma_nombre"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health():
    return {"status": "ok"}