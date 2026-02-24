from app.services.supabase_client import supabase_service
from app.rag.retriever import buscar_contexto_legal, detectar_tipo_tramite
from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def ask_legal_assistant(
    user_message:  str,
    session_id:    str,
    country:       str | None = None,
    age:           str | None = None,
    gender:        str | None = None,
    stayDuration:  str | None = None,
    history:       list | None = None,  # ← NUEVO
):
    # ── 1. GUARDAR PERFIL ─────────────────────────────────────────
    if country or age or gender or stayDuration:
        try:
            supabase_service.client.table("user_profiles").upsert({
                "session_id":   session_id,
                "country":      country,
                "age":          age,
                "gender":       gender,
                "stayDuration": stayDuration,
            }).execute()
        except Exception as e:
            print(f"[legal_agent] Error guardando perfil: {e}")

    # ── 2. RAG LEGAL ──────────────────────────────────────────────
    tipo_tramite   = detectar_tipo_tramite(user_message)
    contexto_legal = buscar_contexto_legal(user_message, tipo_tramite)

    # ── 3. INFO USUARIO ───────────────────────────────────────────
    info_usuario = ""
    if country:      info_usuario += f"Usuario de {country}. "
    if age:          info_usuario += f"Tiene {age}. "
    if gender:       info_usuario += f"Género: {gender}. "

    if stayDuration == "2años":
        info_usuario += "⚠️ LLEVA 2 AÑOS EN ESPAÑA. Cumple requisito de arraigo. Priorizar Arraigo Sociolaboral (con contrato) o Arraigo Social. "
    elif stayDuration:
        info_usuario += f"Lleva {stayDuration} en España. "

    # ── 4. PROMPT ─────────────────────────────────────────────────
    persona_prompt = (
        "Eres 'Guía Arraigo Legal'. Das respuestas ultra claras y directas.\n\n"
        f"{info_usuario}\n\n"
        "REGLA DE ORO: Si el usuario lleva 2 años o menciona que no tiene papeles, "
        "si responde que tiene 2 o 2 años dile que ya puede aplicar a los arraigos.\n"
        "Con contrato de trabajo → ARRAIGO SOCIOLABORAL, SOCIOFORMATIVO, SOCIAL O FAMILIAR"
        "si responde no tengo contrato o no puedo conseguirlo → ARRAIGO SOCIOFORMATIVO, SOCIAL O FAMILIAR "
        "REGLA ANTI-BUCLE: Lee el historial completo. Si ya hiciste una pregunta "
        "y el usuario respondió, NO la repitas. Avanza con la siguiente información.\n\n"
        "CONTEXTO LEGAL (úsalo solo si aplica):\n"
        f"{contexto_legal}\n\n"
        "REGLAS OBLIGATORIAS:\n"
        "1. Máximo 70 PALABRAS.\n"
        "2. Frases cortas.\n"
        "3. Nada de explicaciones generales sobre extranjería.\n"
        "4. Responde solo al trámite mencionado"
        "5. Si falta información, haz UNA pregunta concreta distinta a las ya hechas.\n"
        "6. Sin discurso motivacional.\n"
        "7. No repitas el contexto.\n"
    )

    # ── 5. CONSTRUIR MENSAJES CON HISTORIAL DEL FRONTEND ──────────
    messages = [{"role": "system", "content": persona_prompt}]

    # Usar historial del frontend (más fiable que Supabase)
    if history:
        for h in history[-12:]:  # últimos 12 mensajes
            messages.append({"role": h["role"], "content": h["content"]})
    else:
        # Fallback: historial de Supabase
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
            print(f"[legal_agent] Error cargando historial: {e}")

    messages.append({"role": "user", "content": user_message})

    # ── 6. GENERACIÓN ─────────────────────────────────────────────
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.2,
        max_tokens=120,
    )

    respuesta_ia = completion.choices[0].message.content

    # ── 7. GUARDAR HISTORIAL ──────────────────────────────────────
    try:
        supabase_service.client.table("chat_history").insert([
            {"session_id": session_id, "role": "user",      "content": user_message},
            {"session_id": session_id, "role": "assistant", "content": respuesta_ia},
        ]).execute()
    except Exception as e:
        print(f"[legal_agent] Error guardando historial: {e}")

    return respuesta_ia