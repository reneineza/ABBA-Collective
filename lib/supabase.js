import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// 1. Browser Client Instance
export function getBrowserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// 2. Server Client Instance for Server Actions / Server Components
export async function getServerClient(cookieStore) {
  if (!cookieStore) {
    const { cookies } = await import('next/headers');
    cookieStore = await cookies();
  }

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component cookie mutation guard
          }
        },
      },
    }
  );
}

// 3. Direct JavaScript Supabase Client
export const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
