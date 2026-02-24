import { QUICK_QUESTIONS } from '@/lib/constants'

interface QuickQuestionsProps {
  onSelect: (text: string) => void
  disabled?: boolean
}

/**
 * Franja de preguntas rápidas predefinidas.
 * Scroll horizontal en móvil.
 */
export function QuickQuestions({ onSelect, disabled }: QuickQuestionsProps) {
  return (
    <div
      className="px-4 py-2.5 border-t overflow-x-auto flex gap-2"
      style={{
        borderColor: 'var(--color-border-light)',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {QUICK_QUESTIONS.map(q => (
        <button
          key={q.text}
          type="button"
          onClick={() => onSelect(q.text)}
          disabled={disabled}
          className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full
            text-[14px] font-medium
            bg-white border border-[var(--color-border)] text-[var(--color-primary)]
            transition-all duration-150
            hover:bg-[var(--color-primary-50)] hover:border-[var(--color-primary)]
            disabled:opacity-40 disabled:cursor-not-allowed
            whitespace-nowrap"
        >
          <span>{q.emoji}</span>
          <span>{q.text}</span>
        </button>
      ))}
    </div>
  )
}