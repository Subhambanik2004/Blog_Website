'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard/posts', label: 'All posts', icon: FileText },
  { href: '/dashboard/write', label: 'New post', icon: PenLine },
] as const;

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  className,
}: {
  href: string;
  label: string;
  icon: typeof FileText;
  active: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'bg-zinc-100 text-zinc-900 shadow-sm'
          : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900',
        className
      )}
    >
      <Icon className="h-4 w-4 shrink-0 opacity-70" strokeWidth={1.75} />
      {label}
    </Link>
  );
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <>
      <nav
        className="sticky top-16 z-30 flex gap-2 overflow-x-auto border-b border-zinc-200/80 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden"
        aria-label="Dashboard"
      >
        {links.map(({ href, label, icon }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            icon={icon}
            active={pathname === href || (href === '/dashboard/posts' && pathname === '/dashboard')}
            className="shrink-0"
          />
        ))}
      </nav>

      <aside
        className="hidden w-60 shrink-0 border-r border-zinc-200/80 bg-white lg:block"
        aria-label="Dashboard"
      >
        <div className="sticky top-16 space-y-1 py-8 pl-6 pr-4">
          <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
            Editor
          </p>
          {links.map(({ href, label, icon }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={icon}
              active={pathname === href || (href === '/dashboard/posts' && pathname === '/dashboard')}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
