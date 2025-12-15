import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BeltWall } from './components/slides/BeltWall'
import { SlideController } from './components/layout/SlideController'
import { useMembers } from './hooks/useMembers'

const queryClient = new QueryClient()

// Main display component that uses real data
function GymScreenDisplay() {
  const { data: members, isLoading, error } = useMembers()

  // Enable debug controls with ?debug in URL
  const showControls = window.location.search.includes('debug')

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400">Loading members...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl mb-2">Error loading data</p>
          <p className="text-sm text-neutral-500">{String(error)}</p>
        </div>
      </div>
    )
  }

  const slides = [
    {
      id: 'belt-wall' as const,
      component: (
        <BeltWall
          members={members ?? []}
          title="Belt Wall"
          subtitle="Reconnect Academy"
        />
      ),
      duration: 30,
    },
    // Future slides:
    // { id: 'schedule', component: <Schedule />, duration: 20 },
    // { id: 'announcements', component: <Announcements />, duration: 15 },
    // { id: 'spotlight', component: <FighterSpotlight />, duration: 25 },
  ]

  return (
    <SlideController
      slides={slides}
      autoPlay={true}
      defaultDuration={30}
      showControls={showControls}
    />
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GymScreenDisplay />
    </QueryClientProvider>
  )
}

export default App
