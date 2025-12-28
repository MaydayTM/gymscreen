import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BeltWall } from './components/slides/BeltWall'
import { Schedule } from './components/slides/Schedule'
import { Announcements } from './components/slides/Announcements'
import { BirthdaySpotlight } from './components/slides/BirthdaySpotlight'
import { Slideshow } from './components/slides/Slideshow'
import { SlideController } from './components/layout/SlideController'
import { useMembers } from './hooks/useMembers'
import { useBirthdays } from './hooks/useBirthdays'
import { useGymScreenSettings, getEffectiveSettings } from './hooks/useGymScreenSettings'
import { useSlides } from './hooks/useSlides'

const queryClient = new QueryClient()

// Loading spinner component
function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-neutral-400">{message}</p>
      </div>
    </div>
  )
}

// Error screen component
function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-center text-red-500">
        <p className="text-xl mb-2">Error loading data</p>
        <p className="text-sm text-neutral-500">{message}</p>
      </div>
    </div>
  )
}

// Main display component that uses CRM settings
function GymScreenDisplay() {
  const { data: members, isLoading: membersLoading, error: membersError } = useMembers()
  const { data: birthdayData } = useBirthdays(7, 3) // 7 days upcoming, 3 days recent
  const { data: settings, isLoading: settingsLoading } = useGymScreenSettings()
  const { data: crmSlides } = useSlides(true) // Only active slides

  // Enable debug controls with ?debug in URL
  const showControls = window.location.search.includes('debug')

  if (membersLoading || settingsLoading) {
    return <LoadingScreen />
  }

  if (membersError) {
    return <ErrorScreen message={String(membersError)} />
  }

  // Get effective settings (with defaults)
  const effectiveSettings = getEffectiveSettings(settings)

  // Build slides array based on CRM settings
  const hasBirthdays = birthdayData && (
    birthdayData.today.length > 0 ||
    birthdayData.upcoming.length > 0 ||
    birthdayData.recent.length > 0
  )
  const hasSlides = crmSlides && crmSlides.length > 0

  const slides = []

  // Birthday spotlight - if enabled AND there are birthdays (today, upcoming, or recent)
  if (effectiveSettings.show_birthdays && hasBirthdays && birthdayData) {
    // Calculate duration based on content
    const todayCount = birthdayData.today.length
    const hasUpcoming = birthdayData.upcoming.length > 0
    const baseDuration = todayCount > 0 ? todayCount * 10 : 15
    const totalDuration = baseDuration + (hasUpcoming ? 5 : 0)

    slides.push({
      id: 'birthday' as const,
      component: (
        <BirthdaySpotlight
          birthdayData={birthdayData}
          subtitle="Reconnect Academy"
          rotationInterval={10000}
        />
      ),
      duration: totalDuration,
    })
  }

  // Belt Wall - if enabled
  if (effectiveSettings.show_belt_wall) {
    slides.push({
      id: 'belt-wall' as const,
      component: (
        <BeltWall
          members={members ?? []}
          title="Belt Wall"
          subtitle="Reconnect Academy"
        />
      ),
      duration: effectiveSettings.section_rotation_interval,
    })
  }

  // CRM Slideshow - if enabled AND there are slides
  if (effectiveSettings.show_slideshow && hasSlides) {
    slides.push({
      id: 'slideshow' as const,
      component: (
        <Slideshow
          slides={crmSlides}
          interval={effectiveSettings.slideshow_interval}
          subtitle="Reconnect Academy"
        />
      ),
      // Total duration = sum of all slide durations, or interval * count
      duration: crmSlides.reduce(
        (total, slide) => total + (slide.display_duration || effectiveSettings.slideshow_interval),
        0
      ),
    })
  }

  // Schedule - always show (no toggle in settings yet)
  slides.push(
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
    }
  )

  // Announcements - if enabled
  if (effectiveSettings.show_announcements) {
    slides.push({
      id: 'announcements' as const,
      component: (
        <Announcements subtitle="Reconnect Academy" />
      ),
      duration: 20,
    })
  }

  return (
    <SlideController
      slides={slides}
      autoPlay={true}
      defaultDuration={effectiveSettings.section_rotation_interval}
      showControls={showControls}
    />
  )
}

// Standalone Birthday preview component for testing
function BirthdayPreview() {
  const { data: birthdayData, isLoading } = useBirthdays(7, 3)

  if (isLoading) {
    return <LoadingScreen message="Loading birthdays..." />
  }

  // For testing: show demo if no real birthdays
  const hasRealData = birthdayData && (
    birthdayData.today.length > 0 ||
    birthdayData.upcoming.length > 0 ||
    birthdayData.recent.length > 0
  )

  const testData = hasRealData && birthdayData
    ? birthdayData
    : {
        today: [
          { id: 'test-1', name: 'Demo Jaansen', age: 28, photo_url: undefined, birthdayDate: new Date(), daysUntil: 0 },
          { id: 'test-2', name: 'Test Persoon', age: 35, photo_url: undefined, birthdayDate: new Date(), daysUntil: 0 },
        ],
        upcoming: [
          { id: 'test-3', name: 'Anna Binnenkort', age: 22, photo_url: undefined, birthdayDate: new Date(), daysUntil: 2 },
          { id: 'test-4', name: 'Piet Volgende', age: 45, photo_url: undefined, birthdayDate: new Date(), daysUntil: 5 },
        ],
        recent: [],
      }

  return (
    <BirthdaySpotlight
      birthdayData={testData}
      subtitle="Reconnect Academy"
      rotationInterval={10000}
    />
  )
}

// Standalone Belt Wall preview for direct URL access
function BeltWallPreview() {
  const { data: members, isLoading, error } = useMembers()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return <ErrorScreen message={String(error)} />
  }

  return (
    <BeltWall
      members={members ?? []}
      title="Belt Wall"
      subtitle="Reconnect Academy"
    />
  )
}

// Standalone Slideshow preview
function SlideshowPreview() {
  const { data: slides, isLoading, error } = useSlides(true)
  const { data: settings } = useGymScreenSettings()
  const effectiveSettings = getEffectiveSettings(settings)

  if (isLoading) {
    return <LoadingScreen message="Loading slides..." />
  }

  if (error) {
    return <ErrorScreen message={String(error)} />
  }

  return (
    <Slideshow
      slides={slides ?? []}
      interval={effectiveSettings.slideshow_interval}
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
      ) : path === '/slideshow' ? (
        <SlideshowPreview />
      ) : (
        <GymScreenDisplay />
      )}
    </QueryClientProvider>
  )
}

export default App
