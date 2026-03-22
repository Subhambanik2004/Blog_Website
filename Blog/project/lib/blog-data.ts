import { supabase } from '@/lib/supabase';
import type { BlogPost } from '@/lib/database.types';

export type { BlogPost };

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase.rpc('get_published_blog_posts');

    if (error) {
      console.error('Failed to fetch blog posts:', error);
      return [];
    }

    return data ?? [];
  } catch (error) {
    console.error('Failed to fetch blog posts:', {
      error,
    });
    return [];
  }
}
