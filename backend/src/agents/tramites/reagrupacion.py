from langchain_core.messages import AIMessage, SystemMessage
from ...config.llm import get_llm
from ...config.cultural import construir_contexto_cultural
from ...rag.retriever import buscar_contexto
from ...prompts.reagrupacion import REAGRUPACION_PROMPT
from ...prompts.base import BLOQUE_CULTURAL


async def agente_reagrupacion(state: dict) -> dict:
    llm  = get_llm("reagrupacion")
    pais = state.get("pais") or "Colombia"
    edad = state.get("rango_edad") or "26-35"

    # La pregunta del usuario es el último mensaje en el estado
    pregunta = state["messages"][-1].content

    perfil = construir_contexto_cultural(pais, edad)
    rag    = buscar_contexto(pregunta, tramite="reagrupacion")

    bloque = BLOQUE_CULTURAL.format(
        pais=perfil["pais"], rango_edad=perfil["rango_edad"],
        idioma_nombre=perfil["idioma_nombre"],
        contexto_cultural=perfil["contexto_cultural"],
        tono_edad=perfil["tono_edad"],
    )
    prompt = REAGRUPACION_PROMPT.format(
        bloque_cultural=bloque,
        especialidad="reagrupación familiar",
        contexto_rag=rag,
    )

    # Construimos la lista de mensajes para el LLM
    messages = [SystemMessage(content=prompt)] + state["messages"]
    respuesta = await llm.ainvoke(messages)
    ai_message = AIMessage(content=respuesta.content)

    return {
        "expert_response":   respuesta.content,
        "tramite_detectado": "reagrupacion",
        "last_agent":        "reagrupacion",
        "idioma_codigo":     perfil["idioma_codigo"],
    }