import { useTodayClasses, useWeeklyClasses, getDayName, type ClassSchedule } from '../../hooks/useClasses';

interface ScheduleProps {
  mode?: 'today' | 'week';
  title?: string;
  subtitle?: string;
}

// Map discipline slug/name to background image
function getDisciplineBackground(slug: string, name: string): string {
  // Normalize: lowercase and handle variations
  const normalized = slug.toLowerCase();
  const nameLower = name.toLowerCase();

  // Map to available images in /disciplines folder
  // Note: URL encode spaces as %20
  const imageMap: Record<string, string> = {
    'bjj': '/disciplines/BJJ.jpg',
    'brazilian-jiu-jitsu': '/disciplines/BJJ.jpg',
    'luta-livre': '/disciplines/Grappling.jpg',
    'grappling': '/disciplines/Grappling.jpg',
    'muay-thai': '/disciplines/Muay%20Thai.jpg',
    'muay thai': '/disciplines/Muay%20Thai.jpg',
    'kickboxing': '/disciplines/Muay%20Thai.jpg',
    'kiekerrenbok': '/disciplines/Muay%20Thai.jpg',
    'kiekerenboks': '/disciplines/Muay%20Thai.jpg',
    'kiekerenboksen': '/disciplines/Muay%20Thai.jpg',
    'mma': '/disciplines/MMA.jpg',
    'boxing': '/disciplines/boxing.png',
    'boksen': '/disciplines/boxing.png',
    'wrestling': '/disciplines/wrestling.jpg',
    'worstelen': '/disciplines/wrestling.jpg',
  };

  // Try slug first, then name
  return imageMap[normalized] || imageMap[nameLower] || '/disciplines/MMA.jpg';
}

// Coach avatar component with discipline-colored border and glow
function CoachAvatar({
  name,
  photoUrl,
  disciplineColor,
  size = 'medium'
}: {
  name: string;
  photoUrl?: string;
  disciplineColor: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeConfig = {
    small: 'w-16 h-16 text-lg',
    medium: 'w-24 h-24 text-2xl',
    large: 'w-32 h-32 text-3xl',
    xlarge: 'w-40 h-40 text-4xl',
  };

  const borderWidth = size === 'xlarge' ? '5px' : size === 'large' ? '4px' : '3px';

  return (
    <div className="relative flex-shrink-0">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className={`${sizeConfig[size]} rounded-full object-cover shadow-2xl`}
          style={{
            borderColor: disciplineColor,
            borderWidth,
            borderStyle: 'solid'
          }}
        />
      ) : (
        <div
          className={`${sizeConfig[size]} rounded-full flex items-center justify-center font-bold text-white shadow-2xl`}
          style={{
            background: `linear-gradient(135deg, ${disciplineColor}60 0%, ${disciplineColor}30 100%)`,
            borderColor: disciplineColor,
            borderWidth,
            borderStyle: 'solid',
          }}
        >
          {initials}
        </div>
      )}

      {/* Glow effect */}
      <div
        className="absolute -inset-3 rounded-full opacity-40 blur-xl -z-10"
        style={{ backgroundColor: disciplineColor }}
      />
    </div>
  );
}

