'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type GlobalLoadingContextValue = {
  setLoading: (value: boolean) => void;
  startLoading: () => void;
  stopLoading: () => void;
};

const GlobalLoadingContext = createContext<GlobalLoadingContextValue | null>(null);

const MAX_OVERLAY_MS = 12_000;

export function useGlobalLoading() {
  const ctx = useContext(GlobalLoadingContext);
  if (!ctx) {
    throw new Error('useGlobalLoading must be used within GlobalLoadingProvider');
  }
  return ctx;
}

/** Safe optional hook when provider might be absent (stories/tests). */
export function useGlobalLoadingOptional(): GlobalLoadingContextValue | null {
  return useContext(GlobalLoadingContext);
}

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoadingState] = useState(false);
  const pathname = usePathname();
  const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSafetyTimer = useCallback(() => {
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  const setLoading = useCallback(
    (value: boolean) => {
      setLoadingState(value);
      clearSafetyTimer();
      if (value) {
        safetyTimerRef.current = setTimeout(() => {
          setLoadingState(false);
          safetyTimerRef.current = null;
        }, MAX_OVERLAY_MS);
      }
    },
    [clearSafetyTimer]
  );

  const startLoading = useCallback(() => setLoading(true), [setLoading]);
  const stopLoading = useCallback(() => setLoading(false), [setLoading]);

  // Route finished changing → hide overlay
  useEffect(() => {
    setLoadingState(false);
    clearSafetyTimer();
  }, [pathname, clearSafetyTimer]);

  // Internal link clicks → show overlay until route updates
  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const el = (e.target as HTMLElement | null)?.closest?.('a');
      if (!el) return;

      const a = el as HTMLAnchorElement;
      if (a.target === '_blank' || a.hasAttribute('download')) return;

      const hrefAttr = a.getAttribute('href');
      if (!hrefAttr || hrefAttr.startsWith('#')) return;
      if (hrefAttr.startsWith('mailto:') || hrefAttr.startsWith('tel:')) return;

      let url: URL;
      try {
        url = new URL(a.href, window.location.origin);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      const next = `${url.pathname}${url.search}${url.hash}`;
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (next === current) return;

      setLoading(true);
    };

    document.addEventListener('click', onClickCapture, true);
    return () => document.removeEventListener('click', onClickCapture, true);
  }, [setLoading]);

  // Lock scroll while overlay is visible
  useEffect(() => {
    if (!loading) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [loading]);

  return (
    <GlobalLoadingContext.Provider value={{ setLoading, startLoading, stopLoading }}>
      {children}
      {loading ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/55 backdrop-blur-md"
          role="alert"
          aria-busy="true"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200/90 bg-white px-10 py-8 shadow-xl">
            <Loader2 className="h-11 w-11 animate-spin text-zinc-800" strokeWidth={2} />
            <p className="text-sm font-medium tracking-wide text-zinc-600">Loading…</p>
          </div>
        </div>
      ) : null}
    </GlobalLoadingContext.Provider>
  );
}
