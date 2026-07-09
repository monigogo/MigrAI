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

# pyproject + lock: --frozen garantiza las mismas versiones que en desarrollo
COPY pyproject.toml uv.lock ./

# Crear y activar entorno virtual aislado
RUN uv venv /app/.venv
ENV VIRTUAL_ENV=/app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Instalar dependencias de producción (la app se importa vía PYTHONPATH, no como paquete)
RUN uv sync --frozen --no-dev --no-install-project


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

# Usuario sin privilegios
RUN useradd --create-home app && chown -R app:app /app
USER app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD python -c 'import os, urllib.request; urllib.request.urlopen("http://localhost:" + os.environ.get("PORT", "8000") + "/api/v1/health")' || exit 1

CMD uvicorn src.api.main:app --host 0.0.0.0 --port ${PORT:-8000}
