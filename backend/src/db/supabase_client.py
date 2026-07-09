import logging
from supabase import create_client, Client
from ..config.settings import settings

logger = logging.getLogger(__name__)


class SupabaseManager:
    def __init__(self):
        self.client: Client = create_client(settings.supabase_url, settings.supabase_key)
        logger.info(f"Supabase conectado: {settings.supabase_url}")



    def crear_o_actualizar_sesion(self, sesion_id: str, pais: str,
                                   rango_edad: str, idioma: str):
     
        existe = (
            self.client.table("sesiones")
            .select("id")
            .eq("id", sesion_id)
            .execute()
        )
        datos = {
            "pais":       pais,
            "rango_edad": rango_edad,
            "idioma":     idioma,
        }
        if existe.data:
            self.client.table("sesiones").update(datos).eq("id", sesion_id).execute()
        else:
            self.client.table("sesiones").insert({"id": sesion_id, **datos}).execute()

    # ── Conversaciones ────────────────────────────────────────────────────

    def guardar_conversacion(
        self,
        sesion_id:        str,
        tramite:          str,
        pregunta:         str,
        respuesta:        str,
        agente_usado:     str,
        idioma_respuesta: str,
        pais_usuario:     str,
    ) -> str:

        resultado = (
            self.client.table("conversaciones")
            .insert({
                "sesion_id":         sesion_id,
                "tramite":           tramite,
                "pregunta":          pregunta,
                "respuesta":         respuesta,
                "agente_usado":      agente_usado,
                "idioma_respuesta":  idioma_respuesta,
                "pais_usuario":      pais_usuario,
                "dudas_resueltas":   None,
                "necesita_revision": False,
            })
            .execute()
        )
        return resultado.data[0]["id"]

    def guardar_feedback(self, conversacion_id: str, dudas_resueltas: bool):

        self.client.table("conversaciones").update({
            "dudas_resueltas":   dudas_resueltas,
            "necesita_revision": not dudas_resueltas,
        }).eq("id", conversacion_id).execute()

    # ── Historial ─────────────────────────────────────────────────────────

    def obtener_historial(self, sesion_id: str) -> list:

        resultado = (
            self.client.table("conversaciones")
            .select(
                "id,tramite,pregunta,respuesta,"
                "agente_usado,dudas_resueltas,"
                "idioma_respuesta,creado_en"
            )
            .eq("sesion_id", sesion_id)
            .order("creado_en", desc=False)
            .execute()
        )
        return resultado.data or []

    # ── Storage — PDFs ────────────────────────────────────────────────────

    def get_file_url(self, bucket: str, path: str) -> str:
        return self.client.storage.from_(bucket).get_public_url(path)

    def listar_ficheros(self, bucket: str, carpeta: str) -> list:
        return self.client.storage.from_(bucket).list(carpeta)

    def descargar_pdf(self, bucket: str, ruta: str) -> bytes:
        return self.client.storage.from_(bucket).download(ruta)


# ── Instancia global ──────────────────────────────────────────────────────

supabase_manager = SupabaseManager()


supabase: Client = supabase_manager.client