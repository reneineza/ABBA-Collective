// Saved delivery addresses for signed-in customers (Supabase `addresses` table).
// Row Level Security limits every query to the signed-in user's own rows.
import { getBrowserClient } from '@/lib/supabase';

const FIELDS = ['first_name', 'last_name', 'phone', 'country', 'province', 'district', 'city', 'address_line', 'landmark'];

function pickFields(address) {
  return Object.fromEntries(FIELDS.map((field) => [field, address[field] ?? null]));
}

export async function listAddresses() {
  const supabase = getBrowserClient();
  const { data, error } = await supabase
    .from('addresses')
    .select('*')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

// Inserts a new address, or updates one when `id` is given. The first saved address becomes the default.
export async function saveAddress(userId, address, id = null) {
  const supabase = getBrowserClient();
  if (id) {
    const { data, error } = await supabase.from('addresses').update(pickFields(address)).eq('id', id).select().single();
    if (error) throw error;
    return data;
  }

  const { count } = await supabase.from('addresses').select('id', { count: 'exact', head: true });
  const { data, error } = await supabase
    .from('addresses')
    .insert({ ...pickFields(address), user_id: userId, is_default: !count })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAddress(id) {
  const supabase = getBrowserClient();
  const { error } = await supabase.from('addresses').delete().eq('id', id);
  if (error) throw error;
}

export async function setDefaultAddress(userId, id) {
  const supabase = getBrowserClient();
  const { error: clearError } = await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
  if (clearError) throw clearError;
  const { error } = await supabase.from('addresses').update({ is_default: true }).eq('id', id);
  if (error) throw error;
}
