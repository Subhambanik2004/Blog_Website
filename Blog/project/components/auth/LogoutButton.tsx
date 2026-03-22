'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { useGlobalLoadingOptional } from '@/components/providers/GlobalLoadingProvider';

export function LogoutButton() {
  const router = useRouter();
  const globalLoad = useGlobalLoadingOptional();

  async function handleLogout() {
    globalLoad?.startLoading();
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push('/');
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
    >
      <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
      <span className="hidden sm:inline">Log out</span>
    </button>
  );
}
