import type { Member, BeltProgress } from '../../types';
import { BELT_COLORS, BELT_ORDER, ROLE_DISPLAY } from '../../types';
import { BeltBadge } from './BeltBadge';

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
      className="relative bg-neutral-900/80 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center gap-2 border border-neutral-800/50 transition-all duration-300"
      style={{
        boxShadow: `0 0 30px -10px ${primaryColor}33`,
      }}
    >
      {/* Role badge - top right */}
      {roleInfo && (
        <div
          className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-lg"
          style={{
            backgroundColor: roleInfo.color,
            color: roleInfo.textColor,
          }}
        >
          {roleInfo.label}
        </div>
      )}

      {/* Avatar */}
      <div className="relative">
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.name}
            className="w-14 h-14 rounded-full object-cover border-2"
            style={{ borderColor: primaryColor }}
          />
        ) : (
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold text-white border-2"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}40 0%, ${primaryColor}20 100%)`,
              borderColor: primaryColor,
            }}
          >
            {initials}
          </div>
        )}

        {/* Belt color ring accent */}
        <div
          className="absolute -inset-0.5 rounded-full opacity-20 blur-sm -z-10"
          style={{ backgroundColor: primaryColor }}
        />
      </div>

      {/* Name */}
      <h3 className="text-sm font-semibold text-white text-center leading-tight">
        {member.name}
      </h3>

      {/* Belt Badges - stacked vertically */}
      <div className="flex flex-col gap-2 items-center">
        {displayBelts.map((belt) => (
          <BeltBadge
            key={belt.discipline}
            rank={belt.rank}
            stripes={belt.stripes}
            discipline={belt.discipline}
            size="sm"
            showDiscipline={true}
          />
        ))}
      </div>
    </div>
  );
}
