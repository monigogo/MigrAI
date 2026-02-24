import type { MigrationRoute } from '@/types'

interface RouteCardProps {
  variant: MigrationRoute
  onClick: () => void
}

const ROUTE_DATA = {
  new: {
    emoji: '🧭',
    title: 'No sé por dónde empezar',
    desc: 'Acabo de llegar o estoy empezando mi proceso migratorio desde cero.',
    cta: '→ Empezar guía personalizada',
    ctaStyle: { background: 'linear-gradient(135deg, #EBF5FB, #DDF3FF)', color: 'var(--color-primary)' },
  },
  continue: {
    emoji: '🔄',
    title: 'Ya inicié mi proceso',
    desc: 'Tengo algunos trámites avanzados y necesito orientación específica.',
    cta: '→ Continuar mi proceso',
    ctaStyle: { background: '#FFF3E0', color: 'var(--color-accent)' },
  },
}

/**
 * Tarjeta de selección de ruta en la pantalla de inicio.
 */
export function RouteCard({ variant, onClick }: RouteCardProps) {
  const data = ROUTE_DATA[variant]

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-[20px] p-5 border-[2.5px] border-transparent bg-white
        transition-all duration-200 cursor-pointer
        hover:border-[var(--color-primary-light)] hover:-translate-y-0.5
        hover:shadow-[0_8px_24px_rgba(0,119,182,0.15)]
        shadow-[var(--shadow-soft)]"
      style={{ border: '2.5px solid transparent' }}
    >
      {/* Emoji + texto */}
      <div className="flex items-start gap-4">
        <div className="text-[36px] flex-shrink-0 leading-none mt-0.5">{data.emoji}</div>
        <div>
          <div
            className="font-heading font-bold text-[17px] mb-1.5 leading-snug"
            style={{ color: 'var(--color-text)' }}
          >
            {data.title}
          </div>
          <div className="text-[14px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            {data.desc}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div
        className="mt-4 rounded-xl px-4 py-2.5 text-[14px] font-semibold"
        style={data.ctaStyle}
      >
        {data.cta}
      </div>
    </button>
  )
}