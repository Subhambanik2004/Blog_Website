import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { Plus, Pencil, ExternalLink, FileText } from 'lucide-react';
import { DeletePostButton } from '@/components/dashboard/DeletePostButton';

export const metadata = { title: 'My posts' };

export default async function MyPostsPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: posts, error } = await supabase.rpc('get_my_posts');

  if (error) {
    return (
      <div className="px-6 py-12 lg:px-10">
        <div className="rounded-2xl border border-red-100 bg-red-50/80 px-5 py-4 text-sm text-red-800">
          Could not load posts: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 lg:px-10 lg:py-12">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Dashboard
          </p>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Your posts
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-zinc-500">
            Drafts stay private. Published stories appear on your public blog.
          </p>
        </div>
        <Link
          href="/dashboard/write"
          className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" strokeWidth={2.25} />
          New post
        </Link>
      </div>

      {!posts?.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 px-8 py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <FileText className="h-7 w-7 text-zinc-400" strokeWidth={1.5} />
          </div>
          <p className="text-base font-medium text-zinc-800">No posts yet</p>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            Start writing—save a draft or publish when you are ready.
          </p>
          <Link
            href="/dashboard/write"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50"
          >
            <Plus className="h-4 w-4" />
            Write your first post
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {posts.map((row) => (
            <li
              key={row.id}
              className="group rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md sm:p-6"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={
                        row.published
                          ? 'inline-flex items-center rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-800'
                          : 'inline-flex items-center rounded-full border border-amber-200/80 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-900'
                      }
                    >
                      {row.published ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-xs text-zinc-400">
                      {format(new Date(row.created_at), 'MMM d, yyyy')}
                      {row.updated_at && row.updated_at !== row.created_at && (
                        <span className="text-zinc-400">
                          {' '}
                          · updated {format(new Date(row.updated_at), 'MMM d, yyyy')}
                        </span>
                      )}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-semibold tracking-tight text-zinc-900 sm:text-[1.35rem]">
                    {row.title}
                  </h2>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 sm:pt-1">
                  <Link
                    href={`/dashboard/edit/${row.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                    Edit
                  </Link>
                  {row.published && (
                    <Link
                      href={`/blog/${row.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
                    >
                      <ExternalLink className="h-3.5 w-3.5" strokeWidth={2} />
                      View
                    </Link>
                  )}
                  <DeletePostButton postId={row.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
