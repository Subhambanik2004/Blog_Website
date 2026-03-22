import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ views: 0 }, { status: 400 });
  }

  const { data, error } = await supabase.rpc('get_post_views', { p_id: id });

  if (error) {
    return NextResponse.json({ views: 0 });
  }

  return NextResponse.json({ views: data ?? 0 });
}
