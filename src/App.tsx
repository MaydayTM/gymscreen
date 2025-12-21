import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BeltWall } from './components/slides/BeltWall'
import { Schedule } from './components/slides/Schedule'
import { Announcements } from './components/slides/Announcements'
import { BirthdaySpotlight } from './components/slides/BirthdaySpotlight'
import { SlideController } from './components/layout/SlideController'
import { useMembers } from './hooks/useMembers'
import { useTodaysBirthdays } from './hooks/useBirthdays'

const queryClient = new QueryClient()

// Main display component that uses real data
function GymScreenDisplay() {
  const { data: members, isLoading: membersLoading, error: membersError } = useMembers()
  const { data: birthdayMembers } = useTodaysBirthdays()

  // Enable debug controls with ?debug in URL
  const showControls = window.location.search.includes('debug')

  if (membersLoading) {
    return (
      <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (membersError) {
    return (
      <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl mb-2">Error loading data</p>
          <p className="text-sm text-neutral-500">{String(membersError)}</p>
        </div>
      </div>
    )
  }

  // Build slides array - birthday spotlight only if there are birthdays today
  const hasBirthdays = birthdayMembers && birthdayMembers.length > 0

  const slides = [
    // Birthday spotlight - only shown if there are birthdays today
    // Shows at the START for maximum visibility
    ...(hasBirthdays
      ? [
          {
            id: 'birthday' as const,
            component: (
              <BirthdaySpotlight
                birthdayMembers={birthdayMembers}
                subtitle="Reconnect Academy"
                rotationInterval={10000}
              />
            ),
            // Duration depends on number of birthday members (10 sec each)
            duration: birthdayMembers.length * 10,
          },
        ]
      : []),
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
    {
      id: 'schedule' as const,
      component: (
        <Schedule
          mode="today"
          title="Vandaag"
          subtitle="Reconnect Academy"
        />
      ),
      duration: 20,
    },
    {
      id: 'schedule' as const,
      component: (
        <Schedule
          mode="week"
          title="Lesrooster"
          subtitle="Reconnect Academy"
        />
      ),
      duration: 25,
    },
    {
      id: 'announcements' as const,
      component: (
        <Announcements subtitle="Reconnect Academy" />
      ),
      duration: 20,
    },
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

// Standalone Birthday preview component for testing
function BirthdayPreview() {
  const { data: birthdayMembers, isLoading } = useTodaysBirthdays()

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400">Loading birthdays...</p>
        </div>
      </div>
    )
  }

  // For testing: show demo if no real birthdays
  const testMembers = birthdayMembers && birthdayMembers.length > 0
    ? birthdayMembers
    : [
        { id: 'test-1', name: 'Demo Jaansen', age: 28, photo_url: undefined },
        { id: 'test-2', name: 'Test Persoon', age: 35, photo_url: undefined },
      ]

  return (
    <BirthdaySpotlight
      birthdayMembers={testMembers}
      subtitle="Reconnect Academy"
      rotationInterval={10000}
    />
  )
}

// Standalone Belt Wall preview for direct URL access
function BeltWallPreview() {
  const { data: members, isLoading, error } = useMembers()

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400">Loading...</p>
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

  return (
    <BeltWall
      members={members ?? []}
      title="Belt Wall"
      subtitle="Reconnect Academy"
    />
  )
}

function App() {
  // Simple URL-based routing for direct slide access
  const path = window.location.pathname

  return (
    <QueryClientProvider client={queryClient}>
      {path === '/belt-wall' ? (
        <BeltWallPreview />
      ) : path === '/birthday' ? (
        <BirthdayPreview />
      ) : (
        <GymScreenDisplay />
      )}
    </QueryClientProvider>
  )
}

export default App
