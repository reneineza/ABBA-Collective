// Orders for the signed-in customer, newest first. Row Level Security returns
// only the customer's own orders.
import { getBrowserClient } from '@/lib/supabase';

export async function listMyOrders() {
  const supabase = getBrowserClient();
  const { data, error } = await supabase
    .from('orders')
    .select('id, status, total_amount, items, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
