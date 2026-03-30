# ---------------------------------------------------------
# BACKEND DOCKERFILE
# ---------------------------------------------------------

# ===== ETAPA 1: Construcción =====
FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias del sistema necesarias solo para compilar
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir uv

COPY pyproject.toml ./

# Instalar la versión CPU de PyTorch


# Crear y activar entorno virtual aislado
RUN uv venv /app/.venv
ENV VIRTUAL_ENV=/app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Instalar dependencias de producción
RUN uv sync --no-dev


# ===== ETAPA 2: Producción =====
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

WORKDIR /app

#  Multistage.

COPY --from=builder /app/.venv /app/.venv

# Copiar el código fuente de la app
COPY . .

# Variables necesarias para usar el entorno creado
ENV VIRTUAL_ENV=/app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# En despliegues 
CMD ["sh", "-c", "uvicorn src.api.main:app --host 0.0.0.0 --port ${PORT}"]
