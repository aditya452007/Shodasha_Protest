'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Flag, ExternalLink, Flame, Share2, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { VoteBar } from './VoteBar';
import { useToast } from '../ui/Toast';
import dynamic from 'next/dynamic';
import { Post, POST_TYPE_LABELS, PostType } from '@shodasha/shared';

const ReportModal = dynamic(() => import('../report/ReportModal').then((mod) => mod.ReportModal), {
  ssr: false,
});

interface PostCardProps {
  post: Post;
  isDetail?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, isDetail = false }) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { toast } = useToast();

  const postTypeKey = (post.postType || 'discussion') as PostType;
  const postTypeInfo = POST_TYPE_LABELS[postTypeKey] || POST_TYPE_LABELS.discussion;

  const wordCount = post.body ? post.body.trim().split(/\s+/).length : 0;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 180));

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleShare = () => {
    const url = `${window.location.origin}/posts/${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast('Dispatch link copied to clipboard!', 'success');
    }
  };

  return (
    <>
      <article className="bg-white border border-neutral-200 hover:border-neutral-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-4">
        {/* Category & Status Eyebrows */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-neutral-100">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/category/${post.categorySlug || 'general'}`}>
              <Badge variant="black">{post.categoryName || 'General'}</Badge>
            </Link>

            {postTypeInfo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider border border-neutral-300 bg-neutral-100 text-neutral-800">
                <span>{postTypeInfo.icon}</span>
                <span>{postTypeInfo.label}</span>
              </span>
            )}

            {post.trendingScore > 2 && (
              <Badge variant="red" className="flex items-center gap-1 font-bold text-red-700 bg-red-50 border-red-200">
                <Flame className="w-3 h-3 text-red-600 fill-red-600" />
                Trending rally
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-neutral-500 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readingTimeMin} min read
            </span>
            <span>•</span>
            <span suppressHydrationWarning>{formattedDate}</span>
          </div>
        </div>

        {/* Title */}
        <div>
          {isDetail ? (
            <h1 className="font-serif text-2xl md:text-3xl font-black text-neutral-950 tracking-tight leading-snug">
              {post.title}
            </h1>
          ) : (
            <Link href={`/posts/${post.id}`}>
              <h2 className="font-serif text-xl md:text-2xl font-bold text-neutral-950 hover:text-neutral-700 transition-colors tracking-tight leading-snug">
                {post.title}
              </h2>
            </Link>
          )}
        </div>

        {/* Post Body Excerpt */}
        <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line break-words font-sans">
          {post.body}
        </p>

        {/* Links */}
        {post.links && post.links.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Verified Links & Attachments
            </span>
            <div className="flex flex-wrap gap-2">
              {post.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 hover:text-neutral-950 text-xs rounded border border-neutral-300 transition-colors max-w-full truncate font-mono"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-neutral-500" />
                  <span className="truncate">{link}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 mt-1">
          <VoteBar
            postId={post.id}
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            netVotes={post.netVotes}
            userVote={post.userVote}
          />

          <div className="flex items-center gap-2">
            <Link
              href={`/posts/${post.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 px-3 py-1.5 rounded bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{post.commentCount} Comments</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-700 hover:text-neutral-950 px-2.5 py-1.5 rounded bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition-colors cursor-pointer"
              title="Share link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              suppressHydrationWarning
              onClick={() => setIsReportOpen(true)}
              className="p-1.5 text-neutral-600 hover:text-red-700 hover:bg-neutral-100 rounded transition-colors cursor-pointer border border-transparent hover:border-neutral-200"
              title="Report content"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </article>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        postId={post.id}
      />
    </>
  );
};


