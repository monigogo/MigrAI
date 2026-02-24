import { formatTime } from '@/lib/utils'
import type { ChatMessage } from '@/types'

interface MessageBubbleProps {
  message: ChatMessage
  showTimestamp?: boolean
}

export function MessageBubble({ message, showTimestamp = true }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-2 animate-fade-in`}>
      <div className="flex items-end gap-2">
        {!isUser && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-[16px] bg-blue-600 shadow-lg mb-1">
            🤖
          </div>
        )}
        <div className="flex flex-col gap-1 max-w-[85%]">
          <div
            className="px-4 py-3 text-[15px]"
            style={{
              borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              background: isUser ? 'var(--color-primary)' : 'white',
              color: isUser ? 'white' : 'black',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              border: isUser ? 'none' : '1px solid #e2e8f0'
            }}
          >
            {message.content}
          </div>
        </div>
      </div>

      {showTimestamp && (
        <span className="text-[10px] text-gray-400 px-10">
          {formatTime(message.timestamp)}
        </span>
      )}
    </div>
  )
}
