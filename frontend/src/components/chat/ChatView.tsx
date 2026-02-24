import { useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { QuickQuestions } from './QuickQuestions'
import { ChatInput } from './ChatInput'
import { useChat } from '@/hooks/useChat'
import type { UserProfile, MigrationRoute } from '@/types'

interface ChatViewProps {
  userProfile: UserProfile
  route: MigrationRoute
  onBack: () => void
}

export function ChatView({ userProfile, route, onBack }: ChatViewProps) {
  const {
    messages,
    isTyping,
    inputText,
    setInputText,
    sendMessage,
    messagesEndRef,
  } = useChat({ userProfile, route })

  const hasTriggered = useRef(false)

  useEffect(() => {
    if (!hasTriggered.current && messages.length === 0) {
      if (userProfile.stayDuration === '2años') {
        sendMessage("Hola, llevo casi 2 años en España.")
        hasTriggered.current = true
      }
    }
  }, [userProfile.stayDuration, messages.length, sendMessage])

  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="sticky-header px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn-icon flex-shrink-0">
            <ArrowLeft size={18} />
          </button>
          <div className="relative flex-shrink-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[20px]"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                boxShadow: '0 2px 8px rgba(0,119,182,0.3)',
              }}
            >
              🤖
            </div>
            <div
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
              style={{ background: 'var(--color-success)' }}
            />
          </div>
          <div>
            <div className="font-heading font-bold text-[16px]" style={{ color: 'var(--color-text)' }}>
              migrAI
            </div>
            <div className="text-[12px] font-semibold" style={{ color: 'var(--color-success)' }}>
              ● En línea
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
        style={{ background: 'var(--color-bg)' }}
      >
        <div
          className="flex items-start gap-2 rounded-xl p-3 text-[13px]"
          style={{
            background: 'var(--color-primary-100)',
            border: '1px solid var(--color-primary-200)',
            color: 'var(--color-primary-dark)',
          }}
        >
          <span>💡</span>
          <span>Puedes escribir tu duda libremente.</span>
        </div>

        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <QuickQuestions
        onSelect={text => sendMessage(text)}
        disabled={isTyping}
      />

      <ChatInput
        value={inputText}
        onChange={setInputText}
        onSend={() => sendMessage()}
        disabled={isTyping}
        placeholder="Escribe tu pregunta..."
      />

      <p
        className="text-center text-[11px] px-4 py-2.5 leading-relaxed"
        style={{ color: 'var(--color-text-subtle)', background: 'rgba(240,246,251,0.9)' }}
      >
        migrAI proporciona orientación general. No es asesoramiento legal oficial.
      </p>
    </div>
  )
}
