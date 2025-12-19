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
      className="relative bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-4 flex flex-row items-center gap-5 border border-neutral-800/50 transition-all duration-300 w-full h-full"
      style={{
        boxShadow: `0 0 40px -10px ${primaryColor}40`,
      }}
    >
      {/* Role badge - top right */}
      {roleInfo && (
        <div
          className="absolute -top-3 -right-3 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg"
          style={{
            backgroundColor: roleInfo.color,
            color: roleInfo.textColor,
          }}
        >
          {roleInfo.label}
        </div>
      )}

      {/* Avatar - much larger for TV visibility */}
      <div className="relative flex-shrink-0">
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.name}
            className="w-28 h-28 rounded-full object-cover"
            style={{ borderColor: primaryColor, borderWidth: '4px', borderStyle: 'solid' }}
          />
        ) : (
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}40 0%, ${primaryColor}20 100%)`,
              borderColor: primaryColor,
              borderWidth: '4px',
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

      {/* Name and Belts - right side */}
      <div className="flex flex-col justify-center gap-2 min-w-0 flex-1">
        {/* Name - larger text for TV */}
        <div className="leading-tight">
          <p className="text-2xl font-bold text-white truncate">
            {member.name.split(' ')[0]}
          </p>
          {member.name.split(' ').length > 1 && (
            <p className="text-lg font-medium text-neutral-400 truncate">
              {member.name.split(' ').slice(1).join(' ')}
            </p>
          )}
        </div>

        {/* Belt Badges - horizontal layout */}
        <div className="flex flex-col gap-1.5">
          {displayBelts.map((belt) => (
            <BeltBadge
              key={belt.discipline}
              rank={belt.rank}
              stripes={belt.stripes}
              discipline={belt.discipline}
              size="lg"
              showDiscipline={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
