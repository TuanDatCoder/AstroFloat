'use client';

import { Playfair_Display, Outfit } from 'next/font/google';
import Link from 'next/link';
import { Sparkles, History, Calendar, LayoutGrid, ArrowLeft } from 'lucide-react';

const playfair = Playfair_Display({ 
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-serif'
});

const outfit = Outfit({ 
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-outfit'
});

export default function TarotLayout({ children }) {
  return (
    <div className={`${playfair.variable} ${outfit.variable} font-sans min-h-screen bg-[#07050f] text-[#ebdcb9] overflow-x-hidden relative flex flex-col selection:bg-purple-950 selection:text-amber-200`}>
      {/* Mystical Background Stars & Nebula */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-[#07050f] to-[#07050f]" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-900/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-900/10 blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Star Grid Pattern */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Tarot Header */}
      <header className="relative z-50 border-b border-amber-950/30 bg-[#07050f]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs uppercase tracking-widest text-[#ebdcb9]/60 hover:text-[#ebdcb9] flex items-center gap-1.5 transition-colors border border-amber-950/40 rounded-full px-3.5 py-1.5 bg-amber-950/10">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Về AstroFloat</span>
            </Link>
            
            <Link href="/tarot" className="flex items-center gap-3 group">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-spin-slow" />
                <div className="absolute inset-0 bg-amber-400/20 blur-md rounded-full" />
              </div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 bg-clip-text text-transparent group-hover:brightness-110 transition-all">
                TAROT VŨ TRỤ
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/tarot" className="font-serif px-4 py-2 text-sm tracking-widest text-[#ebdcb9]/80 hover:text-amber-200 transition-colors flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-amber-500/80" />
              TRẢI BÀI TAROT
            </Link>
            <Link href="/tarot/daily" className="font-serif px-4 py-2 text-sm tracking-widest text-[#ebdcb9]/80 hover:text-amber-200 transition-colors flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500/80" />
              HẰNG NGÀY
            </Link>
            <Link href="/tarot/history" className="font-serif px-4 py-2 text-sm tracking-widest text-[#ebdcb9]/80 hover:text-amber-200 transition-colors flex items-center gap-2">
              <History className="w-4 h-4 text-amber-500/80" />
              LỊCH SỬ
            </Link>
          </nav>

          {/* Mobile Nav Trigger Indicator */}
          <div className="flex lg:hidden items-center gap-4">
            <Link href="/tarot/history" className="p-2 border border-amber-950/40 rounded-full bg-amber-950/10 hover:text-amber-200 transition-colors" title="Lịch sử">
              <History className="w-4 h-4 text-amber-400" />
            </Link>
            <Link href="/tarot/daily" className="p-2 border border-amber-950/40 rounded-full bg-amber-950/10 hover:text-amber-200 transition-colors" title="Hằng ngày">
              <Calendar className="w-4 h-4 text-amber-400" />
            </Link>
            <Link href="/tarot" className="p-2 border border-amber-950/40 rounded-full bg-amber-950/10 hover:text-amber-200 transition-colors" title="Trải bài">
              <LayoutGrid className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow">
        {children}
      </main>

      {/* Tarot Footer */}
      <footer className="relative z-10 border-t border-amber-950/30 bg-[#04030a] py-12 text-[#ebdcb9]/50 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
          </div>
          <p className="font-serif italic tracking-wider text-[#ebdcb9]/80 text-sm max-w-xl">
            &ldquo;Quá khứ đã là lịch sử, tương lai là một ẩn số, còn hiện tại là một món quà. Hãy lắng nghe thông điệp vũ trụ bằng sự thông tuệ và tâm thế rộng mở.&rdquo;
          </p>
          <div className="h-px w-full max-w-lg bg-amber-950/20" />
          <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest">
            <Link href="/tarot" className="hover:text-amber-300 transition-colors">TRẢI BÀI CHUYÊN SÂU</Link>
            <Link href="/tarot/daily" className="hover:text-amber-300 transition-colors">LÁ BÀI HẰNG NGÀY</Link>
            <Link href="/tarot/history" className="hover:text-amber-300 transition-colors">LỊCH SỬ CỦA BẠN</Link>
            <Link href="/" className="hover:text-amber-300 transition-colors">VỀ TRANG CHỦ</Link>
          </div>
          <p className="text-[10px] text-[#ebdcb9]/30 tracking-widest mt-2">
            &copy; 2026 ASTROFLOAT TAROT SYSTEM. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* Global CSS for Tarot Animations */}
      <style jsx global>{`
        .font-serif {
          font-family: var(--font-serif), Georgia, serif;
        }
        .font-sans {
          font-family: var(--font-outfit), ui-sans-serif, system-ui, sans-serif;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .tarot-glass {
          background: rgba(15, 10, 25, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(235, 220, 185, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
        }
        .tarot-glass-hover {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tarot-glass-hover:hover {
          background: rgba(25, 15, 40, 0.7);
          border-color: rgba(235, 220, 185, 0.2);
          box-shadow: 0 12px 40px 0 rgba(168, 85, 247, 0.15), inset 0 0 20px rgba(251, 191, 36, 0.03);
          transform: translateY(-4px);
        }
        /* Custom scrollbar for mysticism */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #07050f;
        }
        ::-webkit-scrollbar-thumb {
          background: #3c2317;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #b45309;
        }
      `}</style>
    </div>
  );
}
