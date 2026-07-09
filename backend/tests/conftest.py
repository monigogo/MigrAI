import pytest
from langchain_core.language_models.fake_chat_models import FakeListChatModel

# Cada uno de estos módulos hace "from ...config.llm import get_llm" — parchear
# src.config.llm.get_llm no les afecta, porque ya tienen su propio nombre local
# vinculado a la función original. Hay que parchear el nombre en cada módulo.
_MODULOS_CON_GET_LLM = [
    "src.agents.factory",
    "src.graph.orchestrator",
]


@pytest.fixture(autouse=True)
def _desactivar_rate_limit():
    """Los tests repiten peticiones al mismo endpoint — sin esto, el límite
    de 10/minuto devolvería 429 a mitad de la suite."""
    from src.api.routes import limiter

    limiter.enabled = False
    yield
    limiter.enabled = True


@pytest.fixture(autouse=True)
def _limpiar_cache_llm():
    """get_llm() está cacheado con lru_cache — sin esto, un test que use el
    real ChatGroq antes de que otro test lo parchee dejaría una instancia
    real cacheada contaminando el resto de la sesión de tests."""
    import src.config.llm as llm_module

    llm_module.get_llm.cache_clear()
    yield
    llm_module.get_llm.cache_clear()


@pytest.fixture
def fake_llm_factory(monkeypatch):
    """Parchea get_llm en todos los sitios donde se importa, de una sola vez.

    Uso:
        def test_algo(fake_llm_factory):
            fake_llm_factory(["arraigo_familiar"])  # misma respuesta para cualquier agente
            fake_llm_factory({"orchestrator": ["nie_tie"]})  # respuesta específica por agente
    """

    def _apply(responses):
        def _fake_get_llm(agent_name: str):
            textos = responses[agent_name] if isinstance(responses, dict) else responses
            return FakeListChatModel(responses=textos)

        for modulo in _MODULOS_CON_GET_LLM:
            monkeypatch.setattr(f"{modulo}.get_llm", _fake_get_llm)

        return _fake_get_llm

    return _apply


@pytest.fixture
def fake_guardarrail_llm(monkeypatch):
    """El guardarraíl no usa get_llm() — construye su propio _llm a nivel de
    módulo (vía OpenRouter). Necesita su propia fixture."""

    def _apply(responses):
        fake = FakeListChatModel(responses=responses)
        monkeypatch.setattr("src.guardarrail._llm", fake)
        return fake

    return _apply
