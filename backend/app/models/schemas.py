from typing import Literal, Optional
from pydantic import BaseModel


# ─── Historial de mensajes ────────────────────────────────────────

class HistoryMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


# ─── Contexto del usuario (viene del onboarding del frontend) ─────

class UserContext(BaseModel):
    country: str
    age: str
    gender: Literal["masculino", "femenino", "otro"]
    path: Literal["new", "continue"]
    stayDuration: Optional[str] = None


# ─── Request del chat ─────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None                   # el frontend lo manda, opcional
    context: UserContext                                # anidado dentro de "context"
    history: list[HistoryMessage] = []                  # historial de conversación


# ─── Response del chat ────────────────────────────────────────────

class ChatResponse(BaseModel):
    reply: Optional[str] = None                        # Puede ser None si solo mandamos botones
    session_id: Optional[str] = None
    options: Optional[list[str]] = None                # <--- NUEVO: Para los botones de tiempo