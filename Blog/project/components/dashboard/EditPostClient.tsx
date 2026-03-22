'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PenLine } from 'lucide-react';
import { toast } from 'sonner';
import { BlogPostForm, type SubmitIntent } from '@/components/dashboard/BlogPostForm';
import { useImageUpload } from '@/hooks/useImageUpload';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import type { BlogFormData } from '@/types/blog-form';
import type { BlogPost } from '@/lib/blog-data';

const DRAFT_PLACEHOLDER = 'https://placehold.co/1200x630/f1f5f9/64748b?text=Draft';

export function EditPostClient({ post }: { post: BlogPost }) {
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
      if (!user || user.id !== post.author_id) {
        toast.error('Not allowed');
        return false;
      }

      let featuredUrl = post.image_url;
      if (formData.image) {
        featuredUrl = await uploadImage(formData.image, 'featured');
      }

      const contentImageUrls = await uploadMultipleImages(formData.contentImages);
      let finalContent = formData.content;
      contentImageUrls.forEach((url) => {
        finalContent = finalContent.replace('(uploading...)', `(${url})`);
      });

      let published = post.published;
      if (intent === 'save-published') {
        published = true;
      } else if (intent === 'draft') {
        published = false;
      } else if (intent === 'publish') {
        published = true;
      }

      if (
        intent === 'publish' &&
        (!featuredUrl || featuredUrl === DRAFT_PLACEHOLDER)
      ) {
        toast.error('Add a featured image before publishing');
        return false;
      }

      if (
        intent === 'draft' &&
        (!featuredUrl || featuredUrl === DRAFT_PLACEHOLDER)
      ) {
        featuredUrl = DRAFT_PLACEHOLDER;
      }

      const mergedImages = [...(post.content_images ?? []), ...contentImageUrls];

      const { error } = await supabase.rpc('update_blog_post', {
        p_id: post.id,
        p_title: formData.title.trim(),
        p_excerpt: formData.excerpt.trim(),
        p_content: finalContent,
        p_content_images: mergedImages,
        p_image_url: featuredUrl,
        p_published: published,
      });

      if (error) throw error;
      toast.success('Post updated');
      router.refresh();
      router.push('/dashboard/posts');
      return true;
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Could not update post');
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
          Editing
        </div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
          Edit post
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          Update your copy and images. Saving keeps your slug and history intact.
        </p>
      </header>

      <div className="max-w-3xl rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <BlogPostForm
          onSubmit={handleSubmit}
          isSubmitting={loading}
          initial={{
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
          }}
          existingFeaturedUrl={post.image_url}
          isEdit
          initialPublished={post.published}
        />
      </div>
    </div>
  );
}
