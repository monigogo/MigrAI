import hashlib
import fitz
from ..db.supabase_client import supabase_manager, supabase
from .embeddings import get_embedding
from ..config.settings import dev_config


BUCKET = "documentos-legales"

# Los valores de "tramite" deben coincidir EXACTAMENTE con el string que cada
# agente experto pasa a buscar_contexto(tramite=...) — ver
# src/agents/factory.py. Si no coinciden, ese
# agente nunca recibe contexto RAG (siempre cae en "No se encontró
# información específica para este trámite."), sin ningún error visible.
ESTRUCTURA = {
    # ── Arraigo sociolaboral ──────────────────────────────────────
    "arraigo_sociolaboral/normativa":   {"tramite": "arraigo_sociolaboral", "tipo": "normativa"},
    "arraigo_sociolaboral/comunidad":   {"tramite": "arraigo_sociolaboral", "tipo": "comunidad"},
    "arraigo_sociolaboral/tasa":        {"tramite": "arraigo_sociolaboral", "tipo": "tasa"},
    "arraigo_sociolaboral/formularios": {"tramite": "arraigo_sociolaboral", "tipo": "formulario"},

    # ── Arraigo socioformativo ────────────────────────────────────
    "arraigo_socioformativo/normativa":   {"tramite": "arraigo_socioformativo", "tipo": "normativa"},
    "arraigo_socioformativo/comunidad":   {"tramite": "arraigo_socioformativo", "tipo": "comunidad"},
    "arraigo_socioformativo/tasa":        {"tramite": "arraigo_socioformativo", "tipo": "tasa"},
    "arraigo_socioformativo/formularios": {"tramite": "arraigo_socioformativo", "tipo": "formulario"},

    # ── Arraigo familiar ──────────────────────────────────────────
    "arraigo_familiar/normativa":   {"tramite": "arraigo_familiar", "tipo": "normativa"},
    "arraigo_familiar/comunidad":   {"tramite": "arraigo_familiar", "tipo": "comunidad"},
    "arraigo_familiar/tasa":        {"tramite": "arraigo_familiar", "tipo": "tasa"},
    "arraigo_familiar/formularios": {"tramite": "arraigo_familiar", "tipo": "formulario"},

    # ── Arraigo social ─────────────────────────────────────────────
    # [NUEVO] Antes no existía ninguna carpeta para este trámite: el agente
    # arraigo_social nunca recibía contexto RAG. Si la carpeta no existe aún
    # en el bucket, listar_ficheros() devuelve vacío y se salta sin error —
    # pero hace falta subir los PDFs reales para que esto sirva de algo.
    "arraigo_social/normativa":   {"tramite": "arraigo_social", "tipo": "normativa"},
    "arraigo_social/comunidad":   {"tramite": "arraigo_social", "tipo": "comunidad"},
    "arraigo_social/tasa":        {"tramite": "arraigo_social", "tipo": "tasa"},
    "arraigo_social/formularios": {"tramite": "arraigo_social", "tipo": "formulario"},

    # ── NIE / TIE ──────────────────────────────────────────────────
    # [NUEVO] Mismo caso: nie_tie nunca tenía carpeta ni contenido.
    "nie_tie/normativa":   {"tramite": "nie_tie", "tipo": "normativa"},
    "nie_tie/comunidad":   {"tramite": "nie_tie", "tipo": "comunidad"},
    "nie_tie/tasa":        {"tramite": "nie_tie", "tipo": "tasa"},
    "nie_tie/formularios": {"tramite": "nie_tie", "tipo": "formulario"},

    # ── Reagrupación familiar ────────────────────────────────────
    # [NUEVO] Mismo caso: reagrupacion nunca tenía carpeta ni contenido.
    "reagrupacion/normativa":   {"tramite": "reagrupacion", "tipo": "normativa"},
    "reagrupacion/comunidad":   {"tramite": "reagrupacion", "tipo": "comunidad"},
    "reagrupacion/tasa":        {"tramite": "reagrupacion", "tipo": "tasa"},
    "reagrupacion/formularios": {"tramite": "reagrupacion", "tipo": "formulario"},

    # ── Modificación de estancia a trabajo ────────────────────────
    # [CAMBIO] Antes etiquetado como "residencia_trabajo", que no coincidía
    # con ningún agente — el contenido de estudio_trabajo_ajena/* quedaba
    # ingerido pero nunca era recuperable por nadie. Se retagea al trámite
    # conceptualmente más cercano (modif_estancia_trabajo). Confirmar con
    # producto si esto es correcto o si merece un agente propio.
    "estudio_trabajo_ajena/normativa":   {"tramite": "modif_estancia_trabajo", "tipo": "normativa"},
    "estudio_trabajo_ajena/comunidad":   {"tramite": "modif_estancia_trabajo", "tipo": "comunidad"},
    "estudio_trabajo_ajena/tasa":        {"tramite": "modif_estancia_trabajo", "tipo": "tasa"},
    "estudio_trabajo_ajena/formularios": {"tramite": "modif_estancia_trabajo", "tipo": "formulario"},
}


