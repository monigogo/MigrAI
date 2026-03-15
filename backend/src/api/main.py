from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router

app = FastAPI(
    title="Migrai API",
    description="Guía experto en extranjería española — multiagente con RAG",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://frontend:3000",
        # Añade aquí la URL de Render cuando despliegues:
        # "https://migrai-frontend.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def root():
    return {"mensaje": "Migrai API funcionando", "docs": "/docs"}