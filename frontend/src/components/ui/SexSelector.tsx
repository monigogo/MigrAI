import { cn } from '@/lib/utils'
import { SEX_OPTIONS } from '@/lib/constants'

interface SexSelectorProps {
  value: string
  onChange: (v: string) => void
  className?: string
}

export function SexSelector({ value, onChange, className }: SexSelectorProps) {
  return (
    <div className={cn('flex gap-3', className)}>
      {SEX_OPTIONS.map(option => {
        const isSelected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 flex flex-col items-center gap-2 py-4 px-2 rounded-2xl border-2 cursor-pointer',
              'transition-all duration-150 min-h-[90px]',
              isSelected
                ? 'border-[var(--color-primary)] bg-[var(--color-primary-100)]'
                : 'border-[var(--color-border-light)] bg-white hover:border-[var(--color-primary-light)] hover:bg-[var(--color-primary-50)]',
            )}
            aria-pressed={isSelected}
          >
            <span className="text-2xl leading-none">{option.emoji}</span>
            <span
              className="text-[13px] font-semibold text-center leading-tight"
              style={{ color: isSelected ? 'var(--color-primary)' : 'var(--color-text)' }}
            >
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}