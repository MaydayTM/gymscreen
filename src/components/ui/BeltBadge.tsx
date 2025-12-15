import type { BeltRank, Discipline } from '../../types';
import { BELT_GRADIENTS, DISCIPLINE_INFO } from '../../types';

interface BeltBadgeProps {
  rank: BeltRank;
  stripes: number;
  discipline?: Discipline;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function BeltBadge({ rank, stripes, discipline, size = 'md', showLabel = false }: BeltBadgeProps) {
  const gradient = BELT_GRADIENTS[rank];

  const sizeClasses = {
    sm: 'h-3 w-20',
    md: 'h-5 w-28',
    lg: 'h-7 w-36',
  };

  const stripeSizes = {
    sm: 'w-1 h-2',
    md: 'w-1.5 h-3',
    lg: 'w-2 h-5',
  };

  const stripeGaps = {
    sm: 'gap-0.5',
    md: 'gap-0.5',
    lg: 'gap-1',
  };

  const labelSizes = {
    sm: 'text-[8px] px-1',
    md: 'text-[10px] px-1.5',
    lg: 'text-xs px-2',
  };

  // Black belt has red bar
  const isBlackBelt = rank === 'black';

  return (
    <div className="flex items-center gap-1.5">
      {/* Discipline label */}
      {showLabel && discipline && (
        <span className={`${labelSizes[size]} font-semibold text-neutral-400 uppercase tracking-wide`}>
          {DISCIPLINE_INFO[discipline].shortName}
        </span>
      )}

      <div
        className={`${sizeClasses[size]} rounded-sm relative overflow-hidden shadow-lg flex-shrink-0`}
        style={{
          background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
          boxShadow: rank === 'white'
            ? '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)'
            : '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        {/* Belt texture overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
          }}
        />

        {/* Black belt red/coral bar */}
        {isBlackBelt && (
          <div
            className="absolute right-1.5 top-0 bottom-0 w-1/4"
            style={{
              background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
            }}
          />
        )}

        {/* Stripes container */}
        <div className={`absolute ${isBlackBelt ? 'right-[28%]' : 'right-1.5'} top-1/2 -translate-y-1/2 flex ${stripeGaps[size]}`}>
          {Array.from({ length: stripes }).map((_, i) => (
            <div
              key={i}
              className={`${stripeSizes[size]} bg-white rounded-[1px] shadow-sm`}
              style={{
                boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
