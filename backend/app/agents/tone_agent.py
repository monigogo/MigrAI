"""
tone_agent.py
─────────────────────────────────────────────────────────────────────
Utilidad compartida — NO es un agente independiente con su propia llamada LLM.

Responsabilidades:
  1. Detectar el tono adecuado según el país de origen del usuario
  2. Ajustar el system prompt de otros agentes antes de llamar a Groq
  3. (Opcional) Post-procesar la respuesta final para suavizar el tono

Uso:
    from app.agents.tone_agent import get_tone_config, apply_tone_to_prompt

    config = get_tone_config(country="Venezuela")
    prompt_final = apply_tone_to_prompt(base_prompt, config)
"""

from dataclasses import dataclass


# ─── Configuraciones de tono por región ─────────────────────────────────────

@dataclass
class ToneConfig:
    """Parámetros de tono para un país o región concreta."""
    region: str
    temperature: float        # Groq temperature (0.0–1.0)
    style_notes: str          # Instrucciones de estilo para el system prompt
    greeting: str             # Apertura opcional en respuestas
    use_voseo: bool = False   # Usar "vos" en lugar de "tú"


# Mapa de países → configuración de tono
# Puedes añadir más países sin tocar el resto del código
_TONE_MAP: dict[str, ToneConfig] = {
    # ── Cono Sur ──────────────────────────────────────────────────
    "Argentina": ToneConfig(
        region="cono_sur",
        temperature=0.65,
        style_notes=(
            "Usa un tono cálido pero directo, como el estilo rioplatense. "
            "Puedes usar 'CHE' en lugar de 'tú'. "
            "Sé conciso, sin rodeos."
        ),
        greeting="¿Todo Piola?",
        use_voseo=True,
    ),
    "Costa Rica": ToneConfig(
        region="cono_sur",
        temperature=0.65,
        style_notes=(
            "Usa un tono cálido pero directo, como el estilo rioplatense. "
            "Puedes usar 'CHE' en lugar de 'tú'. "
            "Sé conciso, sin rodeos."
        ),
        greeting="¿Qué es la vara?",
        use_voseo=True,
    ),
    "Chile": ToneConfig(
        region="cono_sur",
        temperature=0.65,
        style_notes=(
            "Usa un tono cálido pero directo, como el estilo rioplatense. "
            "Sé conciso, sin rodeos."
        ),
        greeting="¡Hola chiquill@s!",
        use_voseo=True,
    ),
    "Uruguay": ToneConfig(
        region="cono_sur",
        temperature=0.65,
        style_notes=(
            "Tono tranquilo y cercano. Puedes usar 'CHE'. "
            "Sin tecnicismos innecesarios."
        ),
        greeting="¡Vamo' arriba!",
        use_voseo=True,
    ),

    # ── Caribe / Venezuela ────────────────────────────────────────
    "Venezuela": ToneConfig(
        region="caribe",
        temperature=0.7,
        style_notes=(
            "Tono muy cercano, empático y cálido. "
            "Como si hablaras con un familiar. "
            "Usa expresiones de ánimo frecuentes. "
            "Evita el lenguaje muy formal."
        ),
        greeting="¡Pana, como estas!",
    ),
    "Cuba": ToneConfig(
        region="caribe",
        temperature=0.7,
        style_notes=(
            "Tono directo y cálido a la vez. "
            "Lenguaje sencillo y práctico."
        ),
        greeting="¿Di tú?",
    ),
    "República Dominicana": ToneConfig(
        region="caribe",
        temperature=0.7,
        style_notes="Tono cercano y amigable. Lenguaje simple y práctico.",
        greeting="¿Qué lo qué?",
    ),

    # ── Centroamérica ─────────────────────────────────────────────
    "Honduras": ToneConfig(
        region="centroamerica",
        temperature=0.65,
        style_notes=(
            "Tono empático y paciente. "
            "Muchas personas vienen de procesos difíciles, sé muy humano."
        ),
        greeting="¡Qué onda!",
    ),
    "Guatemala": ToneConfig(
        region="centroamerica",
        temperature=0.65,
        style_notes="Tono amable y paciente. Lenguaje muy sencillo.",
        greeting="¿Qué chucho?",
    ),
    "El Salvador": ToneConfig(
        region="centroamerica",
        temperature=0.65,
        style_notes="Tono empático, cercano y con paciencia.",
        greeting="¿Quiubo?",
    ),
    "Nicaragua": ToneConfig(
        region="centroamerica",
        temperature=0.65,
        style_notes="Tono cálido y accesible.",
        greeting="¿Qué onda, mi herman@?",
    ),

    # ── Andina ────────────────────────────────────────────────────
    "Colombia": ToneConfig(
        region="andina",
        temperature=0.65,
        style_notes=(
            "Tono muy cortés y servicial, estilo colombiano. "
            "Usa 'paila' si el contexto es formal, 'tú' si es informal. "
            "Muy cercano y amable."
        ),
        greeting="¡Paila, como le va!",
    ),
    "Ecuador": ToneConfig(
        region="andina",
        temperature=0.6,
        style_notes="Tono amable y respetuoso. Lenguaje claro.",
        greeting="¿Qué fue, ñañ@?",
    ),
    "Perú": ToneConfig(
        region="andina",
        temperature=0.6,
        style_notes="Tono amable y claro. Lenguaje accesible.",
        greeting="¡Oe mano que fue!",
    ),
    "Bolivia": ToneConfig(
        region="andina",
        temperature=0.6,
        style_notes="Tono paciente y respetuoso.",
        greeting="Hey!",
    ),

    # ── Brasil ────────────────────────────────────────────────────
    "Brasil": ToneConfig(
        region="brasil",
        temperature=0.7,
        style_notes=(
            "El usuario puede mezclar portugués y español. "
            "Responde siempre en español pero sé muy amable si usa português. "
            "Tono cálido y positivo."
        ),
        greeting="¡Tudo bem? / Tudo bom? / Tudo joia?",
    ),

    
    "Paraguay": ToneConfig(
        region="paraguay",
        temperature=0.6,
        style_notes=(
            "El usuario puede tener dificultades con el español. " \
            "Utiliza el 'vos' en lugar de 'tú'. ",
            "Usa frases muy cortas y simples. "
            "Evita palabras difíciles. "
            "Responde en el idioma guarani si te escribe en guarani."
        ),
        greeting="¡Mba'eichapa!",
    ),
    "México": ToneConfig(
        region="mexico",
        temperature=0.65,
        style_notes="Tono amigable y cercano, estilo mexicano. Lenguaje accesible.",
        greeting="¡Weyy!",
    ),
}

