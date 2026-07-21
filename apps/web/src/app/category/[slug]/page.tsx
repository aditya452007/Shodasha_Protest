import React from 'react';
import Link from 'next/link';
import { PostCard } from '@/components/post/PostCard';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { Button } from '@/components/ui/Button';
import { Post, CATEGORIES } from '@shodasha/shared';
import { Metadata, ResolvingMetadata } from 'next';

export const runtime = 'edge';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const matchedCat = CATEGORIES.find((c) => c.slug === resolvedParams.slug);
  const name = matchedCat?.name || resolvedParams.slug;
  const desc = matchedCat?.description || `Explore discussions under ${name} category at Jantar Mantar.`;

  return {
    title: `${name} | Shodasha Civic Forum`,
    description: desc,
  };
}

async function fetchCategoryPosts(slug: string, page: number) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/v1/posts?category=${slug}&page=${page}&limit=20`, {
    next: { revalidate: 60 }
  });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedQuery = await searchParams;
  
  const slug = resolvedParams.slug;
  const page = resolvedQuery.page ? parseInt(resolvedQuery.page, 10) : 1;
  const matchedCat = CATEGORIES.find((c) => c.slug === slug);

  const data = await fetchCategoryPosts(slug, page);
  const posts: Post[] = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-8 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-gray-100 tracking-tight flex items-center gap-3">
            {matchedCat?.name || slug} Discussions
          </h1>
          {matchedCat?.description && (
            <p className="text-[15px] text-gray-400 mt-3 max-w-2xl leading-relaxed">
              {matchedCat.description}
            </p>
          )}
        </div>
      </div>

      <CategoryNav />

      <div className="min-h-[500px]">
        {posts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            {meta && meta.totalPages && meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10 mb-6">
                {page > 1 ? (
                  <Link href={`/category/${slug}?page=${page - 1}`}>
                    <Button variant="outline" size="sm" className="rounded-full px-6">Previous</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-full px-6 opacity-50 cursor-not-allowed" disabled>Previous</Button>
                )}
                
                <span className="text-sm text-gray-400 font-medium bg-gray-900/50 px-4 py-1.5 rounded-full border border-gray-800">
                  Page {page} of {meta.totalPages}
                </span>

                {page < meta.totalPages ? (
                  <Link href={`/category/${slug}?page=${page + 1}`}>
                    <Button variant="outline" size="sm" className="rounded-full px-6">Next</Button>
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-full px-6 opacity-50 cursor-not-allowed" disabled>Next</Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-900/40 border border-gray-800 rounded-2xl shadow-sm">
            <p className="text-gray-400 text-sm font-medium">No posts filed under this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
