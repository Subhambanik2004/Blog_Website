/** Public Supabase URL + browser-safe key (publishable or legacy anon JWT). */
export const supabaseProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
