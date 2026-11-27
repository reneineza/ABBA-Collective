// Expenses and financial reports for the owner and accountant. Database policies make
// all of this data unreadable to sales staff and customers.
import { getBrowserClient } from '@/lib/supabase';

export const EXPENSE_CATEGORIES = [
  'Rent',
  'Salaries & Wages',
  'Transport & Delivery',
  'Marketing & Advertising',
  'Packaging',
  'Utilities & Internet',
  'Fees, Taxes & Licences',
  'Equipment & Supplies',
  'Production & Tailoring',
  'Other',
];

// Website orders count as revenue once paid; unpaid (Pending) and cancelled orders don't
const PAID_ORDER_STATUSES = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];

// Kigali is UTC+2 all year
const startOf = (date) => `${date}T00:00:00+02:00`;
const endOf = (date) => `${date}T23:59:59.999+02:00`;
export const kigaliDate = (value = Date.now()) => new Date(value).toLocaleDateString('en-CA', { timeZone: 'Africa/Kigali' });

function check({ data, error }) {
  if (error) throw new Error(error.message);
  return data;
}

// ---- Expenses ----

export async function listExpenses(from, to) {
  return check(
    await getBrowserClient()
      .from('expenses')
      .select('*, created_by:profiles!expenses_created_by_fkey (full_name, email), updated_by:profiles!expenses_updated_by_fkey (full_name, email)')
      .gte('spent_on', from)
      .lte('spent_on', to)
      .order('spent_on', { ascending: false })
      .order('created_at', { ascending: false })
  );
}

export async function addExpense(userId, expense) {
  return check(await getBrowserClient().from('expenses').insert({ ...expense, created_by: userId }).select().single());
}

export async function updateExpense(id, expense) {
  return check(await getBrowserClient().from('expenses').update(expense).eq('id', id).select().single());
}

export async function deleteExpense(id) {
  check(await getBrowserClient().from('expenses').delete().eq('id', id));
}

// ---- Report data ----

export async function loadReportData(from, to) {
  const supabase = getBrowserClient();
  const [orders, storeSales, saleCosts, expenses, deliveries] = await Promise.all([
    supabase.from('orders').select('id, status, total_amount, subtotal, shipping_fee, payment_provider, items, created_at')
      .gte('created_at', startOf(from)).lte('created_at', endOf(to)),
    supabase.from('store_sales').select('id, sold_at, subtotal, discount, total, payment_method, items:store_sale_items (product_name, quantity, unit_price)')
      .gte('sold_at', startOf(from)).lte('sold_at', endOf(to)),
    supabase.from('sale_costs').select('source, reference_id, product_name, quantity, unit_cost, created_at')
      .gte('created_at', startOf(from)).lte('created_at', endOf(to)),
    supabase.from('expenses').select('spent_on, category, description, amount, payment_method, payee')
      .gte('spent_on', from).lte('spent_on', to),
    supabase.from('stock_purchases').select('id, supplier, purchased_on, payment_method, items:stock_purchase_items (quantity, unit_cost)')
      .gte('purchased_on', from).lte('purchased_on', to),
  ]);
  return {
    orders: check(orders),
    storeSales: check(storeSales),
    saleCosts: check(saleCosts),
    expenses: check(expenses),
    deliveries: check(deliveries),
  };
}

// ---- Report calculations (pure: no database access) ----

const num = (v) => Number(v) || 0;
const sum = (list, fn) => list.reduce((total, item) => total + fn(item), 0);

