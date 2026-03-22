export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  image: File | null;
  contentImages: File[];
}
