'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye } from 'lucide-react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface ViewCounterProps {
  blogId: string;
  initialViews: number;
  /** When false (e.g. blog list cards), only poll — do not increment or send beacon. */
  trackView?: boolean;
  /** Post author id — used with session to skip counting when the viewer is the author. */
  authorId?: string | null;
  /**
   * When true, never increment (e.g. server knows the viewer is the author).
   * Avoids a flash before client auth resolves.
   */
  skipViewIncrement?: boolean;
}

const POLL_MS = 5000;

function sessionKeyFor(blogId: string) {
  return `blog_view_tracked_${blogId}`;
}

export default function ViewCounter({
  blogId,
  initialViews,
  trackView = true,
  authorId = null,
  skipViewIncrement = false,
}: ViewCounterProps) {
  const [views, setViews] = useState(initialViews);
  const [viewerIsAuthor, setViewerIsAuthor] = useState<boolean | null>(
    skipViewIncrement ? true : null
  );
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Resolve “viewer is author” on the client when not provided by the server (e.g. blog list).
  useEffect(() => {
    if (skipViewIncrement || !authorId) {
      if (skipViewIncrement) setViewerIsAuthor(true);
      return;
    }
    let cancelled = false;
    (async () => {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled || !mounted.current) return;
      setViewerIsAuthor(!!user && user.id === authorId);
    })();
    return () => {
      cancelled = true;
    };
  }, [authorId, skipViewIncrement]);

  // Optimistic +1 + sendBeacon (not for list, not for author viewing own post)
  useEffect(() => {
    if (!trackView) return;
    if (typeof window === 'undefined') return;
    if (skipViewIncrement) return;

    if (viewerIsAuthor === null && authorId) {
      return;
    }
    if (viewerIsAuthor === true) {
      return;
    }

    let alreadyTracked = false;
    try {
      alreadyTracked = sessionStorage.getItem(sessionKeyFor(blogId)) === '1';
    } catch {
      /* private mode */
    }

    if (alreadyTracked) {
      return;
    }

    try {
      sessionStorage.setItem(sessionKeyFor(blogId), '1');
    } catch {
      /* ignore */
    }

    setViews((v) => v + 1);

    const payload = JSON.stringify({ id: blogId });
    const blob = new Blob([payload], { type: 'application/json' });

    const sent =
      typeof navigator !== 'undefined' &&
      typeof navigator.sendBeacon === 'function' &&
      navigator.sendBeacon('/api/increment-view', blob);

    if (!sent) {
      fetch('/api/increment-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [blogId, trackView, skipViewIncrement, authorId, viewerIsAuthor]);

  // Poll server
  useEffect(() => {
    let cancelled = false;

    const sync = async () => {
      try {
        const res = await fetch(`/api/get-views?id=${encodeURIComponent(blogId)}`, {
          cache: 'no-store',
        });
        if (!res.ok || cancelled || !mounted.current) return;
        const data = (await res.json()) as { views?: number };
        if (typeof data.views === 'number' && mounted.current) {
          setViews(data.views);
        }
      } catch {
        /* ignore */
      }
    };

    if (!trackView) {
      void sync();
    }

    const interval = setInterval(sync, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [blogId, trackView]);

  return (
    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
      <Eye className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      <span>{views} views</span>
    </div>
  );
}
