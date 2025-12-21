import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const TENANT_ID = 'reconnect';

export interface GymScreenSettings {
  id: string;
  tenant_id: string;
  show_belt_wall: boolean;
  show_slideshow: boolean;
  show_birthdays: boolean;
  show_shop_banners: boolean;
  show_announcements: boolean;
  slideshow_interval: number;
  section_rotation_interval: number;
  birthday_display_days: number;
  section_order: string[];
  theme: 'dark' | 'light' | 'brand';
  show_clock: boolean;
  show_logo: boolean;
  logo_url: string | null;
  api_key: string | null;
  created_at: string;
  updated_at: string;
}

// Default settings when none exist in database
const DEFAULT_SETTINGS: Omit<GymScreenSettings, 'id' | 'tenant_id' | 'created_at' | 'updated_at' | 'api_key'> = {
  show_belt_wall: true,
  show_slideshow: true,
  show_birthdays: true,
  show_shop_banners: false,
  show_announcements: true,
  slideshow_interval: 5,
  section_rotation_interval: 30,
  birthday_display_days: 0,
  section_order: ['birthdays', 'belt_wall', 'slideshow', 'announcements'],
  theme: 'dark',
  show_clock: false,
  show_logo: true,
  logo_url: null,
};

export function useGymScreenSettings() {
  return useQuery({
    queryKey: ['gymscreen-settings'],
    queryFn: async (): Promise<GymScreenSettings | null> => {
      const { data, error } = await supabase
        .from('gymscreen_settings')
        .select('*')
        .eq('tenant_id', TENANT_ID)
        .single();

      if (error) {
        // If no settings exist yet, return defaults
        if (error.code === 'PGRST116') {
          console.log('No gymscreen settings found, using defaults');
          return null;
        }
        console.error('Error fetching gymscreen settings:', error);
        throw error;
      }

      return data as GymScreenSettings;
    },
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Refetch every minute for live updates
  });
}

// Helper to get effective settings (with defaults applied)
export function getEffectiveSettings(settings: GymScreenSettings | null | undefined): typeof DEFAULT_SETTINGS {
  if (!settings) return DEFAULT_SETTINGS;

  return {
    show_belt_wall: settings.show_belt_wall ?? DEFAULT_SETTINGS.show_belt_wall,
    show_slideshow: settings.show_slideshow ?? DEFAULT_SETTINGS.show_slideshow,
    show_birthdays: settings.show_birthdays ?? DEFAULT_SETTINGS.show_birthdays,
    show_shop_banners: settings.show_shop_banners ?? DEFAULT_SETTINGS.show_shop_banners,
    show_announcements: settings.show_announcements ?? DEFAULT_SETTINGS.show_announcements,
    slideshow_interval: settings.slideshow_interval ?? DEFAULT_SETTINGS.slideshow_interval,
    section_rotation_interval: settings.section_rotation_interval ?? DEFAULT_SETTINGS.section_rotation_interval,
    birthday_display_days: settings.birthday_display_days ?? DEFAULT_SETTINGS.birthday_display_days,
    section_order: settings.section_order ?? DEFAULT_SETTINGS.section_order,
    theme: settings.theme ?? DEFAULT_SETTINGS.theme,
    show_clock: settings.show_clock ?? DEFAULT_SETTINGS.show_clock,
    show_logo: settings.show_logo ?? DEFAULT_SETTINGS.show_logo,
    logo_url: settings.logo_url ?? DEFAULT_SETTINGS.logo_url,
  };
}
