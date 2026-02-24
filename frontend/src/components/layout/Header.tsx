import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

interface HeaderProps {
  /** Título principal del header */
  title: string
  /** Subtítulo opcional (ej: "Paso 1 de 2") */
  subtitle?: string
  /** Si se pasa, muestra botón de retroceso que llama a esta función */
  onBack?: () => void
  /** Elemento extra alineado a la derecha (ej: chip de perfil) */
  rightElement?: ReactNode
  /** Clases extra para el contenedor */
  className?: string
}

/**
 * Header sticky reutilizable.
 * Se usa en OnboardingForm, Dashboard y Chat.
 */
export function Header({
  title,
  subtitle,
  onBack,
  rightElement,
  className = '',
}: HeaderProps) {
  return (
    <div className={`sticky-header px-5 py-4 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Botón de retroceso */}
        {onBack && (
          <button
            onClick={onBack}
            className="btn-icon flex-shrink-0"
            aria-label="Volver atrás"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        {/* Título y subtítulo */}
        <div className="flex-1 min-w-0">
          <h1
            className="font-heading font-bold text-[18px] leading-tight truncate"
            style={{ color: 'var(--color-text)' }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Elemento derecho opcional */}
        {rightElement && (
          <div className="flex-shrink-0">{rightElement}</div>
        )}
      </div>
    </div>
  )
}