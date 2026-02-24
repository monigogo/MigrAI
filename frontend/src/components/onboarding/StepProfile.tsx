import { AGE_RANGES } from '@/lib/constants'
import { OptionCard } from '@/components/ui/OptionCard'
import { SexSelector } from '@/components/ui/SexSelector'
import type { UserProfile } from '@/types'

interface StepProfileProps {
  age: string
  gender: string
  stayDuration: string
  onAgeChange: (v: string) => void
  onGenderChange: (v: string) => void
  onStayDurationChange: (v: string) => void
}

/**
 * Paso 2 del onboarding: edad y sexo en la misma pantalla.
 * Reduce fricción mostrando ambos campos juntos.
 */
export function StepProfile({ age, gender, stayDuration, onAgeChange, onGenderChange, onStayDurationChange }: StepProfileProps) {
  return (
    <div className="animate-slide-up">
      {/* Hero del paso */}
      <div className="text-center mb-8">
        <div className="text-[56px] mb-3 leading-none">👤</div>
        <h2
          className="font-heading font-extrabold text-[26px] mb-3 leading-tight"
          style={{ color: 'var(--color-text)' }}
        >
          Cuéntanos más
        </h2>
        <p className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          Para personalizar mejor tu experiencia en migrAI.
        </p>
      </div>

      {/* Rango de edad */}
      <div className="mb-7">
        <div className="section-label">Rango de edad</div>
        <div className="flex flex-col gap-2">
          {AGE_RANGES.map(range => (
            <OptionCard
              key={range}
              label={range}
              selected={age === range}
              onClick={() => onAgeChange(range)}
            />
          ))}
        </div>
      </div>

      {/* Sexo */}
      <div>
        <div className="section-label">Sexo</div>
        <SexSelector value={gender} onChange={onGenderChange} />
      
      </div>

      {/* Tiempo de estancia en España */}
      <div className="mt-7">
        <div className="section-label">Tiempo de estancia en España</div>
        <div className="flex flex-col gap-2">
          {['menos 30 días', '1 año', '2 años o más'].map(duration => (
            <OptionCard
              key={duration}
              label={duration}
              selected={stayDuration === duration}
              onClick={() => onStayDurationChange(duration)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}