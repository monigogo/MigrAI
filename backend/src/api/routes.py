import asyncio
import json
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Request, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import Optional
from langchain_core.messages import HumanMessage
from slowapi import Limiter
from slowapi.util import get_remote_address
from ..tools.pdf_reader import extract_text_from_pdf
from ..db.supabase_client import supabase_manager, supabase
from ..config.cultural import construir_contexto_cultural, PAISES_IDIOMAS
from ..config.llm import get_langfuse_callback
from ..guardarrail import validar_entrada, validar_documento, revisar_salida
from fastapi.responses import StreamingResponse

logger = logging.getLogger(__name__)

# ✅ Lazy load del grafo (CLAVE para evitar Out of Memory)
migrai_graph = None

def get_graph():
    global migrai_graph
    if migrai_graph is None:
        from ..graph.orchestrator import migrai_graph as graph
        migrai_graph = graph
    return migrai_graph

router = APIRouter(prefix="/api/v1", tags=["migrai"])

# Rate limiting por IP — protege la cuota de Groq/OpenRouter de abusos
limiter = Limiter(key_func=get_remote_address)

MAX_PDF_BYTES = 10 * 1024 * 1024  # 10 MB


async def guardar_conversacion_seguro(**kwargs) -> str:
    """Guarda la conversación sin tumbar la petición si la BD no responde:
    la respuesta ya generada le llega al usuario aunque no se persista."""
    try:
        return await asyncio.to_thread(supabase_manager.guardar_conversacion, **kwargs)
    except Exception:
        logger.exception("No se pudo guardar la conversación (¿BD inaccesible?)")
        return ""


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


def _crear_o_actualizar_sesion_sync(sesion_id: str, datos: dict, ahora: str) -> None:
    existe = supabase.table("sesiones").select("id").eq("id", sesion_id).execute()
    if existe.data:
        supabase.table("sesiones").update(datos).eq("id", sesion_id).execute()
    else:
        supabase.table("sesiones").insert({
            "id": sesion_id,
            "creado_en": ahora,
            **datos,
        }).execute()


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

    await asyncio.to_thread(_crear_o_actualizar_sesion_sync, body.sesion_id, datos, ahora)

    return {
        "sesion_id": body.sesion_id,
        "idioma": perfil["idioma_nombre"],
        "status": "ok",
    }


@router.post("/preguntar", response_model=PreguntaResponse)
@limiter.limit("10/minute")
async def preguntar(request: Request, body: PreguntaRequest):
    perfil = construir_contexto_cultural(body.pais, body.rango_edad)

    try:
        bloqueo = await validar_entrada(body.pregunta, contexto="preguntar")
        if bloqueo:
            conversacion_id = await guardar_conversacion_seguro(
                sesion_id=body.sesion_id,
                tramite="bloqueado",
                pregunta=body.pregunta,
                respuesta=bloqueo,
                agente_usado="guardarrail",
                idioma_respuesta=perfil["idioma_codigo"],
                pais_usuario=body.pais,
            )
            return PreguntaResponse(
                respuesta=bloqueo,
                tramite_detectado="bloqueado",
                conversacion_id=conversacion_id,
                idioma_usado=perfil["idioma_nombre"],
            )

        graph = get_graph()  # ✅ SIEMPRE usar esto

        input_data = {
            "messages": [HumanMessage(content=body.pregunta)],
            "pais": body.pais,
            "rango_edad": body.rango_edad,
            "idioma_codigo": perfil["idioma_codigo"],
            "idioma_nombre": perfil["idioma_nombre"],
            "contexto_cultural": perfil["contexto_cultural"],
            "tono_edad": perfil["tono_edad"],
        }

        config = {
            "configurable": {"thread_id": body.sesion_id},
            "callbacks": [cb] if (cb := get_langfuse_callback()) else [],
            "metadata": {
                "session_id": body.sesion_id,
                "user_id": body.sesion_id,
                "pais": body.pais
            }
        }

        resultado = await graph.ainvoke(input_data, config=config)

        final_response = await revisar_salida(resultado["messages"][-1].content, contexto="preguntar")

        conversacion_id = await guardar_conversacion_seguro(
            sesion_id=body.sesion_id,
            tramite=resultado.get("tramite_detectado", "desconocido"),
            pregunta=body.pregunta,
            respuesta=final_response,
            agente_usado=resultado.get("last_agent", "desconocido"),
            idioma_respuesta=perfil["idioma_codigo"],
            pais_usuario=body.pais,
        )

        return PreguntaResponse(
            respuesta=final_response,
            tramite_detectado=resultado.get("tramite_detectado", "desconocido"),
            conversacion_id=conversacion_id,
            idioma_usado=perfil["idioma_nombre"],
        )

    except Exception:
        logger.exception("Error en preguntar")
        raise HTTPException(status_code=500, detail="No se pudo procesar tu pregunta. Inténtalo de nuevo.")


