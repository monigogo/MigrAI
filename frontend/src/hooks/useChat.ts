import { useState, useRef, useCallback, useEffect } from 'react'
import { generateId } from '@/lib/utils'
import type { ChatMessage, UserProfile, MigrationRoute } from '@/types'
import { sendChatMessage } from '@/services/api'

/* ─────────────────────────────────────────────
    SALUDOS POR PAÍS (fallback local)
───────────────────────────────────────────── */
const COUNTRY_GREETINGS: Record<string, string> = {
  'Argentina':   "¡Hola, che! 😊",
  'Bolivia':     "¡Hola, qué tal! 😊",
  'Brasil':      "¡Olá! 😊",
  'Chile':       "¡Hola, po! 😊",
  'Colombia':    "¡Qué más, pues! 😊",
  'Costa Rica':  "¡Pura vida! 😊",
  'Cuba':        "¡Qué bolá! 😊",
  'Ecuador':     "¡Hola, qué tal! 😊",
  'El Salvador': "¡Hola! 😊",
  'Guatemala':   "¡Hola! 😊",
  'Honduras':    "¡Hola! 😊",
  'México':      "¡Qué onda! 😊",
  'Nicaragua':   "¡Hola! 😊",
  'Panamá':      "¡Hola! 😊",
  'Paraguay':    "¡Mba'eichapa! 😊",
  'Perú':        "¡Hola, causa! 😊",
  'Uruguay':     "¡Hola, che! 😊",
  'Venezuela':   "¡Epale! 😊",
  'default':     "¡Hola! 😊",
}

/* ─────────────────────────────────────────────
    TIPOS
───────────────────────────────────────────── */

interface UseChatOptions {
  userProfile: UserProfile
  route: MigrationRoute
}

interface UseChatReturn {
  messages: ChatMessage[]
  isTyping: boolean
  inputText: string
  setInputText: (v: string) => void
  sendMessage: (text?: string) => void
  messagesEndRef: React.RefObject<HTMLDivElement>
  clearMessages: () => void
}

/* ─────────────────────────────────────────────
    HOOK PRINCIPAL
───────────────────────────────────────────── */

export function useChat({ userProfile, route }: UseChatOptions): UseChatReturn {

  const sessionIdRef = useRef(generateId())
  const initCalledRef = useRef(false)  // evita doble llamada en StrictMode

  const greeting =
    COUNTRY_GREETINGS[userProfile.country] ??
    COUNTRY_GREETINGS['default']

  // Empezamos con array vacío — el backend llenará el primer mensaje
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping]   = useState(false)
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // ── Scroll automático ──────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // ── Saludo inicial del backend ─────────────────────────────────
  useEffect(() => {
    if (initCalledRef.current) return
    initCalledRef.current = true

    const initChat = async () => {
      setIsTyping(true)
      try {
        const response = await sendChatMessage({
          message: '__init__',
          session_id: sessionIdRef.current,
          context: {
            country:      userProfile.country,
            age:          userProfile.age,
            gender:       userProfile.gender,
            path:         route,
            stayDuration: userProfile.stayDuration ?? '',
          },
          history: [],
        })

        setMessages([{
          id:        generateId(),
          role:      'assistant',
          content:   response.reply || '',
          options:   response.options,
          timestamp: new Date(),
        }])

      } catch {
        // Fallback local si el backend no responde
        setMessages([{
          id:        generateId(),
          role:      'assistant',
          content:   `${greeting}\n\nSoy migrAI y voy a ayudarte con información real basada en experiencias de personas que hicieron su trámite en España.\n\n¿En qué parte del proceso estás?`,
          timestamp: new Date(),
        }])
      } finally {
        setIsTyping(false)
      }
    }

    initChat()
  }, []) // solo al montar

  // ── Enviar mensaje ─────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text?: string) => {
      const messageText = (text ?? inputText).trim()
      if (!messageText || isTyping) return

      const userMessage: ChatMessage = {
        id:        generateId(),
        role:      'user',
        content:   messageText,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, userMessage])
      setInputText('')
      setIsTyping(true)

      try {
        const updatedHistory = [...messages, userMessage].map(m => ({
          role:    m.role as 'user' | 'assistant',
          content: m.content,
        }))

        const response = await sendChatMessage({
          message:    messageText,
          session_id: sessionIdRef.current,
          context: {
            country:      userProfile.country,
            age:          userProfile.age,
            gender:       userProfile.gender,
            path:         route,
            stayDuration: userProfile.stayDuration ?? '',
          },
          history: updatedHistory,
        })

        setMessages(prev => [
          ...prev,
          {
            id:        generateId(),
            role:      'assistant',
            content:   response.reply || '',
            options:   response.options,
            timestamp: new Date(),
          },
        ])

      } catch (error) {
        console.error('[useChat] Error al enviar mensaje:', error)
        setMessages(prev => [
          ...prev,
          {
            id:        generateId(),
            role:      'assistant',
            content:   '⚠️ Hubo un problema conectando con el servidor.',
            timestamp: new Date(),
          },
        ])
      } finally {
        setIsTyping(false)
      }
    },
    [inputText, isTyping, messages, userProfile, route]
  )

  const clearMessages = useCallback(() => setMessages([]), [])

  return {
    messages,
    isTyping,
    inputText,
    setInputText,
    sendMessage,
    messagesEndRef,
    clearMessages,
  }
}