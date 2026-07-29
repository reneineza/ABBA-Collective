import { SAMPLE_BLOG_POSTS } from '@/lib/data/sampleData';

const STORAGE_KEY = 'abba_blog_posts';

/**
 * Retrieves all blog posts from localStorage or defaults to SAMPLE_BLOG_POSTS
 */
export function getStoredBlogPosts() {
  if (typeof window === 'undefined') return SAMPLE_BLOG_POSTS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading blog posts from localStorage:', err);
  }
  return SAMPLE_BLOG_POSTS;
}

/**
 * Saves updated blog posts list to localStorage and dispatches event for real-time sync
 */
export function saveStoredBlogPosts(posts) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    window.dispatchEvent(new Event('abba_blog_posts_updated'));
  } catch (err) {
    console.error('Error saving blog posts to localStorage:', err);
  }
}
