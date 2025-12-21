// Disciplines offered at the gym
export type Discipline = 'bjj' | 'luta-livre' | 'muay-thai';

// Belt ranks - same system for BJJ and Luta Livre
// Adults: white → blue → purple → brown → black
// Youth (-18): white → yellow → orange → green → blue → purple → brown → black
export type BeltRank =
  | 'white'
  | 'yellow'   // Youth only
  | 'orange'   // Youth only
  | 'green'    // Youth only
  | 'blue'
  | 'purple'
  | 'brown'
  | 'black';

// Belt progress for a specific discipline
export interface BeltProgress {
  discipline: Discipline;
  rank: BeltRank;
  stripes: number; // 0-4
}

// Member roles from CRM
export type MemberRole = 'admin' | 'medewerker' | 'coordinator' | 'coach' | 'fighter' | 'fan';

// Role display configuration
// Coach = amber/oranje, Fighter = lichtere geel-oranje tint (visueel coherent)
export const ROLE_DISPLAY: Record<MemberRole, { label: string; color: string; textColor: string }> = {
  'admin': { label: 'Admin', color: '#DC2626', textColor: '#FFFFFF' },
  'medewerker': { label: 'Staff', color: '#7C3AED', textColor: '#FFFFFF' },
  'coordinator': { label: 'Coordinator', color: '#2563EB', textColor: '#FFFFFF' },
  'coach': { label: 'Coach', color: '#F59E0B', textColor: '#1C1917' },
  'fighter': { label: 'Fighter', color: '#FBBF24', textColor: '#1C1917' },
  'fan': { label: 'Fan', color: '#6B7280', textColor: '#FFFFFF' },
} as const;

export interface Member {
  id: string;
  name: string;
  photo_url?: string;
  belts: BeltProgress[]; // Max 2-3 disciplines
  role?: MemberRole;
  joined_at?: string;
  gym_id?: string;
}

// Discipline display info
export const DISCIPLINE_INFO: Record<Discipline, { name: string; shortName: string }> = {
  'bjj': { name: 'Brazilian Jiu-Jitsu', shortName: 'BJJ' },
  'luta-livre': { name: 'Luta Livre', shortName: 'LL' },
  'muay-thai': { name: 'Muay Thai', shortName: 'MT' },
} as const;

// Belt color mapping
export const BELT_COLORS: Record<BeltRank, string> = {
  white: '#F5F5F5',
  yellow: '#EAB308',
  orange: '#EA580C',
  green: '#16A34A',
  blue: '#1E40AF',
  purple: '#7C3AED',
  brown: '#92400E',
  black: '#1C1917',
} as const;

// Belt gradient colors for visual depth
export const BELT_GRADIENTS: Record<BeltRank, { from: string; to: string }> = {
  white: { from: '#FFFFFF', to: '#E5E5E5' },
  yellow: { from: '#FACC15', to: '#CA8A04' },
  orange: { from: '#FB923C', to: '#C2410C' },
  green: { from: '#22C55E', to: '#15803D' },
  blue: { from: '#2563EB', to: '#1E40AF' },
  purple: { from: '#8B5CF6', to: '#6D28D9' },
  brown: { from: '#A16207', to: '#78350F' },
  black: { from: '#292524', to: '#0C0A09' },
} as const;

// Belt rank order for sorting (lower = higher rank)
export const BELT_ORDER: Record<BeltRank, number> = {
  black: 0,
  brown: 1,
  purple: 2,
  blue: 3,
  green: 4,
  orange: 5,
  yellow: 6,
  white: 7,
} as const;

// Display/Signage types (for future use)
export interface SignageDisplay {
  id: string;
  gym_id: string;
  name: string;
  access_token: string;
  settings: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SignageSlide {
  id: string;
  gym_id: string;
  display_id?: string;
  type: 'belt_wall' | 'competitor_spotlight' | 'photo_carousel' | 'news' | 'schedule' | 'timer' | 'quote';
  title?: string;
  content: Record<string, unknown>;
  duration_seconds: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
