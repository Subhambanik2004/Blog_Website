'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { LogoutButton } from '@/components/auth/LogoutButton';

function UserBadge({ email }: { email?: string }) {
  const initial = email?.charAt(0).toUpperCase() ?? '?';
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-xs font-semibold text-zinc-700"
      title={email}
    >
      {initial}
    </span>
  );
}

export function SiteHeader({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);

  // ✅ FIXED AVATAR SOURCE (Google + fallback)
  const avatarUrl =
    user?.identities?.[0]?.identity_data?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    null;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/90 bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      
      {/* MAIN HEADER */}
      <div className="mx-auto flex h-20 sm:h-24 max-w-[1280px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        
        {/* LOGO */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-lg sm:text-xl font-bold tracking-tight text-zinc-800 transition group-hover:border-zinc-300 group-hover:bg-white">
            B
          </span>
          <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-zinc-1000">
            <span className="text-blue-500">BLOG</span>
            <span className="text-zinc-500">ify</span>
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-lg font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard/posts"
                className="rounded-lg px-3 py-2 text-lg font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                Dashboard
              </Link>

              <Link
                href="/dashboard/write"
                className="rounded-lg px-3 py-2 text-lg font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                Write
              </Link>

              <span className="h-6 w-px bg-zinc-200" aria-hidden />

              <div className="flex items-center gap-3">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full border border-zinc-200 object-cover"
                  />
                ) : (
                  <UserBadge email={user.email} />
                )}

                <span className="max-w-[160px] truncate text-sm text-zinc-500">
                  {user.user_metadata?.name
                    ? user.user_metadata.name
                    : user.email}
                </span>

                <LogoutButton />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-lg font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="rounded-full bg-zinc-900 px-4 py-2 text-lg font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden rounded-lg p-2 hover:bg-zinc-100"
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-3">

          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard/posts"
                className="block rounded-lg px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Dashboard
              </Link>

              <Link
                href="/dashboard/write"
                className="block rounded-lg px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Write
              </Link>

              <div className="flex items-center gap-3 pt-2">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full border border-zinc-200 object-cover"
                  />
                ) : (
                  <UserBadge email={user.email} />
                )}

                <span className="text-sm text-zinc-500 truncate">
                  {user.user_metadata?.name
                    ? user.user_metadata.name
                    : user.email}
                </span>
              </div>

              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block rounded-lg px-3 py-2 text-base font-medium text-zinc-700 hover:bg-zinc-100"
              >
                Log in
              </Link>

              <Link
                href="/signup"
                className="block rounded-full bg-zinc-900 px-4 py-2 text-base font-semibold text-white text-center"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}