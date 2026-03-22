export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  image: File | null;
  contentImages: File[];
}

export interface BlogPost extends Omit<BlogFormData, 'image' | 'contentImages'> {
  id: string;
  image_url: string;
  content_images: string[];
  created_at: string;
}