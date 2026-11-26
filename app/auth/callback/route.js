import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Landing point for Supabase email links (sign-up confirmation, password reset).
// Supports both the default `?code=` links and `?token_hash=&type=` links from
// customised email templates, then forwards to `next` on this site.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const nextParam = searchParams.get('next') || '/account';
  // Only allow redirects within this site
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/account';

  const supabase = await createClient();
  let error = null;

  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type }));
  } else {
    error = { message: 'missing code' };
  }

  if (error) {
    const reason = next === '/reset-password' ? 'reset-link' : 'confirm-link';
    return NextResponse.redirect(`${origin}/login?error=${reason}`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
