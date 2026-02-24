import type { UserProfile } from '@/types'

interface ProfileBadgeProps {
  profile: UserProfile
}

/**
 * Badge que muestra el perfil del usuario de forma compacta.
 * Se usa en el header del Dashboard.
 */
export function ProfileBadge({ profile }: ProfileBadgeProps) {
  const ageShort = profile.age.replace(' años', '')

  return (
    <div
      className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold"
      style={{
        background: 'linear-gradient(135deg, var(--color-primary-100), hsl(193, 55%, 90%))',
        border: '1px solid var(--color-primary-200)',
        color: 'var(--color-primary-dark)',
      }}
    >
      <span>🌍</span>
      <span>{profile.country}</span>
      <span style={{ opacity: 0.5 }}>·</span>
      <span>{ageShort}</span>
    </div>
  )
}