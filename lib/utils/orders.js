// Short, readable order reference shown to customers, e.g. "A1B2C3D4".
export function orderNumber(id) {
  return String(id || '').replace(/-/g, '').slice(0, 8).toUpperCase();
}

// Loyalty rule shown on the rewards page: 10 points per 10,000 RWF spent.
export function pointsForPurchase(subtotal) {
  return Math.floor(Number(subtotal || 0) / 10000) * 10;
}
