'use client';

import React, { useCallback, useRef } from 'react';
import { ImagePlus, Send, Image, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import type { BlogFormData } from '@/types/blog-form';
import { useBlogForm } from '@/hooks/useBlogForm';

export type SubmitIntent = 'draft' | 'publish' | 'save-published';

interface BlogPostFormProps {
  onSubmit: (data: BlogFormData, intent: SubmitIntent) => Promise<boolean>;
  isSubmitting: boolean;
  initial?: Partial<Pick<BlogFormData, 'title' | 'excerpt' | 'content'>>;
  existingFeaturedUrl?: string | null;
  isEdit?: boolean;
  initialPublished?: boolean;
}

export function BlogPostForm({
  onSubmit,
  isSubmitting,
  initial,
  existingFeaturedUrl,
  isEdit,
  initialPublished,
}: BlogPostFormProps) {
  const { formData, updateField, resetForm, addContentImage, textareaRef } = useBlogForm(initial);
  const intentRef = useRef<SubmitIntent>('draft');

  const validateImage = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, GIF, or WebP)');
      return false;
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return false;
    }
    return true;
  };

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (validateImage(file)) updateField('image', file);
      e.target.value = '';
    },
    [updateField]
  );

  const handleContentImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (validateImage(file)) addContentImage(file);
      e.target.value = '';
    },
    [addContentImage]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (!file) return;
      if (validateImage(file)) updateField('image', file);
    },
    [updateField]
  );

  const triggerFileInput = (inputId: string) => {
    const fileInput = document.getElementById(inputId) as HTMLInputElement | null;
    fileInput?.click();
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const intent = intentRef.current;

    if (intent === 'publish' && !formData.image && !existingFeaturedUrl) {
      toast.error('Add a featured image before publishing');
      return;
    }

    const success = await onSubmit(formData, intent);
    if (success && !isEdit) {
      resetForm();
    }
  };

  const labelClass = 'mb-2 block text-sm font-medium text-zinc-700';
  const fieldClass =
    'w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 shadow-sm transition placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10';

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="title" className={labelClass}>
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          className={fieldClass}
          placeholder="Title"
          required
        />
      </div>

      <div>
        <label htmlFor="excerpt" className={labelClass}>
          Excerpt
        </label>
        <input
          type="text"
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => updateField('excerpt', e.target.value)}
          className={fieldClass}
          placeholder="Short summary for cards and SEO"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className={labelClass}>
          Content
        </label>
        <div className="relative">
          <textarea
            ref={textareaRef}
            id="content"
            value={formData.content}
            onChange={(e) => updateField('content', e.target.value)}
            rows={14}
            className={fieldClass}
            placeholder="Write in Markdown-style: paragraphs and ![alt](url) for images"
            required
          />
          <button
            type="button"
            onClick={() => triggerFileInput('contentImage')}
            className="absolute bottom-4 right-4 rounded-xl border border-zinc-200 bg-white p-2 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
            title="Insert image at cursor"
          >
            <Image className="h-5 w-5" />
          </button>
          <input
            id="contentImage"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleContentImageChange}
          />
        </div>
        {formData.contentImages.length > 0 && (
          <p className="mt-2 text-sm text-zinc-500">
            Pending content images: {formData.contentImages.length}
          </p>
        )}
      </div>

      <div>
        <span className={labelClass}>Featured image</span>
        <div
          onClick={() => triggerFileInput('featuredImage')}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`mt-1 flex cursor-pointer justify-center rounded-xl border-2 border-dashed px-6 pt-5 pb-6 transition ${
            formData.image || existingFeaturedUrl
              ? 'border-zinc-400 bg-zinc-50'
              : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50'
          }`}
        >
          <div className="space-y-1 text-center">
            <ImagePlus
              className={`mx-auto h-10 w-10 ${
                formData.image || existingFeaturedUrl ? 'text-zinc-700' : 'text-zinc-400'
              }`}
            />
            <p className="text-sm font-medium text-zinc-800">
              {formData.image
                ? formData.image.name
                : existingFeaturedUrl
                  ? 'Replace cover image'
                  : 'Upload cover image'}
            </p>
            <p className="text-xs text-zinc-500">PNG, JPG, GIF, WebP up to 10MB</p>
            <input
              id="featuredImage"
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageChange}
            />
          </div>
        </div>
        {existingFeaturedUrl && !formData.image && (
          <p className="mt-2 truncate text-xs text-zinc-500">Current: {existingFeaturedUrl}</p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {isEdit && initialPublished ? (
          <button
            type="submit"
            disabled={isSubmitting}
            onClick={() => {
              intentRef.current = 'save-published';
            }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50 sm:flex-none"
          >
            <Send className="h-5 w-5" />
            {isSubmitting ? 'Saving…' : 'Save changes'}
          </button>
        ) : (
          <>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {
                intentRef.current = 'draft';
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 sm:flex-none"
            >
              <FileDown className="h-5 w-5" />
              {isSubmitting ? 'Saving…' : 'Save draft'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => {
                intentRef.current = 'publish';
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50 sm:flex-none"
            >
              <Send className="h-5 w-5" />
              {isSubmitting ? 'Publishing…' : 'Publish'}
            </button>
          </>
        )}
      </div>
      <p className="text-xs leading-relaxed text-zinc-500">
        Drafts can use a placeholder cover until you publish. Publishing requires a real featured
        image.
      </p>
    </form>
  );
}
