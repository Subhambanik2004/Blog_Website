// ./app/api/increment-view/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    // Call the Postgres function to increment views
    const { data, error } = await supabase.rpc('increment_view', { blog_id: id });

    if (error) throw error;

    return NextResponse.json({ views: data });
  } catch (err) {
    console.error('Error incrementing view count:', err);
    return NextResponse.error();
  }
}
