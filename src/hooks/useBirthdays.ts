import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface BirthdayMember {
  id: string;
  name: string;
  photo_url?: string;
  age: number;
}

export function useTodaysBirthdays() {
  return useQuery({
    queryKey: ['todays-birthdays'],
    queryFn: async (): Promise<BirthdayMember[]> => {
      // Get today's month and day
      const today = new Date();
      const month = today.getMonth() + 1; // JS months are 0-indexed
      const day = today.getDate();

      // Query members with birthday today
      // date_of_birth format in Supabase is typically YYYY-MM-DD
      const { data, error } = await supabase
        .from('members')
        .select('id, first_name, last_name, profile_picture_url, date_of_birth')
        .eq('status', 'active')
        .not('date_of_birth', 'is', null);

      if (error) {
        console.error('Error fetching birthdays:', error);
        throw error;
      }

      if (!data) return [];

      // Filter members whose birthday is today
      const birthdayMembers = data.filter((member) => {
        if (!member.date_of_birth) return false;
        const dob = new Date(member.date_of_birth);
        return dob.getMonth() + 1 === month && dob.getDate() === day;
      });

      // Transform to BirthdayMember format
      return birthdayMembers.map((member) => {
        const dob = new Date(member.date_of_birth);
        const age = today.getFullYear() - dob.getFullYear();

        return {
          id: String(member.id),
          name: `${member.first_name} ${member.last_name}`,
          photo_url: member.profile_picture_url || undefined,
          age,
        };
      });
    },
    staleTime: 60 * 60 * 1000, // 1 hour - birthdays don't change often
    refetchInterval: 60 * 60 * 1000, // Refetch every hour
  });
}
