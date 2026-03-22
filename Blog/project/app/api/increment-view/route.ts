import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (!raw.trim()) {
      return NextResponse.json({ error: 'Missing body' }, { status: 400 });
    }

    const parsed = JSON.parse(raw) as { id?: string };
    const id = typeof parsed.id === 'string' ? parsed.id : null;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('increment_view', { blog_id: id });

    if (error) throw error;

    return NextResponse.json({ views: data });
  } catch (err) {
    console.error('Error incrementing view count:', err);
    return NextResponse.json({ error: 'Failed to update views' }, { status: 500 });
  }
}
