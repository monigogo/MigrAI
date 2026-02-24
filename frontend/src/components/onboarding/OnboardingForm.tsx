import { Header } from '@/components/layout/Header'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { StepCountry } from './StepCountry'
import { StepProfile } from './StepProfile'
import { useOnboarding } from '@/hooks/useOnboarding'
import type { UserProfile, MigrationRoute } from '@/types'

interface OnboardingFormProps {
  route: MigrationRoute
  onComplete: (profile: UserProfile) => void
  onBack: () => void
}

/**
 * Formulario de onboarding de 2 pasos.
 *
 * Paso 1: País de origen
 * Paso 2: Rango de edad + Sexo
 * Paso 3: Tiempo en España
 *
 * NO crea ninguna cuenta. Los datos se usan solo en sesión
 * para personalizar la experiencia y se enviarán como contexto
 * al backend del chat.
 */
export function OnboardingForm({ route, onComplete, onBack }: OnboardingFormProps) {
  const {
    step,
    country,
    age,
    gender,
    stayDuration,
    canContinue,
    progress,
    setCountry,
    setAge,
    setGender,
    setStayDuration,
    goBack,
    goNext,
  } = useOnboarding(onComplete, onBack)

  const stepTitle = step === 1 ? 'Tu origen' : 'Tu perfil'
  const stepSubtitle = `Paso ${step} de 2`

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <Header title={stepTitle} subtitle={stepSubtitle} onBack={goBack} />

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        {/* Barra de progreso */}
        <ProgressBar value={progress} className="mb-8" />

        {/* Paso actual */}
        {step === 1 ? (
          <StepCountry value={country} onChange={setCountry} />
        ) : (
          <StepProfile
            age={age}
            gender={gender}
            stayDuration={stayDuration}
            onAgeChange={setAge}
            onGenderChange={setGender}
            onStayDurationChange={setStayDuration}
          />
        )}
      </div>

      {/* Footer con botón */}
      <div
        className="px-5 py-4 border-t"
        style={{
          borderColor: 'var(--color-border-light)',
          background: 'rgba(240,246,251,0.95)',
        }}
      >
        <button
          className="btn-primary"
          disabled={!canContinue}
          onClick={goNext}
        >
          {step === 2 ? '✓ Comenzar mi experiencia' : 'Continuar →'}
        </button>

        <p
          className="text-center text-[12px] mt-3"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          🔒 Tus datos no se guardan ni se comparten con terceros
        </p>
      </div>
    </div>
  )
}