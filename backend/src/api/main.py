import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from .routes import router, limiter


# ── Lifespan (inicio de la app) ───────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

# ── Inicialización de FastAPI ─────────────────────────────────────────────
app = FastAPI(
    title="Migrai API",
    description="Guía experto en extranjería española — multiagente con RAG",
    version="0.1.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Orígenes permitidos configurables sin tocar código (separados por comas)
_origenes = os.environ.get("ALLOWED_ORIGINS", "https://migrai-1.onrender.com")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in _origenes.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def root():
    return {"mensaje": "Migrai API funcionando", "docs": "/docs"}
