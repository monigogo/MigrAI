FROM python:3.11-slim

WORKDIR /app

# Instala uv
RUN pip install uv

# Copia las dependencias primero (así Docker las cachea)
COPY pyproject.toml .
RUN uv sync --no-dev

# Copia todo el código
COPY . .

ENV PYTHONPATH=/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "src.api.main:app", \
     "--host", "0.0.0.0", "--port", "8000"]