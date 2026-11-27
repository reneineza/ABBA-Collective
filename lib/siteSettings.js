// Site-wide settings edited on the admin Marketing page (`site_settings` table).
import { getBrowserClient } from '@/lib/supabase';

export const DEFAULT_SETTINGS = {
  announcement: { active: true, text: 'Identity Received. Grace Revealed.' },
  featured_collection: 'adoption',
};

export async function getSettings() {
  const { data, error } = await getBrowserClient().from('site_settings').select('key, value');
  if (error) throw error;
  return { ...DEFAULT_SETTINGS, ...Object.fromEntries(data.map((row) => [row.key, row.value])) };
}

export async function saveSettings(settings) {
  const rows = Object.entries(settings).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));
  const { error } = await getBrowserClient().from('site_settings').upsert(rows);
  if (error) throw error;
}
