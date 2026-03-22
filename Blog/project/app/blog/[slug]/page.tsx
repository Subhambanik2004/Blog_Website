// app/blog/[slug]/page.tsx
import { getBlogPosts } from '@/lib/blog-data';
import BlogPost from '@/components/BlogPost';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Revalidate every hour
export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === decodedSlug);

  // Fallback metadata if post is not found
  if (!post) {
    return {
      title: 'Blog Post',
      description: 'Blog Post not found',
    };
  }

  // Use the same fallback mechanism for site URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      images: [
        {
          url: post.image_url,
          // width: 1200,
          // height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image_url],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  try {
    const decodedSlug = decodeURIComponent(params.slug);
    const posts = await getBlogPosts();
    const post = posts.find((p) => p.slug === decodedSlug);

    if (!post) {
      return notFound();
    }

    return (
      <div className="relative">
        <Link
          href="/"
          className="absolute top-6 left-6 md:top-10 md:left-10 p-6 w-10 h-10 flex items-center justify-center rounded-full bg-white hover:bg-gray-200 shadow-lg shadow-blue-500/50 transition-all"
        >
          <span className="text-black text-2xl">&larr;</span>
        </Link>
        <BlogPost post={post} />
      </div>
    );
  } catch (error) {
    console.error('Error in Blog Post page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Unable to load blog post
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Please try again later
          </p>
        </div>
      </div>
    );
  }
}
