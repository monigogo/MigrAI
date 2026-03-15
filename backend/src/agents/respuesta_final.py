from langchain_core.messages import AIMessage, SystemMessage, HumanMessage
from ..config.llm import get_llm
from ..config.cultural import construir_contexto_cultural
from ..prompts.respuesta_final import RESPUESTA_FINAL_PROMPT
from ..prompts.base import BLOQUE_CULTURAL
from ..db.supabase_client import supabase


async def agente_respuesta_final(state: dict) -> dict:
    llm  = get_llm("respuesta_final")
    pais = state.get("pais") or "Colombia"
    edad = state.get("rango_edad") or "26-35"

    # La pregunta original es el primer mensaje del usuario en el historial
    pregunta_original = ""
    for msg in state["messages"]:
        if isinstance(msg, HumanMessage):
            pregunta_original = msg.content
            break

    perfil = construir_contexto_cultural(pais, edad)

    bloque = BLOQUE_CULTURAL.format(
        pais=perfil["pais"], rango_edad=perfil["rango_edad"],
        idioma_nombre=perfil["idioma_nombre"],
        contexto_cultural=perfil["contexto_cultural"],
        tono_edad=perfil["tono_edad"],
    )
    prompt   = RESPUESTA_FINAL_PROMPT.format(
        bloque_cultural=bloque,
        info_experto=state.get("expert_response", "Sin información del agente experto"),
        pregunta_original=pregunta_original,
    )

    # Este agente es un poco diferente. No necesita el historial completo,
    # solo el prompt del sistema para formatear la respuesta del experto.
    messages = [SystemMessage(content=prompt)]
    respuesta = await llm.ainvoke(messages)
    ai_message = AIMessage(content=respuesta.content)

    return {
        **state,
        "messages":       state["messages"] + [ai_message],
        "final_response": respuesta.content,
        "last_agent":     "respuesta_final",
    }