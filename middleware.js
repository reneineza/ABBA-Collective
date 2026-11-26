import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Server-side access control: runs before protected pages render, so signed-out
// visitors and non-admins never receive their content. It also refreshes the
// Supabase session cookie when needed.
export async function middleware(request) {
  let response = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const supabase = supabaseUrl && supabaseKey && createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  // getUser() verifies the session with Supabase rather than trusting the cookie.
  // Without Supabase configured, everyone is treated as signed out (access denied).
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const { pathname, search } = request.nextUrl;

  const redirectTo = (path, params = {}) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = new URLSearchParams(params).toString();
    const redirect = NextResponse.redirect(url);
    // Keep any refreshed session cookies on the redirect
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return response;
    if (!user) return redirectTo('/admin/login');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return redirectTo('/admin/login');
    return response;
  }

  if (pathname.startsWith('/account')) {
    if (!user) return redirectTo('/login', { next: pathname + search });
    return response;
  }

  // Signed-in customers don't need the sign-in or registration pages
  if ((pathname === '/login' || pathname === '/register') && user) {
    return redirectTo('/account');
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/login', '/register'],
};
