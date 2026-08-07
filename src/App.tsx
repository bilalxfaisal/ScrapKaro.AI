import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRoutes } from './routes/AppRoutes'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster theme="dark" position="bottom-right" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
