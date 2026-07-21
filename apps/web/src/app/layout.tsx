import type { Metadata } from 'next';
import '@/styles/globals.css';
import Providers from '@/lib/providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Shodasha | Jantar Mantar Public Civic Discussion Platform',
  description:
    'A transparent public civic discussion and community publishing forum focused on peaceful demonstrations, policy reviews, visitor accounts, and eyewitness updates at Jantar Mantar, New Delhi.',
  keywords: [
    'Jantar Mantar',
    'Jantar Mantar Protests',
    'Delhi Civic Forum',
    'Public Discussion Delhi',
    'Civic Engagement India',
    'Peaceful Demonstrations New Delhi',
    'Citizen Journalism Delhi',
    'Policy Discussion India',
  ],
  authors: [{ name: 'Shodasha Civic Forum' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Shodasha - Jantar Mantar Public Civic Discussion Platform',
    description:
      'Community-generated first-hand accounts, event updates, and public policy discussions centered at Jantar Mantar, New Delhi.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shodasha | Jantar Mantar Civic Forum',
    description: 'Discover and share eyewitness updates, visitor experiences, and peaceful demonstration discussions at Jantar Mantar.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
