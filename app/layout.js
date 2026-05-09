import { Inter } from 'next/font/google';
import './globals.css';
import PublicElements from '@/components/PublicElements';

const inter = Inter({ subsets: ['latin', 'vietnamese'], display: 'swap' });

export const metadata = {
  metadataBase: new URL('https://www.gocvutru.com'),
  title: 'Góc Vũ Trụ - Giải mã vận mệnh, Thần số học & Cung hoàng đạo',
  description: 'Khám phá bí mật vũ trụ, xem bói cung hoàng đạo, thần số học chuyên sâu và tin tức tâm linh mới nhất.',
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={inter.className}>
      <body className="min-h-screen bg-[#0B0F19] text-white overflow-x-hidden relative flex flex-col">
        <PublicElements>
          {children}
        </PublicElements>
      </body>
    </html>
  );
}
