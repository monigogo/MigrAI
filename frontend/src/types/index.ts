// ─── migrAI — Tipos globales ──────────────────────────────────────

/** Perfil del usuario recogido en el onboarding */
export interface UserProfile {
  /** País de origen seleccionado */
  country: string
  /** Rango de edad: "18–25 años" | "26–35 años" | ... */
  age: string
  /** Sexo autodeclarado */
  gender: 'masculino' | 'femenino' | 'otro'
/** Tiempo de estancia en España */
  stayDuration: string
}

/** Ruta del proceso migratorio seleccionada en home */
export type MigrationRoute = 'new' | 'continue'

/** Pantallas principales de la app */
export type AppScreen = 'home' | 'onboarding' | 'dashboard'

// ─── Chat ─────────────────────────────────────────────────────────

/** Roles de los mensajes del chat */
export type MessageRole = 'user' | 'assistant'

/** Mensaje individual en el chat */
export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  options?: string[]
}

/** Payload que se enviará al backend en cada mensaje */
export interface ChatRequest {
  session_id: string
  message: string
  context: UserProfile & { path: MigrationRoute }
  history: Array<{ role: MessageRole; content: string }>
}

/** Respuesta que devuelve el backend */
export interface ChatResponse {
  reply: string
  options?: string[]
}

// ─── Recursos y cursos (para cuando estén en backend) ─────────────

export interface Resource {
  id: string
  emoji: string
  title: string
  desc: string
  tag: string
  url?: string
}

export interface Course {
  id: string
  emoji: string
  title: string
  desc: string
  duration: string
  url?: string
}

// ─── Tarjetas de acción del dashboard ────────────────────────────

export interface ActionCard {
  id: string
  emoji: string
  title: string
  desc: string
  onClick?: () => void
}

// ─── API ──────────────────────────────────────────────────────────

/** Respuesta que devuelve el backend */
/** Estado genérico de una petición async */
export interface AsyncState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}