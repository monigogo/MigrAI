interface ProgressBarProps {
  /** Valor entre 0 y 100 */
  value: number
  className?: string
}

/**
 * Barra de progreso animada.
 * Usada en el onboarding para indicar el paso actual.
 */
export function ProgressBar({ value, className = '' }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  return (
    <div className={`progress-track ${className}`} role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="progress-fill"
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}