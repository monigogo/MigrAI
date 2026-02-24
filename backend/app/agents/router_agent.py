"""
router_agent.py — Orquestador central mejorado (versión estable sin loops).
"""

from groq import Groq
from app.agents.legal_agent import ask_legal_assistant
from app.agents.community_agent import ask_community_assistant
from app.agents.tone_agent import get_tone_config

import os
import threading

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# ─── Keywords ────────────────────────────────────────────────────

_LEGAL_KEYWORDS = [
    "requisito", "documento", "plazo", "normativa", "ley", "reglamento",
    "artículo", "resolución", "denegado", "denegación", "recurso",
    "arraigo", "residencia", "visado", "permiso", "autorización", "tarjeta",
    "nie", "nif", "pasaporte", "certificado", "apostilla",
    "extranjería", "delegación", "consulado", "embajada",
    "multa", "sanción", "ilegal", "irregular", "expulsión",
    "reagrupación", "familiar", "cónyuge", "dependiente",
    "renovar", "renovación", "caducado", "vencido",
    "qué documentos", "que documentos", "qué papeles", "que papeles",
    "cómo solicito", "como solicito",
    "estoy irregular", "estoy ilegal", "no tengo papeles", "sin papeles"
]

_COMMUNITY_KEYWORDS = [
    "cuánto tardó", "cuánto tarda", "cuánto tiempo", "esperar",
    "experiencia", "vivido", "pasó", "pasaron", "me contaron",
    "consejo", "recomend", "tip", "truco", "mejor forma",
    "cita", "pedir cita", "colas", "ventanilla",
    "gestoria", "gestor", "abogado barato",
    "grupo", "comunidad", "asociación", "ong", "ayuda gratis",
    "banco", "cuenta", "dinero", "trabajo informal",
    "alquiler", "piso", "habitación",
    "médico", "urgencias", "farmacia", "hospital público",
    "colegio", "escuela", "resguardo", "precontrato",
    "contrato sin nie", "contrato sin papeles",
    "admision a tramite", "admitido a tramite",
]

_GREETING_KEYWORDS = [
    "hola", "buenos días", "buenas tardes", "buenas noches",
    "qué tal", "cómo estás", "gracias", "muchas gracias",
    "adiós", "hasta luego", "chao",
]

_VAGUE_QUESTIONS = [
    "qué documentos necesito", "que documentos necesito",
    "qué papeles necesito", "que papeles necesito",
    "qué necesito", "que necesito",
    "cómo empiezo", "como empiezo",
    "por dónde empiezo", "por donde empiezo",
]


# ─── Clasificador ─────────────────────────────────────────────────

def _classify_intent(message: str) -> str:
    msg = message.lower().strip()

    if any(kw in msg for kw in _GREETING_KEYWORDS) and len(msg.split()) < 6:
        return "greeting"

    if any(vague in msg for vague in _VAGUE_QUESTIONS):
        tramites = ["arraigo", "nie", "permiso", "visado", "estudios", "renovar"]
        if not any(t in msg for t in tramites):
            return "vague"

    has_legal     = any(kw in msg for kw in _LEGAL_KEYWORDS)
    has_community = any(kw in msg for kw in _COMMUNITY_KEYWORDS)

    if has_legal and has_community:
        return "mixed"
    if has_legal:
        return "legal"
    if has_community:
        return "community"

    return "legal"


# ─── Respuestas directas ──────────────────────────────────────────

def _vague_response() -> str:
    return (
        "Para ayudarte mejor, ¿me puedes decir para qué trámite?\n\n"
        "• Arraigo social o laboral\n"
        "• Modificación de estudios a trabajo\n"
        "• Renovación de permiso\n\n"
        "Con eso te doy la info exacta."
    )


def _greeting_response(country: str | None, gender: str | None) -> str:
    tone = get_tone_config(country)
    saludo = f"{tone.greeting} " if tone.greeting else "¡Hola! "
    return (
        f"{saludo}Soy Guía Arraigo, tu asistente para el proceso migratorio en España.\n\n"
        "Puedo ayudarte con:\n\n"
        "📄 Documentos y requisitos legales\n\n"
        "⏱️ Tiempos reales y consejos prácticos\n\n"
        "👨‍👩‍👧 Situaciones familiares especiales\n\n"
        "¿Qué necesitas saber?"
    )


# ─── Combinar respuestas ──────────────────────────────────────────

_COMBINE_PROMPT = (
    "Eres un editor minimalista. Combina esto en un solo mensaje.\n"
    "- Máximo 40 palabras.\n"
    "- Una frase legal y una frase práctica.\n"
    "- Sin relleno.\n\n"
    "Respuesta legal: {legal_response}\n"
    "Comunidad: {community_response}"
)


def _combine_responses(legal_resp: str, community_resp: str, country: str | None) -> str:
    tone_config = get_tone_config(country)

    prompt = _COMBINE_PROMPT.format(
        legal_response=legal_resp,
        community_response=community_resp,
    )

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": "Combina las dos respuestas."},
        ],
        temperature=tone_config.temperature,
        max_tokens=80,
    )

    return completion.choices[0].message.content


# ─── Punto de entrada principal ──────────────────────────────────

def route_and_respond(
    user_message: str,
    session_id:   str,
    country:      str | None = None,
    age:          str | None = None,
    gender:       str | None = None,
    stayDuration: str | None = None,
    custom_instructions: str = "",
    history:      list | None = None,
) -> dict:

    # Solo aplicar instrucciones si vienen explícitamente del main
    if custom_instructions:
        user_message = f"[{custom_instructions}] {user_message}"

    intent = _classify_intent(user_message)
    print(f"[router] intent={intent} | país={country} | sesión={session_id[:8]}...")

    if intent == "greeting":
        return {
            "reply": _greeting_response(country, gender),
            "intent": "greeting",
            "agents": ["direct"],
        }

    if intent == "vague":
        return {
            "reply": _vague_response(),
            "intent": "vague",
            "agents": ["direct"],
        }

    args = {
        "user_message": user_message,
        "session_id": session_id,
        "country": country,
        "age": age,
        "gender": gender,
        "stayDuration": stayDuration,
        "history": history,
    }

    if intent == "legal":
        reply = ask_legal_assistant(**args)
        return {"reply": reply, "intent": "legal", "agents": ["legal_agent"]}

    if intent == "community":
        reply = ask_community_assistant(**args)
        return {"reply": reply, "intent": "community", "agents": ["community_agent"]}

    # Mixed → paralelo

    legal_reply = None
    community_reply = None

    def _run_legal():
        nonlocal legal_reply
        legal_reply = ask_legal_assistant(**args)

    def _run_community():
        nonlocal community_reply
        community_reply = ask_community_assistant(**args)

    t1 = threading.Thread(target=_run_legal)
    t2 = threading.Thread(target=_run_community)
    t1.start()
    t2.start()
    t1.join()
    t2.join()

    if legal_reply and community_reply:
        final_reply = _combine_responses(legal_reply, community_reply, country)
        agents_used = ["legal_agent", "community_agent", "combiner"]
    elif legal_reply:
        final_reply = legal_reply
        agents_used = ["legal_agent"]
    elif community_reply:
        final_reply = community_reply
        agents_used = ["community_agent"]
    else:
        final_reply = "Lo siento, ocurrió un problema. Intenta de nuevo."
        agents_used = []

    return {"reply": final_reply, "intent": "mixed", "agents": agents_used}