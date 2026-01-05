import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface Announcement {
  id: string;
  type: 'hero' | 'promo' | 'info' | 'event';
  title: string;
  subtitle?: string;
  badge?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ['announcements'],
    queryFn: async (): Promise<Announcement[]> => {
      // Fetch active hero and promo banners
      const { data, error } = await supabase
        .from('shop_banners')
        .select('*')
        .in('type', ['hero', 'promo'])
        .eq('is_active', true)
        .order('position');

      if (error) {
        console.error('Error fetching announcements:', error);
        throw error;
      }

      if (!data) return [];

      const announcements = data
        .map((row): Announcement => ({
          id: row.id,
          type: row.type as 'hero' | 'promo',
          title: row.title ?? '',
          subtitle: row.subtitle ?? undefined,
          badge: row.badge_text ?? undefined,
          imageUrl: row.image_url ?? undefined,
          backgroundColor: row.background_color ?? '#1a1a1a',
          textColor: row.text_color ?? '#ffffff',
        }))
        // Filter out empty banners (must have either image or title)
        .filter(a => a.imageUrl || a.title.trim() !== '');

      // Limit to max 2 hero banners and max 2 promo banners
      const heroBanners = announcements.filter(a => a.type === 'hero').slice(0, 2);
      const promoBanners = announcements.filter(a => a.type === 'promo').slice(0, 2);

      // Return max 4 total banners (2 hero + 2 promo)
      return [...heroBanners, ...promoBanners].slice(0, 4);
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}
