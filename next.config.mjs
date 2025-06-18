/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // optional
  experimental: {
    serverActions: {
      enabled: true,
    },
  },
}

export default nextConfig
