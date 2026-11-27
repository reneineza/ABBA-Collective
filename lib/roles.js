// Staff roles and which back-office pages each role may open. Used by the middleware
// (server-side enforcement), the admin layout and the sidebar. The database applies
// matching rules (see supabase/schema.sql), so hiding a link is never the only protection.

export const ROLE_LABELS = {
  admin: 'Owner',
  accountant: 'Accountant',
  sales: 'Sales',
  customer: 'Customer',
};

export const STAFF_ROLES = ['admin', 'accountant', 'sales'];

const ALL_STAFF = STAFF_ROLES;
const OWNER = ['admin'];
const FINANCE = ['admin', 'accountant'];

// Longest matching prefix wins
const PAGE_ROLES = {
  '/admin': ALL_STAFF,
  '/admin/products': ALL_STAFF,
  '/admin/collections': ALL_STAFF,
  '/admin/categories': ALL_STAFF,
  '/admin/orders': ALL_STAFF,
  '/admin/customers': OWNER,
  '/admin/reviews': OWNER,
  '/admin/marketing': OWNER,
  '/admin/blog': OWNER,
  '/admin/newsletter': OWNER,
  '/admin/staff': OWNER,
};

export function isStaffRole(role) {
  return STAFF_ROLES.includes(role);
}

export function canAccessPage(role, pathname) {
  if (!isStaffRole(role)) return false;
  const match = Object.keys(PAGE_ROLES)
    // '/admin' is the overview page only, not a prefix for every page
    .filter((prefix) => pathname === prefix || (prefix !== '/admin' && pathname.startsWith(prefix + '/')))
    .sort((a, b) => b.length - a.length)[0];
  // Unknown back-office pages are owner-only until given an explicit rule
  return (match ? PAGE_ROLES[match] : OWNER).includes(role);
}

// Whether a role may see money figures such as revenue and profit
export function canSeeFinance(role) {
  return FINANCE.includes(role);
}
