"""
ingest_pdfs.py
─────────────────────────────────────────────────────────────────────
Script de ingesta: lee los PDFs de Supabase Storage y los inserta
en la tabla documentos_legales con los metadatos correctos.

Estructura esperada en Storage (bucket: documentos_legales):
  arraigo_sociolaboral/
    base_legal/
      reglamento_articulo_x.pdf
    comunidad/
      experiencias_arraigo_sociolaboral.pdf
  modificacion_estudios_cuenta_ajena/
    base_legal/
      reglamento_articulo_x.pdf
    comunidad/
      experiencias_estudios_cuenta_ajena.pdf

Uso:
  python -m app.rag.ingest_pdfs                  ← ingesta completa
  python -m app.rag.ingest_pdfs --dry-run        ← solo muestra qué procesaría
  python -m app.rag.ingest_pdfs --reset          ← borra todo e ingesta de nuevo
"""

import io
import sys
import argparse
import pdfplumber
from sentence_transformers import SentenceTransformer
from app.services.supabase_client import supabase_service

# ─── Configuración ────────────────────────────────────────────────

BUCKET_NAME   = "documentos-legales"
EMBED_MODEL   = "sentence-transformers/all-MiniLM-L6-v2"
CHUNK_SIZE    = 500    # caracteres por chunk
CHUNK_OVERLAP = 100    # solapamiento entre chunks

# Mapa de carpetas → metadatos
# Clave: prefijo de ruta en Storage
# Valor: (tipo_tramite, fuente_tipo)
FOLDER_MAP = {
    "arraigo_sociolaboral/base_legal":   ("arraigo_sociolaboral",    "base_legal"),
    "arraigo_sociolaboral/comunidad":    ("arraigo_sociolaboral",    "comunidad"),
    "estudios_trabajo_ajena/base_legal": ("estudios_trabajo_ajena",  "base_legal"),
    "estudios_trabajo_ajena/comunidad":  ("estudios_trabajo_ajena",  "comunidad"),
}

# ─── Modelo de embeddings ─────────────────────────────────────────

print(f"[ingest] Cargando modelo {EMBED_MODEL}...")
model = SentenceTransformer(EMBED_MODEL)
print("[ingest] Modelo cargado ✓")


# ─── Helpers ─────────────────────────────────────────────────────

def _detect_metadata(file_path: str) -> tuple[str, str] | None:
    """
    Detecta tipo_tramite y fuente_tipo a partir de la ruta del fichero.

    Ejemplo:
      "arraigo_sociolaboral/base_legal/reglamento.pdf"
      → ("arraigo_sociolaboral", "base_legal")

    Returns None si la ruta no coincide con ningún patrón conocido.
    """
    for prefix, metadata in FOLDER_MAP.items():
        if file_path.startswith(prefix):
            return metadata
    return None


