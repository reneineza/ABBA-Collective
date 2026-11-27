// Staff roles, permissions and which back-office pages each permission opens. Used by
// the middleware (server-side enforcement), the admin layout, the sidebar and pages.
// Roles and their permissions live in the database (public.roles), are edited by the
// owner on the Staff page, and the database applies the same permissions in its own
// rules (see supabase/schema.sql), so hiding a link is never the only protection.

// The owner's role: always has every permission and is the only role that manages staff
export const OWNER_ROLE = 'admin';

// Profile columns plus the role's name and permissions; use wherever a profile is loaded
export const PROFILE_SELECT = '*, access:roles (name, permissions, is_staff)';

// Longest matching prefix wins. null = any staff member; OWNER_ROLE = the owner only.
const PAGE_PERMISSIONS = {
  '/admin': null,
  '/admin/products': 'catalog.manage',
  '/admin/collections': 'catalog.manage',
  '/admin/categories': 'catalog.manage',
  '/admin/orders': 'orders.view',
  '/admin/stock': 'stock.view',
  '/admin/stock/receive': 'stock.receive',
  '/admin/sales': 'sales.view',
  '/admin/sales/new': 'sales.record',
  '/admin/purchases': 'costs.view',
  '/admin/expenses': 'expenses.view',
  '/admin/reports': 'reports.view',
  '/admin/customers': 'customers.view',
  '/admin/reviews': 'reviews.manage',
  '/admin/marketing': 'content.manage',
  '/admin/blog': 'content.manage',
  '/admin/newsletter': 'newsletter.manage',
  '/admin/staff': OWNER_ROLE,
};

export function isOwner(profile) {
  return profile?.role === OWNER_ROLE;
}

export function isStaff(profile) {
  return isOwner(profile) || Boolean(profile?.access?.is_staff);
}

export function hasPermission(profile, permission) {
  if (isOwner(profile)) return true;
  return isStaff(profile) && (profile.access.permissions || []).includes(permission);
}

export function roleName(profile) {
  return profile?.access?.name || (isOwner(profile) ? 'Owner' : 'Staff');
}

export function canAccessPage(profile, pathname) {
  if (!isStaff(profile)) return false;
  const match = Object.keys(PAGE_PERMISSIONS)
    // '/admin' is the overview page only, not a prefix for every page
    .filter((prefix) => pathname === prefix || (prefix !== '/admin' && pathname.startsWith(prefix + '/')))
    .sort((a, b) => b.length - a.length)[0];
  // Unknown back-office pages are owner-only until given an explicit rule
  const needed = match ? PAGE_PERMISSIONS[match] : OWNER_ROLE;
  if (needed === null) return true;
  if (needed === OWNER_ROLE) return isOwner(profile);
  return hasPermission(profile, needed);
}
