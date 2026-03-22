import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import { supabaseProjectUrl, supabasePublishableKey } from '@/lib/supabase/env';

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    supabaseProjectUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component without mutable cookie store
          }
        },
      },
    }
  );
}
