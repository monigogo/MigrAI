import os
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Carga el .env con ruta explícita desde cualquier punto del proyecto
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


class SupabaseManager:
    def __init__(self):
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_KEY")  # ← corregido

        if not url or not key:
            raise ValueError(
                f"Faltan credenciales de Supabase.\n"
                f"SUPABASE_URL: {url}\n"
                f"SUPABASE_KEY: {'encontrada' if key else 'NO encontrada'}\n"
                f"Buscando .env en: {env_path}\n"
                f"¿Existe el fichero?: {env_path.exists()}"
            )

        self.client: Client = create_client(url, key)
        print(f"✅ Supabase conectado: {url}")

    # ── Sesiones anónimas ─────────────────────────────────────────────────

    def crear_o_actualizar_sesion(self, sesion_id: str, pais: str,
                                   rango_edad: str, idioma: str):
        """Crea la sesión si no existe, o actualiza si ya existe."""
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
        """
        Guarda la conversación completa en Supabase.
        Devuelve el ID de la conversación para usarlo después en el feedback.
        """
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
        """
        Actualiza si el usuario resolvió sus dudas.
        Si dice NO → marca necesita_revision = True para análisis posterior.
        """
        self.client.table("conversaciones").update({
            "dudas_resueltas":   dudas_resueltas,
            "necesita_revision": not dudas_resueltas,
        }).eq("id", conversacion_id).execute()

    # ── Historial ─────────────────────────────────────────────────────────

    def obtener_historial(self, sesion_id: str) -> list:
        """Devuelve todas las conversaciones de una sesión."""
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
        """Devuelve la URL pública de un PDF en Supabase Storage."""
        return self.client.storage.from_(bucket).get_public_url(path)

    def listar_ficheros(self, bucket: str, carpeta: str) -> list:
        """Lista los ficheros de una carpeta del bucket."""
        return self.client.storage.from_(bucket).list(carpeta)

    def descargar_pdf(self, bucket: str, ruta: str) -> bytes:
        """Descarga un PDF como bytes. Lo usa el script de carga de normativa."""
        return self.client.storage.from_(bucket).download(ruta)


# ── Instancia global ──────────────────────────────────────────────────────
# Importa 'supabase_manager' en cualquier fichero que necesite Supabase
supabase_manager = SupabaseManager()

# Acceso directo al cliente crudo para queries avanzadas
supabase: Client = supabase_manager.client