import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Home } from '@/pages/Home'
import { OnboardingForm } from '@/components/onboarding/OnboardingForm'
import { Dashboard } from '@/pages/Dashboard'
import { NotFound } from '@/pages/NotFound'
import type { UserProfile, MigrationRoute, AppScreen } from '@/types'

/**
 * ─── Componente raíz de la aplicación ────────────────────────────
 *
 * Gestiona el estado global mínimo necesario:
 * - screen:      pantalla activa (home | onboarding | dashboard)
 * - route:       ruta migratoria seleccionada (new | continue)
 * - userProfile: perfil del usuario (país, edad, sexo)
 *
 * El enrutamiento con React Router es para la URL del navegador.
 * La navegación entre pantallas se hace con estado local (screen)
 * porque la app no tiene rutas de usuario individuales.
 * ────────────────────────────────────────────────────────────────── */
export function App() {
  const [screen, setScreen]           = useState<AppScreen>('home')
  const [route, setRoute]             = useState<MigrationRoute>('new')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  function handleSelectRoute(selectedRoute: MigrationRoute) {
    setRoute(selectedRoute)
    setScreen('onboarding')
  }

  function handleOnboardingComplete(profile: UserProfile) {
    setUserProfile(profile)
    setScreen('dashboard')

    // 🔌 PUNTO DE INTEGRACIÓN: Guardar perfil de sesión en el backend (opcional)
    // import { saveUserSession } from '@/services/api'
    // saveUserSession(profile).catch(console.error)
  }

  function handleBackToHome() {
    setScreen('home')
    setUserProfile(null)
  }

  return (
    <AppShell>
      <Routes>
        {/* Ruta principal — SPA de pantalla única */}
        <Route
          path="/"
          element={
            <>
              {screen === 'home' && (
                <Home onSelectRoute={handleSelectRoute} />
              )}

              {screen === 'onboarding' && (
                <OnboardingForm
                  route={route}
                  onComplete={handleOnboardingComplete}
                  onBack={() => setScreen('home')}
                />
              )}

              {screen === 'dashboard' && userProfile && (
                <Dashboard
                  userProfile={userProfile}
                  route={route}
                  onBack={handleBackToHome}
                />
              )}

              {/* Fallback: si llega a dashboard sin perfil, volver a home */}
              {screen === 'dashboard' && !userProfile && (
                <Navigate to="/" replace />
              )}
            </>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  )
}