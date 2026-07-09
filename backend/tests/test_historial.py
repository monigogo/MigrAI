from langchain_core.messages import HumanMessage

from src.agents.historial import MAX_MENSAJES_HISTORIAL, recortar_historial


def test_historial_corto_no_se_toca():
    mensajes = [HumanMessage(content=f"m{i}") for i in range(5)]
    assert recortar_historial(mensajes) == mensajes


def test_historial_largo_se_queda_con_los_ultimos():
    mensajes = [HumanMessage(content=f"m{i}") for i in range(MAX_MENSAJES_HISTORIAL + 15)]
    recortado = recortar_historial(mensajes)
    assert len(recortado) == MAX_MENSAJES_HISTORIAL
    assert recortado[-1] is mensajes[-1]
    assert recortado[0] is mensajes[15]
