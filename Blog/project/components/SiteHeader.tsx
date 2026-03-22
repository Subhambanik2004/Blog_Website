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
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/90 bg-white shadow-[0_1px_0_rgba(0,0,0,0.03)]">
      <div className="mx-auto flex h-24 max-w-[1280px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-xl font-bold tracking-tight text-zinc-800 transition group-hover:border-zinc-300 group-hover:bg-white">
            B
          </span>
          <span className="font-serif text-2xl font-semibold tracking-tight text-zinc-1000 dark:text-zinc-1000">
            <span className="text-blue-500">BLOG</span><span className="text-zinc-500 dark:text-zinc-400">ify</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
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
                className="hidden rounded-lg px-3 py-2 text-lg font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 sm:inline-flex"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/write"
                className="hidden rounded-lg px-3 py-2 text-lg font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 md:inline-flex"
              >
                Write
              </Link>
              <span className="hidden h-6 w-px bg-zinc-200 sm:block" aria-hidden />
              <div className="flex items-center gap-2 sm:gap-3">
                {/* <UserBadge email={user.email} /> */}
                {user.user_metadata?.avatar_url ? (
                  <img
                  src={user.user_metadata.avatar_url}
                  alt="avatar"
                  className="h-8 w-8 rounded-full border border-zinc-200 object-cover"
                  />
                ) : (
                  <UserBadge email={user.email} />
                )}
                <span className="hidden max-w-[160px] truncate text-sm text-zinc-500 lg:inline">
                  {user.user_metadata?.name ? user.user_metadata.name : user.email}
                </span>
                <LogoutButton />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
