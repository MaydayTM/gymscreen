import type { Member } from '../../types';
import { BELT_ORDER } from '../../types';
import { MemberCard } from '../ui/MemberCard';

interface BeltWallProps {
  members: Member[];
  title?: string;
  subtitle?: string;
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
}: BeltWallProps) {
  // Sort members by highest belt rank, then by stripes
  const sortedMembers = [...members].sort((a, b) => {
    const rankDiff = getHighestBeltOrder(a) - getHighestBeltOrder(b);
    if (rankDiff !== 0) return rankDiff;
    return getHighestStripes(b) - getHighestStripes(a);
  });

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6 flex flex-col overflow-hidden">
      {/* Background pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Header - Compact for landscape */}
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

      {/* Members Grid - Optimized for landscape 16:9 TV */}
      <div className="flex-1 relative z-10 flex items-center">
        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 w-full">
          {sortedMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>

      {/* Footer - Minimal */}
      <footer className="relative z-10 text-center mt-3">
        <p className="text-neutral-600 text-xs">
          OSS! Train hard. Stay humble.
        </p>
      </footer>
    </div>
  );
}
