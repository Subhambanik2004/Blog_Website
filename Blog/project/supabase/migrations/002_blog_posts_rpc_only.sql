-- Run in Supabase SQL editor. Exposes blog_posts only via SECURITY DEFINER RPCs.
-- After verifying the app, revoke direct table privileges (see bottom).

-- Published feed (anon + authenticated)
create or replace function public.get_published_blog_posts()
returns setof blog_posts
language sql
security definer
set search_path = public
stable
as $$
  select * from public.blog_posts
  where published = true
  order by created_at desc;
$$;

revoke all on function public.get_published_blog_posts() from public;
grant execute on function public.get_published_blog_posts() to anon, authenticated;

-- View count for published post (anon + authenticated)
create or replace function public.get_post_views(p_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v integer;
begin
  select views into v from public.blog_posts
  where id = p_id and published = true;
  return coalesce(v, 0);
end;
$$;

revoke all on function public.get_post_views(uuid) from public;
grant execute on function public.get_post_views(uuid) to anon, authenticated;

-- Dashboard list (author only)
create or replace function public.get_my_posts()
returns setof blog_posts
language sql
security definer
set search_path = public
stable
as $$
  select * from public.blog_posts
  where author_id = auth.uid()
  order by created_at desc;
$$;

revoke all on function public.get_my_posts() from public;
grant execute on function public.get_my_posts() to authenticated;

-- Single post for edit (author only)
create or replace function public.get_post_for_edit(p_id uuid)
returns blog_posts
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  r blog_posts;
begin
  select * into r from public.blog_posts
  where id = p_id and author_id = auth.uid();
  return r;
end;
$$;

revoke all on function public.get_post_for_edit(uuid) from public;
grant execute on function public.get_post_for_edit(uuid) to authenticated;

-- Insert (author = auth.uid())
create or replace function public.insert_blog_post(
  p_slug text,
  p_title text,
  p_excerpt text,
  p_content text,
  p_content_images text[],
  p_image_url text,
  p_published boolean
)
returns blog_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  new_row blog_posts;
begin
  insert into public.blog_posts (
    slug, title, excerpt, content, content_images, image_url, author_id, published, views
  )
  values (
    p_slug,
    p_title,
    p_excerpt,
    p_content,
    p_content_images,
    p_image_url,
    auth.uid(),
    p_published,
    0
  )
  returning * into new_row;
  return new_row;
end;
$$;

revoke all on function public.insert_blog_post(text, text, text, text, text[], text, boolean) from public;
grant execute on function public.insert_blog_post(text, text, text, text, text[], text, boolean) to authenticated;

-- Update (author only)
create or replace function public.update_blog_post(
  p_id uuid,
  p_title text,
  p_excerpt text,
  p_content text,
  p_content_images text[],
  p_image_url text,
  p_published boolean
)
returns blog_posts
language plpgsql
security definer
set search_path = public
as $$
declare
  new_row blog_posts;
begin
  update public.blog_posts
  set
    title = p_title,
    excerpt = p_excerpt,
    content = p_content,
    content_images = p_content_images,
    image_url = p_image_url,
    published = p_published
  where id = p_id and author_id = auth.uid()
  returning * into new_row;
  return new_row;
end;
$$;

revoke all on function public.update_blog_post(uuid, text, text, text, text[], text, boolean) from public;
grant execute on function public.update_blog_post(uuid, text, text, text, text[], text, boolean) to authenticated;

-- Delete (author only)
create or replace function public.delete_my_post(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.blog_posts
  where id = p_id and author_id = auth.uid();
end;
$$;

revoke all on function public.delete_my_post(uuid) from public;
grant execute on function public.delete_my_post(uuid) to authenticated;

-- Optional: lock down direct table access after your app works:
-- revoke select, insert, update, delete on public.blog_posts from anon, authenticated;
-- grant select, insert, update, delete on public.blog_posts to service_role;
