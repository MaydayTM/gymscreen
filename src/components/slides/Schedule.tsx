import { useTodayClasses, useWeeklyClasses, getDayName, type ClassSchedule } from '../../hooks/useClasses';

interface ScheduleProps {
  mode?: 'today' | 'week';
  title?: string;
  subtitle?: string;
}

// Single class row component
function ClassRow({ classItem, showDay = false }: { classItem: ClassSchedule; showDay?: boolean }) {
  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/50"
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: classItem.discipline.color,
      }}
    >
      {/* Time */}
      <div className="flex-shrink-0 w-28 text-center">
        <div className="text-2xl font-bold text-white">{classItem.startTime}</div>
        <div className="text-sm text-neutral-500">{classItem.endTime}</div>
      </div>

      {/* Divider */}
      <div className="w-px h-12 bg-neutral-700" />

      {/* Class info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-semibold text-white truncate">{classItem.name}</h3>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold uppercase"
            style={{
              backgroundColor: classItem.discipline.color,
              color: '#FFFFFF',
            }}
          >
            {classItem.discipline.name}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-1 text-sm text-neutral-400">
          {classItem.coach && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {classItem.coach.name}
            </span>
          )}
          {classItem.room && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {classItem.room}
            </span>
          )}
          {showDay && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {getDayName(classItem.dayOfWeek)}
            </span>
          )}
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
    <div className="h-screen w-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6 flex flex-col overflow-hidden">
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between mb-6 px-2">
        <div>
          <p className="text-sm text-amber-500 font-medium tracking-wider uppercase">
            {subtitle}
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
            {title}
          </h1>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{dayName}</div>
          <div className="text-sm text-neutral-400">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-full overflow-y-auto pr-2">
            {classes.map((classItem) => (
              <ClassRow key={classItem.id} classItem={classItem} />
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
