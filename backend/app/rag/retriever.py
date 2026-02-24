"""
retriever.py
─────────────────────────────────────────────────────────────────────
RAG con filtros por fuente_tipo y tipo_tramite.

Funciones públicas:
  buscar_contexto_legal(query, tipo_tramite?)
    → busca solo en fuente_tipo="base_legal"
    → usado por legal_agent

  buscar_contexto_comunidad(query, tipo_tramite?)
    → busca solo en fuente_tipo="comunidad"
    → usado por community_agent

  buscar_contexto_combinado(query, tipo_tramite?)
    → busca en ambas fuentes y devuelve resultado unificado
    → usado por router_agent en modo "mixed" si se necesita contexto
"""

from sentence_transformers import SentenceTransformer
from app.services.supabase_client import supabase_service

# Mismo modelo que usa ingest_pdfs.py — deben coincidir siempre
_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
model = SentenceTransformer(_MODEL_NAME)

# ─── Búsqueda base ────────────────────────────────────────────────

def _buscar(
    query:           str,
    fuente_tipo:     str | None = None,
    tipo_tramite:    str | None = None,
    match_threshold: float = 0.45,
    match_count:     int   = 3,
) -> str:
    """
    Búsqueda vectorial en documentos_legales con filtros opcionales.

    Args:
        query:           Texto de la pregunta del usuario
        fuente_tipo:     "base_legal" | "comunidad" | None (ambas)
        tipo_tramite:    "arraigo_sociolaboral" | "estudios_trabajo_ajena" | None
        match_threshold: Similitud mínima (0.0–1.0). Bajar si no encuentra resultados.
        match_count:     Número máximo de chunks a recuperar

    Returns:
        Texto con los chunks más relevantes concatenados,
        o mensaje de fallback si no hay resultados.
    """
    query_embedding = model.encode(query).tolist()

    try:
        rpc_res = supabase_service.client.rpc(
            "buscar_legal_documents",
            {
                "query_embedding":  query_embedding,
                "match_threshold":  match_threshold,
                "match_count":      match_count,
                "p_fuente_tipo":    fuente_tipo,
                "p_tipo_tramite":   tipo_tramite,
            }
        ).execute()

        print(f"[retriever] RPC ok → {len(rpc_res.data or [])} chunks | fuente={fuente_tipo} | tramite={tipo_tramite}")

    except Exception as e:
        print(f"[retriever] Error en RPC buscar_legal_documents: {e}")
        return ""

    if not rpc_res.data:
        print(f"[retriever] Sin resultados para: '{query[:60]}...'")
        return ""

    # Añadir cabecera de fuente para que el LLM sepa de dónde viene
    partes = []
    for item in rpc_res.data:
        fuente  = item.get("fuente_tipo", "")
        tramite = item.get("tipo_tramite", "")
        texto   = item.get("content", "")
        sim     = item.get("similarity", 0)

        cabecera = f"[{tramite} / {fuente} | similitud: {sim:.2f}]"
        partes.append(f"{cabecera}\n{texto}")

    return "\n\n---\n\n".join(partes)


# ─── API pública ──────────────────────────────────────────────────

def buscar_contexto_legal(
    query:        str,
    tipo_tramite: str | None = None,
) -> str:
    """
    Busca contexto de normativa legal (base_legal).
    Usado por legal_agent.

    Args:
        query:        Pregunta del usuario
        tipo_tramite: Filtrar por trámite específico (opcional)

    Returns:
        Fragmentos de reglamentos y normativa relevantes,
        o mensaje de fallback.
    """
    resultado = _buscar(
        query=query,
        fuente_tipo="base_legal",
        tipo_tramite=tipo_tramite,
    )

    if not resultado:
        return (
            "No se encontró información específica en los documentos legales. "
            "Usa tu conocimiento general sobre extranjería en España y aclara "
            "que es orientación general, no asesoramiento legal oficial."
        )

    return resultado


def buscar_contexto_comunidad(
    query:        str,
    tipo_tramite: str | None = None,
) -> str:
    """
    Busca experiencias reales de la comunidad (comunidad).
    Usado por community_agent.

    Args:
        query:        Pregunta del usuario
        tipo_tramite: Filtrar por trámite específico (opcional)

    Returns:
        Fragmentos de experiencias reales relevantes,
        o mensaje de fallback.
    """
    resultado = _buscar(
        query=query,
        fuente_tipo="comunidad",
        tipo_tramite=tipo_tramite,
    )

    if not resultado:
        return (
            "No hay experiencias específicas registradas para esta consulta. "
            "Responde con consejos generales basados en experiencias comunes "
            "de personas migrantes en España."
        )

    return resultado


def buscar_contexto_combinado(
    query:        str,
    tipo_tramite: str | None = None,
) -> dict[str, str]:
    """
    Busca en ambas fuentes y devuelve un dict separado.
    Útil para el router en modo 'mixed'.

    Returns:
        {
            "legal":     contexto de base_legal,
            "comunidad": contexto de comunidad
        }
    """
    return {
        "legal":     buscar_contexto_legal(query, tipo_tramite),
        "comunidad": buscar_contexto_comunidad(query, tipo_tramite),
    }


def detectar_tipo_tramite(query: str) -> str | None:
    """
    Detecta el tipo de trámite a partir de keywords en la pregunta.
    Permite filtrar el RAG al trámite más relevante.

    Returns:
        "arraigo_sociolaboral" | "estudios_trabajo_ajena" | None
    """
    msg = query.lower()

    if any(kw in msg for kw in [
        "arraigo", "arraigo social", "arraigo laboral",
        "dos años", "2 años", "residencia por arraigo",
    ]):
        return "arraigo_sociolaboral"

    if any(kw in msg for kw in [
        "estudios", "cuenta ajena", "modificación",
        "permiso de trabajo", "contrato de trabajo",
        "autorización de trabajo",
    ]):
        return "estudios_trabajo_ajena"

    return None  # Sin filtro → busca en todos los trámites