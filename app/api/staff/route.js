import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { OWNER_ROLE } from '@/lib/roles';

// Owner-only staff management that needs the secret key:
//   { action: 'add', email, fullName, role }  gives an account a staff role, creating the
//     account first if needed, and returns a one-time link for them to choose a password
//   { action: 'link', userId }                returns a fresh password-setup link
// Links are returned to the owner to pass on (e.g. by WhatsApp); no email is sent.
const fail = (message, status = 400) => NextResponse.json({ error: message }, { status });

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setupLink(origin, properties) {
  const params = new URLSearchParams({
    token_hash: properties.hashed_token,
    type: properties.verification_type,
    next: '/reset-password',
  });
  return `${origin}/auth/callback?${params}`;
}

export async function POST(request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return fail('Please sign in again.', 401);
  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (me?.role !== OWNER_ROLE) return fail('Only the owner can manage staff.', 403);

  let body;
  try {
    body = await request.json();
  } catch {
    return fail('Invalid request.');
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (err) {
    return fail(err.message, 500);
  }
  const origin = new URL(request.url).origin;

  if (body.action === 'link') {
    const { data: member } = await admin.from('profiles').select('id, email, role').eq('id', body.userId).maybeSingle();
    if (!member?.email) return fail('Staff member not found.', 404);
    const { data, error } = await admin.auth.admin.generateLink({ type: 'recovery', email: member.email });
    if (error) return fail('Could not create the link: ' + error.message, 500);
    return NextResponse.json({ link: setupLink(origin, data.properties) });
  }

  if (body.action !== 'add') return fail('Unknown action.');

  const email = String(body.email || '').trim().toLowerCase();
  const fullName = String(body.fullName || '').trim().slice(0, 120);
  if (!EMAIL_PATTERN.test(email)) return fail('Enter a valid email address.');

  const { data: role } = await admin.from('roles').select('key, name, is_staff').eq('key', body.role).maybeSingle();
  if (!role?.is_staff) return fail('Choose a staff role.');

  let { data: account } = await admin.from('profiles').select('id, full_name').eq('email', email).maybeSingle();
  if (account?.id === user.id) return fail('You cannot change your own role.');

  let link = null;
  if (!account) {
    // Creates the account (the database trigger creates its profile) without sending an email
    const { data, error } = await admin.auth.admin.generateLink({
      type: 'invite',
      email,
      options: { data: { full_name: fullName } },
    });
    if (error) return fail('Could not create the account: ' + error.message, 500);
    link = setupLink(origin, data.properties);
    account = { id: data.user.id, full_name: fullName };
  }

  const changes = { role: role.key };
  if (fullName && !account.full_name) changes.full_name = fullName;
  const { error: roleError } = await admin.from('profiles').update(changes).eq('id', account.id);
  if (roleError) return fail('Could not set the role: ' + roleError.message, 500);

  return NextResponse.json({ created: Boolean(link), link, name: account.full_name || fullName || email, roleName: role.name });
}
