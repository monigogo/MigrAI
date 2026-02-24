/**
 * ─── migrAI — Servicio de API ─────────────────────────────────────
 *
 * Todas las llamadas al backend pasan por este fichero.
 * Cuando el backend esté listo:
 *  1. Crea un fichero .env.local con VITE_API_URL=https://tu-backend.com
 *  2. Las funciones `sendChatMessage` y `saveUserSession` ya están
 *     implementadas y listas para usar.
 *
 * En desarrollo (sin backend) se usa el simulador en useChat.ts.
 * ────────────────────────────────────────────────────────────────── */

import type { ChatRequest, ChatResponse, UserProfile } from '@/types'


// URL base del backend — se lee desde variable de entorno
const API_URL = (import.meta as any).env.VITE_API_URL || 'http://127.0.0.1:8000'

// ─── Errores personalizados ───────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// ─── Helper base para fetch ───────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let message = `Error ${response.status}`
    try {
      const body = await response.json()
      message = body.message ?? message
    } catch {
      // ignore JSON parse errors
    }
    throw new ApiError(message, response.status)
  }

  return response.json() as Promise<T>
}

// ─── Chat ─────────────────────────────────────────────────────────

/**
 * Envía un mensaje al backend y recibe la respuesta de la IA.
 *
 * @example
 * const { reply } = await sendChatMessage({
 *   message: "¿Qué documentos necesito?",
 *   context: { country: "Venezuela", age: "26–35 años", gender: "masculino", path: "new", stayDuration: "2años" },
 *   history: [...]
 * })
 *
 * Endpoint esperado en el backend:
 *   POST /chat
 *   Body: ChatRequest
 *   Response: ChatResponse
 */
export async function sendChatMessage(
  payload: ChatRequest,
): Promise<ChatResponse> {
  
  // 1. Pégalo justo aquí para ver el contenido original
  console.log("PAYLOAD QUE SALE AL BACKEND:", payload); 

  const cleanPayload = {
    message: payload.message,
    session_id: payload.session_id || "temp-session",
    context: {
      country: payload.context?.country || "España",
      age: String(payload.context?.age || "30"),
      gender: payload.context?.gender || "masculino",
      path: payload.context?.path || "new",
      stayDuration: payload.context?.stayDuration || "2años" 
    },
    history: payload.history || []
  };

  // 2. También puedes ponerlo aquí para ver el objeto ya "limpio"
  console.log("OBJETO LIMPIO QUE SE ENVÍA:", cleanPayload);

  return apiFetch<ChatResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify(cleanPayload),
  });
}
// ─── Sesión de usuario ────────────────────────────────────────────

/**
 * (Opcional) Guarda el perfil de sesión en el backend para
 * personalizar respuestas. No crea ninguna cuenta de usuario.
 *
 * Endpoint esperado en el backend:
 *   POST /session
 *   Body: UserProfile
 *   Response: { ok: true }
 */
export async function saveUserSession(
  profile: UserProfile,
): Promise<void> {
  await apiFetch<{ ok: boolean }>('/session', {
    method: 'POST',
    body: JSON.stringify(profile),
  })
}

// ─── Recursos dinámicos (Fase futura) ────────────────────────────

/**
 * (Fase futura) Carga recursos relevantes según el país del usuario.
 *
 * Endpoint esperado en el backend:
 *   GET /api/resources?country=Venezuela
 */
export async function fetchResources(country: string) {
  return apiFetch<{
    resources: Array<{
      title: string
      tag: string
      emoji: string
      desc: string
      url: string
    }>
  }>(`/api/resources?country=${encodeURIComponent(country)}`)
}