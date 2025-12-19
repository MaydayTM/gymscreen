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
      className="relative bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center gap-3 border border-neutral-800/50 transition-all duration-300"
      style={{
        boxShadow: `0 0 40px -10px ${primaryColor}40`,
      }}
    >
      {/* Role badge - top right */}
      {roleInfo && (
        <div
          className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg"
          style={{
            backgroundColor: roleInfo.color,
            color: roleInfo.textColor,
          }}
        >
          {roleInfo.label}
        </div>
      )}

      {/* Avatar - larger for TV visibility */}
      <div className="relative">
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.name}
            className="w-24 h-24 rounded-full object-cover border-3"
            style={{ borderColor: primaryColor, borderWidth: '3px' }}
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

        {/* Belt color ring accent */}
        <div
          className="absolute -inset-1 rounded-full opacity-25 blur-md -z-10"
          style={{ backgroundColor: primaryColor }}
        />
      </div>

      {/* Name - larger text for TV */}
      <h3 className="text-lg font-semibold text-white text-center leading-tight">
        {member.name}
      </h3>

      {/* Belt Badges - stacked vertically, medium size for visibility */}
      <div className="flex flex-col gap-2 items-center">
        {displayBelts.map((belt) => (
          <BeltBadge
            key={belt.discipline}
            rank={belt.rank}
            stripes={belt.stripes}
            discipline={belt.discipline}
            size="md"
            showDiscipline={true}
          />
        ))}
      </div>
    </div>
  );
}
