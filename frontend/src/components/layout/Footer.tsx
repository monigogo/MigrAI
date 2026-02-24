import { LEGAL_NOTICE } from '@/lib/constants'

interface FooterProps {
  /** Texto personalizado — por defecto usa el aviso legal global */
  text?: string
}

/**
 * Footer con aviso legal.
 * Se muestra en Home y al pie del Chat.
 */
export function Footer({ text = LEGAL_NOTICE }: FooterProps) {
  return (
    <div
      className="px-5 py-3 border-t text-center"
      style={{ borderColor: 'var(--color-border-light)', background: 'rgba(240,246,251,0.9)' }}
    >
      <p className="text-[12px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
        {text}
      </p>
    </div>
  )
}