// Product catalogue stored in Supabase: products, their photos and stock variants,
// categories and collections. Works with any Supabase client (browser or server).

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const PRODUCT_SELECT = `
  id, name, slug, tagline, description, story, details, reflection, price, featured, active, created_at,
  category_id, collection_id,
  category:categories (id, name, slug),
  collection:collections (id, name, slug),
  images:product_images (id, image_url, alt_text, sort_order),
  variants:product_variants (id, color, size, sku, stock_quantity)
`;

function unique(values) {
  return [...new Set(values)];
}

function bySize(a, b) {
  const ia = SIZE_ORDER.indexOf(a);
  const ib = SIZE_ORDER.indexOf(b);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
}

// Database row → the product shape the pages render. Colours and sizes come from the
// stock variants, so only options that exist in stock records are offered.
export function mapProduct(row) {
  const variants = row.variants || [];
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    tagline: row.tagline,
    description: row.description,
    story: row.story,
    details: row.details,
    reflection: row.reflection,
    price: Number(row.price),
    featured: row.featured,
    active: row.active,
    created_at: row.created_at,
    category_id: row.category_id,
    category: row.category?.name || '',
    category_slug: row.category?.slug || '',
    collection_id: row.collection_id,
    collection: row.collection?.name || '',
    collection_slug: row.collection?.slug || '',
    images: [...(row.images || [])].sort((a, b) => a.sort_order - b.sort_order),
    variants,
    colors: unique(variants.map((v) => v.color)),
    sizes: unique(variants.map((v) => v.size)).sort(bySize),
    in_stock: variants.some((v) => v.stock_quantity > 0),
  };
}

// Stock for one colour/size; 0 when that combination isn't stocked
export function stockFor(product, color, size) {
  return product?.variants?.find((v) => v.color === color && v.size === size)?.stock_quantity ?? 0;
}

// First colour/size combination with stock (used by "Quick Add"), or null if sold out
export function firstAvailableVariant(product) {
  return product?.variants?.find((v) => v.stock_quantity > 0) || null;
}

export async function fetchProducts(supabase) {
  const { data, error } = await supabase.from('products').select(PRODUCT_SELECT).order('created_at');
  if (error) throw error;
  return data.map(mapProduct);
}

export async function fetchProductsByIds(supabase, ids) {
  const { data, error } = await supabase.from('products').select(PRODUCT_SELECT).in('id', ids);
  if (error) throw error;
  return data.map(mapProduct);
}

export async function fetchCollections(supabase) {
  const { data, error } = await supabase.from('collections').select('*').order('sort_order').order('name');
  if (error) throw error;
  return data;
}

export async function fetchCategories(supabase) {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data;
}

// Related products: same collection first, then same category, then the rest
export function getRelatedProducts(products, current, limit = 4) {
  const others = products.filter((p) => p.id !== current?.id && p.active !== false);
  const score = (p) => (p.collection_id === current?.collection_id ? 2 : 0) + (p.category_id === current?.category_id ? 1 : 0);
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, limit);
}
