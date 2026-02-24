import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OptionCardProps {
  /** Texto principal de la opción */
  label: string
  /** Descripción adicional opcional */
  description?: string
  /** Si está seleccionada */
  selected: boolean
  /** Callback al hacer clic */
  onClick: () => void
  /** Clases extra */
  className?: string
}

/**
 * Tarjeta de opción seleccionable.
 * Se usa en el onboarding para rangos de edad.
 */
export function OptionCard({
  label,
  description,
  selected,
  onClick,
  className,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-4 px-4 py-4 rounded-2xl border-2 text-left',
        'transition-all duration-150 min-h-[56px]',
        'bg-white',
        selected
          ? 'border-[var(--color-primary)] bg-[var(--color-primary-100)] shadow-[0_0_0_3px_rgba(0,119,182,0.12)]'
          : 'border-[var(--color-border-light)] hover:border-[var(--color-primary-light)] hover:bg-[var(--color-primary-50)]',
        className,
      )}
      aria-pressed={selected}
    >
      {/* Indicador circular */}
      <div
        className={cn(
          'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150',
          selected
            ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
            : 'border-[var(--color-border)]',
        )}
      >
        {selected && <Check size={13} color="white" strokeWidth={3} />}
      </div>

      {/* Texto */}
      <div className="flex-1">
        <span
          className="block font-medium text-[15px]"
          style={{ color: selected ? 'var(--color-primary-dark)' : 'var(--color-text)' }}
        >
          {label}
        </span>
        {description && (
          <span className="block text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {description}
          </span>
        )}
      </div>
    </button>
  )
}