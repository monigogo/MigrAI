import fitz
from ..db.supabase_client import supabase_manager, supabase
from .embeddings import get_embedding
from ..config.settings import dev_config

# Nombre exacto de tu bucket en Supabase Storage
BUCKET = "documentos-legales"

# Estructura exacta de tu Storage
# formato: "carpeta_tramite/subcarpeta" → { tramite, fuente_tipo }
ESTRUCTURA = {
    # ── Arraigo sociolaboral ──────────────────────────────────────
    "arraigo_sociolaboral/normativa":   {"tramite": "arraigo_sociolaboral", "fuente_tipo": "normativa"},
    "arraigo_sociolaboral/comunidad":   {"tramite": "arraigo_sociolaboral", "fuente_tipo": "comunidad"},
    "arraigo_sociolaboral/tasa":        {"tramite": "arraigo_sociolaboral", "fuente_tipo": "tasa"},
    "arraigo_sociolaboral/formularios": {"tramite": "arraigo_sociolaboral", "fuente_tipo": "formulario"},

    # ── Arraigo socioformativo ────────────────────────────────────
    "arraigo_socioformativo/normativa":   {"tramite": "arraigo_socioformativo", "fuente_tipo": "normativa"},
    "arraigo_socioformativo/comunidad":   {"tramite": "arraigo_socioformativo", "fuente_tipo": "comunidad"},
    "arraigo_socioformativo/tasa":        {"tramite": "arraigo_socioformativo", "fuente_tipo": "tasa"},
    "arraigo_socioformativo/formularios": {"tramite": "arraigo_socioformativo", "fuente_tipo": "formulario"},

    # ── Arraigo familiar ──────────────────────────────────────────
    "arraigo_familiar/normativa":   {"tramite": "arraigo_familiar", "fuente_tipo": "normativa"},
    "arraigo_familiar/comunidad":   {"tramite": "arraigo_familiar", "fuente_tipo": "comunidad"},
    "arraigo_familiar/tasa":        {"tramite": "arraigo_familiar", "fuente_tipo": "tasa"},
    "arraigo_familiar/formularios": {"tramite": "arraigo_familiar", "fuente_tipo": "formulario"},

    # ── Estancia a residencia por trabajo cuenta ajena ────────────
    "estudio_trabajo_ajena/normativa":   {"tramite": "residencia_trabajo", "fuente_tipo": "normativa"},
    "estudio_trabajo_ajena/comunidad":   {"tramite": "residencia_trabajo", "fuente_tipo": "comunidad"},
    "estudio_trabajo_ajena/tasa":        {"tramite": "residencia_trabajo", "fuente_tipo": "tasa"},
    "estudio_trabajo_ajena/formularios": {"tramite": "residencia_trabajo", "fuente_tipo": "formulario"},
}


def trocear_texto(texto: str, chunk_size: int, overlap: int) -> list[str]:
    """Divide el texto en trozos con solapamiento para no perder contexto."""
    trozos, inicio = [], 0
    while inicio < len(texto):
        trozo = texto[inicio: inicio + chunk_size]
        if trozo.strip():
            trozos.append(trozo)
        inicio += chunk_size - overlap
    return trozos


def cargar_desde_storage() -> int:
    """
    Recorre toda la estructura de documentos-legales en Supabase Storage.
    Por cada PDF: lo descarga, trocea, genera embedding y guarda en Supabase.
    Devuelve el total de fragmentos guardados.
    """
    cfg   = dev_config["rag"]
    total = 0

    for ruta_carpeta, meta in ESTRUCTURA.items():
        tramite     = meta["tramite"]
        fuente_tipo = meta["fuente_tipo"]

        print(f"\n── {ruta_carpeta} [{fuente_tipo}] ──────────")

        # Lista los ficheros de esta subcarpeta
        try:
            ficheros = supabase_manager.listar_ficheros(BUCKET, ruta_carpeta)
        except Exception as e:
            print(f"  No se pudo acceder: {e}")
            continue

        if not ficheros:
            print(f"  Vacía, saltando")
            continue

        for fichero in ficheros:
            nombre = fichero.get("name", "")
            if not nombre.lower().endswith(".pdf"):
                continue

            ruta_completa = f"{ruta_carpeta}/{nombre}"
            print(f"  Procesando: {nombre}")

            # Descarga el PDF
            try:
                pdf_bytes = supabase_manager.descargar_pdf(BUCKET, ruta_completa)
            except Exception as e:
                print(f"  Error descargando {nombre}: {e}")
                continue

            # Extrae texto página a página
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            fragmentos_fichero = 0

            for num_pag, pagina in enumerate(doc, start=1):
                texto = pagina.get_text()
                if not texto.strip():
                    continue

                for trozo in trocear_texto(
                    texto, cfg["chunk_size"], cfg["chunk_overlap"]
                ):
                    if len(trozo.strip()) < 50:
                        continue

                    vector = get_embedding(trozo)

                    supabase.table("documentos_normativa").insert({
                        "contenido":   trozo,
                        "embedding":   vector,
                        "tramite":     tramite,
                        "fuente":      nombre,
                        "pagina":      num_pag,
                        "tipo":        fuente_tipo,
                        "fuente_tipo": fuente_tipo,
                    }).execute()

                    fragmentos_fichero += 1
                    total += 1

            doc.close()
            print(f"  OK: {nombre} → {fragmentos_fichero} fragmentos")

    print(f"\n{'─'*50}")
    print(f"Total fragmentos guardados en Supabase: {total}")
    return total