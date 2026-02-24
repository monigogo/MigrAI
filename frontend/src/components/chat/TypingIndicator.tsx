/**
 * Indicador animado de "migrAI está escribiendo..."
 */
export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-fade-in">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[16px] flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
          boxShadow: '0 2px 8px rgba(0,119,182,0.3)',
        }}
      >
        🤖
      </div>

      {/* Burbuja con dots */}
      <div
        className="flex items-center gap-1.5 px-4 py-3.5 rounded-[20px_20px_20px_4px]"
        style={{
          background: 'white',
          border: '1px solid var(--color-border-light)',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        <div className="typing-dot" style={{ animationDelay: '0ms' }} />
        <div className="typing-dot" style={{ animationDelay: '200ms' }} />
        <div className="typing-dot" style={{ animationDelay: '400ms' }} />
      </div>

      <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)', marginBottom: 2 }}>
        Escribiendo…
      </span>
    </div>
  )
}