export function buildReport({ orders, storeSales, saleCosts, expenses, deliveries }) {
  const paidOrders = orders.filter((o) => PAID_ORDER_STATUSES.includes(o.status));

  // Revenue
  const onlineTotal = sum(paidOrders, (o) => num(o.total_amount));
  const deliveryFees = sum(paidOrders, (o) => num(o.shipping_fee));
  const onlineGoods = onlineTotal - deliveryFees;
  const storeTotal = sum(storeSales, (s) => num(s.total));
  const storeDiscounts = sum(storeSales, (s) => num(s.discount));
  const goodsRevenue = onlineGoods + storeTotal;
  const totalRevenue = onlineTotal + storeTotal;

  const byPaymentMethod = {};
  for (const o of paidOrders) byPaymentMethod[o.payment_provider || 'Unknown'] = (byPaymentMethod[o.payment_provider || 'Unknown'] || 0) + num(o.total_amount);
  for (const s of storeSales) byPaymentMethod[s.payment_method] = (byPaymentMethod[s.payment_method] || 0) + num(s.total);

  // Cost of goods sold, only for sales counted above
  const counted = new Set([...paidOrders.map((o) => o.id), ...storeSales.map((s) => s.id)]);
  const costLines = saleCosts.filter((c) => counted.has(c.reference_id));
  const cogs = sum(costLines, (c) => (c.unit_cost == null ? 0 : num(c.unit_cost) * c.quantity));
  const uncosted = costLines.filter((c) => c.unit_cost == null);
  const uncostedUnits = sum(uncosted, (c) => c.quantity);

  const grossProfit = goodsRevenue - cogs;
  const expensesTotal = sum(expenses, (e) => num(e.amount));
  const netProfit = totalRevenue - cogs - expensesTotal;

  const expensesByCategory = {};
  for (const e of expenses) expensesByCategory[e.category] = (expensesByCategory[e.category] || 0) + num(e.amount);

  // Cash out: deliveries marked as paid, plus expenses. Unpaid deliveries are listed separately.
  const deliveryCost = (d) => sum(d.items, (i) => (i.unit_cost == null ? 0 : num(i.unit_cost) * i.quantity));
  const paidDeliveries = deliveries.filter((d) => d.payment_method);
  const deliveriesPaid = sum(paidDeliveries, deliveryCost);
  const deliveriesUnpaid = deliveries.filter((d) => !d.payment_method).map((d) => ({ ...d, cost: deliveryCost(d) }));
  const cashOut = deliveriesPaid + expensesTotal;

  // Per-product figures (before sale-level discounts on in-store sales)
  const products = {};
  const row = (name) => (products[name] ||= { name, units: 0, revenue: 0, cost: 0, uncostedUnits: 0 });
  for (const o of paidOrders) for (const i of o.items || []) {
    row(i.name).units += num(i.quantity);
    row(i.name).revenue += num(i.price) * num(i.quantity);
  }
  for (const s of storeSales) for (const i of s.items || []) {
    row(i.product_name).units += num(i.quantity);
    row(i.product_name).revenue += num(i.unit_price) * num(i.quantity);
  }
  for (const c of costLines) {
    if (c.unit_cost == null) row(c.product_name).uncostedUnits += c.quantity;
    else row(c.product_name).cost += num(c.unit_cost) * c.quantity;
  }
  const productRows = Object.values(products)
    .map((p) => ({ ...p, profit: p.revenue - p.cost, margin: p.revenue ? (p.revenue - p.cost) / p.revenue : 0 }))
    .sort((a, b) => b.profit - a.profit);

  // Day by day (Kigali dates)
  const days = {};
  const day = (d) => (days[d] ||= { date: d, revenue: 0, expenses: 0 });
  for (const o of paidOrders) day(kigaliDate(o.created_at)).revenue += num(o.total_amount);
  for (const s of storeSales) day(kigaliDate(s.sold_at)).revenue += num(s.total);
  for (const e of expenses) day(e.spent_on).expenses += num(e.amount);
  const daily = Object.values(days).sort((a, b) => a.date.localeCompare(b.date));

  return {
    revenue: { onlineTotal, onlineGoods, deliveryFees, storeTotal, storeDiscounts, goodsRevenue, totalRevenue, onlineOrders: paidOrders.length, storeSales: storeSales.length },
    byPaymentMethod,
    cogs,
    uncostedUnits,
    uncostedProducts: [...new Set(uncosted.map((c) => c.product_name))],
    grossProfit,
    grossMargin: goodsRevenue ? grossProfit / goodsRevenue : 0,
    expensesTotal,
    expensesByCategory,
    netProfit,
    cash: { in: totalRevenue, out: cashOut, deliveriesPaid, expenses: expensesTotal, net: totalRevenue - cashOut },
    deliveriesUnpaid,
    productRows,
    daily,
  };
}

// ---- CSV export ----

export function reportToCsv(report, from, to) {
  const lines = [];
  const add = (...cells) => lines.push(cells.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','));
  add('ABBA financial report', `${from} to ${to}`);
  add();
  add('Summary', 'RWF');
  add('Website revenue (incl. delivery fees)', report.revenue.onlineTotal);
  add('  of which delivery fees', report.revenue.deliveryFees);
  add('In-store revenue (after discounts)', report.revenue.storeTotal);
  add('Total revenue', report.revenue.totalRevenue);
  add('Cost of goods sold', report.cogs);
  add('Gross profit (goods)', report.grossProfit);
  add('Gross margin', `${(report.grossMargin * 100).toFixed(1)}%`);
  add('Expenses', report.expensesTotal);
  add('Net profit', report.netProfit);
  add('Cash in', report.cash.in);
  add('Cash out (paid deliveries + expenses)', report.cash.out);
  if (report.uncostedUnits) add('Units sold without a cost (profit overstated)', report.uncostedUnits);
  add();
  add('Revenue by payment method', 'RWF');
  for (const [method, amount] of Object.entries(report.byPaymentMethod)) add(method, amount);
  add();
  add('Expenses by category', 'RWF');
  for (const [category, amount] of Object.entries(report.expensesByCategory)) add(category, amount);
  add();
  add('Product', 'Units', 'Revenue', 'Cost', 'Profit', 'Margin', 'Units without cost');
  for (const p of report.productRows) add(p.name, p.units, p.revenue, p.cost, p.profit, `${(p.margin * 100).toFixed(1)}%`, p.uncostedUnits);
  add();
  add('Date', 'Revenue', 'Expenses');
  for (const d of report.daily) add(d.date, d.revenue, d.expenses);
  return lines.join('\n');
}
