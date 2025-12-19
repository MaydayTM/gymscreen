import { useState, useEffect } from 'react';
import type { Member } from '../../types';
import { BELT_ORDER } from '../../types';
import { MemberCard } from '../ui/MemberCard';

interface BeltWallProps {
  members: Member[];
  title?: string;
  subtitle?: string;
  itemsPerPage?: number;
  rotationInterval?: number; // in milliseconds
}

// Get highest belt rank for a member (for sorting)
function getHighestBeltOrder(member: Member): number {
  if (member.belts.length === 0) return 999;
  return Math.min(...member.belts.map((b) => BELT_ORDER[b.rank]));
}

// Get highest stripe count for sorting within same rank
function getHighestStripes(member: Member): number {
  if (member.belts.length === 0) return 0;
  return Math.max(...member.belts.map((b) => b.stripes));
}

export function BeltWall({
  members,
  title = 'Belt Wall',
  subtitle = 'Reconnect Academy',
  itemsPerPage = 15,
  rotationInterval = 10000,
}: BeltWallProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // Sort members: coaches first, then by highest belt rank, then stripes, then alphabetically
  const sortedMembers = [...members].sort((a, b) => {
    // 1. Coaches come first
    const aIsCoach = a.role === 'coach';
    const bIsCoach = b.role === 'coach';
    if (aIsCoach && !bIsCoach) return -1;
    if (!aIsCoach && bIsCoach) return 1;

    // 2. Sort by highest belt rank (lower number = higher rank)
    const rankDiff = getHighestBeltOrder(a) - getHighestBeltOrder(b);
    if (rankDiff !== 0) return rankDiff;

    // 3. Sort by stripes (more stripes = higher)
    const stripeDiff = getHighestStripes(b) - getHighestStripes(a);
    if (stripeDiff !== 0) return stripeDiff;

    // 4. Sort alphabetically by name
    return a.name.localeCompare(b.name);
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedMembers.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const currentMembers = sortedMembers.slice(startIndex, startIndex + itemsPerPage);

  // Auto-rotate pages
  useEffect(() => {
    if (totalPages <= 1) return;

    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, rotationInterval);

    return () => clearInterval(timer);
  }, [totalPages, rotationInterval]);

  // Reset to first page when members change
  useEffect(() => {
    setCurrentPage(0);
  }, [members.length]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 px-8 pt-8 pb-4 flex flex-col overflow-hidden">
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Header - Compact for landscape */}
      <header className="relative z-10 flex-shrink-0 flex items-center justify-between mb-4 px-2">
        <div>
          <p className="text-sm text-amber-500 font-medium tracking-wider uppercase">
            {subtitle}
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
            {title}
          </h1>
        </div>

        {/* Page indicator */}
        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentPage
                      ? 'bg-amber-500 scale-125'
                      : 'bg-neutral-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-neutral-500 text-sm font-medium">
              {currentPage + 1} / {totalPages}
            </span>
          </div>
        )}

        <div className="h-12 w-1 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full" />
      </header>

      {/* Members Grid - 5x3 for 15 items per page */}
      <div className="flex-1 relative z-10 min-h-0 pt-4">
        <div className="grid grid-cols-5 grid-rows-3 gap-x-3 gap-y-32 w-full h-full">
          {currentMembers.map((member) => (
            <div key={member.id} className="flex items-start justify-center">
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </div>

      {/* Footer - Minimal */}
      <footer className="relative z-10 text-center mt-4">
        <p className="text-neutral-600 text-sm">
          OSS! Train hard. Stay humble.
        </p>
      </footer>
    </div>
  );
}
