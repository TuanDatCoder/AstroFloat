'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarsBackground from '@/components/StarsBackground';
import FramerProvider from '@/components/FramerProvider';

export default function PublicElements({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <FramerProvider>
      {/* Hiệu ứng các vì sao bay lơ lửng background */}
      <StarsBackground />
      
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <main className="relative z-10 flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </FramerProvider>
  );
}
