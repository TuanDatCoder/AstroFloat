'use client';

import React, { useState, useEffect } from 'react';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import Link from 'next/link';
import { Sparkles, History, Calendar, LayoutGrid, ArrowLeft } from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { supabase } from '@/services/supabase';
import TarotIcon from '@/components/TarotIcon';
import CosmicEnergyIcon from '@/components/CosmicEnergyIcon';
import LightningIcon from '@/components/LightningIcon';

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif'
});

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans'
});

export default function TarotLayout({ children }) {
  const [energy, setEnergy] = useState(null);
  const [maxEnergy, setMaxEnergy] = useState(20);
  const [isEnergyPopoverOpen, setIsEnergyPopoverOpen] = useState(false);

  const fetchEnergy = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = {};
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      const res = await fetch('/api/energy', { headers });
      const data = await res.json();
      if (data.success) {
        setEnergy(data.energy);
        setMaxEnergy(data.max_energy);
      }
    } catch (err) {
      console.warn("Lỗi fetch năng lượng ở Tarot:", err);
    }
  };

  useEffect(() => {
    fetchEnergy();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchEnergy();
    });

    const handleEnergyUpdate = (e) => {
      if (e.detail && typeof e.detail.energy === 'number') {
        setEnergy(e.detail.energy);
        setMaxEnergy(e.detail.maxEnergy);
      } else {
        fetchEnergy();
      }
    };

    window.addEventListener('astro:energy-update', handleEnergyUpdate);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('astro:energy-update', handleEnergyUpdate);
    };
  }, []);

  return (
    <div className={`${cormorant.variable} ${plusJakartaSans.variable} font-sans min-h-screen bg-[#03050c] text-[#e2e8f0] overflow-x-hidden relative flex flex-col selection:bg-indigo-950 selection:text-cyan-200`}>
      {/* Mystical Background Stars & Nebula */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0b0f24]/30 via-[#03050c] to-[#03050c]" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-950/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-950/20 blur-[150px] animate-pulse" style={{ animationDuration: '12s' }} />
        
        {/* Star Grid Pattern */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Tarot Header */}
      <header className="relative z-50 border-b border-indigo-950/40 bg-[#03050c]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xs uppercase tracking-widest text-[#94a3b8] hover:text-[#f8fafc] flex items-center gap-1.5 transition-colors border border-indigo-950/40 rounded-full px-3.5 py-1.5 bg-indigo-950/25">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Về Góc Vũ Trụ</span>
            </Link>
            
            <Link href="/tarot" className="flex items-center gap-3 group">
              <div className="relative">
                <TarotIcon className="w-9 h-9 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-purple-400/10 blur-md rounded-full -z-10" />
              </div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest bg-gradient-to-r from-indigo-200 via-purple-200 to-cyan-200 bg-clip-text text-transparent group-hover:brightness-110 transition-all">
                TAROT GÓC VŨ TRỤ
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1.5">
            <Link href="/tarot" className="font-serif px-4 py-2 text-sm tracking-widest text-[#e2e8f0]/80 hover:text-cyan-200 transition-colors flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-purple-400" />
              TRẢI BÀI TAROT
            </Link>
            <Link href="/tarot/daily" className="font-serif px-4 py-2 text-sm tracking-widest text-[#e2e8f0]/80 hover:text-cyan-200 transition-colors flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              HẰNG NGÀY
            </Link>
            <Link href="/tarot/history" className="font-serif px-4 py-2 text-sm tracking-widest text-[#e2e8f0]/80 hover:text-cyan-200 transition-colors flex items-center gap-2 mr-2">
              <History className="w-4 h-4 text-purple-400" />
              LỊCH SỬ
            </Link>

            {/* ENERGY BAR FOR TAROT */}
            {energy !== null && (
              <Link
                href="/tarot/nap-nang-luong"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-950/45 bg-indigo-950/20 hover:bg-indigo-950/40 hover:border-purple-500/40 transition-all relative group/energy select-none ml-2"
                onMouseEnter={() => setIsEnergyPopoverOpen(true)}
                onMouseLeave={() => setIsEnergyPopoverOpen(false)}
              >
                <CosmicEnergyIcon className="w-5 h-5" />
                <div className="flex flex-col items-start gap-px">
                  <div className="flex items-center gap-1 text-[10px] font-black font-sans tracking-wide text-gray-400">
                    <span className="text-[#f8fafc] font-bold text-xs">{energy}</span>
                    <LightningIcon className="w-3.5 h-3.5 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                  </div>
                </div>

                {/* Energy Popover */}
                <AnimatePresence>
                  {isEnergyPopoverOpen && (
                    <m.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full pt-3 w-60 z-50 pointer-events-none"
                    >
                      <div className="bg-[#0B0F19]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-4 text-left">
                        <h4 className="text-xs font-black uppercase text-white tracking-widest mb-1.5 flex items-center gap-1.5 font-sans">
                          <CosmicEnergyIcon className="w-4 h-4" /> Năng Lượng Vũ Trụ
                        </h4>
                        <p className="text-[10px] text-gray-400 font-light leading-relaxed mb-2.5 font-sans">
                          Tiêu hao khi sử dụng các tính năng AI. Tự hồi phục +1/giờ.
                        </p>
                        <div className="text-[10px] font-bold text-purple-300 tracking-wide flex items-center gap-1 border-t border-white/5 pt-2 font-sans">
                          ⚡ Nhấp để nạp thêm năng lượng →
                        </div>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </Link>
            )}
          </nav>

          {/* Mobile Nav Trigger Indicator */}
          <div className="flex lg:hidden items-center gap-4">
            {energy !== null && (
              <Link
                href="/tarot/nap-nang-luong"
                className="flex items-center gap-1.5 bg-indigo-950/20 px-2.5 py-1.5 rounded-full border border-indigo-950/45 hover:border-purple-500/40 hover:bg-indigo-950/40 transition-all select-none mr-1"
              >
                <CosmicEnergyIcon className="w-4 h-4" />
                <span className="text-white font-bold font-sans text-xs">{energy}</span>
              </Link>
            )}
            <Link href="/tarot/history" className="p-2 border border-indigo-950/40 rounded-full bg-indigo-950/20 hover:text-cyan-200 transition-colors" title="Lịch sử">
              <History className="w-4 h-4 text-purple-400" />
            </Link>
            <Link href="/tarot/daily" className="p-2 border border-indigo-950/40 rounded-full bg-indigo-950/20 hover:text-cyan-200 transition-colors" title="Hằng ngày">
              <Calendar className="w-4 h-4 text-purple-400" />
            </Link>
            <Link href="/tarot" className="p-2 border border-indigo-950/40 rounded-full bg-indigo-950/20 hover:text-cyan-200 transition-colors" title="Trải bài">
              <LayoutGrid className="w-4 h-4 text-purple-400" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow">
        {children}
      </main>

      {/* Tarot Footer */}
      <footer className="relative z-10 border-t border-purple-900/20 bg-[#03050c] pt-16 pb-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand & Vision */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <Link href="/tarot" className="flex items-center gap-3 group mb-4">
                <TarotIcon className="w-8 h-8 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                <span className="font-serif text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-cyan-200">
                  TAROT GÓC VŨ TRỤ
                </span>
              </Link>
              <p className="text-slate-400 text-sm font-light leading-relaxed max-w-xs">
                &ldquo;Quá khứ đã là lịch sử, tương lai là một ẩn số, còn hiện tại là một món quà.&rdquo; Khám phá bản đồ năng lượng của bạn thông qua sự kỳ diệu của 78 lá bài.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-serif text-white font-bold tracking-widest uppercase mb-6 text-sm">Trải Bài & Công Cụ</h3>
              <ul className="space-y-3">
                <li><Link href="/tarot" className="text-sm text-slate-400 hover:text-purple-300 transition-colors">Trải Bài Chuyên Sâu</Link></li>
                <li><Link href="/tarot/daily" className="text-sm text-slate-400 hover:text-purple-300 transition-colors">Thông Điệp Hằng Ngày</Link></li>
                <li><Link href="/tarot/thu-vien" className="text-sm text-slate-400 hover:text-purple-300 transition-colors">Thư Viện 78 Lá Bài</Link></li>
                <li><Link href="/tarot/history" className="text-sm text-slate-400 hover:text-purple-300 transition-colors">Lịch Sử Của Bạn</Link></li>
              </ul>
            </div>

            {/* Global Links */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h3 className="font-serif text-white font-bold tracking-widest uppercase mb-6 text-sm">Hệ Sinh Thái</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-sm text-slate-400 hover:text-cyan-300 transition-colors">Về Trang Chủ Góc Vũ Trụ</Link></li>
                <li><Link href="/dem-ngay-yeu" className="text-sm text-slate-400 hover:text-rose-400 transition-colors">Đếm Ngày Yêu</Link></li>
                <li><a href="mailto:devprojectlabvn@gmail.com" className="text-sm text-slate-400 hover:text-cyan-300 transition-colors">Liên hệ hợp tác</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-purple-900/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="flex flex-wrap items-center justify-center gap-2 text-slate-500 text-[11px] font-medium tracking-widest uppercase">
              <span>&copy; {new Date().getFullYear()}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Góc Vũ Trụ</span>
              <span className="w-1 h-1 rounded-full bg-slate-700 inline-block" />
              <span>Crafted with</span>
              <Sparkles className="w-3 h-3 text-purple-400" />
              <Link href="/tarot/family-love-studio" className="hover:text-purple-300 transition-colors cursor-pointer border-b border-transparent hover:border-purple-400/50 pb-0.5">
                by Family Love Studio
              </Link>
            </p>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="text-[10px] text-purple-400 hover:text-purple-300 tracking-widest uppercase transition-colors font-bold flex items-center gap-1"
              >
                Lên Đầu Trang &uarr;
              </button>
              <span className="text-slate-800">|</span>
              <Link href="/tarot/chinh-sach-bao-mat" className="text-[10px] text-slate-500 hover:text-slate-300 tracking-widest uppercase transition-colors">Bảo Mật</Link>
              <Link href="/tarot/dieu-khoan-su-dung" className="text-[10px] text-slate-500 hover:text-slate-300 tracking-widest uppercase transition-colors">Điều Khoản</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Global CSS for Tarot Animations */}
      <style jsx global>{`
        .font-serif {
          font-family: var(--font-serif), Georgia, serif;
        }
        .font-sans {
          font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .tarot-glass {
          background: rgba(10, 15, 30, 0.6);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(168, 85, 247, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
        }
        .tarot-glass-hover {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .tarot-glass-hover:hover {
          background: rgba(15, 20, 45, 0.7);
          border-color: rgba(168, 85, 247, 0.2);
          box-shadow: 0 12px 40px 0 rgba(168, 85, 247, 0.15), inset 0 0 20px rgba(6, 182, 212, 0.03);
          transform: translateY(-4px);
        }
        /* Custom scrollbar for mysticism */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #03050c;
        }
        ::-webkit-scrollbar-thumb {
          background: #1e1b4b;
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #4f46e5;
        }
      `}</style>
    </div>
  );
}
