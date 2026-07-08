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

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarsBackground from '@/components/StarsBackground';
import FramerProvider from '@/components/FramerProvider';
import FloatingTarotBot from '@/components/FloatingTarotBot';

export default function PublicElements({ children }) {
  const pathname = usePathname();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const hash = window.location.hash;
      const path = window.location.pathname;

      // Nếu có mã xác nhận code và không nằm trong trang xac-nhan hay doi-mat-khau
      if (code && path !== '/xac-nhan' && path !== '/doi-mat-khau') {
        window.location.href = `/xac-nhan?code=${code}`;
      }

      // Nếu có hash fragment chứa access_token (flow implicit)
      if (hash.includes('access_token') && path !== '/xac-nhan' && path !== '/doi-mat-khau') {
        window.location.href = `/xac-nhan${hash}`;
      }

      // Nếu có hash fragment chứa lỗi từ Supabase (ví dụ link hết hạn)
      if (hash.includes('error=') && path !== '/xac-nhan' && path !== '/doi-mat-khau') {
        window.location.href = `/xac-nhan${hash}`;
      }
    }
  }, [pathname]);

  const isAdmin = pathname?.startsWith('/admin');
  const isTarot = pathname?.startsWith('/tarot');

  if (isAdmin) {
    return <>{children}</>;
  }

  if (isTarot) {
    return (
      <>
        {children}
        <FloatingTarotBot />
      </>
    );
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

      {/* Cầu nối ảo Trợ Lý Vũ Trụ */}
      <FloatingTarotBot />
    </FramerProvider>
  );
}
