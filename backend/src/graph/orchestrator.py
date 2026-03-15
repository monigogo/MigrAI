from typing import TypedDict, Optional, Annotated
from langgraph.graph import StateGraph, END, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from ..agents.arraigos.familiar            import agente_arraigo_familiar
from ..agents.arraigos.socioformativo      import agente_arraigo_socioformativo
from ..agents.arraigos.sociolaboral        import agente_arraigo_sociolaboral
from ..agents.arraigos.social              import agente_arraigo_social
from ..agents.tramites.nie_tie             import agente_nie_tie
from ..agents.tramites.reagrupacion        import agente_reagrupacion
from ..agents.tramites.modif_estan_trabajo import agente_modif_estancia_trabajo
from ..agents.respuesta_final              import agente_respuesta_final
from ..config.llm                          import get_llm
from ..config.cultural                     import construir_contexto_cultural
from ..prompts.orchestrator                import ORCHESTRATOR_PROMPT
from ..prompts.documentos                  import DOCUMENTOS_PROMPT
from ..prompts.base                        import BLOQUE_CULTURAL


# ── Estado del grafo con historial de mensajes integrado ──────────────────
class MigraiState(MessagesState):
    # Perfil del usuario
    pais:              Optional[str]
    rango_edad:        Optional[str]
    idioma_codigo:     Optional[str]
    idioma_nombre:     Optional[str]
    contexto_cultural: Optional[str]
    tono_edad:         Optional[str]
    # Documento adjunto
    document_content:  Optional[str]
    # Flujo interno
    next_agent:        Optional[str]
    expert_response:   Optional[str]
    tramite_detectado: Optional[str]
    final_response:    Optional[str]
    last_agent:        Optional[str]


# ── Orquestador ───────────────────────────────────────────────────────────
async def orchestrator_node(state: MigraiState) -> MigraiState:
    if state.get("document_content"):
        return {**state, "next_agent": "documentos"}

    llm = get_llm("orchestrator")

    # Usar todo el historial de mensajes para dar contexto al orquestador
    messages = [SystemMessage(content=ORCHESTRATOR_PROMPT)] + state["messages"]

    respuesta  = await llm.ainvoke(messages)
    next_agent = respuesta.content.strip().lower().strip(".")

    agentes_validos = [
        "arraigo_familiar", "arraigo_socioformativo", "arraigo_sociolaboral",
        "arraigo_social", "modif_estancia_trabajo", "nie_tie",
        "reagrupacion", "documentos",
    ]

    if next_agent not in agentes_validos:
        last_message = state["messages"][-1]
        pregunta = last_message.content
        pregunta_lower = pregunta.lower()
        if "familiar" in pregunta_lower or "hijo" in pregunta_lower:
            next_agent = "arraigo_familiar"
        elif "formacion" in pregunta_lower or "estudiar" in pregunta_lower:
            next_agent = "arraigo_socioformativo"
        elif "contrato" in pregunta_lower and "arraigo" in pregunta_lower:
            next_agent = "arraigo_sociolaboral"
        elif "nie" in pregunta_lower or "tie" in pregunta_lower:
            next_agent = "nie_tie"
        elif "reagrup" in pregunta_lower:
            next_agent = "reagrupacion"
        elif "modificacion" in pregunta_lower or "estancia" in pregunta_lower:
            next_agent = "modif_estancia_trabajo"
        else:
            next_agent = "arraigo_social"

    return {**state, "next_agent": next_agent}


# ── Agente de documentos ──────────────────────────────────────────────────
async def agente_documentos(state: MigraiState) -> MigraiState:
    llm    = get_llm("documentos")
    pais   = state.get("pais") 
    edad   = state.get("rango_edad") 
    perfil = construir_contexto_cultural(pais, edad)

    bloque = BLOQUE_CULTURAL.format(
        pais=perfil["pais"], rango_edad=perfil["rango_edad"],
        idioma_nombre=perfil["idioma_nombre"],
        contexto_cultural=perfil["contexto_cultural"],
        tono_edad=perfil["tono_edad"],
    )
    prompt = DOCUMENTOS_PROMPT.format(
        bloque_cultural=bloque,
        document_content=state.get("document_content", ""),
    )

    # Incluye el historial de mensajes
    messages = [SystemMessage(content=prompt)] + state["messages"]
    respuesta = await llm.ainvoke(messages)

    return {
        **state,
        "expert_response":   respuesta.content,
        "tramite_detectado": "documentos",
        "last_agent":        "documentos",
        "idioma_codigo":     perfil["idioma_codigo"],
        "messages":          state["messages"] + [AIMessage(content=respuesta.content)],
    }


# ── Enrutado ──────────────────────────────────────────────────────────────
def route_to_agent(state: MigraiState) -> str:
    return state.get("next_agent", "arraigo_social")


def should_end(state: MigraiState) -> str:
    if state.get("last_agent") == "respuesta_final":
        return END
    return "respuesta_final"


# ── Construcción del grafo con memoria ────────────────────────────────────
def build_graph():
    graph = StateGraph(MigraiState)

    graph.add_node("orchestrator",           orchestrator_node)
    graph.add_node("arraigo_familiar",       agente_arraigo_familiar)
    graph.add_node("arraigo_socioformativo", agente_arraigo_socioformativo)
    graph.add_node("arraigo_sociolaboral",   agente_arraigo_sociolaboral)
    graph.add_node("arraigo_social",         agente_arraigo_social)
    graph.add_node("modif_estancia_trabajo", agente_modif_estancia_trabajo)
    graph.add_node("nie_tie",                agente_nie_tie)
    graph.add_node("reagrupacion",           agente_reagrupacion)
    graph.add_node("documentos",             agente_documentos)
    graph.add_node("respuesta_final",        agente_respuesta_final)

    graph.set_entry_point("orchestrator")

    graph.add_conditional_edges(
        "orchestrator", route_to_agent,
        {
            "arraigo_familiar":       "arraigo_familiar",
            "arraigo_socioformativo": "arraigo_socioformativo",
            "arraigo_sociolaboral":   "arraigo_sociolaboral",
            "arraigo_social":         "arraigo_social",
            "modif_estancia_trabajo": "modif_estancia_trabajo",
            "nie_tie":                "nie_tie",
            "reagrupacion":           "reagrupacion",
            "documentos":             "documentos",
        },
    )

    agentes_expertos = [
        "arraigo_familiar", "arraigo_socioformativo", "arraigo_sociolaboral",
        "arraigo_social", "modif_estancia_trabajo", "nie_tie",
        "reagrupacion", "documentos",
    ]
    for agente in agentes_expertos:
        graph.add_conditional_edges(
            agente, should_end,
            {"respuesta_final": "respuesta_final", END: END},
        )

    graph.add_edge("respuesta_final", END)

    # MemorySaver guarda el historial en memoria por session_id
    memoria = MemorySaver()
    return graph.compile(checkpointer=memoria)


migrai_graph = build_graph()