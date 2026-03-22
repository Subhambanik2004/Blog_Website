'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { useGlobalLoadingOptional } from '@/components/providers/GlobalLoadingProvider';

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();
  const globalLoad = useGlobalLoadingOptional();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!window.confirm('Delete this post permanently? This cannot be undone.')) {
      return;
    }
    setBusy(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error } = await supabase.rpc('delete_my_post', { p_id: postId });

      if (error) throw error;
      toast.success('Post deleted');
      globalLoad?.startLoading();
      router.refresh();
      router.push('/dashboard/posts');
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Could not delete post');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => void handleDelete()}
      className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
      {busy ? 'Deleting…' : 'Delete'}
    </button>
  );
}
