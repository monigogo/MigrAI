import { cn } from '@/lib/utils'
import type { ActionCard as ActionCardType } from '@/types'

interface ActionCardProps {
  card: ActionCardType
  className?: string
}

/**
 * Tarjeta de acción rápida del Dashboard.
 * Se muestran en grid de 3 columnas.
 */
export function ActionCard({ card, className }: ActionCardProps) {
  return (
    <button
      type="button"
      onClick={card.onClick}
      className={cn(
        'flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white text-center',
        'border border-[var(--color-border-light)] cursor-pointer',
        'transition-all duration-150',
        'hover:border-[var(--color-primary-light)] hover:bg-[var(--color-primary-50)]',
        className,
      )}
    >
      <span className="text-[28px] leading-none">{card.emoji}</span>
      <div>
        <div
          className="font-bold text-[13px] leading-snug"
          style={{ color: 'var(--color-text)' }}
        >
          {card.title}
        </div>
        <div
          className="text-[12px] mt-0.5 leading-snug"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {card.desc}
        </div>
      </div>
    </button>
  )
}