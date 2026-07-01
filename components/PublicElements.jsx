'use client';

if (typeof window !== 'undefined') {
  const origError = console.error;
  console.error = function(...args) {
    const hasWarning = args.some(arg => {
      const str = typeof arg === 'string' ? arg : (arg && arg.message ? String(arg.message) : '');
      return (
        str.includes('hydration') || 
        str.includes('Hydration') || 
        str.includes('bis_skin_checked') ||
        str.includes('Mismatched') ||
        str.includes('did not match') ||
        str.includes('Hydrated') ||
        str.includes('React hydration')
      );
    });
    if (hasWarning) {
      return;
    }
    origError.apply(console, args);
  };
}

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarsBackground from '@/components/StarsBackground';
import FramerProvider from '@/components/FramerProvider';

export default function PublicElements({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const isTarot = pathname?.startsWith('/tarot');

  if (isAdmin || isTarot) {
    return <>{children}</>;
  }

  return (
    <FramerProvider>
      {/* Hiệu ứng các vì sao bay lơ lửng background */}
      <StarsBackground />
      
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <main className="relative z-10 flex-grow min-h-[70vh]">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </FramerProvider>
  );
}
