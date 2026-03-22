import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/database.types';
import { supabaseProjectUrl, supabasePublishableKey } from '@/lib/supabase/env';

export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(supabaseProjectUrl, supabasePublishableKey);
}
