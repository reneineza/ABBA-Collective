// Admin-only catalogue changes. Database policies allow these writes for admins only.
import { getBrowserClient } from '@/lib/supabase';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function friendly(error) {
  if (error?.code === '23505') {
    if (/sku/i.test(error.message)) return new Error('Another product already uses one of these SKUs. SKUs must be unique.');
    return new Error('That URL slug is already used. Please choose a different one.');
  }
  return new Error(error?.message || 'Something went wrong. Please try again.');
}

// Saves a product with its stock variants and photos. `product` uses the form's shape.
export async function saveProduct(product, id = null) {
  const supabase = getBrowserClient();
  const row = {
    name: product.name,
    slug: product.slug,
    tagline: product.tagline || null,
    description: product.description,
    story: product.story || null,
    details: product.details || null,
    reflection: product.reflection || null,
    price: product.price,
    featured: product.featured,
    active: product.active,
    category_id: product.category_id || null,
    collection_id: product.collection_id || null,
  };

  const saved = id
    ? await supabase.from('products').update(row).eq('id', id).select('id').single()
    : await supabase.from('products').insert(row).select('id').single();
  if (saved.error) throw friendly(saved.error);
  const productId = saved.data.id;

  // Stock variants: remove combinations that were deleted, then add/update the rest
  const keep = product.variants.map((v) => `${v.color}|${v.size}`);
  const existing = await supabase.from('product_variants').select('id, color, size').eq('product_id', productId);
  if (existing.error) throw friendly(existing.error);
  const removed = existing.data.filter((v) => !keep.includes(`${v.color}|${v.size}`)).map((v) => v.id);
  if (removed.length) {
    const { error } = await supabase.from('product_variants').delete().in('id', removed);
    if (error) throw friendly(error);
  }
  if (product.variants.length) {
    const { error } = await supabase.from('product_variants').upsert(
      product.variants.map((v) => ({
        product_id: productId,
        color: v.color.trim(),
        size: v.size,
        sku: v.sku.trim(),
        stock_quantity: Math.max(0, Number(v.stock_quantity) || 0),
      })),
      { onConflict: 'product_id,color,size' }
    );
    if (error) throw friendly(error);
  }

  // Photos: replace the list, keeping the chosen order (first = main photo)
  const { error: clearError } = await supabase.from('product_images').delete().eq('product_id', productId);
  if (clearError) throw friendly(clearError);
  if (product.images.length) {
    const { error } = await supabase.from('product_images').insert(
      product.images.map((img, index) => ({
        product_id: productId,
        image_url: img.image_url,
        alt_text: img.alt_text || product.name,
        sort_order: index,
      }))
    );
    if (error) throw friendly(error);
  }

  return productId;
}

export async function deleteProduct(id) {
  const { error } = await getBrowserClient().from('products').delete().eq('id', id);
  if (error) throw friendly(error);
}

export async function setProductActive(id, active) {
  const { error } = await getBrowserClient().from('products').update({ active }).eq('id', id);
  if (error) throw friendly(error);
}

// Uploads a photo to Supabase Storage and returns its public URL
export async function uploadCatalogImage(file, bucket = 'product-images') {
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file (JPG, PNG or WebP).');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Image is larger than 5 MB. Please use a smaller photo.');

  const supabase = getBrowserClient();
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  const path = `${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: '31536000', upsert: false });
  if (error) throw friendly(error);
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

// Collections and categories
export async function saveCollection(collection, id = null) {
  const supabase = getBrowserClient();
  const row = {
    name: collection.name,
    slug: collection.slug,
    description: collection.description || null,
    image_url: collection.image_url || null,
  };
  const { error } = id
    ? await supabase.from('collections').update(row).eq('id', id)
    : await supabase.from('collections').insert(row);
  if (error) throw friendly(error);
}

export async function deleteCollection(id) {
  const { error } = await getBrowserClient().from('collections').delete().eq('id', id);
  if (error) throw friendly(error);
}

export async function saveCategory(category, id = null) {
  const supabase = getBrowserClient();
  const row = { name: category.name, slug: category.slug };
  const { error } = id
    ? await supabase.from('categories').update(row).eq('id', id)
    : await supabase.from('categories').insert(row);
  if (error) throw friendly(error);
}

export async function deleteCategory(id) {
  const { error } = await getBrowserClient().from('categories').delete().eq('id', id);
  if (error) throw friendly(error);
}

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
