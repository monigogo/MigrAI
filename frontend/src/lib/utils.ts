import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combina clases de Tailwind de forma segura,
 * resolviendo conflictos con tailwind-merge.
 *
 * @example cn('px-4 py-2', condition && 'bg-blue-500', 'text-white')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Genera un ID único simple para mensajes del chat.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Formatea la hora de un mensaje del chat.
 * @example formatTime(new Date()) → "14:32"
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Trunca un texto a un número máximo de caracteres.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}…`
}

/**
 * Capitaliza la primera letra de un string.
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Devuelve el saludo apropiado según la hora del día.
 */
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

/**
 * Pequeño sleep para simular delay de red en desarrollo.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}