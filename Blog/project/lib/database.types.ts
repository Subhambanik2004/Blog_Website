export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string;
          slug: string; // <-- Added slug
          title: string;
          excerpt: string;
          content: string;
          content_images: string[] | null;
          image_url: string;
          created_at: string;
          author_id: string | null;
          views: number;
        };
        Insert: {
          id?: string;
          slug: string; // <-- Added slug (required)
          title: string;
          excerpt: string;
          content: string;
          content_images?: string[] | null;
          image_url: string;
          created_at?: string;
          author_id?: string | null;
          views?: number;
        };
        Update: {
          id?: string;
          slug?: string; // <-- Added slug
          title?: string;
          excerpt?: string;
          content?: string;
          content_images?: string[] | null;
          image_url?: string;
          created_at?: string;
          author_id?: string | null;
          views?: number;
        };
      };
    };
  };
}