def trocear_texto(texto: str, chunk_size: int, overlap: int) -> list[str]:

    trozos, inicio = [], 0
    while inicio < len(texto):
        trozo = texto[inicio: inicio + chunk_size]
        if trozo.strip():
            trozos.append(trozo)
        inicio += chunk_size - overlap
    return trozos


def _hash_trozo(fuente: str, pagina: int, indice: int, trozo: str) -> str:
    clave = f"{fuente}|{pagina}|{indice}|{trozo}"
    return hashlib.sha256(clave.encode("utf-8")).hexdigest()


def _existe_hash(contenido_hash: str) -> bool:
    r = (
        supabase.table("documentos_normativa")
        .select("id")
        .eq("contenido_hash", contenido_hash)
        .limit(1)
        .execute()
    )
    return bool(r.data)


def _desactivar_versiones_previas(fuente: str) -> None:
    """Marca como inactivas las filas ya existentes de este fichero antes de
    reinsertar — el ingest más reciente de un fichero es el que cuenta."""
    supabase.table("documentos_normativa").update({"activo": False}).eq("fuente", fuente).execute()


def cargar_desde_storage() -> int:
    cfg   = dev_config["rag"]
    total = 0

    for ruta_carpeta, meta in ESTRUCTURA.items():
        tramite = meta["tramite"]
        tipo    = meta["tipo"]

        print(f"\n── {ruta_carpeta} [{tipo}] ──────────")


        try:
            ficheros = supabase_manager.listar_ficheros(BUCKET, ruta_carpeta)
        except Exception as e:
            print(f"  No se pudo acceder: {e}")
            continue

        if not ficheros:
            print("  Vacía, saltando")
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

            # El ingest de este fichero reemplaza a cualquier ingest previo del
            # mismo fichero (versionado simple: gana la ejecución más reciente).
            _desactivar_versiones_previas(nombre)

            # Extrae texto página a página
            doc = fitz.open(stream=pdf_bytes, filetype="pdf")
            fragmentos_fichero = 0

            for num_pag, pagina in enumerate(doc, start=1):
                texto = pagina.get_text()
                if not texto.strip():
                    continue

                for indice, trozo in enumerate(trocear_texto(
                    texto, cfg["chunk_size"], cfg["chunk_overlap"]
                )):
                    if len(trozo.strip()) < 50:
                        continue

                    contenido_hash = _hash_trozo(nombre, num_pag, indice, trozo)
                    if _existe_hash(contenido_hash):
                        # Mismo contenido ya ingerido antes (p.ej. el PDF no
                        # cambió) — se reactiva en vez de duplicar.
                        supabase.table("documentos_normativa").update(
                            {"activo": True}
                        ).eq("contenido_hash", contenido_hash).execute()
                        fragmentos_fichero += 1
                        total += 1
                        continue

                    vector = get_embedding(trozo)

                    supabase.table("documentos_normativa").insert({
                        "contenido":      trozo,
                        "embedding":      vector,
                        "tramite":        tramite,
                        "fuente":         nombre,
                        "pagina":         num_pag,
                        "tipo":           tipo,
                        "contenido_hash": contenido_hash,
                        "activo":         True,
                    }).execute()

                    fragmentos_fichero += 1
                    total += 1

            doc.close()
            print(f"  OK: {nombre} → {fragmentos_fichero} fragmentos")

    print(f"\n{'─'*50}")
    print(f"Total fragmentos guardados en Supabase: {total}")
    return total


if __name__ == "__main__":
    cargar_desde_storage()