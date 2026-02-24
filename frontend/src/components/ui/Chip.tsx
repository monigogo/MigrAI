import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ChipProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'accent' | 'dark'
  className?: string
}

const variantStyles: Record<string, string> = {
  default: 'bg-primary-100 text-primary',
  success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
  accent:  'bg-[#FFF3E0] text-[var(--color-accent)]',
  dark:    'bg-[var(--color-primary-dark)] text-white',
}

/**
 * Chip / badge pequeño para etiquetas y estados.
 */
export function Chip({ children, variant = 'default', className }: ChipProps) {
  return (
    <span className={cn('chip', variantStyles[variant], className)}>
      {children}
    </span>
  )
}