import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import type { Member, BeltProgress, Discipline, BeltRank, MemberRole } from '../types';

// Map database discipline slugs to our Discipline type
function mapDiscipline(slug: string): Discipline | null {
  const mapping: Record<string, Discipline> = {
    'bjj': 'bjj',
    'luta-livre': 'luta-livre',
    'muay-thai': 'muay-thai',
    'kids-bjj': 'bjj', // Kids BJJ counts as BJJ
  };
  return mapping[slug] ?? null;
}

// Map database belt colors to our BeltRank type
function mapBeltRank(color: string): BeltRank {
  const mapping: Record<string, BeltRank> = {
    'white': 'white',
    'yellow': 'yellow',
    'orange': 'orange',
    'green': 'green',
    'blue': 'blue',
    'purple': 'purple',
    'brown': 'brown',
    'black': 'black',
  };
  return mapping[color] ?? 'white';
}

// Map database role to our MemberRole type
function mapRole(role: string): MemberRole | undefined {
  const validRoles: MemberRole[] = ['admin', 'medewerker', 'coordinator', 'coach', 'fighter', 'fan'];
  return validRoles.includes(role as MemberRole) ? (role as MemberRole) : undefined;
}

// Transform raw database result to our Member type
function transformMember(raw: Record<string, unknown>): Member {
  const belts: BeltProgress[] = [];

  const memberBelts = raw.member_belts as Array<Record<string, unknown>> | null;
  if (memberBelts) {
    for (const belt of memberBelts) {
      // Supabase returns the joined discipline as an object (not array) when using :discipline_id
      const disciplines = belt.disciplines as Record<string, unknown> | null;
      if (disciplines && typeof disciplines.slug === 'string') {
        const discipline = mapDiscipline(disciplines.slug);
        if (discipline) {
          belts.push({
            discipline,
            rank: mapBeltRank(String(belt.belt_color ?? 'white')),
            stripes: Number(belt.stripes ?? 0),
          });
        }
      }
    }
  }

  return {
    id: String(raw.id),
    name: `${raw.first_name} ${raw.last_name}`,
    photo_url: raw.profile_picture_url ? String(raw.profile_picture_url) : undefined,
    role: raw.role ? mapRole(String(raw.role)) : undefined,
    belts,
  };
}

export function useMembers() {
  return useQuery({
    queryKey: ['members-with-belts'],
    queryFn: async (): Promise<Member[]> => {
      // SECURITY: Alleen publieke velden ophalen - GEEN PII!
      // Toegestane velden: id, first_name, last_name, profile_picture_url, role, status
      // VERBODEN (PII): email, phone, date_of_birth, address, bank details, national_id, notes
      const { data, error } = await supabase
        .from('members')
        .select(`
          id,
          first_name,
          last_name,
          profile_picture_url,
          role,
          member_belts (
            belt_color,
            stripes,
            disciplines:discipline_id (
              slug,
              name
            )
          )
        `)
        .eq('status', 'active')
        .order('last_name');

      if (error) {
        console.error('Error fetching members:', error);
        throw error;
      }

      if (!data) return [];

      // Log raw data for debugging
      console.log('Raw members data:', data);

      // Filter to only members with at least one belt
      const membersWithBelts = data
        .map((row) => transformMember(row as Record<string, unknown>))
        .filter((m) => m.belts.length > 0);

      console.log('Transformed members:', membersWithBelts);

      return membersWithBelts;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for TV display
  });
}
