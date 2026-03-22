import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';
import { supabaseProjectUrl, supabasePublishableKey } from '@/lib/supabase/env';

export const supabase = createClient<Database>(supabaseProjectUrl, supabasePublishableKey);