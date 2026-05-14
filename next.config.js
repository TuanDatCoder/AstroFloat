/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Bỏ qua lỗi Typescript nếu có
  typescript: {
    ignoreBuildErrors: true,
  },
  // Tối ưu tree-shaking cho các thư viện lớn
  // Next.js sẽ chỉ import các icon/component thực sự được dùng
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dhfdllzdnemmrxubnldu.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/discover',
        destination: '/kham-pha',
        permanent: true,
      },
      {
        source: '/zodiac',
        destination: '/cung-hoang-dao',
        permanent: true,
      },
      {
        source: '/zodiac-match',
        destination: '/do-hop-cung-hoang-dao',
        permanent: true,
      },
      {
        source: '/numerology',
        destination: '/than-so-hoc',
        permanent: true,
      },
      {
        source: '/name-numerology',
        destination: '/than-so-hoc-theo-ten',
        permanent: true,
      },
      // Thêm redirect cho các sub-path nếu cần (ví dụ zodiac detail)
      {
        source: '/zodiac/:slug',
        destination: '/cung-hoang-dao/:slug',
        permanent: true,
      },
      {
        source: '/numerology/:number',
        destination: '/than-so-hoc/:number',
        permanent: true,
      },
      {
        source: '/pinnacle-analysis',
        destination: '/phan-tich-4-dinh-cao',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
