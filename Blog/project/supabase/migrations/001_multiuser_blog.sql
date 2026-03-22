-- Run in Supabase SQL editor (or via CLI) after reviewing your existing schema.
-- Adds multi-user fields and row-level security for blog_posts.

-- Columns (safe if already present)
alter table public.blog_posts
  add column if not exists published boolean not null default true;

alter table public.blog_posts
  add column if not exists updated_at timestamptz;

-- Backfill: treat legacy rows as published
update public.blog_posts set published = true where published is null;

-- Storage: ensure buckets exist (Dashboard → Storage) named blog-images and content-images, public read.

alter table public.blog_posts enable row level security;

drop policy if exists "Public read published posts" on public.blog_posts;
create policy "Public read published posts"
  on public.blog_posts for select
  using (published = true);

drop policy if exists "Authors read own posts" on public.blog_posts;
create policy "Authors read own posts"
  on public.blog_posts for select
  using (auth.uid() = author_id);

drop policy if exists "Authors insert own posts" on public.blog_posts;
create policy "Authors insert own posts"
  on public.blog_posts for insert
  with check (auth.uid() = author_id);

drop policy if exists "Authors update own posts" on public.blog_posts;
create policy "Authors update own posts"
  on public.blog_posts for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "Authors delete own posts" on public.blog_posts;
create policy "Authors delete own posts"
  on public.blog_posts for delete
  using (auth.uid() = author_id);

-- increment_view RPC: must remain callable for anonymous readers (SECURITY DEFINER recommended).
-- Example stub if you need to recreate it:
-- create or replace function public.increment_view(blog_id uuid)
-- returns int language plpgsql security definer set search_path = public as $$
-- declare v int;
-- begin
--   update blog_posts set views = coalesce(views, 0) + 1 where id = blog_id returning views into v;
--   return coalesce(v, 0);
-- end;
-- $$;
-- grant execute on function public.increment_view(uuid) to anon, authenticated;
