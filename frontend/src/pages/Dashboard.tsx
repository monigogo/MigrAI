import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { ProfileBadge } from '@/components/dashboard/ProfileBadge'
import { ActionCard } from '@/components/dashboard/ActionCard'
import { ChatView } from '@/components/chat/ChatView'
import { capitalize } from '@/lib/utils'
import type { UserProfile, MigrationRoute, ActionCard as ActionCardType } from '@/types'

type DashboardView = 'main' | 'chat'

interface DashboardProps {
  userProfile: UserProfile
  route: MigrationRoute
  onBack: () => void
}

/**
 * Panel principal del usuario.
 * Dos vistas internas: "main" (dashboard) y "chat".
 */
export function Dashboard({ userProfile, route, onBack }: DashboardProps) {
  const [view, setView] = useState<DashboardView>('main')

  // Si está en el chat, renderiza solo ChatView
  if (view === 'chat') {
    return (
      <ChatView
        userProfile={userProfile}
        route={route}
        onBack={() => setView('main')}
      />
    )
  }

  // ── Tarjetas de acción según la ruta ──────────────────────────
  const actionCards: ActionCardType[] =
    route === 'new'
      ? [
          { id: '1', emoji: '🗺️', title: 'Guía paso a paso', desc: 'Tu hoja de ruta completa' },
          { id: '2', emoji: '📄', title: 'Documentos',        desc: 'Qué necesitas según tu país' },
          { id: '3', emoji: '❓', title: 'Preguntas frecuentes', desc: 'Las dudas más comunes' },
        ]
      : [
          { id: '1', emoji: '➡️', title: 'Siguiente paso', desc: '¿Qué toca ahora?' },
          { id: '2', emoji: '🤖', title: 'Chat con migrAI', desc: 'Consulta tu duda', onClick: () => setView('chat') },
          { id: '3', emoji: '📁', title: 'Mis documentos', desc: 'Estado de tus trámites' },
        ]

  return (
    <div className="flex flex-col flex-1">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="sticky-header px-5 py-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-[14px] font-medium transition-colors
              hover:text-[var(--color-primary)]"
            style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <ArrowLeft size={16} />
            Inicio
          </button>
          <ProfileBadge profile={userProfile} />
        </div>
      </div>

      {/* ── Contenido scrollable ────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="animate-fade-in flex flex-col gap-6">
          {/* Saludo personalizado */}
          <div>
            <h2
              className="font-heading font-extrabold text-[26px] leading-tight"
              style={{ color: 'var(--color-text)' }}
            >
              {route === 'new'
                ? '¡Empecemos tu proceso! 🚀'
                : '¡Continuemos tu proceso! 🔄'}
            </h2>
            <p className="text-[15px] leading-relaxed mt-2" style={{ color: 'var(--color-text-muted)' }}>
              {route === 'new'
                ? 'Te guiaremos paso a paso. Estamos contigo en todo el camino.'
                : 'Vemos que ya tienes avance. ¡Sigamos desde donde lo dejaste!'}
            </p>
          </div>

          {/* Resumen de perfil */}
          <div
            className="rounded-[20px] p-5 border"
            style={{
              background: 'linear-gradient(135deg, var(--color-primary-100), hsl(193, 55%, 90%))',
              borderColor: 'var(--color-primary-200)',
            }}
          >
            <div className="section-label">Tu perfil de sesión</div>
            <div className="flex gap-3 flex-wrap">
              {[
                { emoji: '🌍', label: 'País',  value: userProfile.country },
                { emoji: '📅', label: 'Edad',  value: userProfile.age },
                { emoji: '👤', label: 'Sexo',  value: capitalize(userProfile.gender) },
                { emoji: '⏳', label: 'Tiempo', value: userProfile.stayDuration === '2años' ? 'Casi 2 años' : userProfile.stayDuration },

              ].map(item => (
                <div
                  key={item.label}
                  className="flex-1 min-w-[90px] rounded-xl p-3 border"
                  style={{
                    background: 'white',
                    borderColor: 'var(--color-primary-200)',
                  }}
                >
                  <div className="text-[18px] mb-1 leading-none">{item.emoji}</div>
                  <div
                    className="text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {item.label}
                  </div>
                  <div
                    className="text-[14px] font-bold mt-0.5"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjetas de acción */}
          <div>
            <div className="section-label">¿Qué necesitas?</div>
            <div className="grid grid-cols-3 gap-2.5">
              {actionCards.map(card => (
                <ActionCard key={card.id} card={card} />
              ))}
            </div>
          </div>

          {/* Banner informativo */}
          <div
            className="rounded-[20px] p-5 border flex gap-4 items-start"
            style={{
              background: 'var(--color-success-light)',
              borderColor: 'hsl(152, 35%, 78%)',
            }}
          >
            <div className="text-[28px] flex-shrink-0 leading-none">💬</div>
            <div>
              <div
                className="font-bold text-[15px] mb-1"
                style={{ color: 'var(--color-text)' }}
              >
                Habla con migrAI en cualquier momento
              </div>
              <div className="text-[13px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                Resuelve tus dudas sobre documentos, derechos y trámites al instante.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA Fijo ────────────────────────────────────────────── */}
      <div
        className="px-5 py-4 border-t"
        style={{
          borderColor: 'var(--color-border-light)',
          background: 'rgba(240,246,251,0.97)',
        }}
      >
        <button
          className="btn-primary"
          onClick={() => setView('chat')}
        >
          🤖 Hablar con migrAI
        </button>
      </div>
    </div>
  )
}