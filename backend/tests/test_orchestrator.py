import pytest
from langchain_core.messages import HumanMessage
from src.graph.orchestrator import (
    _extraer_agente,
    orchestrator_node,
    route_to_agent,
    should_end,
)


AGENTES_VALIDOS = [
    "arraigo_familiar", "arraigo_socioformativo", "arraigo_sociolaboral",
    "arraigo_social", "modif_estancia_trabajo", "nie_tie",
    "reagrupacion",
]


def _estado(pregunta="¿qué necesito?", **extra):
    return {"messages": [HumanMessage(content=pregunta)], **extra}


@pytest.mark.asyncio
class TestOrchestratorNode:
    @pytest.mark.parametrize("agente", AGENTES_VALIDOS)
    async def test_enruta_a_cada_agente_valido(self, fake_llm_factory, agente):
        fake_llm_factory({"orchestrator": [agente]})
        resultado = await orchestrator_node(_estado())
        assert resultado["next_agent"] == agente

    @pytest.mark.parametrize("respuesta_llm,esperado", [
        ("Arraigo-Familiar.", "arraigo_familiar"),
        ("  NIE_TIE  ", "nie_tie"),
        ("Reagrupacion", "reagrupacion"),
    ])
    async def test_normaliza_mayusculas_guiones_espacios_y_punto(
        self, fake_llm_factory, respuesta_llm, esperado
    ):
        fake_llm_factory({"orchestrator": [respuesta_llm]})
        resultado = await orchestrator_node(_estado())
        assert resultado["next_agent"] == esperado

    async def test_respuesta_invalida_cae_a_respuesta_final(self, fake_llm_factory):
        fake_llm_factory({"orchestrator": ["no lo sé, no tengo claro qué trámite es"]})
        resultado = await orchestrator_node(_estado())
        assert resultado["next_agent"] == "respuesta_final"
        assert resultado["tramite_detectado"] == "conversacion_orquestador"
        assert resultado["last_agent"] == "orchestrator"

    async def test_documentos_sin_fichero_cae_a_respuesta_final(self, fake_llm_factory):
        """A "documentos" solo se llega subiendo un PDF; si el LLM lo elige
        sin documento, tratarlo como conversación evita que el agente
        responda sobre un fichero inexistente."""
        fake_llm_factory({"orchestrator": ["documentos"]})
        resultado = await orchestrator_node(_estado())
        assert resultado["next_agent"] == "respuesta_final"

    async def test_document_content_enruta_a_documentos_sin_llamar_al_llm(self, monkeypatch):
        llamado = False

        def _no_deberia_llamarse(agent_name):
            nonlocal llamado
            llamado = True
            raise AssertionError("no debería llamarse a get_llm cuando hay document_content")

        monkeypatch.setattr("src.graph.orchestrator.get_llm", _no_deberia_llamarse)
        resultado = await orchestrator_node(_estado(document_content="texto extraído del PDF"))
        assert resultado["next_agent"] == "documentos"
        assert not llamado


class TestExtraerAgente:
    def test_nombre_exacto(self):
        assert _extraer_agente("arraigo_familiar") == "arraigo_familiar"

    @pytest.mark.parametrize("respuesta,esperado", [
        # El LLM conversa y deja la derivación en la última línea
        ("¡Claro! Con un cónyuge español puedes optar al arraigo familiar.\narraigo_familiar 🙌", "arraigo_familiar"),
        ("Te derivo con el especialista.\nnie_tie", "nie_tie"),
        ("Con contrato de trabajo tu vía es esta:\n→ arraigo_sociolaboral", "arraigo_sociolaboral"),
    ])
    def test_agente_en_ultima_linea_con_conversacion(self, respuesta, esperado):
        assert _extraer_agente(respuesta) == esperado

    def test_varios_agentes_en_ultima_linea_es_ambiguo(self):
        pregunta = "¿Estudias (arraigo socioformativo) o tienes ahorros (arraigo social)?"
        assert _extraer_agente(pregunta) is None

    def test_conversacion_sin_agente_devuelve_none(self):
        assert _extraer_agente("no lo sé, no tengo claro qué trámite es") is None

    def test_social_no_confunde_con_sociolaboral(self):
        assert _extraer_agente("tu caso es arraigo_sociolaboral") == "arraigo_sociolaboral"


class TestRouteToAgent:
    def test_devuelve_next_agent_del_estado(self):
        assert route_to_agent({"next_agent": "nie_tie"}) == "nie_tie"

    def test_default_arraigo_social_si_falta_next_agent(self):
        assert route_to_agent({}) == "arraigo_social"


class TestShouldEnd:
    def test_termina_si_last_agent_es_respuesta_final(self):
        from langgraph.graph import END
        assert should_end({"last_agent": "respuesta_final"}) == END

    def test_continua_a_respuesta_final_en_otro_caso(self):
        assert should_end({"last_agent": "nie_tie"}) == "respuesta_final"
        assert should_end({}) == "respuesta_final"
