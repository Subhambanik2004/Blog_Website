import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export function useImageUpload() {
  const uploadImage = async (
    file: File,
    type: 'featured' | 'content' = 'content'
  ): Promise<string> => {
    const supabase = createBrowserSupabaseClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const bucket = type === 'featured' ? 'blog-images' : 'content-images';

    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(`uploads/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw new Error(uploadError.message || 'Failed to upload image');
    if (!data?.path) throw new Error('No upload data returned');

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(`uploads/${fileName}`);
    if (!pub?.publicUrl) throw new Error('Failed to get public URL');
    return pub.publicUrl;
  };

  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    return Promise.all(files.map((file) => uploadImage(file, 'content')));
  };

  return { uploadImage, uploadMultipleImages };
}