@router.post("/preguntar-stream")
@limiter.limit("10/minute")
async def preguntar_stream(request: Request, body: PreguntaRequest):

    perfil = construir_contexto_cultural(body.pais, body.rango_edad)

    async def generar():
        try:
            bloqueo = await validar_entrada(body.pregunta, contexto="stream")
            if bloqueo:
                yield f"data: {json.dumps({'token': bloqueo})}\n\n"
                conversacion_id = await guardar_conversacion_seguro(
                    sesion_id=body.sesion_id,
                    tramite="bloqueado",
                    pregunta=body.pregunta,
                    respuesta=bloqueo,
                    agente_usado="guardarrail",
                    idioma_respuesta=perfil["idioma_codigo"],
                    pais_usuario=body.pais,
                )
                yield f"data: {json.dumps({'fin': True, 'conversacion_id': conversacion_id, 'tramite_detectado': 'bloqueado', 'idioma_usado': perfil['idioma_nombre']})}\n\n"
                return

            graph = get_graph()  # ✅ CLAVE

            input_data = {
                "messages": [HumanMessage(content=body.pregunta)],
                "pais": body.pais,
                "rango_edad": body.rango_edad,
                "idioma_codigo": perfil["idioma_codigo"],
                "idioma_nombre": perfil["idioma_nombre"],
                "contexto_cultural": perfil["contexto_cultural"],
                "tono_edad": perfil["tono_edad"],
            }

            config = {
                "configurable": {"thread_id": body.sesion_id},
                "callbacks": [cb] if (cb := get_langfuse_callback()) else [],
                "metadata": {
                    "session_id": body.sesion_id,
                    "user_id": body.sesion_id,
                    "pais": body.pais
                }
            }

            respuesta_completa = ""
            tramite_detectado = "desconocido"
            last_agent = "desconocido"

            async for evento in graph.astream_events(input_data, config=config, version="v2"):
                tipo = evento.get("event")

                if tipo == "on_chat_model_stream" and evento.get("name", "").startswith("llm_respuesta_final"):
                    # data.chunk es un AIMessageChunk (objeto), no un dict
                    chunk = getattr(evento.get("data", {}).get("chunk"), "content", None)
                    if chunk:
                        respuesta_completa += chunk
                        yield f"data: {json.dumps({'token': chunk})}\n\n"

                elif tipo == "on_chain_end" and evento.get("name") == "LangGraph":
                    estado_final = evento.get("data", {}).get("output", {})
                    tramite_detectado = estado_final.get("tramite_detectado", "desconocido")
                    last_agent = estado_final.get("last_agent", "desconocido")

            respuesta_completa = await revisar_salida(respuesta_completa, contexto="stream")

            conversacion_id = await guardar_conversacion_seguro(
                sesion_id=body.sesion_id,
                tramite=tramite_detectado,
                pregunta=body.pregunta,
                respuesta=respuesta_completa,
                agente_usado=last_agent,
                idioma_respuesta=perfil["idioma_codigo"],
                pais_usuario=body.pais,
            )

            yield f"data: {json.dumps({'fin': True, 'conversacion_id': conversacion_id, 'tramite_detectado': tramite_detectado, 'idioma_usado': perfil['idioma_nombre']})}\n\n"

        except Exception:
            logger.exception("Error en preguntar-stream")
            yield f"data: {json.dumps({'error': 'No se pudo procesar tu pregunta. Inténtalo de nuevo.'})}\n\n"

    return StreamingResponse(generar(), media_type="text/event-stream")


@router.post("/preguntar-con-documento", response_model=PreguntaResponse)
@limiter.limit("10/minute")
async def preguntar_con_documento(
    request: Request,
    pregunta: str = Form(...),
    sesion_id: str = Form(...),
    pais: str = Form(...),
    rango_edad: str = Form(...),
    archivo: UploadFile = File(...),
):

    perfil = construir_contexto_cultural(pais, rango_edad)

    if archivo.content_type != "application/pdf":
        raise HTTPException(status_code=415, detail="Solo se aceptan ficheros PDF.")

    contenido_archivo = await archivo.read()
    if len(contenido_archivo) > MAX_PDF_BYTES:
        raise HTTPException(status_code=413, detail="El fichero supera el tamaño máximo de 10 MB.")

    try:
        texto_doc = await asyncio.to_thread(extract_text_from_pdf, contenido_archivo)

        bloqueo = await validar_entrada(pregunta, contexto="documento_pregunta")
        if not bloqueo:
            bloqueo = validar_documento(texto_doc, contexto="documento_contenido")

        if bloqueo:
            conversacion_id = await guardar_conversacion_seguro(
                sesion_id=sesion_id,
                tramite="bloqueado",
                pregunta=pregunta,
                respuesta=bloqueo,
                agente_usado="guardarrail",
                idioma_respuesta=perfil["idioma_codigo"],
                pais_usuario=pais,
            )
            return PreguntaResponse(
                respuesta=bloqueo,
                tramite_detectado="bloqueado",
                conversacion_id=conversacion_id,
                idioma_usado=perfil["idioma_nombre"],
            )

        graph = get_graph()  # ✅ CLAVE

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

        config = {
            "configurable": {"thread_id": sesion_id},
            "callbacks": [cb] if (cb := get_langfuse_callback()) else [],
            "metadata": {
                "session_id": sesion_id,
                "user_id": sesion_id,
                "pais": pais,
            },
        }

        resultado = await graph.ainvoke(input_data, config=config)

        final_response = await revisar_salida(resultado["messages"][-1].content, contexto="documento")

        conversacion_id = await guardar_conversacion_seguro(
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

    except Exception:
        logger.exception("Error en preguntar-con-documento")
        raise HTTPException(status_code=500, detail="No se pudo procesar tu pregunta. Inténtalo de nuevo.")


@router.post("/feedback")
async def feedback(body: FeedbackRequest):
    await asyncio.to_thread(supabase_manager.guardar_feedback, body.conversacion_id, body.dudas_resueltas)
    return {"status": "ok"}


@router.get("/historial/{sesion_id}")
async def historial(sesion_id: str):
    historial_datos = await asyncio.to_thread(supabase_manager.obtener_historial, sesion_id)
    return {"historial": historial_datos}


@router.get("/health")
async def health():
    return {"status": "ok"}