import os
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargamos las variables del .env con ruta explícita
env_path = Path(__file__).parent.parent.parent / ".env"
print(f"🔍 Buscando .env en: {env_path}")
print(f"🔍 ¿El archivo existe?: {env_path.exists()}")
load_dotenv(dotenv_path=env_path)

class SupabaseManager:
    def __init__(self):
        url: str = os.environ.get("SUPABASE_URL")
        key: str = os.environ.get("SUPABASE_ANON_KEY")
        print(f"🔑 SUPABASE_URL: {url}")
        print(f"🔑 SUPABASE_ANON_KEY: {'***' + key[-10:] if key else 'None'}")
        if not url or not key:
            raise ValueError("Faltan las credenciales de Supabase en el .env")
        self.client: Client = create_client(url, key)

    def get_file_url(self, bucket: str, path: str):
        """Obtiene la URL pública del PDF que subiste al Storage"""
        return self.client.storage.from_(bucket).get_public_url(path)

    def save_chat_history(self, session_id: str, message: str, role: str):
        """Guarda el historial filtrado (puedes llamar a tu función de limpieza aquí)"""
        data = {
            "session_id": session_id,
            "content": message,
            "role": role
        }
        return self.client.table("chat_history").insert(data).execute()

# Instancia única para usar en todo el proyecto
supabase_service = SupabaseManager()