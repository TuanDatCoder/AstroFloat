'use client';

import React from 'react';
import { m } from 'framer-motion';
import Link from 'next/link';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Send from 'lucide-react/dist/esm/icons/send';
import Mail from 'lucide-react/dist/esm/icons/mail';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';
import { supabase } from '@/services/supabase';
import { ROUTES } from '@/constants';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 w-full border-t border-white/5 bg-[#0B0F19]/80 pt-20 pb-10 px-6 lg:px-12 mt-20 overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.3)]" />
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,_rgba(147,51,234,0.12)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 relative z-10">
        <div className="flex flex-col items-start space-y-6">
          <div className="flex items-center gap-3 text-2xl font-black tracking-tighter">
            <m.div whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }}>
              <Sparkles className="w-7 h-7 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
            </m.div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400">
              Góc Vũ Trụ
            </span>
          </div>
          <p className="text-gray-400 text-sm font-light leading-relaxed max-w-xs text-left">
            Khám phá hành trình tâm linh qua nhịp đập của những con số và sự sắp đặt của tinh tú. Cùng bạn kết nối với bản ngã thực sự.
          </p>
          <div className="flex items-center gap-4">
            {[
              { Icon: Globe, color: 'hover:text-blue-400', label: 'Trang web' },
              { Icon: Mail, color: 'hover:text-pink-400', label: 'Email liên hệ' },
              { Icon: Send, color: 'hover:text-red-400', label: 'Kênh Telegram' }
            ].map(({ Icon, color, label }, i) => (
              <m.a key={i} href="#" aria-label={label} whileHover={{ y: -5, scale: 1.1 }} className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all ${color} shadow-lg`}>
                <Icon className="w-5 h-5" />
              </m.a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start">
          <h2 className="text-white font-black text-xs tracking-[0.3em] uppercase mb-8 opacity-70">Công Cụ</h2>
          <ul className="space-y-4 w-full flex flex-col items-start">
            {[
              { href: ROUTES.DISCOVER, label: 'Giải Mã Vận Mệnh' },
              { href: ROUTES.ZODIAC, label: '12 Chòm Sao' },
              { href: ROUTES.ZODIAC_MATCH, label: 'Tương Hợp Cung' },
              { href: ROUTES.NUMEROLOGY, label: 'Thần Số Học' },
              { href: ROUTES.NAME_NUMEROLOGY, label: 'Thần Số Tên' },
              { href: 'https://tinhyeu.gocvutru.com/', label: 'Đếm Ngày Yêu', external: true }
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} className="group flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm font-medium">
                  <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-cyan-400" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-start text-left">
          <h2 className="text-white font-black text-xs tracking-[0.3em] uppercase mb-8 opacity-70">Liên Hệ</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <span className="hover:text-cyan-300 transition-colors cursor-pointer">devprojectlabvn@gmail.com</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <h2 className="text-white font-black text-xs tracking-[0.3em] uppercase mb-8 opacity-70">Sứ Mệnh</h2>
          <p className="text-gray-400 text-sm font-light mb-6 text-left leading-relaxed">
            Góc Vũ Trụ mong muốn mang lại những góc nhìn sâu sắc về bản thân thông qua ngôn ngữ của những vì sao và con số.
          </p>
          <div className="flex flex-col items-start gap-2">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Hợp tác & Feedback</span>
            <a href="mailto:devprojectlabvn@gmail.com" className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors font-medium">
              devprojectlabvn@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="flex items-center gap-2 text-gray-400 text-[11px] font-medium tracking-widest uppercase">
            <span>&copy; {new Date().getFullYear()}</span>
            <span className="w-1 h-1 rounded-full bg-white/20 inline-block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Góc Vũ Trụ</span>
            <span className="w-1 h-1 rounded-full bg-white/20 inline-block" />
            <span>Crafted with</span>
            <Sparkles className="w-3 h-3 text-purple-400" />
            <Link href={ROUTES.FAMILY_LOVE_STUDIO} className="hover:text-purple-300 transition-colors cursor-pointer border-b border-transparent hover:border-purple-400/50 pb-0.5">
              by Family Love Studio
            </Link>
          </p>
          <div className="flex items-center gap-2">
            <Link href={ROUTES.TERMS} className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">Điều khoản</Link>
            <span className="w-px h-3 bg-white/10" />
            <Link href={ROUTES.PRIVACY} className="px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">Bảo mật</Link>
            <span className="w-px h-3 bg-white/10 mx-1" />
            <m.button onClick={scrollToTop} whileHover={{ y: -3, scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 text-purple-300 hover:text-white hover:border-purple-400/40 transition-all group">
              <span className="text-[10px] font-black tracking-widest uppercase">Lên đầu</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </m.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