def _chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[str]:
    """
    Divide el texto en chunks con solapamiento.
    Intenta cortar en saltos de párrafo para no partir frases.
    """
    chunks = []
    start  = 0

    while start < len(text):
        end = start + chunk_size

        if end < len(text):
            # Intentar cortar en el último párrafo o punto dentro del chunk
            corte_parrafo = text.rfind("\n\n", start, end)
            corte_punto   = text.rfind(". ", start, end)

            if corte_parrafo > start + (chunk_size // 2):
                end = corte_parrafo
            elif corte_punto > start + (chunk_size // 2):
                end = corte_punto + 1

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        start = end - overlap

    return chunks


def _extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extrae texto de un PDF dado como bytes."""
    text_parts = []
    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
    except Exception as e:
        print(f"  ⚠️  Error extrayendo texto: {e}")
        return ""
    return "\n\n".join(text_parts)


def _get_already_ingested() -> set[str]:
    """Devuelve los file_paths ya insertados en documentos_legales."""
    try:
        res = (
            supabase_service.client
            .table("legal_documents")
            .select("file_path")
            .execute()
        )
        return {row["file_path"] for row in res.data if row["file_path"]}
    except Exception:
        return set()


# ─── Ingesta principal ────────────────────────────────────────────

def ingest_all(dry_run: bool = False, reset: bool = False) -> None:
    """
    Lee todos los PDFs de Storage e inserta sus ch unks en documentos-legales.

    Args:
        dry_run: Si True, solo muestra qué procesaría sin insertar nada
        reset:   Si True, borra todos los registros antes de ingestar
    """

    if reset and not dry_run:
        print("[ingest] 🗑️  Borrando registros existentes...")
        supabase_service.client.table("legal_documents").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
        print("[ingest] Tabla limpiada ✓")

    already_ingested = set() if reset else _get_already_ingested()
    if already_ingested:
        print(f"[ingest] {len(already_ingested)} ficheros ya ingestados, se omitirán")

    # 1. Listar todos los ficheros del bucket ─────────────────────
    print(f"\n[ingest] Listando ficheros en bucket '{BUCKET_NAME}'...")
    all_files = []

    for prefix in FOLDER_MAP.keys():
        try:
            res = supabase_service.client.storage.from_(BUCKET_NAME).list(prefix)
            for f in res:
                if f["name"].endswith(".pdf"):
                    full_path = f"{prefix}/{f['name']}"
                    all_files.append(full_path)
        except Exception as e:
            print(f"  ⚠️  Error listando {prefix}: {e}")

    if not all_files:
        print("[ingest] ❌ No se encontraron PDFs. Revisa el nombre del bucket y las rutas.")
        return

    print(f"[ingest] {len(all_files)} PDFs encontrados:\n")
    for f in all_files:
        print(f"  📄 {f}")

    if dry_run:
        print("\n[ingest] Modo dry-run: no se insertará nada.")
        return

    # 2. Procesar cada PDF ─────────────────────────────────────────
    total_chunks  = 0
    total_ficheros = 0

    for file_path in all_files:

        if file_path in already_ingested:
            print(f"\n[ingest] ⏭️  Omitiendo (ya ingestado): {file_path}")
            continue

        metadata = _detect_metadata(file_path)
        if not metadata:
            print(f"\n[ingest] ⚠️  Ruta no reconocida, omitiendo: {file_path}")
            continue

        tipo_tramite, fuente_tipo = metadata
        print(f"\n[ingest] 📄 Procesando: {file_path}")
        print(f"          tipo_tramite={tipo_tramite} | fuente_tipo={fuente_tipo}")

        # Descargar PDF
        try:
            pdf_bytes = supabase_service.client.storage.from_(BUCKET_NAME).download(file_path)
        except Exception as e:
            print(f"  ❌ Error descargando: {e}")
            continue

        # Extraer texto
        texto = _extract_text_from_pdf(pdf_bytes)
        if not texto.strip():
            print(f"  ⚠️  PDF sin texto extraíble (¿escaneado sin OCR?): {file_path}")
            continue

        print(f"  ✓ Texto extraído: {len(texto)} caracteres")

        # Dividir en chunks
        chunks = _chunk_text(texto)
        print(f"  ✓ {len(chunks)} chunks generados")

        # Generar embeddings e insertar
        rows_to_insert = []
        for chunk in chunks:
            embedding = model.encode(chunk).tolist()
            rows_to_insert.append({
                "content":      chunk,
                "embedding":    embedding,
                "tipo_tramite": tipo_tramite,
                "fuente_tipo":  fuente_tipo,
                "file_path":    file_path,
            })

        # Insertar en lotes de 50 para no sobrecargar
        batch_size = 50
        for i in range(0, len(rows_to_insert), batch_size):
            batch = rows_to_insert[i:i + batch_size]
            try:
                supabase_service.client.table("legal_documents").insert(batch).execute()
                print(f"  ✓ Lote {i // batch_size + 1}: {len(batch)} chunks insertados")
            except Exception as e:
                print(f"  ❌ Error insertando lote {i // batch_size + 1}: {e}")

        total_chunks   += len(chunks)
        total_ficheros += 1

    print(f"\n[ingest] ✅ Ingesta completada:")
    print(f"          {total_ficheros} ficheros procesados")
    print(f"          {total_chunks} chunks insertados en legal_documents")


# ─── CLI ─────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingesta PDFs de Supabase Storage a legal_documents")
    parser.add_argument("--dry-run", action="store_true", help="Solo lista los PDFs sin insertar")
    parser.add_argument("--reset",   action="store_true", help="Borra todo e ingesta desde cero")
    args = parser.parse_args()

    ingest_all(dry_run=args.dry_run, reset=args.reset)