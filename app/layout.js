import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import PublicElements from '@/components/PublicElements';

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'], 
  display: 'swap',
  preload: true,
  adjustFontFallback: false,
});

export const metadata = {
  metadataBase: new URL('https://www.gocvutru.com'),
  title: 'Góc Vũ Trụ - Giải mã vận mệnh, Thần số học & Cung hoàng đạo',
  description: 'Khám phá bí mật vũ trụ, xem bói cung hoàng đạo, thần số học chuyên sâu và tin tức tâm linh mới nhất.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={inter.className} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://dhfdllzdnemmrxubnldu.supabase.co" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#0B0F19] text-white overflow-x-hidden relative flex flex-col" suppressHydrationWarning>
        <Script
          id="suppress-console-hydration-warnings"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const origError = console.error;
                console.error = function(...args) {
                  const msg = args[0] ? String(args[0]) : '';
                  if (
                    msg.includes('hydration') || 
                    msg.includes('Hydration') || 
                    msg.includes('bis_skin_checked') ||
                    msg.includes('Mismatched') ||
                    msg.includes('did not match') ||
                    msg.includes('Hydrated')
                  ) {
                    return;
                  }
                  origError.apply(console, args);
                };
              })();
            `
          }}
        />
        <PublicElements>
          {children}
        </PublicElements>
      </body>
    </html>
  );
}
