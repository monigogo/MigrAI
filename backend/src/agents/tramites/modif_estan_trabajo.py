from langchain_core.messages import AIMessage, SystemMessage
from ...config.llm import get_llm
from ...config.cultural import construir_contexto_cultural
from ...rag.retriever import buscar_contexto
from ...prompts.modif_estancia_trabajo import MODIF_ESTANCIA_TRABAJO_PROMPT
from ...prompts.base import BLOQUE_CULTURAL


async def agente_modif_estancia_trabajo(state: dict) -> dict:
    llm  = get_llm("modif_estancia_trabajo")
    pais = state.get("pais") or "Colombia"
    edad = state.get("rango_edad") or "26-35"

    # La pregunta del usuario es el último mensaje en el estado
    pregunta = state["messages"][-1].content

    perfil = construir_contexto_cultural(pais, edad)
    rag    = buscar_contexto(pregunta, tramite="modif_estancia_trabajo")

    bloque = BLOQUE_CULTURAL.format(
        pais=perfil["pais"], rango_edad=perfil["rango_edad"],
        idioma_nombre=perfil["idioma_nombre"],
        contexto_cultural=perfil["contexto_cultural"],
        tono_edad=perfil["tono_edad"],
    )
    prompt = MODIF_ESTANCIA_TRABAJO_PROMPT.format(
        bloque_cultural=bloque,
        especialidad="modificación de estancia a residencia por trabajo cuenta ajena",
        contexto_rag=rag,
    )

    # Construimos la lista de mensajes para el LLM
    messages = [SystemMessage(content=prompt)] + state["messages"]
    respuesta = await llm.ainvoke(messages)
    ai_message = AIMessage(content=respuesta.content)

    return {
        **state,
        "messages":          state["messages"] + [ai_message],
        "expert_response":   respuesta.content,
        "tramite_detectado": "modif_estancia_trabajo",
        "last_agent":        "modif_estancia_trabajo",
        "idioma_codigo":     perfil["idioma_codigo"],
    }