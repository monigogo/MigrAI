import asyncio
from langchain_core.messages import SystemMessage
from ..config.llm import get_llm
from ..config.cultural import construir_contexto_cultural
from ..rag.retriever import buscar_contexto
from ..prompts.arraigo_familiar import ARRAIGO_FAMILIAR_PROMPT
from ..prompts.arraigo_social import ARRAIGO_SOCIAL_PROMPT
from ..prompts.arraigo_socioformativo import ARRAIGO_SOCIOFORMATIVO_PROMPT
from ..prompts.arraigo_sociolaboral import ARRAIGO_SOCIOLABORAL_PROMPT
from ..prompts.modif_estancia_trabajo import MODIF_ESTANCIA_TRABAJO_PROMPT
from ..prompts.nie_tie import NIE_TIE_PROMPT
from ..prompts.reagrupacion import REAGRUPACION_PROMPT
from ..prompts.base import BLOQUE_CULTURAL
from .historial import recortar_historial


def crear_agente_experto(tramite: str, prompt_template: str, especialidad: str):
    """Los 7 agentes expertos comparten la misma lógica: solo cambian el
    trámite, el prompt y el texto de especialidad."""

    async def agente(state: dict) -> dict:
        llm  = get_llm(tramite)
        pais = state.get("pais") or "Colombia"
        edad = state.get("rango_edad") or "26-35"

        # La pregunta del usuario es el último mensaje en el estado
        pregunta = state["messages"][-1].content

        perfil = construir_contexto_cultural(pais, edad)
        rag    = await asyncio.to_thread(buscar_contexto, pregunta, tramite=tramite)

        bloque = BLOQUE_CULTURAL.format(
            pais=perfil["pais"], rango_edad=perfil["rango_edad"],
            idioma_nombre=perfil["idioma_nombre"],
            contexto_cultural=perfil["contexto_cultural"],
            tono_edad=perfil["tono_edad"],
        )
        prompt = prompt_template.format(
            bloque_cultural=bloque,
            especialidad=especialidad,
            contexto_rag=rag,
        )

        # Construimos la lista de mensajes para el LLM
        messages = [SystemMessage(content=prompt)] + recortar_historial(state["messages"])
        respuesta = await llm.ainvoke(messages)

        return {
            "expert_response":   respuesta.content,
            "tramite_detectado": tramite,
            "last_agent":        tramite,
            "idioma_codigo":     perfil["idioma_codigo"],
        }

    agente.__name__ = f"agente_{tramite}"
    return agente


agente_arraigo_familiar       = crear_agente_experto("arraigo_familiar", ARRAIGO_FAMILIAR_PROMPT, "arraigo por circunstancias familiares")
agente_arraigo_social         = crear_agente_experto("arraigo_social", ARRAIGO_SOCIAL_PROMPT, "arraigo social")
agente_arraigo_socioformativo = crear_agente_experto("arraigo_socioformativo", ARRAIGO_SOCIOFORMATIVO_PROMPT, "arraigo para la formación (socioformativo)")
agente_arraigo_sociolaboral   = crear_agente_experto("arraigo_sociolaboral", ARRAIGO_SOCIOLABORAL_PROMPT, "arraigo sociolaboral")
agente_modif_estancia_trabajo = crear_agente_experto("modif_estancia_trabajo", MODIF_ESTANCIA_TRABAJO_PROMPT, "modificación de estancia a residencia por trabajo cuenta ajena")
agente_nie_tie                = crear_agente_experto("nie_tie", NIE_TIE_PROMPT, "NIE y TIE")
agente_reagrupacion           = crear_agente_experto("reagrupacion", REAGRUPACION_PROMPT, "reagrupación familiar")
