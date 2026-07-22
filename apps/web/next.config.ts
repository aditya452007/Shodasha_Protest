import type { NextConfig } from 'next';

const getApiUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!envUrl) return 'http://localhost:4000';
  // Remove any trailing slash to prevent double slashes in destination
  return envUrl.replace(/\/+$/, '');
};

const apiUrl = getApiUrl();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
