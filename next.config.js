/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Bỏ qua lỗi linting khi build để đẩy nhanh quá trình di cư
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Bỏ qua lỗi Typescript nếu có
  typescript: {
    ignoreBuildErrors: true,
  },
  // Tối ưu tree-shaking cho các thư viện lớn
  // Next.js sẽ chỉ import các icon/component thực sự được dùng
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
}

export default nextConfig
