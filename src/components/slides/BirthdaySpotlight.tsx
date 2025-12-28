import { useState, useEffect } from 'react';
import type { BirthdayMember, BirthdayData } from '../../hooks/useBirthdays';

interface BirthdaySpotlightProps {
  birthdayData: BirthdayData;
  subtitle?: string;
  rotationInterval?: number; // in milliseconds
}

// Legacy interface for backwards compatibility
interface LegacyBirthdaySpotlightProps {
  birthdayMembers: BirthdayMember[];
  subtitle?: string;
  rotationInterval?: number;
}

// Generate initials from name
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Avatar component
function Avatar({
  member,
  size = 'large',
}: {
  member: BirthdayMember;
  size?: 'small' | 'medium' | 'large';
}) {
  const sizeClasses = {
    small: 'w-16 h-16 text-xl',
    medium: 'w-24 h-24 text-3xl',
    large: 'w-48 h-48 md:w-56 md:h-56 text-6xl',
  };

  const borderSizes = {
    small: 'border-2',
    medium: 'border-4',
    large: 'border-6',
  };

  if (member.photo_url) {
    return (
      <img
        src={member.photo_url}
        alt={member.name}
        className={`${sizeClasses[size]} rounded-full object-cover ${borderSizes[size]} border-amber-500`}
        style={{
          boxShadow: size === 'large' ? '0 0 40px rgba(245, 158, 11, 0.4)' : undefined,
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white ${borderSizes[size]} border-amber-500`}
      style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(245, 158, 11, 0.2) 100%)',
        boxShadow: size === 'large' ? '0 0 40px rgba(245, 158, 11, 0.4)' : undefined,
      }}
    >
      {getInitials(member.name)}
    </div>
  );
}

// Today's birthday card - large and prominent
function TodayBirthdayCard({ member }: { member: BirthdayMember }) {
  const firstName = member.name.split(' ')[0];
  const lastName = member.name.split(' ').slice(1).join(' ');

  return (
    <div className="flex flex-col items-center">
      {/* Photo with glow effect */}
      <div className="relative mb-6">
        <Avatar member={member} size="large" />
        <div
          className="absolute -inset-3 rounded-full border-4 border-amber-500/20 animate-ping"
          style={{ animationDuration: '3s' }}
        />
      </div>

      {/* Name */}
      <h2 className="text-5xl md:text-6xl font-black text-white text-center mb-2">
        {firstName.toUpperCase()}
      </h2>
      {lastName && (
        <p className="text-2xl text-neutral-400 font-medium mb-4">{lastName}</p>
      )}

      {/* Age badge */}
      <div className="flex items-center gap-3 mt-2">
        <span className="text-5xl">🎂</span>
        <span className="text-5xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          {member.age}
        </span>
        <span className="text-2xl text-neutral-400 font-medium">jaar</span>
      </div>
    </div>
  );
}

// Upcoming/Recent birthday row - smaller, compact
function SecondaryBirthdayRow({
  members,
  title,
  icon,
  labelFn,
}: {
  members: BirthdayMember[];
  title: string;
  icon: string;
  labelFn: (m: BirthdayMember) => string;
}) {
  const [visibleIndex, setVisibleIndex] = useState(0);

  // Rotate through members if more than can be displayed
  const maxVisible = 3;
  const needsRotation = members.length > maxVisible;

  useEffect(() => {
    if (!needsRotation) return;
    const timer = setInterval(() => {
      setVisibleIndex((prev) => (prev + 1) % Math.ceil(members.length / maxVisible));
    }, 8000);
    return () => clearInterval(timer);
  }, [members.length, needsRotation]);

  if (members.length === 0) return null;

  const visibleMembers = needsRotation
    ? members.slice(visibleIndex * maxVisible, (visibleIndex + 1) * maxVisible)
    : members;

  return (
    <div className="w-full max-w-4xl">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold text-neutral-400 uppercase tracking-wider">
          {title}
        </h3>
        {needsRotation && (
          <span className="text-xs text-neutral-600 ml-auto">
            {visibleIndex + 1}/{Math.ceil(members.length / maxVisible)}
          </span>
        )}
      </div>

      {/* Members grid */}
      <div className="flex justify-center gap-6">
        {visibleMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 bg-neutral-900/50 rounded-xl px-5 py-3 border border-neutral-800"
          >
            <Avatar member={member} size="small" />
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-white">
                {member.name.split(' ')[0]}
              </span>
              <span className="text-sm text-amber-500 font-medium">
                {labelFn(member)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main component with new design
export function BirthdaySpotlight({
  birthdayData,
  subtitle = 'Reconnect Academy',
  rotationInterval = 10000,
}: BirthdaySpotlightProps) {
  const [currentTodayIndex, setCurrentTodayIndex] = useState(0);

  const { today, upcoming, recent } = birthdayData;

  // Auto-rotate through today's birthday members
  useEffect(() => {
    if (today.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentTodayIndex((prev) => (prev + 1) % today.length);
    }, rotationInterval);

    return () => clearInterval(timer);
  }, [today.length, rotationInterval]);

  // Reset index when members change
  useEffect(() => {
    setCurrentTodayIndex(0);
  }, [today.length]);

  // Nothing to show
  const hasContent = today.length > 0 || upcoming.length > 0 || recent.length > 0;
  if (!hasContent) {
    return null;
  }

  const currentTodayMember = today[currentTodayIndex];
  const hasToday = today.length > 0;
  const hasSecondary = upcoming.length > 0 || recent.length > 0;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#F59E0B', '#EF4444', '#8B5CF6', '#10B981'][i % 4],
              opacity: 0.2,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative icons */}
      <div className="absolute top-6 left-6 text-5xl opacity-15">🎂</div>
      <div className="absolute top-6 right-6 text-5xl opacity-15">🎉</div>

      {/* Header */}
      <div className="text-center pt-8 pb-4 relative z-10">
        <p className="text-sm text-amber-500 font-medium tracking-wider uppercase mb-2">
          {subtitle}
        </p>
        <h1 className="text-3xl md:text-4xl font-black">
          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            {hasToday ? 'PUNISH THE BIRTHDAY' : 'BINNENKORT JARIG'}
          </span>
          {hasToday && (
            <>
              <br />
              <span className="text-white">
                {today.length > 1 ? 'BOYS / GIRLS' : 'BOY / GIRL'}
                <span className="inline-block animate-bounce ml-2">😈</span>
              </span>
            </>
          )}
        </h1>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8 relative z-10">
        {/* Today's birthdays - prominent */}
        {hasToday && currentTodayMember && (
          <div className="flex-shrink-0">
            <TodayBirthdayCard member={currentTodayMember} />

            {/* Page indicator for multiple today birthdays */}
            {today.length > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                {today.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === currentTodayIndex ? 'bg-amber-500 scale-125' : 'bg-neutral-600'
                    }`}
                  />
                ))}
                <span className="text-neutral-500 text-xs ml-2">
                  {currentTodayIndex + 1}/{today.length} vandaag
                </span>
              </div>
            )}
          </div>
        )}

        {/* Secondary sections - upcoming and recent */}
        {hasSecondary && (
          <div className={`w-full flex flex-col items-center gap-6 ${hasToday ? 'mt-4' : 'mt-8'}`}>
            {/* Upcoming birthdays */}
            <SecondaryBirthdayRow
              members={upcoming}
              title="Binnenkort Jarig"
              icon="📅"
              labelFn={(m) => {
                if (m.daysUntil === 1) return `Morgen ${m.age} jaar`;
                return `Over ${m.daysUntil} dagen • ${m.age} jaar`;
              }}
            />

            {/* Recent birthdays (optional) */}
            {recent.length > 0 && (
              <SecondaryBirthdayRow
                members={recent}
                title="Was Jarig"
                icon="🎈"
                labelFn={(m) => {
                  const daysAgo = Math.abs(m.daysUntil);
                  if (daysAgo === 1) return `Gisteren ${m.age} jaar geworden`;
                  return `${daysAgo} dagen geleden • ${m.age} jaar`;
                }}
              />
            )}
          </div>
        )}

        {/* If only upcoming (no today), show them more prominently */}
        {!hasToday && upcoming.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 max-w-5xl">
            {upcoming.slice(0, 6).map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center bg-neutral-900/30 rounded-2xl p-6 border border-neutral-800"
              >
                <Avatar member={member} size="medium" />
                <h3 className="text-xl font-bold text-white mt-4">
                  {member.name.split(' ')[0]}
                </h3>
                <p className="text-sm text-neutral-400">{member.name.split(' ').slice(1).join(' ')}</p>
                <div className="mt-3 text-center">
                  <span className="text-2xl font-bold text-amber-500">{member.age}</span>
                  <span className="text-neutral-400 text-sm ml-1">jaar</span>
                </div>
                <p className="text-xs text-amber-500/80 mt-2">
                  {member.daysUntil === 1 ? 'Morgen!' : `Over ${member.daysUntil} dagen`}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom tagline */}
      <div className="text-center pb-4 relative z-10">
        <p className="text-neutral-600 text-sm">
          {hasToday ? 'Time for birthday burpees! 💪' : 'Vergeet de verjaardagen niet! 🎁'}
        </p>
      </div>
    </div>
  );
}

// Legacy wrapper for backwards compatibility
export function LegacyBirthdaySpotlight({
  birthdayMembers,
  subtitle,
  rotationInterval,
}: LegacyBirthdaySpotlightProps) {
  // Convert legacy format to new format
  const birthdayData: BirthdayData = {
    today: birthdayMembers,
    upcoming: [],
    recent: [],
  };

  return (
    <BirthdaySpotlight
      birthdayData={birthdayData}
      subtitle={subtitle}
      rotationInterval={rotationInterval}
    />
  );
}
