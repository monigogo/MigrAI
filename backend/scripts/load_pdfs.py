"""
CÓMO EJECUTAR:
    cd /workspaces/migrAI/backend
    uv run python scripts/load_pdfs.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import fitz
from src.db.supabase_client import supabase_manager, supabase
from src.rag.embeddings import get_embedding

BUCKET = "documentos-legales"

# Estructura exacta de tu Storage
# "carpeta/subcarpeta" → { tramite, fuente_tipo }
ESTRUCTURA = {
    # ── Arraigo sociolaboral ──────────────────────────────────────
    "arraigo_sociolaboral/base_legal": {
        "tramite":     "arraigo_sociolaboral",
        "fuente_tipo": "normativa",
    },
    "arraigo_sociolaboral/comunidad": {
        "tramite":     "arraigo_sociolaboral",
        "fuente_tipo": "comunidad",
    },
    # ── Estancia a residencia por trabajo cuenta ajena ────────────
    "estudios_trabajo_ajena/base_legal": {
        "tramite":     "modif_estancia_trabajo",
        "fuente_tipo": "normativa",
    },
    "estudios_trabajo_ajena/comunidad": {
        "tramite":     "modif_estancia_trabajo",
        "fuente_tipo": "comunidad",
    },
}

CHUNK_SIZE    = 1000
CHUNK_OVERLAP = 200


def trocear_texto(texto: str) -> list[str]:
    trozos, inicio = [], 0
    while inicio < len(texto):
        trozo = texto[inicio: inicio + CHUNK_SIZE]
        if trozo.strip():
            trozos.append(trozo)
        inicio += CHUNK_SIZE - CHUNK_OVERLAP
    return trozos


def cargar_todo():
    total = 0

    for ruta_carpeta, meta in ESTRUCTURA.items():
        tramite     = meta["tramite"]
        fuente_tipo = meta["fuente_tipo"]

        print(f"\n── {ruta_carpeta} [{fuente_tipo}] ──────────")

        try:
            ficheros = supabase_manager.listar_ficheros(BUCKET, ruta_carpeta)
        except Exception as e:
            print(f"  Error listando: {e}")
            continue

        if not ficheros:
            print(f"  Vacía")
            continue

        for fichero in ficheros:
            nombre = fichero.get("name", "")

            # Ignora ficheros del sistema
            if not nombre.endswith(".pdf"):
                print(f"  Saltando: {nombre}")
                continue

            ruta_completa = f"{ruta_carpeta}/{nombre}"
            print(f"  Procesando: {nombre}")

            try:
                pdf_bytes = supabase_manager.descargar_pdf(BUCKET, ruta_completa)
            except Exception as e:
                print(f"  Error descargando: {e}")
                continue

            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            fragmentos_fichero = 0

            for num_pag, pagina in enumerate(doc, start=1):
                texto = pagina.get_text()
                if not texto.strip():
                    continue

                for trozo in trocear_texto(texto):
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
    print(f"✅ Total fragmentos guardados: {total}")
    return total


if __name__ == "__main__":
    print("── Cargando PDFs desde Supabase Storage ──────────")
    cargar_todo()