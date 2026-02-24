import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
}

/**
 * Shell responsivo de la aplicación.
 *
 * - Móvil (< 768px):   ocupa todo el viewport
 * - Tablet (768–1023px): centrado con bordes redondeados y sombra
 * - Desktop (≥ 1024px): igual que tablet, con padding superior
 *
 * Max-width: 480px para mantener la sensación de app móvil en pantallas grandes.
 */
export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <div className="app-container">
        {children}
      </div>
    </div>
  )
}