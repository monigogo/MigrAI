import json
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
from pydantic import Field

_env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=_env_path, override=True)


class Settings(BaseSettings):
    # OpenRouter
    groq_api_key: str = Field(..., env="GROQ_API_KEY")
    openrouter_api_key: str = Field(..., env="OPENROUTER_API_KEY")

    # LangSmith
    langchain_api_key: str = Field(..., env="LANGCHAIN_API_KEY")
    langchain_tracing_v2: str = Field("true", env="LANGCHAIN_TRACING_V2")
    langchain_project: str = Field("migrai-dev", env="LANGCHAIN_PROJECT")
    langchain_endpoint: str = Field(
        "https://api.smith.langchain.com", env="LANGCHAIN_ENDPOINT"
    )

    # Supabase
    supabase_url: str = Field(..., env="SUPABASE_URL")
    supabase_key: str = Field(..., env="SUPABASE_ANON_KEY")
    supabase_db_url: str = Field("", env="SUPABASE_DB_URL")

    # App
    app_env: str = Field("development", env="APP_ENV")

    model_config = {
        "env_file": str(_env_path),
        "env_file_encoding": "utf-8",
        "extra": "allow",
    }


def load_dev_config() -> dict:
    config_path = Path(__file__).parent.parent.parent / "dev.json"
    with open(config_path) as f:
        return json.load(f)


settings = Settings()
dev_config = load_dev_config()