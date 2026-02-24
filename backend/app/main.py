import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import ChatRequest, ChatResponse
from app.agents.router_agent import route_and_respond
from app.agents.tone_agent import get_tone_config

app = FastAPI(
    title="Guía Arraigo API",
    description="Backend para asistente legal de extranjería con RAG",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def parse_session_id(raw: str | None) -> str:
    if not raw:
        return str(uuid.uuid4())
    try:
        return str(uuid.UUID(raw))
    except ValueError:
        return str(uuid.uuid4())


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        session_id = parse_session_id(request.session_id)
        msg_text   = request.message.lower().strip()
        stay       = request.context.stayDuration or ""

        # ── 1. SALUDO INICIAL ──────────────────────────────────────
        if msg_text == "__init__":
            tone   = get_tone_config(request.context.country)
            saludo = tone.greeting if tone.greeting else "¡Hola!"

            # Si ya tenemos stayDuration, saltar directo al contexto legal
            if stay == "2años":
                return ChatResponse(
                    reply=(
                        f"{saludo} Soy migrAI, tu asistente migratorio en España.\n\n"
                        "Como llevas casi 2 años, tienes opciones reales: "
                        "**Arraigo Laboral** (con contrato) o **Arraigo Social**.\n\n"
                        "¿Qué quieres saber sobre tu situación?"
                    ),
                    session_id=session_id,
                )
            return ChatResponse(
                reply=(
                    f"{saludo} Soy migrAI, tu asistente para el proceso "
                    "migratorio en España.\n\n¿En qué puedo ayudarte hoy?"
                ),
                session_id=session_id,
            )

        # ── 2. CONTEXTO LEGAL POR TIEMPO DE ESTANCIA ──────────────
        if stay == "2años":
            extra_context = (
                "El usuario lleva 2 años en España y está irregular. "
                "Puede solicitar arraigo laboral (con contrato) o arraigo social. "
                "Menciona también arraigo para la formación si aplica."
            )
        elif stay == "1 años":
            extra_context = "El usuario lleva 1 año. Vías limitadas: matrimonio con español o casos especiales."
        else:
            extra_context = "El usuario lleva menos de 1 año. Aún no cumple requisitos de arraigo general."

        # ── 3. AGENTES ─────────────────────────────────────────────
        message_con_contexto = (
            f"{request.message}\n\n[Contexto del sistema: {extra_context}]"
            if extra_context else request.message
        )

        result = route_and_respond(
            user_message=message_con_contexto,
            session_id=session_id,
            country=request.context.country,
            age=request.context.age,
            gender=request.context.gender,
            stayDuration=stay,
            history=[{"role": h.role, "content": h.content} for h in request.history],
        )

        return ChatResponse(
            reply=result["reply"],
            session_id=session_id,
        )

    except Exception as e:
        print(f"❌ Error en /chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def read_root():
    return {"status": "Guía Arraigo API v2 funcionando 🚀"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}