import { useState, useEffect } from 'react';
import type { BirthdayMember } from '../../hooks/useBirthdays';

interface BirthdaySpotlightProps {
  birthdayMembers: BirthdayMember[];
  subtitle?: string;
  rotationInterval?: number; // in milliseconds
}

export function BirthdaySpotlight({
  birthdayMembers,
  subtitle = 'Reconnect Academy',
  rotationInterval = 10000,
}: BirthdaySpotlightProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate through birthday members
  useEffect(() => {
    if (birthdayMembers.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % birthdayMembers.length);
    }, rotationInterval);

    return () => clearInterval(timer);
  }, [birthdayMembers.length, rotationInterval]);

  // Reset index when members change
  useEffect(() => {
    setCurrentIndex(0);
  }, [birthdayMembers.length]);

  // No birthdays today
  if (birthdayMembers.length === 0) {
    return null;
  }

  const currentMember = birthdayMembers[currentIndex];
  const firstName = currentMember.name.split(' ')[0];

  // Generate initials for avatar fallback
  const initials = currentMember.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 flex flex-col items-center justify-center overflow-hidden relative">
      {/* Animated background particles/confetti effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ['#F59E0B', '#EF4444', '#8B5CF6', '#10B981', '#3B82F6'][i % 5],
              opacity: 0.3,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Decorative cake/party icons */}
      <div className="absolute top-8 left-8 text-6xl opacity-20">🎂</div>
      <div className="absolute top-8 right-8 text-6xl opacity-20">🎉</div>
      <div className="absolute bottom-8 left-8 text-6xl opacity-20">🎈</div>
      <div className="absolute bottom-8 right-8 text-6xl opacity-20">🎁</div>

      {/* Academy name */}
      <p className="text-lg text-amber-500 font-medium tracking-wider uppercase mb-4 relative z-10">
        {subtitle}
      </p>

      {/* Main title */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white text-center mb-12 relative z-10">
        <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
          PUNISH THE BIRTHDAY
        </span>
        <br />
        <span className="text-white">
          BOY / GIRL
          <span className="inline-block animate-bounce ml-2">😈</span>
        </span>
      </h1>

      {/* Member spotlight card */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Photo with glow */}
        <div className="relative mb-8">
          {currentMember.photo_url ? (
            <img
              src={currentMember.photo_url}
              alt={currentMember.name}
              className="w-56 h-56 md:w-72 md:h-72 rounded-full object-cover border-8 border-amber-500 shadow-2xl"
              style={{
                boxShadow: '0 0 60px rgba(245, 158, 11, 0.5), 0 0 120px rgba(245, 158, 11, 0.3)',
              }}
            />
          ) : (
            <div
              className="w-56 h-56 md:w-72 md:h-72 rounded-full flex items-center justify-center text-7xl font-bold text-white border-8 border-amber-500"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(245, 158, 11, 0.2) 100%)',
                boxShadow: '0 0 60px rgba(245, 158, 11, 0.5), 0 0 120px rgba(245, 158, 11, 0.3)',
              }}
            >
              {initials}
            </div>
          )}

          {/* Animated ring */}
          <div
            className="absolute -inset-4 rounded-full border-4 border-amber-500/30 animate-ping"
            style={{ animationDuration: '2s' }}
          />
        </div>

        {/* Name */}
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white text-center mb-4">
          {firstName.toUpperCase()}
        </h2>

        {/* Full name if different */}
        {currentMember.name.split(' ').length > 1 && (
          <p className="text-2xl md:text-3xl text-neutral-400 font-medium mb-4">
            {currentMember.name.split(' ').slice(1).join(' ')}
          </p>
        )}

        {/* Age badge */}
        <div className="flex items-center gap-3 mt-4">
          <span className="text-6xl">🎂</span>
          <span className="text-5xl md:text-6xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            {currentMember.age}
          </span>
          <span className="text-3xl text-neutral-400 font-medium">jaar</span>
        </div>
      </div>

      {/* Page indicator for multiple birthdays */}
      {birthdayMembers.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div className="flex gap-2">
            {birthdayMembers.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'bg-amber-500 scale-125'
                    : 'bg-neutral-600'
                }`}
              />
            ))}
          </div>
          <span className="text-neutral-500 text-sm font-medium">
            {currentIndex + 1} / {birthdayMembers.length}
          </span>
        </div>
      )}

      {/* Bottom tagline */}
      <p className="absolute bottom-4 text-neutral-600 text-sm">
        Time for birthday burpees! 💪
      </p>
    </div>
  );
}
