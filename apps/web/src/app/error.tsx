'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
        Something went wrong
      </h2>
      <p className="text-[15px] text-[var(--text-secondary)] max-w-md mb-8 leading-relaxed">
        We encountered an unexpected error while trying to process your request. Our team has been notified.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => reset()} variant="primary">
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline">
            Return to Feed
          </Button>
        </Link>
      </div>
    </div>
  );
}
