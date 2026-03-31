from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router


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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://migrai-1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def root():
    return {"mensaje": "Migrai API funcionando", "docs": "/docs"}