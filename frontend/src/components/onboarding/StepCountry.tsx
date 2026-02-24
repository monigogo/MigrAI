import { COUNTRIES } from '@/lib/constants'

interface StepCountryProps {
  value: string
  onChange: (v: string) => void
}

/**
 * Paso 1 del onboarding: selección del país de origen.
 */
export function StepCountry({ value, onChange }: StepCountryProps) {
  return (
    <div className="animate-slide-up">
      {/* Hero del paso */}
      <div className="text-center mb-8">
        <div className="text-[56px] mb-3 leading-none">🌍</div>
        <h2
          className="font-heading font-extrabold text-[26px] mb-3 leading-tight"
          style={{ color: 'var(--color-text)' }}
        >
          ¿De dónde vienes?
        </h2>
        <p className="text-[15px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          Esto nos ayuda a darte información relevante para tu país de origen.
        </p>
      </div>

      {/* Select */}
      <div>
        <div className="section-label">Selecciona tu país</div>
        <select
          className="select-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-label="País de origen"
        >
          <option value="">— Seleccionar país —</option>
          {COUNTRIES.map(country => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        {/* Info bajo el select */}
        <p className="text-[13px] mt-3 text-center" style={{ color: 'var(--color-text-subtle)' }}>
          🔒 Este dato solo se usa para personalizar tu experiencia
        </p>
      </div>
    </div>
  )
}