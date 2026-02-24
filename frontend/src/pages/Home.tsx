import { useState } from 'react'
import { Chip } from '@/components/ui/Chip'
import { RouteCard } from '@/components/dashboard/RouteCard'
import { ResourceCard } from '@/components/dashboard/ResourceCard'
import { CourseCard } from '@/components/dashboard/CourseCard'
import { Footer } from '@/components/layout/Footer'
import { STATIC_RESOURCES, STATIC_COURSES } from '@/lib/constants'
import type { MigrationRoute } from '@/types'

type HomeTab = 'inicio' | 'aprender'

interface HomeProps {
  onSelectRoute: (route: MigrationRoute) => void
}

/**
 * Pantalla de inicio.
 *
 * Sin login. Sin registro.
 * El usuario elige su ruta y comienza el onboarding.
 */
export function Home({ onSelectRoute }: HomeProps) {
  const [activeTab, setActiveTab] = useState<HomeTab>('inicio')

  return (
    <div className="flex flex-col flex-1">
      {/* ── App Header ─────────────────────────────────────────── */}
      <div className="sticky-header px-5 py-4">
        {/* Logo + nombre */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-[14px] flex items-center justify-center text-[22px] flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary-light))',
                boxShadow: 'var(--shadow-blue)',
              }}
            >
              🌍
            </div>
            <div>
              <div
                className="font-heading font-extrabold text-[22px] leading-none"
                style={{ color: 'var(--color-text)' }}
              >
                migrAI
              </div>
              <div className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                Orientación migratoria
              </div>
            </div>
          </div>
          <Chip>🤖 IA activa</Chip>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b"
          style={{ borderColor: 'var(--color-border-light)' }}
        >
          {(['inicio', 'aprender'] as HomeTab[]).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-[14px] font-semibold border-b-[3px] transition-all duration-150 capitalize ${
                activeTab === tab
                  ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                  : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {tab === 'inicio' ? '🏠 Inicio' : '📚 Aprender'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Contenido scrollable ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {activeTab === 'inicio' ? (
          <div className="animate-fade-in flex flex-col gap-6">
            {/* Hero */}
            <div
              className="rounded-[20px] p-7 text-white"
              style={{
                background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 60%, var(--color-primary-light) 100%)',
              }}
            >
              <div className="text-[44px] mb-3 leading-none">👋</div>
              <h1 className="font-heading font-extrabold text-[24px] mb-2.5 leading-tight">
                Bienvenido/a a migrAI
              </h1>
              <p className="text-[15px] leading-relaxed" style={{ opacity: 0.92 }}>
              No estás solo en esto. Aquí tienes una guía, basada en la normativa
               vigente y en historias como la tuya, para que tomes el control de tu futuro.
              </p>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {['Sin registro', 'En español', 'Gratis'].map(badge => (
                  <span
                    key={badge}
                    className="text-[13px] font-semibold px-3 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)' }}
                  >
                    ✓ {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Selección de ruta */}
            <div>
              <div className="section-label">¿Cuál es tu situación?</div>
              <div className="flex flex-col gap-3">
                <RouteCard variant="new"      onClick={() => onSelectRoute('new')}      />
                <RouteCard variant="continue" onClick={() => onSelectRoute('continue')} />
              </div>
            </div>

            {/* Recursos útiles */}
            <div>
              <div className="section-label">Recursos útiles</div>
              <div className="flex flex-col gap-2.5">
                {STATIC_RESOURCES.map(r => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Tab: Aprender */
          <div className="animate-fade-in flex flex-col gap-5">
            {/* Hero del tab */}
            <div
              className="rounded-[20px] p-6 text-white"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%)',
              }}
            >
              <div className="text-[38px] mb-2.5 leading-none">📚</div>
              <h2 className="font-heading font-extrabold text-[22px] mb-2">
                ¿Dónde estudiar solo con pasaporte?
              </h2>
              <p className="text-[14px] leading-relaxed" style={{ opacity: 0.9 }}>
                Aquí tienes nuestras recomendaciones de cursos gratuitos para ti.
                 ¡Anímate, el momento es ahora!
              </p>
            </div>

            {/* Lista de cursos */}
            <div className="flex flex-col gap-2.5">
              {STATIC_COURSES.map(c => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}