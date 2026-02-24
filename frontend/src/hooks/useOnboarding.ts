import { useState, useCallback } from 'react'
import type { UserProfile } from '@/types'

export type OnboardingStep = 1 | 2

interface OnboardingState {
  step: OnboardingStep
  country: string
  age: string
  gender: '' | 'masculino' | 'femenino' | 'otro'
  stayDuration: '' | 'menos 30 días' | '1 año' | '2 años o más'

}

interface UseOnboardingReturn {
  step: OnboardingStep
  country: string
  age: string
  gender: OnboardingState['gender']
  stayDuration: OnboardingState['stayDuration']
  canContinue: boolean
  progress: number
  setCountry: (v: string) => void
  setAge: (v: string) => void
  setGender: (v: OnboardingState['gender']) => void
  setStayDuration: (v: OnboardingState['stayDuration']) => void
  goBack: () => void
  goNext: () => void
  getProfile: () => UserProfile | null
  reset: () => void
}

/**
 * Encapsula toda la lógica del formulario de onboarding.
 * El componente solo renderiza — la lógica vive aquí.
 *
 * @param onComplete  Callback llamado con el perfil completo al terminar el paso 2
 * @param onBackHome  Callback para volver a la pantalla de inicio desde el paso 1
 */
export function useOnboarding(
  onComplete: (profile: UserProfile) => void,
  onBackHome: () => void,
): UseOnboardingReturn {
  const [state, setState] = useState<OnboardingState>({
    step: 1,
    country: '',
    age: '',
    gender: '',
    stayDuration: '',
  })

  // Validación por paso
  const canContinue =
    state.step === 1
      ? state.country.trim() !== ''
      : state.age !== '' && state.gender !== '' && state.stayDuration !== ''

  // Progreso visual (0–100)
  const progress = state.step === 1 ? 50 : 100

  const setCountry = useCallback((v: string) => {
    setState(prev => ({ ...prev, country: v }))
  }, [])

  const setAge = useCallback((v: string) => {
    setState(prev => ({ ...prev, age: v }))
  }, [])

  const setGender = useCallback((v: OnboardingState['gender']) => {
    setState(prev => ({ ...prev, gender: v }))
  }, [])

  const setStayDuration = useCallback((v: OnboardingState['stayDuration']) => {
    setState(prev => ({ ...prev, stayDuration: v }))
  }, [])

  const goBack = useCallback(() => {
    if (state.step === 1) {
      onBackHome()
    } else {
      setState(prev => ({ ...prev, step: 1 }))
    }
  }, [state.step, onBackHome])

  const goNext = useCallback(() => {
    if (!canContinue) return

    if (state.step === 1) {
      setState(prev => ({ ...prev, step: 2 }))
    } else {
      // Paso 2 completado — construir perfil y llamar al padre
      const profile: UserProfile = {
        country: state.country,
        age: state.age,
        gender: state.gender as 'masculino' | 'femenino' | 'otro',
        stayDuration: state.stayDuration,
      }
      onComplete(profile)
    }
  }, [canContinue, state, onComplete])

  const getProfile = useCallback((): UserProfile | null => {
    if (!state.country || !state.age || !state.gender || !state.stayDuration) return null
    return {
      country: state.country,
      age: state.age,
      gender: state.gender as 'masculino' | 'femenino' | 'otro',
      stayDuration: state.stayDuration,
    }
  }, [state])

  const reset = useCallback(() => {
    setState({ step: 1, country: '', age: '', gender: '', stayDuration: '' })
  }, [])

  return {
    step: state.step,
    country: state.country,
    age: state.age,
    gender: state.gender,
    stayDuration: state.stayDuration,
    canContinue,
    progress,
    setCountry,
    setAge,
    setGender,
    setStayDuration,
    goBack,
    goNext,
    getProfile,
    reset,
  }
}