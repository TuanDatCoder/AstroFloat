'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import StarsBackground from '@/components/StarsBackground';

export default function PublicElements({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Hiệu ứng các vì sao bay lơ lửng background */}
      <StarsBackground />
      
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <main className="relative z-10 flex-grow">
        {children}
      </main>

      {/* Quảng cáo */}
      <AdBanner className="mt-20 -mb-10" />

      {/* Footer */}
      <Footer />
    </>
  );
}
