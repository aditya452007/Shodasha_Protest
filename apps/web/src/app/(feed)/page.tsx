import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { FeedClient } from './FeedClient';

// Helper to fetch data on the server
async function fetchPostsServer(sort: string, page: number) {
  // Use absolute URL for server-side fetch
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/v1/posts?sort=${sort}&page=${page}&limit=20`, {
    next: { revalidate: 60 } // Cache for 60 seconds (Performance Engineering)
  });
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
}

export default async function HomePage() {
  const queryClient = new QueryClient();

  // Prefetch the first page of trending posts for instant LCP
  await queryClient.prefetchQuery({
    queryKey: ['posts', 'trending', 1],
    queryFn: () => fetchPostsServer('trending', 1),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeedClient />
    </HydrationBoundary>
  );
}
