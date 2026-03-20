# 🌍 MigrAI

**MigrAI** es Guia  virtual inteligente y experto en extranjería española, construido con arquitecturas de múltiples agentes (Multi-Agent System) y Generación Aumentada por Recuperación (RAG). Su propósito es guiar de manera clara, legal y personalizada a personas hispanohablantes (y sus distintas variantes culturales) a través de los complejos trámites de residencia, arraigo y permisos en España.

## ✨ Características Principales

*   **🕵️‍♂️ Sistema Multi-Agente:** Utiliza LangGraph para orquestar a distintos agentes "expertos" donde cada uno domina un área técnica específica (Arraigo Social, Familiar, Socioformativo, NIE/TIE, etc.).
*   **📚 RAG (Retrieval-Augmented Generation):** El sistema lee y vectoriza documentos oficiales en PDF desde una base de datos local para brindar respuestas fundamentadas en la ley y minimizar la alucinación de los modelos.
*   **🧠 Fallbacks Inteligentes de LLM:** Configurado con respaldos automatizados en LangChain (uso primario de Llama-3-70b a través de Groq, con ramificaciones inmediatas a Llama-3-8b y Mixtral si se presentan límites de tokens).
*   **🗣️ Tono Sensible y Cultural:** Adapta su lenguaje, acento y empatía basándose en la edad y la procedencia del usuario (ej., acento colombiano, argentino, etc.).
*   **⚡ Streaming en Tiempo Real (SSE):** Arquitectura cliente-servidor reactiva gracias al uso de Server-Sent Events desde FastAPI hacia un frontend asíncrono.

## 🏗️ Arquitectura y Tecnologías

### 💻 Backend (API & IA)
*   **Entorno:** Python 3.11 gestionado con [uv](https://github.com/astral-sh/uv) (rápido y seguro).
*   **Framework API:** FastAPI / Uvicorn.
*   **Orquestación de IA:** LangChain y LangGraph.
*   **Modelos Locales:** Embeddings a través de `sentence-transformers` (ejecutados estrictamente en CPU usando PyTorch optimizado para ahorrar peso en la nube).
*   **Base de Datos:** Postgres en la nube gestionado por Supabase para el historial y vectores.

### 🎨 Frontend (UI/UX)
*   **Framework:** React 19 + TypeScript.
*   **Build Tool:** Vite.
*   **Estilos y Componentes:** Tailwind CSS v4, Lucide React y Radix UI.

### 🐳 DevOps y Despliegue
*   **Contenedores:** Docker (arquitectura Multi-Stage) y Docker Compose para desarrollo sincronizado local.
*   **Servidor Web (Producción):** Nginx actuando como proxy inverso dinámico.
*   **CI/CD:** GitHub Actions configurado para validar Node.js, efectuar Test unitarios en Python (`pytest`), validar la integridad del Docker y disparar un despliegue transparente en la nube (ej., Render) vía Webhooks.

---

## 🚀 Despliegue en Local (Guía Rápida)

### Prerrequisitos
- Docker y Docker Compose instalados.
- Clonar el repositorio.

1.  **Configurar Variables de Entorno:**
    Duplica el posible `.env.example` en un `.env` dentro de la carpeta `/backend` y/o `/frontend` con tus llaves correspondientes:
    ```bash
    GROQ_API_KEY="tu_llave_aqui"
    SUPABASE_URL="https://tu_proyecto.supabase.co"
    SUPABASE_ANON_KEY="tu_llave_aqui"
    # (Y variables si usas LangSmith y OpenRouter)
    ```

2.  **Levantar el Clúster con Docker:**
    Desde la raíz del proyecto ejecuta:
    ```bash
    docker compose up --build
    ```
    *   🚀 El Frontend estará vivo interactuando en el puerto alojado en tu navegador.
    *   ⚙️ El Backend de Inteligencia Artificial (FastAPI) estará escuchando a través del puerto `:8000`.

---

## 🤝 Contribuciones (CI/CD)
El proyecto utiliza flujos de trabajo en **GitHub Actions**. Cualquier Pull Request contra la rama `main` deberá pasar satisfactoriamente:
- Pruebas unitarias de tipado e inicialización (React/Vite).
- Pruebas sintácticas de Python.
- Compilación del clúster Multi-Stage de Docker sin errores de arquitectura.

---

## link demo: https://migrai-1.onrender.com
_Hecho con ❤️ para facilitar la integración y por la comunidad migrante._
