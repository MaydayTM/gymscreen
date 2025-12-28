import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface BirthdayMember {
  id: string;
  name: string;
  photo_url?: string;
  age: number;
  birthdayDate: Date;
  daysUntil: number; // 0 = today, 1 = tomorrow, etc.
}

export interface BirthdayData {
  today: BirthdayMember[];
  upcoming: BirthdayMember[];
  recent: BirthdayMember[];
}

// Calculate days until birthday (0 = today)
function getDaysUntilBirthday(dob: Date, today: Date): number {
  const thisYearBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

  // If birthday already passed this year, use next year
  if (thisYearBirthday < today && !isSameDay(thisYearBirthday, today)) {
    thisYearBirthday.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = thisYearBirthday.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays < 0 ? 0 : diffDays;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

// Calculate age (will be this age on their birthday this year)
function calculateAge(dob: Date, referenceDate: Date): number {
  let age = referenceDate.getFullYear() - dob.getFullYear();
  const monthDiff = referenceDate.getMonth() - dob.getMonth();

  // If birthday hasn't happened yet this year on the reference date
  if (monthDiff < 0 || (monthDiff === 0 && referenceDate.getDate() < dob.getDate())) {
    age--;
  }

  // Return the age they will turn (not current age)
  return age + 1;
}

export function useBirthdays(upcomingDays: number = 7, recentDays: number = 3) {
  return useQuery({
    queryKey: ['birthdays', upcomingDays, recentDays],
    queryFn: async (): Promise<BirthdayData> => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Query members with birthdays
      const { data, error } = await supabase
        .from('members')
        .select('id, first_name, last_name, profile_picture_url, date_of_birth')
        .eq('status', 'active')
        .not('date_of_birth', 'is', null);

      if (error) {
        console.error('Error fetching birthdays:', error);
        throw error;
      }

      console.log('Birthday query result:', { count: data?.length, sample: data?.slice(0, 2) });

      if (!data) return { today: [], upcoming: [], recent: [] };

      const todayMembers: BirthdayMember[] = [];
      const upcomingMembers: BirthdayMember[] = [];
      const recentMembers: BirthdayMember[] = [];

      for (const member of data) {
        if (!member.date_of_birth) continue;

        const dob = new Date(member.date_of_birth);
        const daysUntil = getDaysUntilBirthday(dob, today);

        // Calculate birthday date for this year
        const birthdayThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

        const birthdayMember: BirthdayMember = {
          id: String(member.id),
          name: `${member.first_name} ${member.last_name}`,
          photo_url: member.profile_picture_url || undefined,
          age: calculateAge(dob, birthdayThisYear),
          birthdayDate: birthdayThisYear,
          daysUntil,
        };

        // Categorize
        if (isSameDay(dob, today)) {
          todayMembers.push(birthdayMember);
        } else if (daysUntil > 0 && daysUntil <= upcomingDays) {
          upcomingMembers.push(birthdayMember);
        } else {
          // Check if birthday was recently (in the past X days)
          const birthdayThisYearDate = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
          const birthdayPassed = birthdayThisYearDate < today;
          const daysAgo = Math.floor((today.getTime() - birthdayThisYearDate.getTime()) / (1000 * 60 * 60 * 24));

          if (birthdayPassed && daysAgo > 0 && daysAgo <= recentDays) {
            birthdayMember.daysUntil = -daysAgo; // Negative = days ago
            recentMembers.push(birthdayMember);
          }
        }
      }

      // Sort upcoming by days until birthday
      upcomingMembers.sort((a, b) => a.daysUntil - b.daysUntil);

      // Sort recent by most recent first
      recentMembers.sort((a, b) => b.daysUntil - a.daysUntil);

      console.log('Processed birthdays:', {
        today: todayMembers.map(m => m.name),
        upcoming: upcomingMembers.map(m => `${m.name} (${m.daysUntil}d)`),
        recent: recentMembers.map(m => `${m.name} (${m.daysUntil}d ago)`),
      });

      return {
        today: todayMembers,
        upcoming: upcomingMembers,
        recent: recentMembers,
      };
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  });
}

// Legacy hook for backwards compatibility
export function useTodaysBirthdays() {
  const { data, ...rest } = useBirthdays();
  return {
    ...rest,
    data: data?.today ?? [],
  };
}
