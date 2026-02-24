import { useState, useEffect } from 'react'

/**
 * Detecta si el viewport es móvil (< 768px).
 * Útil para condicionar comportamientos entre móvil y escritorio.
 */
export function useMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => window.innerWidth < 768,
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)

    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}

/**
 * Devuelve el breakpoint actual como string.
 */
export function useBreakpoint(): 'mobile' | 'tablet' | 'desktop' {
  const [bp, setBp] = useState<'mobile' | 'tablet' | 'desktop'>(() => {
    const w = window.innerWidth
    if (w < 768) return 'mobile'
    if (w < 1024) return 'tablet'
    return 'desktop'
  })

  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth
      if (w < 768) setBp('mobile')
      else if (w < 1024) setBp('tablet')
      else setBp('desktop')
    }

    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return bp
}