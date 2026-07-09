from typing import Optional
from langgraph.graph import StateGraph, END, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langchain_core.messages import SystemMessage
from ..agents.factory import (
    agente_arraigo_familiar,
    agente_arraigo_social,
    agente_arraigo_socioformativo,
    agente_arraigo_sociolaboral,
    agente_modif_estancia_trabajo,
    agente_nie_tie,
    agente_reagrupacion,
)
from ..agents.respuesta_final import agente_respuesta_final
from ..agents.historial       import recortar_historial
from ..config.llm             import get_llm
from ..config.cultural        import construir_contexto_cultural
from ..prompts.orchestrator   import ORCHESTRATOR_PROMPT
from ..prompts.documentos     import DOCUMENTOS_PROMPT
from ..prompts.base           import BLOQUE_CULTURAL

# Única fuente de verdad para los agentes del grafo (nodos y enrutado)
AGENTES_EXPERTOS = [
    "arraigo_familiar", "arraigo_socioformativo", "arraigo_sociolaboral",
    "arraigo_social", "modif_estancia_trabajo", "nie_tie",
    "reagrupacion", "documentos",
]

# El LLM solo puede derivar a estos: a "documentos" se llega únicamente
# subiendo un fichero (ruta automática por document_content) — sin documento,
# ese agente respondería sobre un PDF que no existe.
AGENTES_DERIVABLES = [a for a in AGENTES_EXPERTOS if a != "documentos"]


# ── Estado del grafo ──────────────────────────────────────────────────────
class MigraiState(MessagesState):
    pais:              Optional[str]
    rango_edad:        Optional[str]
    idioma_codigo:     Optional[str]
    idioma_nombre:     Optional[str]
    contexto_cultural: Optional[str]
    tono_edad:         Optional[str]
    document_content:  Optional[str]
    next_agent:        Optional[str]
    expert_response:   Optional[str]
    tramite_detectado: Optional[str]
    final_response:    Optional[str]
    last_agent:        Optional[str]


def _extraer_agente(texto: str) -> Optional[str]:
    """El LLM debería responder SOLO con el nombre del agente, pero en la
    práctica a veces añade conversación y deja la derivación en la última
    línea ("¡Claro que puedes!...\narraigo_familiar"). Si la última línea
    contiene exactamente un agente válido, esa es la decisión; si hay cero
    o varios (p. ej. una pregunta aclaratoria que enumera opciones), se
    trata como respuesta conversacional."""
    normalizado = texto.strip().lower().replace(" ", "_").replace("-", "_").rstrip(".")
    if normalizado in AGENTES_DERIVABLES:
        return normalizado

    ultima_linea = texto.strip().splitlines()[-1].lower().replace(" ", "_").replace("-", "_")
    encontrados = {a for a in AGENTES_DERIVABLES if a in ultima_linea}
    if len(encontrados) == 1:
        return encontrados.pop()
    return None


# ── Orquestador ───────────────────────────────────────────────────────────
async def orchestrator_node(state: MigraiState) -> MigraiState:
    if state.get("document_content"):
        return {"next_agent": "documentos"}

    llm = get_llm("orchestrator")
    messages = [SystemMessage(content=ORCHESTRATOR_PROMPT)] + recortar_historial(state["messages"])
    respuesta = await llm.ainvoke(messages)

    next_agent = _extraer_agente(respuesta.content)

    if next_agent is None:

        return {
            "next_agent": "respuesta_final",
            "expert_response": respuesta.content,
            "tramite_detectado": "conversacion_orquestador",
            "last_agent": "orchestrator"
        }

    return {"next_agent": next_agent}


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

    messages = [SystemMessage(content=prompt)] + recortar_historial(state["messages"])
    respuesta = await llm.ainvoke(messages)

    return {
        "expert_response":   respuesta.content,
        "tramite_detectado": "documentos",
        "last_agent":        "documentos",
        "idioma_codigo":     perfil["idioma_codigo"],
    }


# ── Enrutado ──────────────────────────────────────────────────────────────
def route_to_agent(state: MigraiState) -> str:
    return state.get("next_agent", "arraigo_social")

def should_end(state: MigraiState) -> str:
    if state.get("last_agent") == "respuesta_final":
        return END
    return "respuesta_final"


# ── Construcción del grafo ────────────────────────────────────────────────
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
            "respuesta_final":        "respuesta_final",
        },
    )

    for agente in AGENTES_EXPERTOS:
        graph.add_conditional_edges(
            agente, should_end,
            {"respuesta_final": "respuesta_final", END: END},
        )

    graph.add_edge("respuesta_final", END)
    memoria = MemorySaver()
    return graph.compile(checkpointer=memoria)


migrai_graph = build_graph()
