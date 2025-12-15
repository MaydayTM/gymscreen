import type { BeltRank, Discipline } from '../../types';
import { BELT_GRADIENTS, DISCIPLINE_INFO } from '../../types';

interface BeltBadgeProps {
  rank: BeltRank;
  stripes: number;
  discipline?: Discipline;
  size?: 'sm' | 'md' | 'lg';
  showDiscipline?: boolean;
}

export function BeltBadge({ rank, stripes, discipline, size = 'md', showDiscipline = true }: BeltBadgeProps) {
  const gradient = BELT_GRADIENTS[rank];

  const sizeClasses = {
    sm: 'h-3.5 w-24',
    md: 'h-5 w-32',
    lg: 'h-7 w-40',
  };

  const stripeSizes = {
    sm: 'w-1 h-2.5',
    md: 'w-1.5 h-3.5',
    lg: 'w-2 h-5',
  };

  const stripeGaps = {
    sm: 'gap-px',
    md: 'gap-0.5',
    lg: 'gap-1',
  };

  const tipWidths = {
    sm: 'w-5',
    md: 'w-7',
    lg: 'w-9',
  };

  const textSizes = {
    sm: 'text-[7px]',
    md: 'text-[9px]',
    lg: 'text-xs',
  };

  // Black belt has RED tip, all other belts have BLACK tip
  const isBlackBelt = rank === 'black';
  const tipColor = isBlackBelt
    ? 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)'
    : 'linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)';

  // Get discipline display name
  const disciplineName = discipline ? DISCIPLINE_INFO[discipline].shortName : '';

  return (
    <div className="flex flex-col items-start gap-0.5">
      {/* Belt visual */}
      <div
        className={`${sizeClasses[size]} rounded-sm relative overflow-hidden shadow-lg flex-shrink-0`}
        style={{
          background: `linear-gradient(180deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
          boxShadow: rank === 'white'
            ? '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)'
            : '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        {/* Belt texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)',
          }}
        />

        {/* Tip (black for colored belts, red for black belt) */}
        <div
          className={`absolute right-0 top-0 bottom-0 ${tipWidths[size]}`}
          style={{ background: tipColor }}
        />

        {/* Stripes on the tip */}
        <div className={`absolute right-1 top-1/2 -translate-y-1/2 flex ${stripeGaps[size]}`}>
          {Array.from({ length: Math.min(stripes, 4) }).map((_, i) => (
            <div
              key={i}
              className={`${stripeSizes[size]} bg-white rounded-[1px]`}
              style={{
                boxShadow: '0 1px 2px rgba(0,0,0,0.4)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Discipline + Belt name below */}
      {showDiscipline && discipline && (
        <span className={`${textSizes[size]} text-neutral-400 font-medium uppercase tracking-wider`}>
          {disciplineName} {rank}
        </span>
      )}
    </div>
  );
}
