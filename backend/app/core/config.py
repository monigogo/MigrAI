import os
from dotenv import load_dotenv

# Carga el .env del directorio actual (backend/)
load_dotenv()

class Settings:
    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_DB: str = os.getenv("SUPABASE_DB", "")
    SUPABASE_USER: str = os.getenv("SUPABASE_USER", "")
    SUPABASE_PASSWORD: str = os.getenv("SUPABASE_PASSWORD", "")
    SUPABASE_HOST: str = os.getenv("SUPABASE_HOST", "")

    # Groq
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    # Configuración general
    TOP_K: int = int(os.getenv("TOP_K", 3))

settings = Settings()
