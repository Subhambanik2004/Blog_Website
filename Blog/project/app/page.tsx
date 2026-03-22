import BlogList from '@/components/BlogList';
import { getBlogPosts } from '@/lib/blog-data';

// Enable static rendering and revalidate every hour
export const revalidate = 3600;

export default async function Home() {
  try {
    // console.log('Home page: Fetching blog posts...');
    const posts = await getBlogPosts();
    // console.log('Home page: Received posts:', {
    //   count: posts.length,
    //   postIds: posts.map(post => post.id)
    // });

    // Handle case when no posts are available
    if (posts.length === 0) {
      return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="relative">
              <div className="absolute inset-0 blur-3xl opacity-30 dark:opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full transform rotate-12 scale-y-50"></div>
              </div>
              <h1 className="relative text-4xl md:text-5xl font-serif font-bold text-center mb-4 text-slate-900 dark:text-slate-100">
                Fashion Blog
              </h1>
              <p className="relative text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto text-lg">
                No posts available at the moment. Check back soon!
              </p>
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative">
            <div className="absolute inset-0 blur-3xl opacity-30 dark:opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full transform rotate-12 scale-y-50"></div>
            </div>
            <h1 className="relative text-4xl md:text-5xl font-serif font-bold text-center mb-4 text-slate-900 dark:text-slate-100">
              Fasion Blog
            </h1>
            <p className="relative text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto text-lg">
              "Unleash your style with the latest trends, timeless classics, and bold fashion statements!" ✨👗
            </p>
          </div>
          <BlogList posts={posts} />
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in Home page:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Unable to load blog posts
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Please try again later
          </p>
        </div>
      </div>
    );
  }
}