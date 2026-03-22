import React, { useCallback } from 'react';
import { ImagePlus, Send, Image } from 'lucide-react';
import toast from 'react-hot-toast';
import type { BlogFormData } from '../types';
import { useBlogForm } from '../hooks/useBlogForm';

interface BlogPostFormProps {
  onSubmit: (data: BlogFormData) => Promise<boolean>;
  isSubmitting: boolean;
}

export function BlogPostForm({ onSubmit, isSubmitting }: BlogPostFormProps) {
  const { formData, updateField, resetForm, addContentImage, textareaRef } = useBlogForm();

  const validateImage = (file: File): boolean => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or GIF)');
      return false;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return false;
    }

    return true;
  };

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateImage(file)) {
      updateField('image', file);
    }
    e.target.value = '';
  }, [updateField]);

  const handleContentImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (validateImage(file)) {
      addContentImage(file);
    }
    e.target.value = '';
  }, [addContentImage]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (validateImage(file)) {
      updateField('image', file);
    }
  }, [updateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error('Please select a featured image');
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      resetForm();
    }
  };

  const triggerFileInput = (inputId: string) => {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div>
        <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => updateField('title', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          placeholder="Enter your captivating title"
          required
        />
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-lg font-medium text-gray-700 mb-2">
          Excerpt
        </label>
        <input
          type="text"
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => updateField('excerpt', e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          placeholder="Write a brief summary"
          required
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-lg font-medium text-gray-700 mb-2">
          Content
        </label>
        <div className="relative">
          <textarea
            ref={textareaRef}
            id="content"
            value={formData.content}
            onChange={(e) => updateField('content', e.target.value)}
            rows={12}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            placeholder="Write your blog post content here... Click the image button to insert an image at cursor position"
            required
          />
          <button
            type="button"
            onClick={() => triggerFileInput('contentImage')}
            className="absolute bottom-4 right-4 p-2 bg-white rounded-lg border border-gray-300 hover:border-purple-500 hover:text-purple-500 transition-colors"
            title="Add image at cursor position (Ctrl+I)"
          >
            <Image className="w-5 h-5" />
          </button>
          <input
            id="contentImage"
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleContentImageChange}
          />
        </div>
        {formData.contentImages.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Content images: {formData.contentImages.length}
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-lg font-medium text-gray-700 mb-2">
          Featured Image
        </label>
        <div
          onClick={() => triggerFileInput('featuredImage')}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition cursor-pointer group ${
            formData.image ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-500'
          }`}
        >
          <div className="space-y-1 text-center">
            <ImagePlus className={`mx-auto h-12 w-12 transition-colors ${
              formData.image ? 'text-purple-500' : 'text-gray-400 group-hover:text-purple-500'
            }`} />
            <div className="flex flex-col items-center text-sm text-gray-600">
              <p className="font-medium text-purple-600 group-hover:text-purple-500 transition-colors">
                {formData.image ? 'Change image' : 'Click to upload'}
              </p>
              <p className="text-gray-500">or drag and drop</p>
            </div>
            <input
              id="featuredImage"
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleImageChange}
            />
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        {formData.image && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Selected file: {formData.image.name}
            </p>
            <p className="text-xs text-gray-500">
              Size: {(formData.image.size / (1024 * 1024)).toFixed(2)}MB
            </p>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50"
      >
        <Send className="w-5 h-5" />
        {isSubmitting ? 'Publishing...' : 'Publish Post'}
      </button>
    </form>
  );
}