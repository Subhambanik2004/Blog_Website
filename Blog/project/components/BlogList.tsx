'use client';

import type { BlogPost } from '@/lib/blog-data';
import { Card } from '@/components/ui/card';
import { Calendar, Clock, Eye } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import ViewCounter from './ViewCounter';

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link 
          href={`/blog/${post.slug}`} 
          key={post.id} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-full">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <time className="text-sm font-medium">
                    {format(new Date(post.created_at), 'MMM d, yyyy')}
                  </time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">{Math.ceil(post.content.split(' ').length / 200)} min read</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-medium">{post.views} views</span>
                </div>
              </div>
              <h2 className="text-2xl font-serif font-semibold mb-4 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                {post.title}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-base line-clamp-3">
                {post.excerpt}
              </p>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
