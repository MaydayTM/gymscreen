import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">GymScreen</h1>
          <p className="text-neutral-400 text-lg">
            Display app voor gym schermen
          </p>
          <div className="mt-8 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
            <p className="text-sm text-neutral-500">
              Connected to Supabase (shared with CRM)
            </p>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
