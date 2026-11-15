/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    // Disable client-side Router Cache for dynamic pages so mutations reflect immediately
    staleTimes: { dynamic: 0 },
  },
}

export default nextConfig
