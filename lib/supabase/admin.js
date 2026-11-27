import { createClient } from '@supabase/supabase-js';

// Supabase client with the secret key: bypasses Row Level Security. Only import this
// from server code (route handlers); never from components that run in the browser.
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('createAdminClient must only be used on the server');
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secretKey) {
    throw new Error('Supabase is not configured on the server (SUPABASE_SECRET_KEY missing)');
  }
  return createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
