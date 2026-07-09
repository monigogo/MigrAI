"""
Harness de evaluación de enrutado del orquestador.

Modo mockeado (por defecto, corre en CI): usa un LLM falso que siempre
responde con el agente esperado — verifica que el parseo/normalización de
orchestrator_node funciona, no la precisión real del modelo. Solapa
intencionalmente con tests/test_orchestrator.py; sirve de smoke test del
propio harness de evaluación.

Modo en vivo (opt-in, requiere RUN_LIVE_EVAL=1 y credenciales reales de
Groq): llama al orquestador real para cada pregunta del dataset dorado y
mide la precisión de enrutado real. No se ejecuta en CI.

    RUN_LIVE_EVAL=1 uv run pytest tests/eval/ -m eval_live -v
"""
import json
import os
from pathlib import Path

import pytest
from langchain_core.messages import HumanMessage
from src.graph.orchestrator import orchestrator_node

DATASET_PATH = Path(__file__).parent / "golden_routing.json"


def _cargar_dataset() -> list[dict]:
    with open(DATASET_PATH, encoding="utf-8") as f:
        return json.load(f)


def _registrar_en_langfuse(accuracy: float, total: int) -> None:
    """Best-effort: si Langfuse no está configurado o falla, no afecta al test."""
    try:
        from src.config.settings import settings
        if not settings.langfuse_public_key or not settings.langfuse_secret_key:
            return
        from langfuse import Langfuse
        client = Langfuse(
            public_key=settings.langfuse_public_key,
            secret_key=settings.langfuse_secret_key,
            host=settings.langfuse_host,
        )
        client.create_score(
            name="orchestrator_routing_accuracy",
            value=accuracy,
            comment=f"{total} preguntas del dataset dorado",
        )
    except Exception:
        pass


@pytest.mark.asyncio
async def test_smoke_del_harness_con_llm_mockeado(fake_llm_factory):
    """Verifica que el harness de evaluación en sí funciona: con un LLM que
    siempre acierta, la precisión medida debe ser 100%."""
    dataset = _cargar_dataset()
    aciertos = 0

    for caso in dataset:
        fake_llm_factory({"orchestrator": [caso["expected_agent"]]})
        estado = {"messages": [HumanMessage(content=caso["pregunta"])]}
        resultado = await orchestrator_node(estado)
        if resultado["next_agent"] == caso["expected_agent"]:
            aciertos += 1

    assert aciertos == len(dataset)


@pytest.mark.asyncio
@pytest.mark.eval_live
@pytest.mark.skipif(
    not os.environ.get("RUN_LIVE_EVAL"),
    reason="Eval en vivo desactivada por defecto (cuesta dinero real). Activar con RUN_LIVE_EVAL=1.",
)
async def test_precision_de_enrutado_en_vivo():
    """Mide la precisión real del orquestador contra Groq. No corre en CI."""
    dataset = _cargar_dataset()
    aciertos = 0
    fallos = []

    for caso in dataset:
        estado = {"messages": [HumanMessage(content=caso["pregunta"])]}
        resultado = await orchestrator_node(estado)
        obtenido = resultado.get("next_agent")
        if obtenido == caso["expected_agent"]:
            aciertos += 1
        else:
            fallos.append((caso["pregunta"], caso["expected_agent"], obtenido))

    accuracy = aciertos / len(dataset)
    _registrar_en_langfuse(accuracy, len(dataset))

    if fallos:
        detalle = "\n".join(f"  - '{p}': esperado={e}, obtenido={o}" for p, e, o in fallos)
        print(f"\nFallos de enrutado ({len(fallos)}/{len(dataset)}):\n{detalle}")

    # Umbral inicial conservador — ajustar tras establecer una base real.
    assert accuracy >= 0.85, f"Precisión de enrutado {accuracy:.0%} por debajo del umbral (85%)"
