import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRoutes } from './routes/AppRoutes'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            theme="dark"
            position="bottom-right"
            richColors
            toastOptions={{
              classNames: {
                toast: "!rounded-xl !border !border-border !shadow-soft-lg",
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
