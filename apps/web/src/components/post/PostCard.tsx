'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Flag, ExternalLink, Flame } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { VoteBar } from './VoteBar';
import { ReportModal } from '../report/ReportModal';
import { Post, POST_TYPE_LABELS, PostType } from '@shodasha/shared';

interface PostCardProps {
  post: Post;
  isDetail?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, isDetail = false }) => {
  const [isReportOpen, setIsReportOpen] = useState(false);

  const postTypeKey = (post.postType || 'discussion') as PostType;
  const postTypeInfo = POST_TYPE_LABELS[postTypeKey] || POST_TYPE_LABELS.discussion;

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <>
      <article className="bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--border-color-hover)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] transition-all flex flex-col gap-5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/category/${post.categorySlug || 'general'}`}>
              <Badge variant="orange">{post.categoryName || 'General'}</Badge>
            </Link>

            {postTypeInfo && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${postTypeInfo.badgeClass}`}>
                <span>{postTypeInfo.icon}</span>
                <span>{postTypeInfo.label}</span>
              </span>
            )}

            {post.trendingScore > 2 && (
              <Badge variant="red" className="flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-400 fill-red-400" />
                Trending
              </Badge>
            )}
          </div>
          <span className="text-[13px] text-[var(--text-secondary)] font-medium" suppressHydrationWarning>{formattedDate}</span>
        </div>

        <div>
          {isDetail ? (
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight leading-snug">
              {post.title}
            </h1>
          ) : (
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-xl font-bold text-[var(--text-primary)] hover:text-[var(--accent-orange)] transition-colors tracking-tight leading-snug">
                {post.title}
              </h2>
            </Link>
          )}
        </div>

        <p className="text-[15px] text-[var(--text-secondary)] leading-[1.6] whitespace-pre-line break-words">
          {post.body}
        </p>

        {post.links && post.links.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-1">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest">
              Attached Links
            </span>
            <div className="flex flex-wrap gap-2">
              {post.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--accent-orange)] text-[13px] rounded-[var(--radius-md)] border border-[var(--border-color)] transition-colors max-w-full truncate"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{link}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)] mt-2">
          <VoteBar
            postId={post.id}
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            netVotes={post.netVotes}
            userVote={post.userVote}
          />

          <div className="flex items-center gap-3">
            <Link
              href={`/posts/${post.id}`}
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-[var(--radius-md)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{post.commentCount} Comments</span>
            </Link>

            <button
              suppressHydrationWarning
              onClick={() => setIsReportOpen(true)}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-red)] hover:bg-[var(--bg-surface)] rounded-[var(--radius-md)] transition-colors cursor-pointer"
              title="Report content"
            >
              <Flag className="w-4 h-4" />
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
