"""
CÓMO EJECUTAR:
    cd migrai/backend
    uv run python tests/test_arraigo_sociolaboral.py
"""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from src.agents.arraigos.sociolaboral import agente_arraigo_sociolaboral

PRUEBAS = [
    {
        "nombre":     "Colombiano 30 años — lleva 2 años",
        "question":   "Llevo 2 años en España, ¿puedo pedir el arraigo social?",
        "pais":       "Colombia",
        "rango_edad": "26-35",
    },
    {
        "nombre":     "Venezolano joven — tiene contrato 6 meses",
        "question":   "Tengo un contrato de trabajo de 6 meses, ¿qué arraigo me corresponde?",
        "pais":       "Venezuela",
        "rango_edad": "18-25",
    },
    {
        "nombre":     "Ecuatoriano — lleva solo 1 año",
        "question":   "Llevo 1 año en España, ¿puedo pedir el arraigo?",
        "pais":       "Ecuador",
        "rango_edad": "36-50",
    },
    {
        "nombre":     "Argentino — voseo",
        "question":   "¿Qué papeles necesito para el arraigo social?",
        "pais":       "Argentina",
        "rango_edad": "26-35",
    },
]


async def probar(prueba: dict):
    print(f"\n{'═'*60}")
    print(f"TEST: {prueba['nombre']}")
    print(f"País: {prueba['pais']} | Edad: {prueba['rango_edad']}")
    print(f"Pregunta: {prueba['question']}")
    print(f"{'─'*60}")

    estado = {
        "question":          prueba["question"],
        "document_content":  None,
        "pais":              prueba["pais"],
        "rango_edad":        prueba["rango_edad"],
        "idioma_codigo":     None,
        "idioma_nombre":     None,
        "contexto_cultural": None,
        "tono_edad":         None,
        "next_agent":        None,
        "expert_response":   None,
        "tramite_detectado": None,
        "final_response":    None,
        "last_agent":        None,
    }

    try:
        resultado = await agente_arraigo_sociolaboral(estado)
        print(f"RESPUESTA:\n{resultado['expert_response']}")
        print(f"\nTrámite: {resultado['tramite_detectado']}")
        print(f"Agente:  {resultado['last_agent']}")
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()


async def main():
    print("🧪 PROBANDO: agente_arraigo_sociolaboral")
    for prueba in PRUEBAS:
        await probar(prueba)
        await asyncio.sleep(1)
    print(f"\n{'═'*60}")
    print("✅ Pruebas completadas")


if __name__ == "__main__":
    asyncio.run(main())