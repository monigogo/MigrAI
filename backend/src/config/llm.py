import os
import logging
from functools import lru_cache
from langchain_groq import ChatGroq
from langchain_core.runnables import Runnable
from langfuse.langchain import CallbackHandler
from .settings import settings

logger = logging.getLogger(__name__)

# Variables de entorno para tracing — se fijan una sola vez al importar el
# módulo. Antes se reescribían en cada llamada a get_llm (una por cada
# pregunta de cada usuario), lo cual no aporta nada porque su valor nunca cambia.
os.environ["LANGCHAIN_API_KEY"]    = settings.langchain_api_key
os.environ["LANGCHAIN_TRACING_V2"] = "false"
os.environ["LANGCHAIN_PROJECT"]    = settings.langchain_project
os.environ["LANGCHAIN_ENDPOINT"]   = settings.langchain_endpoint
os.environ["LANGFUSE_PUBLIC_KEY"]  = settings.langfuse_public_key
os.environ["LANGFUSE_SECRET_KEY"]  = settings.langfuse_secret_key
os.environ["LANGFUSE_HOST"]        = settings.langfuse_host


def get_langfuse_callback():
    if not settings.langfuse_public_key or not settings.langfuse_secret_key:
        logger.debug("Langfuse no configurado, saltando.")
        return None

    return CallbackHandler()


@lru_cache(maxsize=None)
def get_llm(agent_name: str) -> Runnable:
    """Cliente LLM por agente, creado una sola vez y reutilizado en todas las
    peticiones (antes se creaban 3 clientes ChatGroq nuevos en cada pregunta).

    OJO: no enganchar aquí el callback de Langfuse con with_config — rompe
    los eventos on_chat_model_stream de astream_events (el streaming llega
    vacío al frontend) y además duplica el tracing: los endpoints ya pasan
    el callback por petición en el config del grafo."""

    # 1. MODELO PRINCIPAL
    llm_principal = ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0.0,
        max_tokens=3000,
        api_key=settings.groq_api_key,
        name=f"llm_{agent_name}_main",
    )

    # 2. RESPALDO 
    llm_respaldo_1 = ChatGroq(
        model="llama-3.1-8b-instant",
        temperature=0.0,
        max_tokens=3000,
        api_key=settings.groq_api_key,
        name=f"llm_{agent_name}_fallback_1",
    )

    # 3. RESPALDO
    llm_respaldo_2 = ChatGroq(
        model="openai/gpt-oss-20b",
        temperature=0.0,
        max_tokens=3000,
        api_key=settings.groq_api_key,
        name=f"llm_{agent_name}_fallback_2",
    )
    return llm_principal.with_fallbacks([llm_respaldo_1, llm_respaldo_2])
