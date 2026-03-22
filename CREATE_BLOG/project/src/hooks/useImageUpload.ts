import { supabase } from '../lib/supabase';

export const useImageUpload = () => {
  const uploadImage = async (file: File, type: 'featured' | 'content' = 'content'): Promise<string> => {
    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Use different buckets for different types of images
      const bucket = type === 'featured' ? 'blog-images' : 'content-images';
      
      // Upload the file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(`uploads/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image');
      }

      if (!data?.path) {
        throw new Error('No upload data returned');
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(`uploads/${fileName}`);
      
      if (!publicUrl) {
        throw new Error('Failed to get public URL');
      }

      return publicUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    try {
      const uploadPromises = files.map(file => uploadImage(file, 'content'));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Multiple image upload error:', error);
      throw error;
    }
  };

  return { uploadImage, uploadMultipleImages };
};