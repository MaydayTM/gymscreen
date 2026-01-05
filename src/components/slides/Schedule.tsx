import { useTodayClasses, useWeeklyClasses, getDayName, type ClassSchedule } from '../../hooks/useClasses';

interface ScheduleProps {
  mode?: 'today' | 'week';
  title?: string;
  subtitle?: string;
}

// Coach avatar component with discipline-colored border and glow (like Belt Wall)
function CoachAvatar({
  name,
  photoUrl,
  disciplineColor,
  size = 'medium'
}: {
  name: string;
  photoUrl?: string;
  disciplineColor: string;
  size?: 'medium' | 'large';
}) {
  // Generate initials for fallback
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = size === 'large'
    ? 'w-32 h-32 text-3xl'
    : 'w-24 h-24 text-2xl';

  return (
    <div className="relative flex-shrink-0">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className={`${sizeClasses} rounded-full object-cover`}
          style={{
            borderColor: disciplineColor,
            borderWidth: '4px',
            borderStyle: 'solid'
          }}
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-full flex items-center justify-center font-bold text-white`}
          style={{
            background: `linear-gradient(135deg, ${disciplineColor}40 0%, ${disciplineColor}20 100%)`,
            borderColor: disciplineColor,
            borderWidth: '4px',
            borderStyle: 'solid',
          }}
        >
          {initials}
        </div>
      )}

      {/* Glow effect */}
      <div
        className="absolute -inset-3 rounded-full opacity-30 blur-xl -z-10"
        style={{ backgroundColor: disciplineColor }}
      />
    </div>
  );
}

// Large class card component for daily view (max 4-5 classes)
function ClassCard({ classItem }: { classItem: ClassSchedule }) {
  return (
    <div
      className="flex items-center gap-6 p-6 lg:p-8 rounded-3xl bg-neutral-900/80 border border-neutral-800/50 backdrop-blur-sm h-full"
      style={{
        borderLeftWidth: '6px',
        borderLeftColor: classItem.discipline.color,
      }}
    >
      {/* Time block */}
      <div className="flex-shrink-0 w-28 lg:w-32 text-center">
        <div className="text-4xl lg:text-5xl font-bold text-white tracking-tight">{classItem.startTime}</div>
        <div className="text-lg lg:text-xl text-neutral-500 mt-1">{classItem.endTime}</div>
      </div>

      {/* Divider */}
      <div className="w-px h-20 lg:h-24 bg-neutral-700 flex-shrink-0" />

      {/* Coach avatar with glow - moved before text */}
      {classItem.coach && (
        <div className="flex-shrink-0">
          <CoachAvatar
            name={classItem.coach.name}
            photoUrl={classItem.coach.photo_url}
            disciplineColor={classItem.discipline.color}
            size="large"
          />
        </div>
      )}

      {/* Class info - takes remaining space */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">{classItem.name}</h3>
        <span
          className="self-start px-3 lg:px-4 py-1 lg:py-1.5 rounded-full text-xs lg:text-sm font-bold uppercase tracking-wider whitespace-nowrap mb-2"
          style={{
            backgroundColor: classItem.discipline.color,
            color: '#FFFFFF',
          }}
        >
          {classItem.discipline.name}
        </span>
        {classItem.coach && (
          <div className="text-xl lg:text-2xl text-neutral-300 font-medium">
            {classItem.coach.name}
          </div>
        )}
        {classItem.room && (
          <div className="flex items-center gap-2 mt-1 text-base lg:text-lg text-neutral-500">
            <svg className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {classItem.room}
          </div>
        )}
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
