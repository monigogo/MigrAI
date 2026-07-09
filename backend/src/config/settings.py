import json
from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator

_env_path = Path(__file__).parent.parent.parent / ".env"


class Settings(BaseSettings):

    # Docker (--env-file, docker-compose env_file) NO quita las comillas de
    # los valores del .env, a diferencia de python-dotenv. Un valor como
    # LANGFUSE_BASE_URL="https://..." llega con comillas literales y rompe
    # las URLs. Este validador las limpia venga de donde venga el valor.
    @field_validator("*", mode="before")
    @classmethod
    def _quitar_comillas_envolventes(cls, v):
        if isinstance(v, str) and len(v) >= 2 and v[0] == v[-1] and v[0] in "\"'":
            return v[1:-1]
        return v

    groq_api_key: str = Field(...)
    openrouter_api_key: str = Field(...)

    langchain_api_key: str = Field(...)
    langchain_tracing_v2: str = Field("true")
    langchain_project: str = Field("migrai-dev")
    langchain_endpoint: str = Field("https://api.smith.langchain.com")

    supabase_url: str = Field(...)
    supabase_key: str = Field(..., validation_alias="SUPABASE_KEY")
    supabase_db_url: str = Field("")

    # Langfuse
    langfuse_public_key: str = Field("")
    langfuse_secret_key: str = Field("")
    langfuse_host: str = Field("https://cloud.langfuse.com", validation_alias="LANGFUSE_BASE_URL")

    model_config = {
        "env_file": str(_env_path),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


def load_dev_config() -> dict:
    config_path = Path(__file__).parent.parent.parent / "dev.json"
    with open(config_path) as f:
        return json.load(f)


settings = Settings()
dev_config = load_dev_config()
