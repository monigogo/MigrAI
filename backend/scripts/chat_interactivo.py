"""
Script manual de chat interactivo por terminal — NO es un test automatizado.
Hace llamadas reales al LLM configurado.

CÓMO EJECUTAR:
    cd /workspaces/migrAI/backend
    uv run python scripts/chat_interactivo.py
"""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from src.config.llm import get_llm
from src.config.cultural import construir_contexto_cultural
from src.rag.retriever import buscar_contexto
from src.prompts.orchestrator import ORCHESTRATOR_PROMPT
from src.prompts.base import BLOQUE_CULTURAL
from src.prompts.arraigo_sociolaboral import ARRAIGO_SOCIOLABORAL_PROMPT
from src.prompts.arraigo_social import ARRAIGO_SOCIAL_PROMPT
from src.prompts.arraigo_familiar import ARRAIGO_FAMILIAR_PROMPT
from src.prompts.arraigo_socioformativo import ARRAIGO_SOCIOFORMATIVO_PROMPT
from src.prompts.modif_estancia_trabajo import MODIF_ESTANCIA_TRABAJO_PROMPT
from src.prompts.nie_tie import NIE_TIE_PROMPT
from src.prompts.reagrupacion import REAGRUPACION_PROMPT
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

PERFIL = {
    "pais":       "Colombia",
    "rango_edad": "26-35",
}

PROMPTS_POR_AGENTE = {
    "arraigo_sociolaboral":  (ARRAIGO_SOCIOLABORAL_PROMPT,  "arraigo sociolaboral"),
    "arraigo_social":        (ARRAIGO_SOCIAL_PROMPT,        "arraigo social"),
    "arraigo_familiar":      (ARRAIGO_FAMILIAR_PROMPT,      "arraigo familiar"),
    "arraigo_socioformativo":(ARRAIGO_SOCIOFORMATIVO_PROMPT,"arraigo socioformativo"),
    "modif_estancia_trabajo":(MODIF_ESTANCIA_TRABAJO_PROMPT,"modificación de estancia"),
    "nie_tie":               (NIE_TIE_PROMPT,               "NIE y TIE"),
    "reagrupacion":          (REAGRUPACION_PROMPT,          "reagrupación familiar"),
}


async def detectar_agente(pregunta: str) -> str:

    llm = get_llm("orchestrator")
    messages = [
        SystemMessage(content=ORCHESTRATOR_PROMPT),
        HumanMessage(content=pregunta),
    ]
    r = await llm.ainvoke(messages)
    agente = r.content.strip().lower().strip(".")
    if agente not in PROMPTS_POR_AGENTE:
        agente = "arraigo_social"
    return agente


async def preguntar(
    pregunta: str,
    historial: list,
    agente_actual: str,
) -> tuple[str, str]:

    perfil = construir_contexto_cultural(PERFIL["pais"], PERFIL["rango_edad"])

    if not historial:
        agente_actual = await detectar_agente(pregunta)

    rag = buscar_contexto(pregunta, tramite=agente_actual)

    bloque  = BLOQUE_CULTURAL.format(
        pais=perfil["pais"],
        rango_edad=perfil["rango_edad"],
        idioma_nombre=perfil["idioma_nombre"],
        contexto_cultural=perfil["contexto_cultural"],
        tono_edad=perfil["tono_edad"],
    )

    prompt_template, especialidad = PROMPTS_POR_AGENTE[agente_actual]
    prompt = prompt_template.format(
        bloque_cultural=bloque,
        especialidad=especialidad,
        contexto_rag=rag,
    )


    messages = [SystemMessage(content=prompt)]
    for turno in historial[-16:]:  # últimos 8 intercambios
        messages.append(turno)
    messages.append(HumanMessage(content=pregunta))

    llm       = get_llm(agente_actual)
    respuesta = await llm.ainvoke(messages)

    return respuesta.content, agente_actual


async def main():
    print(f"\n{'═'*50}")
    print("  MIGRAI — Chat interactivo con memoria")
    print(f"  País: {PERFIL['pais']} | Edad: {PERFIL['rango_edad']}")
    print("  Comandos: 'salir' · 'limpiar' · 'cambiar'")
    print(f"{'═'*50}\n")
    print("Bot: ¡Hola! Soy Migrai 👋 Pregúntame lo que necesites.\n")

    historial:     list  = []
    agente_actual: str   = "arraigo_social"

    while True:
        try:
            pregunta = input("Tú: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nBot: ¡Hasta luego! 👋")
            break

        if not pregunta:
            continue

        if pregunta.lower() == "salir":
            print("Bot: ¡Hasta luego! 👋")
            break

        if pregunta.lower() == "limpiar":
            historial     = []
            agente_actual = "arraigo_social"
            print("Bot: Conversación reiniciada 🔄\n")
            continue

        if pregunta.lower() == "cambiar":
            nuevo_pais = input(f"  País [{PERFIL['pais']}]: ").strip()
            nueva_edad = input(f"  Edad [{PERFIL['rango_edad']}]: ").strip()
            if nuevo_pais:
                PERFIL["pais"] = nuevo_pais
            if nueva_edad:
                PERFIL["rango_edad"] = nueva_edad
            historial     = []
            agente_actual = "arraigo_social"
            print(f"  Perfil: {PERFIL['pais']} | {PERFIL['rango_edad']}\n")
            continue

        print("Bot: ...")

        try:
            respuesta, agente_actual = await preguntar(
                pregunta, historial, agente_actual
            )

     
            historial.append(HumanMessage(content=pregunta))
            historial.append(AIMessage(content=respuesta))

            print(f"\rBot: {respuesta}")
            print(f"     [agente: {agente_actual}]\n")

        except Exception as e:
            print(f"\rBot: Error — {e}\n")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())