import type { Member, BeltProgress } from '../../types';
import { BELT_COLORS, BELT_ORDER, ROLE_DISPLAY, BELT_GRADIENTS, DISCIPLINE_INFO } from '../../types';

interface MemberCardProps {
  member: Member;
}

// Get the highest ranked belt for avatar border color
function getHighestBelt(belts: BeltProgress[]): BeltProgress | undefined {
  if (belts.length === 0) return undefined;
  return [...belts].sort((a, b) => {
    const rankDiff = BELT_ORDER[a.rank] - BELT_ORDER[b.rank];
    if (rankDiff !== 0) return rankDiff;
    return b.stripes - a.stripes;
  })[0];
}

// Compact belt row component for ID card
function CompactBeltRow({ belt }: { belt: BeltProgress }) {
  const gradient = BELT_GRADIENTS[belt.rank];
  const disciplineName = DISCIPLINE_INFO[belt.discipline].shortName;
  const isBlackBelt = belt.rank === 'black';

  return (
    <div className="flex items-center gap-2">
      {/* Discipline label */}
      <span className="text-xs font-semibold text-neutral-400 uppercase w-8 flex-shrink-0">
        {disciplineName}
      </span>

      {/* Belt bar */}
      <div
        className="h-4 flex-1 rounded-sm relative overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
          boxShadow: belt.rank === 'white'
            ? '0 1px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)'
            : '0 1px 4px rgba(0,0,0,0.4)',
        }}
      >
        {/* Belt texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
          }}
        />

        {/* Tip */}
        <div
          className="absolute right-0 top-0 bottom-0 w-6"
          style={{
            background: isBlackBelt
              ? 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)'
              : 'linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)',
          }}
        />

        {/* Stripes on tip */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-px">
          {Array.from({ length: Math.min(belt.stripes, 4) }).map((_, i) => (
            <div
              key={i}
              className="w-1 h-2.5 bg-white rounded-[1px]"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.4)' }}
            />
          ))}
        </div>
      </div>

      {/* Rank label */}
      <span className="text-xs font-medium text-neutral-500 uppercase w-14 text-right flex-shrink-0">
        {belt.rank}
      </span>
    </div>
  );
}

export function MemberCard({ member }: MemberCardProps) {
  const highestBelt = getHighestBelt(member.belts);
  const primaryColor = highestBelt ? BELT_COLORS[highestBelt.rank] : BELT_COLORS.white;

  // Show max 2 belts, sorted by rank
  const displayBelts = [...member.belts]
    .sort((a, b) => BELT_ORDER[a.rank] - BELT_ORDER[b.rank])
    .slice(0, 2);

  // Generate initials for avatar fallback
  const initials = member.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Get role display info
  const roleInfo = member.role ? ROLE_DISPLAY[member.role] : null;

  return (
    <div
      className="relative bg-neutral-900/90 backdrop-blur-sm rounded-2xl border border-neutral-800/50 transition-all duration-300 w-full h-full flex flex-col overflow-hidden"
      style={{
        boxShadow: `0 0 30px -5px ${primaryColor}30`,
      }}
    >
      {/* Header with role badge */}
      {roleInfo && (
        <div
          className="px-3 py-1.5 text-center text-sm font-bold uppercase tracking-wider"
          style={{
            backgroundColor: roleInfo.color,
            color: roleInfo.textColor,
          }}
        >
          {roleInfo.label}
        </div>
      )}

      {/* Main content - vertical ID card layout */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-3">
        {/* Avatar - large and centered */}
        <div className="relative flex-shrink-0">
          {member.photo_url ? (
            <img
              src={member.photo_url}
              alt={member.name}
              className="w-24 h-24 rounded-full object-cover"
              style={{ borderColor: primaryColor, borderWidth: '3px', borderStyle: 'solid' }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${primaryColor}40 0%, ${primaryColor}20 100%)`,
                borderColor: primaryColor,
                borderWidth: '3px',
                borderStyle: 'solid',
              }}
            >
              {initials}
            </div>
          )}

          {/* Glow effect */}
          <div
            className="absolute -inset-2 rounded-full opacity-20 blur-lg -z-10"
            style={{ backgroundColor: primaryColor }}
          />
        </div>

        {/* Name - centered below photo */}
        <div className="text-center leading-tight w-full">
          <p className="text-xl font-bold text-white truncate">
            {member.name.split(' ')[0]}
          </p>
          {member.name.split(' ').length > 1 && (
            <p className="text-base font-medium text-neutral-400 truncate">
              {member.name.split(' ').slice(1).join(' ')}
            </p>
          )}
        </div>
      </div>

      {/* Belt section - bottom of card */}
      <div className="bg-neutral-950/50 px-3 py-2.5 border-t border-neutral-800/50">
        <div className="flex flex-col gap-1.5">
          {displayBelts.map((belt) => (
            <CompactBeltRow key={belt.discipline} belt={belt} />
          ))}
        </div>
      </div>
    </div>
  );
}
