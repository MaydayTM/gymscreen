import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface GymScreenSlide {
  id: string;
  image_url: string;
  title: string | null;
  caption: string | null;
  category: 'event' | 'training' | 'community' | 'achievement' | 'promo' | 'announcement';
  display_duration: number;
  sort_order: number;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export function useSlides(activeOnly = true) {
  return useQuery({
    queryKey: ['gymscreen-slides', activeOnly],
    queryFn: async (): Promise<GymScreenSlide[]> => {
      let query = supabase
        .from('gymscreen_slides')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (activeOnly) {
        query = query.eq('is_active', true);

        // Also filter by date range if applicable
        const today = new Date().toISOString().split('T')[0];
        query = query
          .or(`start_date.is.null,start_date.lte.${today}`)
          .or(`end_date.is.null,end_date.gte.${today}`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching slides:', error);
        throw error;
      }

      return (data || []) as GymScreenSlide[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
}
