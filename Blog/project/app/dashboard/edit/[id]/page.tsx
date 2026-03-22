import { notFound, redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { EditPostClient } from '@/components/dashboard/EditPostClient';

export const metadata = { title: 'Edit post' };

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/edit/${params.id}`);
  }

  const { data: post, error } = await supabase.rpc('get_post_for_edit', {
    p_id: params.id,
  });

  if (error || !post) {
    notFound();
  }

  return <EditPostClient post={post} />;
}
