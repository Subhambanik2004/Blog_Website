'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenLine } from 'lucide-react';
import { toast } from 'sonner';
import { BlogPostForm, type SubmitIntent } from '@/components/dashboard/BlogPostForm';
import { useImageUpload } from '@/hooks/useImageUpload';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { BlogFormData } from '@/types/blog-form';
import { uniqueSlugFromTitle } from '@/lib/slug';

const DRAFT_PLACEHOLDER = 'https://placehold.co/1200x630/f1f5f9/64748b?text=Draft';

export function WritePostClient() {
  const [loading, setLoading] = useState(false);
  const { uploadImage, uploadMultipleImages } = useImageUpload();
  const router = useRouter();

  const handleSubmit = async (formData: BlogFormData, intent: SubmitIntent) => {
    setLoading(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be signed in');
        return false;
      }

      const [featuredRaw, contentImageUrls] = await Promise.all([
        formData.image ? uploadImage(formData.image, 'featured') : Promise.resolve(''),
        uploadMultipleImages(formData.contentImages),
      ]);

      let featuredUrl = featuredRaw;
      if (!featuredUrl && intent === 'draft') {
        featuredUrl = DRAFT_PLACEHOLDER;
      }
      if (
        intent === 'publish' &&
        (!featuredUrl || featuredUrl === DRAFT_PLACEHOLDER)
      ) {
        toast.error('Add a featured image before publishing');
        return false;
      }

      let finalContent = formData.content;
      contentImageUrls.forEach((url) => {
        finalContent = finalContent.replace('(uploading...)', `(${url})`);
      });

      const published = intent === 'publish';
      const slug = uniqueSlugFromTitle(formData.title);

      const { error } = await supabase.rpc('insert_blog_post', {
        p_slug: slug,
        p_title: formData.title.trim(),
        p_excerpt: formData.excerpt.trim(),
        p_content: finalContent,
        p_content_images: contentImageUrls,
        p_image_url: featuredUrl,
        p_published: published,
      });

      if (error) throw error;
      toast.success(published ? 'Post published' : 'Draft saved');
      router.refresh();
      router.push('/dashboard/posts');
      return true;
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Could not save post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-10 lg:px-10 lg:py-12">
      <header className="mb-8 max-w-3xl">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600">
          <PenLine className="h-3.5 w-3.5" strokeWidth={2} />
          Composer
        </div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          New post
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          Add a title, excerpt, and body. Save a draft anytime, or publish when your cover image is
          ready.
        </p>
      </header>

      <div className="max-w-3xl rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <BlogPostForm onSubmit={handleSubmit} isSubmitting={loading} />
      </div>
    </div>
  );
}
