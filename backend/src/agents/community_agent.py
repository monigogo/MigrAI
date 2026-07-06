from groq import Groq
from app.services.supabase_client import supabase_service
from app.agents.tone_agent import get_tone_config, apply_tone_to_prompt
from app.rag.retriever import buscar_contexto_comunidad, detectar_tipo_tramite
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ─── Knowledge base de fallback ──────────────────────────────────
_COMMUNITY_KNOWLEDGE = {
    "nie": (
        "NIE: espera entre 1 y 3 meses. Las citas se liberan a las 00:00 o 6am. "
        "Lleva todo por duplicado. Gestorías ofrecen citas más rápidas por una tarifa."
    ),
    "empadronamiento": (
        "Empadronamiento: mismo día en la mayoría de ayuntamientos. "
        "Necesitas contrato de alquiler o declaración del propietario."
    ),
    "arraigo": (
        "Arraigo social: entre 6 y 12 meses de resolución. "
        "Guarda TODO: facturas, contratos, recibos. "
        "ACCEM y Cruz Roja ayudan gratis."
    ),
    "trabajo": (
        "Trabajo: sectores más accesibles son hostelería, construcción y cuidados. "
        "Con arraigo laboral puedes regularizarte tras 2 años con contrato."
    ),
    "cuenta_bancaria": (
        "Banco: BBVA y Santander suelen ser más flexibles."
    ),
    "salud": (
        "Salud: con empadronamiento tienes médico de cabecera. "
        "Urgencias siempre accesibles sin papeles. "
        "Con 3 meses de padrón puedes acceder a la tarjeta sanitaria."
    ),
    "homologacion": (
        "Homologación: entre 6 meses y 1 año si son para la ESO. "
        "Ministerio de Educación lo tramita."
    ),
}


def _get_fallback_context(user_message: str) -> str:
    msg = user_message.lower()
    keyword_map = {
        "nie":             ["nie", "número de identidad"],
        "empadronamiento": ["empadronamiento", "empadronar", "padrón"],
        "arraigo":         ["arraigo", "regularizar", "residencia"],
        "trabajo":         ["trabajo", "trabajar", "empleo", "contrato"],
        "cuenta_bancaria": ["banco", "cuenta"],
        "salud":           ["salud", "médico", "hospital", "sanitaria", "dase"],
        "homologacion":    ["título", "homologar", "eso"],
    }
    results = []
    for topic, keywords in keyword_map.items():
        if any(kw in msg for kw in keywords):
            results.append(_COMMUNITY_KNOWLEDGE[topic])
    return "\n".join(results) if results else (
        "Consejo general: mantén copias de todos tus documentos. "
        "Existen ayudas gratuitas con el pasaporte, Parroquias, ONGs."
    )


def ask_community_assistant(
    user_message: str,
    session_id: str,
    country: str | None = None,
    age: str | None = None,
    gender: str | None = None,
    stayDuration: str | None = None,
    history: list | None = None,
) -> str:
    
    # 1. Tono por país
    tone_config = get_tone_config(country)

    # 2. RAG comunidad
    tipo_tramite  = detectar_tipo_tramite(user_message)
    rag_comunidad = buscar_contexto_comunidad(user_message, tipo_tramite)
    hardcoded     = _get_fallback_context(user_message)
    contexto_final = rag_comunidad if rag_comunidad and "No hay experiencias" not in rag_comunidad else hardcoded

    # 3. Info usuario
    info_usuario = ""
    if country:
        info_usuario += f"Usuario de {country}. "
    if age:
        info_usuario += f"Tiene {age}. "
    if gender:
        info_usuario += f"Género: {gender}. "
    if stayDuration == "2años":
        info_usuario += "⚠️ LLEVA 2 AÑOS EN ESPAÑA. Ya cumple arraigo. NO preguntes cuánto tiempo lleva. "
    elif stayDuration:
        info_usuario += f"Lleva {stayDuration} en España. "

    # 4. Prompt
    base_prompt = (
        "Eres 'Guía Arraigo Comunidad'. Hablas como un amigo que da consejo rápido.\n\n"
        f"{info_usuario}\n\n"
        "REGLA ANTI-BUCLE: Lee el historial. Si ya preguntaste algo y el usuario respondió, "
        "NO lo preguntes de nuevo. Avanza con la siguiente información.\n\n"
        "REGLA DE ORO: Si el usuario lleva 2 años, NO preguntes cuánto lleva. "
        "Ya lo sabes. Dile directamente qué arraigo le corresponde.\n\n"
        "CONTEXTO DE EXPERIENCIAS:\n"
        f"{contexto_final}\n\n"
        "ESTILO OBLIGATORIO:\n"
        "- Máximo 40 palabras.\n"
        "- Directo al grano, sin introducciones.\n"
        "- Informal, como WhatsApp.\n"
        "- 1 o 2 emojis máximo.\n"
        "- PROHIBIDO: 'ánimo', 'no te rindas', 'España es acogedora'.\n"
        "- PROHIBIDO: repetir preguntas ya respondidas en el historial.\n"
    )
    prompt_final = apply_tone_to_prompt(base_prompt, tone_config)

    # 5. Historial 
    messages = [{"role": "system", "content": prompt_final}]

    if history:
        for h in history[-12:]: 
            messages.append({"role": h["role"], "content": h["content"]})
    else:
        try:
            res = (
                supabase_service.client
                .table("chat_history")
                .select("role, content")
                .eq("session_id", session_id)
                .order("created_at", desc=True)
                .limit(12)
                .execute()
            )
            for h in res.data[::-1]:
                messages.append({"role": h["role"], "content": h["content"]})
        except Exception as e:
            print(f"[community_agent] Error cargando historial: {e}")

    messages.append({"role": "user", "content": user_message})

    
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=tone_config.temperature,
        max_tokens=120,
    )

    return completion.choices[0].message.content