import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // Importação necessária
import './index.css'
import App from './App.tsx'

// 1. Criamos o cliente que vai gerenciar o cache dos pedidos
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Se a internet cair, ele tenta de novo 3 vezes
      refetchOnWindowFocus: true, // Atualiza quando o dono da pizzaria volta para a aba
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 2. Envolvemos o App com o Provider */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);