# Configuración por defecto (países no listados o "Otro")
_DEFAULT_TONE = ToneConfig(
    region="default",
    temperature=0.65,
    style_notes=(
        "Tono cercano, humano y empático. "
        "Como alguien que ya pasó por el proceso y quiere ayudar."
    ),
    greeting="¡Hola!",
)


# ─── API pública ─────────────────────────────────────────────────────────────

def get_tone_config(country: str | None) -> ToneConfig:
    """
    Devuelve la configuración de tono para un país.
    Si el país no está en el mapa, devuelve la configuración por defecto.
    """
    if not country:
        return _DEFAULT_TONE
    return _TONE_MAP.get(country, _DEFAULT_TONE)


def apply_tone_to_prompt(base_prompt: str, config: ToneConfig) -> str:
    """
    Inyecta las instrucciones de tono al final del system prompt base.

    Args:
        base_prompt: El system prompt original del agente
        config:      La ToneConfig obtenida con get_tone_config()

    Returns:
        El system prompt enriquecido con las notas de tono
    """
    tone_block = f"""
─── TONO Y ESTILO (MUY IMPORTANTE) ───────────────────────────────
{config.style_notes}
──────────────────────────────────────────────────────────────────
"""
    return base_prompt + tone_block


def get_temperature(country: str | None) -> float:
    """Shortcut para obtener solo la temperature de Groq para un país."""
    return get_tone_config(country).temperature