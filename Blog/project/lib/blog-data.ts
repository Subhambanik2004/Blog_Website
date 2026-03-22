import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    console.log('Fetching blog posts from Supabase...');
    
    // Use fetch directly with Supabase REST API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/blog_posts?select=*&order=created_at.desc`,
      {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data) {
      console.warn('No data returned from Supabase');
      return [];
    }

    // console.log('Successfully fetched blog posts:', {
    //   count: data.length,
    //   posts: data
    // });

    return data;
  } catch (error) {
    console.error('Failed to fetch blog posts:', {
      error,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      // Don't log the actual key for security
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });
    
    // Return empty array instead of throwing to prevent build failures
    return [];
  }
}