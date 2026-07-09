"""Recorte del historial de conversación.

El checkpointer del grafo acumula todos los mensajes del hilo; sin recorte,
una conversación larga dispara los tokens (y el coste) de cada llamada al LLM.
"""

MAX_MENSAJES_HISTORIAL = 20


def recortar_historial(mensajes: list) -> list:
    return mensajes[-MAX_MENSAJES_HISTORIAL:]
