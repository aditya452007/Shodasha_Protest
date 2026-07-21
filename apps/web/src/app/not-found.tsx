import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-7xl font-black text-[var(--accent-orange)] tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-4">Discussion Not Found</h2>
      <p className="text-[15px] text-[var(--text-secondary)] mt-2 max-w-sm leading-relaxed">
        The topic or page you requested could not be located. It may have been removed or the URL is incorrect.
      </p>
      <Link href="/" className="mt-8">
        <Button variant="primary">Return to Jantar Mantar Feed</Button>
      </Link>
    </div>
  );
}
