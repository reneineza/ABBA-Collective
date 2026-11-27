// Back-office stock operations. The database functions check the caller's role and log
// every change in stock_movements; costs are only readable by the owner and accountant.
import { getBrowserClient } from '@/lib/supabase';

export const STOCK_REASONS = {
  purchase: 'Delivery received',
  purchase_deleted: 'Delivery deleted',
  online_order: 'Website order',
  order_cancelled: 'Order cancelled',
  checkout_failed: 'Checkout failed (returned)',
  store_sale: 'In-store sale',
  store_sale_deleted: 'In-store sale deleted',
  adjustment: 'Adjustment',
  manual_edit: 'Edited on product form',
  opening_stock: 'Opening stock',
};

export const PAYMENT_METHODS = ['Cash', 'MTN MoMo', 'Airtel Money', 'Card', 'Bank Transfer'];

function friendly(error) {
  // Database exceptions carry a readable message; strip Postgres prefixes if present
  return new Error((error?.message || 'Something went wrong').replace(/^.*?ERROR:\s*/, ''));
}

export async function recordDelivery({ supplier, purchasedOn, reference, paymentMethod, notes, items }) {
  const { data, error } = await getBrowserClient().rpc('record_stock_purchase', {
    supplier,
    purchased_on: purchasedOn,
    reference,
    payment_method: paymentMethod,
    notes,
    items: items.map((i) => ({
      variant_id: i.variantId,
      quantity: Number(i.quantity),
      unit_cost: i.unitCost === '' || i.unitCost == null ? null : Number(i.unitCost),
    })),
  });
  if (error) throw friendly(error);
  return data;
}

export async function adjustStock(variantId, change, note) {
  const { error } = await getBrowserClient().rpc('adjust_stock', { variant: variantId, change, note });
  if (error) throw friendly(error);
}

export async function setItemCost(itemId, unitCost) {
  const { error } = await getBrowserClient().rpc('set_purchase_item_cost', { item_id: itemId, unit_cost: unitCost });
  if (error) throw friendly(error);
}

export async function deleteDelivery(purchaseId) {
  const { error } = await getBrowserClient().rpc('delete_stock_purchase', { purchase: purchaseId });
  if (error) throw friendly(error);
}

export async function listMovements(limit = 200) {
  const { data, error } = await getBrowserClient()
    .from('stock_movements')
    .select('id, variant_id, product_name, color, size, change, stock_after, reason, reference_id, note, created_at, created_by:profiles (full_name, email)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw friendly(error);
  return data;
}

// Owner and accountant only (database policies)
export async function listVariantCosts() {
  const { data, error } = await getBrowserClient().from('variant_costs').select('variant_id, avg_cost');
  if (error) throw friendly(error);
  return Object.fromEntries(data.map((row) => [row.variant_id, Number(row.avg_cost)]));
}

export async function listDeliveries() {
  const { data, error } = await getBrowserClient()
    .from('stock_purchases')
    .select('*, created_by:profiles (full_name, email), items:stock_purchase_items (*)')
    .order('purchased_on', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw friendly(error);
  return data;
}