// New modern class card with discipline background image
function ClassCard({ classItem }: { classItem: ClassSchedule }) {
  const backgroundImage = getDisciplineBackground(classItem.discipline.slug, classItem.discipline.name);

  return (
    <div className="relative h-full rounded-3xl overflow-hidden group">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Gradient overlay - darker for better readability */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.5) 100%)`,
        }}
      />

      {/* Color accent bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: classItem.discipline.color }}
      />

      {/* Content */}
      <div className="relative z-10 h-full p-6 lg:p-8 flex flex-col">
        {/* Top row: Time */}
        <div className="flex justify-between items-start mb-auto">
          <div
            className="px-4 py-2 rounded-xl backdrop-blur-sm"
            style={{ backgroundColor: `${classItem.discipline.color}20` }}
          >
            <div className="text-4xl lg:text-5xl font-bold text-white">{classItem.startTime}</div>
            <div className="text-lg text-white/60">{classItem.endTime}</div>
          </div>
        </div>

        {/* Bottom section: Coach + Info */}
        <div className="flex items-end gap-5">
          {/* Coach avatar */}
          {classItem.coach && (
            <CoachAvatar
              name={classItem.coach.name}
              photoUrl={classItem.coach.photo_url}
              disciplineColor={classItem.discipline.color}
              size="large"
            />
          )}

          {/* Class info */}
          <div className="flex-1 min-w-0">
            {/* Class name - primary */}
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
              {classItem.name}
            </h3>

            {/* Discipline badge */}
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2"
              style={{
                backgroundColor: classItem.discipline.color,
                color: '#FFFFFF',
              }}
            >
              {classItem.discipline.name}
            </span>

            {/* Coach name */}
            {classItem.coach && (
              <div className="text-xl text-white/80 font-medium">
                {classItem.coach.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Today's schedule view
function TodayView({ classes, title, subtitle }: { classes: ClassSchedule[]; title: string; subtitle: string }) {
  const today = new Date();
  const dayName = getDayName(today.getDay());

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-8 flex flex-col overflow-hidden">
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between mb-8 px-2">
        <div>
          <p className="text-base text-amber-500 font-medium tracking-wider uppercase">
            {subtitle}
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
            {title}
          </h1>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-white">{dayName}</div>
          <div className="text-lg text-neutral-400">
            {today.toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </header>

      {/* Classes list */}
      <div className="flex-1 relative z-10 overflow-hidden">
        {classes.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🥋</div>
              <p className="text-2xl text-neutral-400">Geen lessen vandaag</p>
              <p className="text-neutral-500 mt-2">Geniet van je rustdag!</p>
            </div>
          </div>
        ) : (
          <div className={`grid gap-6 h-full ${
            classes.length <= 2
              ? 'grid-cols-1 lg:grid-cols-2 grid-rows-1'
              : classes.length <= 4
                ? 'grid-cols-2 grid-rows-2'
                : 'grid-cols-2 grid-rows-3'
          }`}>
            {classes.map((classItem) => (
              <ClassCard key={classItem.id} classItem={classItem} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center mt-4">
        <p className="text-neutral-600 text-xs">
          Kom op tijd. Warm-up start 5 minuten voor de les.
        </p>
      </footer>
    </div>
  );
}

// Weekly schedule view
function WeekView({ classes, title, subtitle }: { classes: ClassSchedule[]; title: string; subtitle: string }) {
  // Group classes by day
  const classesByDay = classes.reduce((acc, classItem) => {
    const day = classItem.dayOfWeek;
    if (!acc[day]) acc[day] = [];
    acc[day].push(classItem);
    return acc;
  }, {} as Record<number, ClassSchedule[]>);


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
            {title}
          </h1>
        </div>
        <div className="h-12 w-1 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full" />
      </header>

      {/* Weekly grid */}
      <div className="flex-1 relative z-10 overflow-hidden">
        <div className="grid grid-cols-6 gap-3 h-full">
          {[1, 2, 3, 4, 5, 6].map((day) => (
            <div key={day} className="flex flex-col min-h-0">
              {/* Day header */}
              <div className={`text-center py-2 rounded-t-lg ${
                day === new Date().getDay()
                  ? 'bg-amber-500 text-neutral-900'
                  : 'bg-neutral-800 text-neutral-300'
              }`}>
                <div className="font-bold text-sm">{getDayName(day)}</div>
              </div>

              {/* Classes for this day */}
              <div className="flex-1 bg-neutral-900/40 rounded-b-lg p-2 overflow-y-auto space-y-2">
                {(classesByDay[day] || []).map((classItem) => (
                  <div
                    key={classItem.id}
                    className="p-2 rounded-lg bg-neutral-800/60 border-l-2"
                    style={{ borderLeftColor: classItem.discipline.color }}
                  >
                    <div className="text-xs font-bold text-amber-500">{classItem.startTime}</div>
                    <div className="text-sm font-semibold text-white truncate">{classItem.name}</div>
                    {classItem.coach && (
                      <div className="text-xs text-neutral-400 truncate">{classItem.coach.name}</div>
                    )}
                  </div>
                ))}
                {!classesByDay[day]?.length && (
                  <div className="text-xs text-neutral-600 text-center py-4">-</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center mt-3">
        <p className="text-neutral-600 text-xs">
          Lesrooster kan wijzigen. Check de app voor actuele info.
        </p>
      </footer>
    </div>
  );
}

export function Schedule({
  mode = 'today',
  title = 'Lesrooster',
  subtitle = 'Reconnect Academy',
}: ScheduleProps) {
  const todayQuery = useTodayClasses();
  const weekQuery = useWeeklyClasses();

  const query = mode === 'today' ? todayQuery : weekQuery;

  if (query.isLoading) {
    return (
      <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-400">Lesrooster laden...</p>
        </div>
      </div>
    );
  }

  if (query.error) {
    return (
      <div className="h-screen w-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl mb-2">Error loading schedule</p>
          <p className="text-sm text-neutral-500">{String(query.error)}</p>
        </div>
      </div>
    );
  }

  const classes = query.data ?? [];

  if (mode === 'today') {
    return <TodayView classes={classes} title={title} subtitle={subtitle} />;
  }

  return <WeekView classes={classes} title={title} subtitle={subtitle} />;
}
