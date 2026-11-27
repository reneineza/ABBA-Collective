// Product reviews (Supabase `reviews`). Visitors see approved reviews; customers also
// see their own pending review; admins see and moderate all of them.
import { getBrowserClient } from '@/lib/supabase';

const FIELDS = 'id, product_id, user_id, rating, title, comment, reviewer_name, verified_purchase, approved, created_at';

export async function listProductReviews(productId) {
  const { data, error } = await getBrowserClient()
    .from('reviews')
    .select(FIELDS)
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function submitReview({ productId, userId, rating, title, comment, reviewerName }) {
  const { error } = await getBrowserClient().from('reviews').insert({
    product_id: productId,
    user_id: userId,
    rating,
    title: title.trim(),
    comment: comment.trim(),
    reviewer_name: reviewerName.trim() || null,
  });
  if (error) {
    if (error.code === '23505') throw new Error('You have already reviewed this product.');
    throw error;
  }
}

// Admin moderation
export async function listAllReviews() {
  const { data, error } = await getBrowserClient()
    .from('reviews')
    .select(`${FIELDS}, product:products (name, slug)`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function setReviewApproved(id, approved) {
  const { error } = await getBrowserClient().from('reviews').update({ approved }).eq('id', id);
  if (error) throw error;
}

export async function deleteReview(id) {
  const { error } = await getBrowserClient().from('reviews').delete().eq('id', id);
  if (error) throw error;
}
