from ..db.supabase_client import supabase
from .embeddings import get_embedding
from ..config.settings import dev_config


def buscar_contexto(pregunta: str, tramite: str) -> str:

    top_k  = dev_config["rag"]["top_k"]
    vector = get_embedding(pregunta)

    resultado = supabase.rpc(
        "buscar_documentos",
        {
            "query_embedding": vector,
            "tramite_filtro":  tramite,
            "top_k":           top_k,
        },
    ).execute()

    if not resultado.data:
        return "No se encontró información específica para este trámite."

    # Agrupa por tipo de fuente
    secciones = {
        "normativa":  [],
        "comunidad":  [],
        "tasa":       [],
        "formulario": [],
    }

    for doc in resultado.data:
        fuente      = doc.get("fuente", "")
        pagina      = doc.get("pagina", "")
        contenido   = doc.get("contenido", "")
        fuente_tipo = doc.get("fuente_tipo", "normativa")
        bloque      = f"[{fuente} — pág. {pagina}]\n{contenido}"

        if fuente_tipo in secciones:
            secciones[fuente_tipo].append(bloque)
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

    resultado = supabase.rpc(
        "buscar_documentos",
        {
            "query_embedding": vector,
            "tramite_filtro":  tramite_busqueda,
            "top_k":           top_k,
        },
    ).execute()

    if not resultado.data:
        return ""

    bloques = [
        doc.get("contenido", "")
        for doc in resultado.data
        if doc.get("fuente_tipo") == "comunidad"
    ]

    return "\n---\n".join(bloques) if bloques else ""