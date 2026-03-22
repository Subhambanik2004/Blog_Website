import { useState } from 'react';
import { Pen } from 'lucide-react';
import toast from 'react-hot-toast';
import { BlogPostForm } from '../components/BlogPostForm';
import { useImageUpload } from '../hooks/useImageUpload';
import { supabase } from '../lib/supabase';
import type { BlogFormData } from '../types';

export function CreatePost() {
  const [loading, setLoading] = useState(false);
  const { uploadImage, uploadMultipleImages } = useImageUpload();

  const handleSubmit = async (formData: BlogFormData) => {
    setLoading(true);

    try {
      // Upload featured image and content images in parallel
      const [featuredImageUrl, contentImageUrls] = await Promise.all([
        formData.image ? uploadImage(formData.image, 'featured') : '',
        uploadMultipleImages(formData.contentImages)
      ]);

      // Replace the temporary image placeholders with actual URLs
      let finalContent = formData.content;
      contentImageUrls.forEach(url => {
        finalContent = finalContent.replace('(uploading...)', `(${url})`);
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be signed in to create a post');
        return false;
      }

      // Generate slug from title by converting to lowercase and replacing spaces with dashes
      const slug = formData.title.toLowerCase().replace(/ /g, '-');

      const { error } = await supabase.rpc('insert_blog_post', {
        p_slug: slug,
        p_title: formData.title,
        p_excerpt: formData.excerpt,
        p_content: finalContent,
        p_content_images: contentImageUrls,
        p_image_url: featuredImageUrl,
        p_published: true,
      });

      if (error) throw error;

      toast.success('Blog post created successfully!');
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create blog post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Pen className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
          </div>
          <BlogPostForm onSubmit={handleSubmit} isSubmitting={loading} />
        </div>
      </div>
    </div>
  );
}
