/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['https://aivideo-bucket.s3.ap-northeast-1.amazonaws.com'],
  },
  experimental: {
    serverActions: {
      enabled: true,
    },
  },
};

export default nextConfig;
