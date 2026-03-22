export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  content_images: string[] | null;
  image_url: string;
  created_at: string;
  updated_at: string | null;
  author_id: string | null;
  published: boolean;
  views: number;
};

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: BlogPostRow;
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt: string;
          content: string;
          content_images?: string[] | null;
          image_url: string;
          created_at?: string;
          updated_at?: string | null;
          author_id?: string | null;
          published?: boolean;
          views?: number;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          content?: string;
          content_images?: string[] | null;
          image_url?: string;
          created_at?: string;
          updated_at?: string | null;
          author_id?: string | null;
          published?: boolean;
          views?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_view: {
        Args: { blog_id: string };
        Returns: number;
      };
      get_published_blog_posts: {
        Args: Record<string, never>;
        Returns: BlogPostRow[];
      };
      get_post_views: {
        Args: { p_id: string };
        Returns: number;
      };
      get_my_posts: {
        Args: Record<string, never>;
        Returns: BlogPostRow[];
      };
      get_post_for_edit: {
        Args: { p_id: string };
        Returns: BlogPostRow | null;
      };
      insert_blog_post: {
        Args: {
          p_slug: string;
          p_title: string;
          p_excerpt: string;
          p_content: string;
          p_content_images: string[] | null;
          p_image_url: string;
          p_published: boolean;
        };
        Returns: BlogPostRow;
      };
      update_blog_post: {
        Args: {
          p_id: string;
          p_title: string;
          p_excerpt: string;
          p_content: string;
          p_content_images: string[] | null;
          p_image_url: string;
          p_published: boolean;
        };
        Returns: BlogPostRow | null;
      };
      delete_my_post: {
        Args: { p_id: string };
        Returns: undefined;
      };
    };
  };
}

export type BlogPost = BlogPostRow;
