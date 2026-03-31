from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router
 


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="Migrai API",
    description="Guía experto en extranjería española — multiagente con RAG",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://frontend:3000",
        "https://migrai.onrender.com",
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