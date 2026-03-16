# ---------------------------------------------------------
# BACKEND DOCKERFILE - ULTRA OPTIMIZADO
# ---------------------------------------------------------

# ===== ETAPA 1: Construcción (Builder) =====
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

# TRUCO MÁGICO 1: Instalar la versión CPU de PyTorch
# Esto lo configuramos en pyproject.toml usando uv sources.

# Crear y activar entorno virtual aislado
RUN uv venv /app/.venv
ENV VIRTUAL_ENV=/app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Instalar dependencias de producción
RUN uv sync --no-dev


# ===== ETAPA 2: Producción (Imagen final) =====
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app

WORKDIR /app

# TRUCO MÁGICO 2: Multistage.
# Copiamos solo el entorno virtual ya compilado desde el builder.
# Se queda atrás gcc, pip caché, git, y uv. Imagen mucho más limpia.
COPY --from=builder /app/.venv /app/.venv

# Copiar el código fuente de la app
COPY . .

# Variables necesarias para usar el entorno creado
ENV VIRTUAL_ENV=/app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# En despliegues gratuitos como Render se inyecta automáticamente $PORT
# Si no hay (ej. local), usamos 8000
CMD ["sh", "-c", "uvicorn src.api.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
