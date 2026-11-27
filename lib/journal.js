// Journal articles stored in Supabase (`journal_posts`). Visitors only receive
// published posts; admins also see drafts (enforced by database policies).
import { getBrowserClient } from '@/lib/supabase';
import { formatDate } from '@/lib/utils/formatDate';

// Database row → the shape the journal pages render
export function fromRow(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    author: row.author,
    published_on: row.published_on,
    date: formatDate(row.published_on),
    readTime: row.read_time,
    image_url: row.image_url,
    excerpt: row.excerpt,
    scripture: row.scripture,
    content: row.content || [],
    published: row.published,
  };
}

// Article form data → database columns
function toRow(article) {
  return {
    slug: article.slug,
    title: article.title,
    category: article.category,
    author: article.author,
    published_on: article.published_on,
    read_time: article.readTime,
    image_url: article.image_url,
    excerpt: article.excerpt,
    scripture: article.scripture,
    content: article.content,
    published: article.published,
    updated_at: new Date().toISOString(),
  };
}

export async function listPosts() {
  const { data, error } = await getBrowserClient()
    .from('journal_posts')
    .select('*')
    .order('published_on', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

export async function getPostBySlug(slug) {
  const { data, error } = await getBrowserClient().from('journal_posts').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : null;
}

export async function savePost(article, id = null) {
  const supabase = getBrowserClient();
  const query = id
    ? supabase.from('journal_posts').update(toRow(article)).eq('id', id)
    : supabase.from('journal_posts').insert(toRow(article));
  const { data, error } = await query.select().single();
  if (error) {
    if (error.code === '23505') throw new Error('Another article already uses this URL slug. Please choose a different one.');
    throw error;
  }
  return fromRow(data);
}

export async function deletePost(id) {
  const { error } = await getBrowserClient().from('journal_posts').delete().eq('id', id);
  if (error) throw error;
}
