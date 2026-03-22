import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/database.types';
import { supabaseProjectUrl, supabasePublishableKey } from '@/lib/supabase/env';

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith('/')) return '/dashboard/posts';
  return next;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = safeNextPath(url.searchParams.get('next'));
  const redirectTarget = new URL(next, url.origin);

  const response = NextResponse.redirect(redirectTarget);

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=auth', url.origin));
  }

  const supabase = createServerClient<Database>(supabaseProjectUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL('/login?error=auth', url.origin));
  }

  return response;
}
