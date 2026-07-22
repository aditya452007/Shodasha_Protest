import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { FeedClient } from './FeedClient';

// Helper to fetch data on the server
async function fetchPostsServer(sort: string, page: number) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/api/v1/posts?sort=${sort}&page=${page}&limit=20`, {
      next: { revalidate: 60 }
    });
    if (!res.ok) {
      return { data: [], meta: { page: 1, totalPages: 1 } };
    }
    return res.json();
  } catch (err) {
    console.error('Server-side fetch posts failed:', err);
    return { data: [], meta: { page: 1, totalPages: 1 } };
  }
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
