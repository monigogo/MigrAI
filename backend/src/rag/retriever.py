import logging
from ..db.supabase_client import supabase
from .embeddings import get_embedding
from ..config.settings import dev_config

logger = logging.getLogger(__name__)

_SIN_CONTEXTO = "No se encontró información específica para este trámite."


def buscar_contexto(pregunta: str, tramite: str) -> str:

    top_k  = dev_config["rag"]["top_k"]
    vector = get_embedding(pregunta)

    try:
        resultado = supabase.rpc(
            "buscar_documentos",
            {
                "query_embedding": vector,
                "tramite_filtro":  tramite,
                "top_k":           top_k,
            },
        ).execute()
    except Exception:
        # Si el RAG cae (Supabase inaccesible, RPC roto...), el agente debe
        # responder sin contexto en vez de tumbar toda la petición.
        logger.exception(f"RAG no disponible para tramite={tramite}, respondiendo sin contexto")
        return _SIN_CONTEXTO

    if not resultado.data:
        return _SIN_CONTEXTO

    # Agrupa por tipo de fuente
    secciones = {
        "normativa":  [],
        "comunidad":  [],
        "tasa":       [],
        "formulario": [],
    }

    for doc in resultado.data:
        fuente    = doc.get("fuente", "")
        pagina    = doc.get("pagina", "")
        contenido = doc.get("contenido", "")
        tipo      = doc.get("tipo", "normativa")
        bloque    = f"[{fuente} — pág. {pagina}]\n{contenido}"

        if tipo in secciones:
            secciones[tipo].append(bloque)
        else:
            secciones["normativa"].append(bloque)


    partes = []

    if secciones["normativa"]:
        partes.append(
            "### NORMATIVA OFICIAL\n" +
            "\n---\n".join(secciones["normativa"])
        )
    if secciones["comunidad"]:
        partes.append(
            "### EXPERIENCIAS DE PERSONAS QUE YA OBTUVIERON SUS PAPELES\n" +
            "\n---\n".join(secciones["comunidad"])
        )
    if secciones["tasa"]:
        partes.append(
            "### TASAS\n" +
            "\n---\n".join(secciones["tasa"])
        )
    if secciones["formulario"]:
        partes.append(
            "### FORMULARIOS\n" +
            "\n---\n".join(secciones["formulario"])
        )

    return "\n\n".join(partes) if partes else "Sin información encontrada."


def buscar_contexto_comunidad(pregunta: str, tramite: str = None) -> str:

    top_k  = dev_config["rag"]["top_k"]
    vector = get_embedding(pregunta)

    tramite_busqueda = tramite or "arraigo_sociolaboral"

    try:
        resultado = supabase.rpc(
            "buscar_documentos",
            {
                "query_embedding": vector,
                "tramite_filtro":  tramite_busqueda,
                "top_k":           top_k,
            },
        ).execute()
    except Exception:
        logger.exception(f"RAG comunidad no disponible para tramite={tramite_busqueda}")
        return ""

    if not resultado.data:
        return ""

    bloques = [
        doc.get("contenido", "")
        for doc in resultado.data
        if doc.get("tipo") == "comunidad"
    ]

    return "\n---\n".join(bloques) if bloques else ""