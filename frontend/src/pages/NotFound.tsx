import { useNavigate } from 'react-router-dom'

/**
 * Página 404 — ruta no encontrada.
 */
export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-5 py-12 text-center animate-fade-in">
      <div className="text-[72px] mb-6 leading-none">🌐</div>
      <h1
        className="font-heading font-extrabold text-[28px] mb-3"
        style={{ color: 'var(--color-text)' }}
      >
        Página no encontrada
      </h1>
      <p className="text-[16px] leading-relaxed mb-8" style={{ color: 'var(--color-text-muted)' }}>
        Esta dirección no existe. Puede que el enlace sea incorrecto o haya expirado.
      </p>
      <button className="btn-primary max-w-[280px]" onClick={() => navigate('/')}>
        ← Volver al inicio
      </button>
    </div>
  )
}