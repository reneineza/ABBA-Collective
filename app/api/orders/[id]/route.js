import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isStaffRole } from '@/lib/roles';

// Returns one order to whoever is allowed to see it: the customer who placed it,
// an admin, or anyone holding the private receipt token (guest checkout).
export async function GET(request, { params }) {
  const { id } = await params;
  const token = new URL(request.url).searchParams.get('token');
  const notFound = NextResponse.json({ error: 'Order not found.' }, { status: 404 });

  if (!/^[0-9a-f-]{36}$/i.test(id)) return notFound;

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json({ error: 'Orders are temporarily unavailable.' }, { status: 503 });
  }

  const { data: order } = await admin.from('orders').select('*').eq('id', id).maybeSingle();
  if (!order) return notFound;

  let allowed = Boolean(token && order.receipt_token && token === order.receipt_token);
  if (!allowed) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user && order.user_id === user.id) {
      allowed = true;
    } else if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      allowed = isStaffRole(profile?.role);
    }
  }
  if (!allowed) return notFound;

  const { receipt_token, ...publicOrder } = order;
  return NextResponse.json({ order: publicOrder });
}
