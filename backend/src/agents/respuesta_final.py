from langchain_core.messages import AIMessage, SystemMessage, HumanMessage
from ..config.llm import get_llm
from ..config.cultural import construir_contexto_cultural
from ..prompts.respuesta_final import RESPUESTA_FINAL_PROMPT
from ..prompts.base import BLOQUE_CULTURAL

async def agente_respuesta_final(state: dict) -> dict:
    llm  = get_llm("respuesta_final")
    pais = state.get("pais") or "Colombia"
    edad = state.get("rango_edad") or "26-35"

    perfil = construir_contexto_cultural(pais, edad)

    bloque = BLOQUE_CULTURAL.format(
        pais=perfil["pais"], rango_edad=perfil["rango_edad"],
        idioma_nombre=perfil["idioma_nombre"],
        contexto_cultural=perfil["contexto_cultural"],
        tono_edad=perfil["tono_edad"],
    )
    prompt = RESPUESTA_FINAL_PROMPT.format(
        bloque_cultural=bloque,
        info_experto=state.get("expert_response", "Sin información del agente experto"),
    )

    # Es importante pasarle el historial para que NO repita saludos ni hilos cerrados
    messages = [SystemMessage(content=prompt)] + state["messages"]
    respuesta = await llm.ainvoke(messages)
    ai_message = AIMessage(content=respuesta.content)

    return {
        "messages":       [ai_message],
        "final_response": respuesta.content,
        "last_agent":     "respuesta_final",
    }
