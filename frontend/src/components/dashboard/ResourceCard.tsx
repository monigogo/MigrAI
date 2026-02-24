import { Chip } from '@/components/ui/Chip'
import type { Resource } from '@/types'

interface ResourceCardProps {
  resource: Resource
  onClick?: () => void
}

/**
 * Tarjeta de recurso informativo.
 * Se muestra en el tab "Inicio" de la pantalla de inicio.
 */
export function ResourceCard({ resource, onClick }: ResourceCardProps) {
  return (
    <div
      className="flex gap-4 items-start p-4 rounded-2xl bg-white border cursor-pointer
        transition-all duration-150
        hover:shadow-[0_4px_16px_rgba(0,119,182,0.10)] hover:border-[var(--color-border)]"
      style={{ borderColor: 'var(--color-border-light)' }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {/* Icono */}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0"
        style={{ background: 'var(--color-primary-100)' }}
      >
        {resource.emoji}
      </div>

      {/* Texto */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-[15px]" style={{ color: 'var(--color-text)' }}>
          {resource.title}
        </div>
        <div className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          {resource.desc}
        </div>
      </div>

      {/* Etiqueta */}
      <Chip className="flex-shrink-0 text-[11px]">{resource.tag}</Chip>
    </div>
  )
}