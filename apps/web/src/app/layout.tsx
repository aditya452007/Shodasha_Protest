import type { Metadata } from 'next';
import '@/styles/globals.css';
import Providers from '@/lib/providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Script from 'next/script';
import { Inter, Playfair_Display } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

const getMetadataBase = (): URL => {
  let url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!url) {
    return new URL('http://localhost:3000');
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  try {
    return new URL(url);
  } catch {
    return new URL('http://localhost:3000');
  }
};

export const metadata: Metadata = {
  title: {
    template: '%s | Shodasha Civic Forum',
    default: 'Shodasha | Jantar Mantar Public Civic Discussion Forum',
  },
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
  metadataBase: getMetadataBase(),
  openGraph: {
    title: 'Shodasha - Jantar Mantar Public Civic Discussion Platform',
    description:
      'Community-generated first-hand accounts, event updates, and public policy discussions centered at Jantar Mantar, New Delhi.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'Shodasha Civic Forum',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shodasha | Jantar Mantar Civic Forum',
    description: 'Discover and share eyewitness updates, visitor experiences, and peaceful demonstration discussions at Jantar Mantar.',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Shodasha Civic Forum",
  "url": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Shodasha Civic Forum",
    "logo": {
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/logo.png`
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-white text-neutral-950 min-h-screen flex flex-col antialiased selection:bg-neutral-950 selection:text-white`} suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

