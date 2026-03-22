'use client';

import type { BlogPost } from '@/lib/blog-data';
import { Calendar, Clock, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
import ViewCounter from './ViewCounter';

interface BlogPostProps {
  post: BlogPost;
  /** When true, opening this page does not count as a view (viewer is the author). */
  skipViewIncrement?: boolean;
}

function ContentWithImages({ content }: { content: string }) {
  const parts = content.split(/!\[.*?\]\((.*?)\)/g);

  return (
    <div className="prose max-w-none text-gray-800">
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <figure key={index} className="my-12 mx-auto relative h-96">
              <Image
                src={part.trim()}
                alt="Blog content"
                fill
                className="object-cover rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300"
                loading="lazy"
              />
            </figure>
          );
        }
        return part.split('\n\n').map((paragraph, pIndex) => (
          paragraph.trim() && (
            <p key={`${index}-${pIndex}`} className="text-lg leading-relaxed mb-6 text-gray-800">
              {paragraph}
            </p>
          )
        ));
      })}
    </div>
  );
}

export default function BlogPost({ post, skipViewIncrement = false }: BlogPostProps) {
  const [copied, setCopied] = useState(false);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Use the slug for the post URL for sharing
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  // Updated share function with modern Navigator.share API and fallback
  const handleShare = useCallback(async () => {
    const shareTitle = post.title;
    const shareText = post.excerpt;
    const shareUrl = postUrl;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Sharing failed:', error);
      }
    } else {
      const formattedMessage = `${shareTitle}\n\n${shareText}\n\nRead more at: ${shareUrl}\n\nShared via imthe.ai`;
      try {
        await navigator.clipboard.writeText(formattedMessage);
        setCopied(true);
        // toast.success('Link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // toast.error('Failed to copy link');
      }
    }
  }, [post.title, post.excerpt, postUrl]);

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 bg-white">
      <div className="relative">
        <div className="absolute inset-0 blur-3xl opacity-30">
          {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full transform rotate-12 scale-y-50"></div> */}
        </div>
        <h1 className="relative text-4xl md:text-5xl font-serif font-bold text-center mb-4 text-gray-900">
          {post.title}
        </h1>
      </div>

      <div className="w-full mb-4">
        {/* Top Thin Line */}
        <div className="border-t border-gray-300 opacity-50"></div>

        {/* Metadata + Share Button in One Line */}
        <div className="flex flex-wrap items-center justify-between text-sm text-gray-600 py-2 gap-2 sm:gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <time>{format(new Date(post.created_at), 'MMMM d, yyyy')}</time>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ViewCounter
                blogId={post.id}
                initialViews={post.views}
                authorId={post.author_id}
                skipViewIncrement={skipViewIncrement}
              />
            </div>
          </div>

          {/* Share Button */}
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Bottom Thin Line */}
        <div className="border-t border-gray-300 opacity-50"></div>
      </div>

      <div className="relative rounded-xl overflow-hidden mb-12 h-80 bg-slate-200">
        {post.image_url ? (
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500">
            No cover image
          </div>
        )}
      </div>

      <div className="prose max-w-none text-gray-800">
        <ContentWithImages content={post.content} />
      </div>
    </article>
  );
}
