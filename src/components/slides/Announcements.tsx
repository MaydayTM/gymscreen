import { useAnnouncements, type Announcement } from '../../hooks/useAnnouncements';

interface AnnouncementsProps {
  subtitle?: string;
}

function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const isHero = announcement.type === 'hero';

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${isHero ? 'col-span-2 row-span-2' : ''}`}
      style={{
        backgroundColor: announcement.backgroundColor,
        minHeight: isHero ? '400px' : '200px',
      }}
    >
      {/* Background image if available */}
      {announcement.imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${announcement.imageUrl})`,
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center p-8">
        {/* Badge */}
        {announcement.badge && (
          <span className="inline-block self-start px-3 py-1 mb-4 text-xs font-bold uppercase tracking-wider bg-amber-500 text-neutral-900 rounded-full">
            {announcement.badge}
          </span>
        )}

        {/* Title */}
        <h2
          className={`font-bold leading-tight ${isHero ? 'text-4xl lg:text-5xl' : 'text-2xl lg:text-3xl'}`}
          style={{ color: announcement.textColor }}
        >
          {announcement.title}
        </h2>

        {/* Subtitle */}
        {announcement.subtitle && (
          <p
            className={`mt-3 opacity-80 ${isHero ? 'text-lg' : 'text-base'}`}
            style={{ color: announcement.textColor }}
          >
            {announcement.subtitle}
          </p>
        )}
      </div>

      {/* Decorative element */}
      <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" fill="currentColor" className="text-white">
          <circle cx="80" cy="80" r="60" />
        </svg>
      </div>
    </div>
  );
}

// Fallback when no announcements
function NoAnnouncements() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6">🥋</div>
        <h2 className="text-4xl font-bold text-white mb-4">Reconnect Academy</h2>
        <p className="text-xl text-neutral-400">Train Hard. Stay Humble.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-neutral-500">BJJ • Luta Livre • MMA</span>
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function Announcements({ subtitle = 'Reconnect Academy' }: AnnouncementsProps) {
  const { data: announcements, isLoading, error } = useAnnouncements();

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl mb-2">Error loading announcements</p>
        </div>
      </div>
    );
  }

  const hasAnnouncements = announcements && announcements.length > 0;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6 flex flex-col overflow-hidden">
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between mb-4 px-2">
        <div>
          <p className="text-sm text-amber-500 font-medium tracking-wider uppercase">
            {subtitle}
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
            News & Updates
          </h1>
        </div>
        <div className="h-12 w-1 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full" />
      </header>

      {/* Content */}
      <div className="flex-1 relative z-10">
        {hasAnnouncements ? (
          <div className="grid grid-cols-3 gap-4 h-full">
            {announcements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        ) : (
          <NoAnnouncements />
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center mt-4">
        <p className="text-neutral-600 text-xs">
          Volg ons op Instagram @reconnect.academy
        </p>
      </footer>
    </div>
  );
}
