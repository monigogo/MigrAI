import os
from langchain_groq import ChatGroq
from .settings import settings, dev_config


def get_llm(agent_name: str) -> ChatGroq:
    """
    Usa Groq con llama-3.3-70b-versatile.
    Gratuito y muy rápido. LangSmith activado para trazas.
    """
    # Activa LangSmith
    os.environ["LANGCHAIN_API_KEY"]    = settings.langchain_api_key
    os.environ["LANGCHAIN_TRACING_V2"] = settings.langchain_tracing_v2
    os.environ["LANGCHAIN_PROJECT"]    = settings.langchain_project
    os.environ["LANGCHAIN_ENDPOINT"]   = settings.langchain_endpoint

    return ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0.0,
        max_tokens=3000,
        api_key=settings.groq_api_key,
    )