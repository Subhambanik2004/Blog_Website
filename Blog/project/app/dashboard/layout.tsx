import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DashboardNav } from '@/components/dashboard/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/dashboard');
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-50">
      <div className="mx-auto flex max-w-[1280px]">
        <DashboardNav />
        <div className="min-h-[calc(100vh-4rem)] flex-1 bg-white lg:border-l lg:border-zinc-200/80 lg:shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
          {children}
        </div>
      </div>
    </div>
  );
}
