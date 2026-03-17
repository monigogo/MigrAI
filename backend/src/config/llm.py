import os
from langchain_groq import ChatGroq
from langchain_core.runnables import Runnable
from .settings import settings, dev_config

def get_llm(agent_name: str) -> Runnable:

    # Activa LangSmith
    os.environ["LANGCHAIN_API_KEY"]    = settings.langchain_api_key
    os.environ["LANGCHAIN_TRACING_V2"] = settings.langchain_tracing_v2
    os.environ["LANGCHAIN_PROJECT"]    = settings.langchain_project
    os.environ["LANGCHAIN_ENDPOINT"]   = settings.langchain_endpoint

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
        model="mixtral-8x7b-32768",
        temperature=0.0,
        max_tokens=3000,
        api_key=settings.groq_api_key,
        name=f"llm_{agent_name}_fallback_2",
    )

    return llm_principal.with_fallbacks([llm_respaldo_1, llm_respaldo_2])
