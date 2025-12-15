import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface ClassSchedule {
  id: string;
  name: string;
  startTime: string; // HH:MM format
  endTime: string;
  room?: string;
  discipline: {
    name: string;
    color: string;
  };
  coach?: {
    name: string;
  };
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
}

// Get day name in Dutch
export function getDayName(dayOfWeek: number): string {
  const days = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  return days[dayOfWeek] ?? '';
}

// Format time from HH:MM:SS to HH:MM
function formatTime(time: string): string {
  return time.slice(0, 5);
}

export function useClasses(dayOfWeek?: number) {
  return useQuery({
    queryKey: ['classes', dayOfWeek],
    queryFn: async (): Promise<ClassSchedule[]> => {
      let query = supabase
        .from('classes')
        .select(`
          id,
          name,
          start_time,
          end_time,
          room,
          day_of_week,
          disciplines:discipline_id (
            name,
            color
          ),
          coach:coach_id (
            first_name,
            last_name
          )
        `)
        .eq('is_active', true)
        .order('start_time');

      if (dayOfWeek !== undefined) {
        query = query.eq('day_of_week', dayOfWeek);
      } else {
        query = query.order('day_of_week');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching classes:', error);
        throw error;
      }

      if (!data) return [];

      return data.map((row): ClassSchedule => {
        const rawDiscipline = row.disciplines as unknown;
        const rawCoach = row.coach as unknown;

        // Supabase returns single object for :discipline_id join
        const discipline = rawDiscipline as { name: string; color: string } | null;
        const coach = rawCoach as { first_name: string; last_name: string } | null;

        return {
          id: row.id,
          name: row.name,
          startTime: formatTime(row.start_time),
          endTime: formatTime(row.end_time),
          room: row.room ?? undefined,
          dayOfWeek: row.day_of_week,
          discipline: discipline ?? { name: 'Unknown', color: '#6B7280' },
          coach: coach ? { name: `${coach.first_name} ${coach.last_name}` } : undefined,
        };
      });
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

// Hook to get today's classes
export function useTodayClasses() {
  const today = new Date().getDay(); // 0 = Sunday
  return useClasses(today);
}

// Hook to get classes for multiple days (for weekly view)
export function useWeeklyClasses() {
  return useClasses(); // Gets all classes
}
