import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'
import './styles/globals.css'

/**
 * Configuración del QueryClient para TanStack Query.
 * Listo para cuando se integre el backend.
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,   // 5 minutos
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('No se encontró el elemento #root en el DOM')

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)