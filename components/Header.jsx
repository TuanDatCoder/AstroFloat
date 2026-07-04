'use client';

import React, { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import LogIn from 'lucide-react/dist/esm/icons/log-in';
import User from 'lucide-react/dist/esm/icons/user';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import MenuIcon from 'lucide-react/dist/esm/icons/menu';
import X from 'lucide-react/dist/esm/icons/x';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import LayoutGrid from 'lucide-react/dist/esm/icons/layout-grid';
import Heart from 'lucide-react/dist/esm/icons/heart';
import Dices from 'lucide-react/dist/esm/icons/dices';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import Bot from 'lucide-react/dist/esm/icons/bot';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { supabase } from '@/services/supabase';
import { ROUTES } from '@/constants';
import TarotIcon from '@/components/TarotIcon';

const navLinks = [
  { to: ROUTES.ZODIAC, label: 'CHÒM SAO', activeColor: 'text-cyan-300', glowColor: 'rgba(34,211,238,0.8)', hoverClass: 'hover:text-cyan-300', excludes: 'match' },
  { to: ROUTES.ZODIAC_MATCH, label: 'TƯƠNG HỢP', activeColor: 'text-pink-300', glowColor: 'rgba(244,114,182,0.8)', hoverClass: 'hover:text-pink-300' },
  { to: ROUTES.DISCOVER, label: 'GIẢI MÃ', activeColor: 'text-emerald-300', glowColor: 'rgba(16,185,129,0.8)', hoverClass: 'hover:text-emerald-300' },
  { to: ROUTES.NUMEROLOGY, label: 'THẦN SỐ HỌC', activeColor: 'text-purple-300', glowColor: 'rgba(168,85,247,0.8)', hoverClass: 'hover:text-purple-300', excludes: 'theo-ten' },
  { to: ROUTES.NAME_NUMEROLOGY, label: 'THẦN SỐ TÊN', activeColor: 'text-indigo-300', glowColor: 'rgba(129,140,248,0.8)', hoverClass: 'hover:text-indigo-300' },
  { to: ROUTES.TAROT, label: 'TAROT', activeColor: 'text-fuchsia-300', glowColor: 'rgba(240,79,255,0.8)', hoverClass: 'hover:text-fuchsia-300' },
  { to: ROUTES.NEWS, label: 'TIN TỨC', activeColor: 'text-yellow-300', glowColor: 'rgba(253,224,71,0.8)', hoverClass: 'hover:text-yellow-300' },
];

export default function Header() {
  const path = usePathname();
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('nickname, avatar_url, role')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
    }).catch(err => console.warn("Lỗi getSession:", err));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [path]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAppsDropdownOpen, setIsAppsDropdownOpen] = useState(false);

  const isActive = (link) => {
    if (link.excludes) return path.startsWith(link.to) && !path.includes(link.excludes);
    return path.startsWith(link.to);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setIsUserDropdownOpen(false);
  };

  return (
    <header className="relative z-[100] w-full">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <nav className="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-16 bg-black/60 ">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <m.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6, ease: 'easeInOut' }}>
            <Sparkles className="w-5 h-5 text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
          </m.div>
          <span className="text-lg font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300">
            Góc Vũ Trụ
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <Link key={link.to} href={link.to} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} className="relative px-2 xl:px-4 py-2 group">
                {active && (
                  <m.span
                    layoutId="nav-highlight"
                    className="absolute inset-0 rounded-full bg-white/5 border border-white/10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className={`whitespace-nowrap relative z-10 text-[10px] xl:text-xs font-bold tracking-wider xl:tracking-[0.12em] transition-all duration-200 ${
                  active ? `${link.activeColor} drop-shadow-[0_0_8px_${link.glowColor}]` : `text-gray-400 ${link.hoverClass}`
                }`}>
                  {link.label}
                </span>
              </Link>
            );
          })}

        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* TIỆN ÍCH DROPDOWN (GÓC PHẢI) */}
          <div 
            className="hidden lg:block relative group/apps"
            onMouseEnter={() => setIsAppsDropdownOpen(true)}
            onMouseLeave={() => setIsAppsDropdownOpen(false)}
          >
            <button className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors shadow-inner">
              <LayoutGrid className="w-4 h-4 text-cyan-400" />
            </button>

            <AnimatePresence>
              {isAppsDropdownOpen && (
                <m.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full pt-3 w-56 z-50"
                >
                  <div className="bg-[#0B0F19]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2">
                    <Link 
                      href={ROUTES.PREDICTIONS} 
                      onClick={() => setIsAppsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
                        <Dices className="w-4 h-4 text-rose-400" />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white uppercase tracking-widest mb-0.5">Vòng Quay</div>
                        <div className="text-[9px] text-gray-400 uppercase tracking-wider">Dự đoán tương lai</div>
                      </div>
                    </Link>
                    
                    <Link 
                      href={ROUTES.DEM_NGAY_YEU} 
                      onClick={() => setIsAppsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all group border-t border-white/5"
                    >
                      <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/20 group-hover:scale-110 transition-transform">
                        <Heart className="w-4 h-4 text-pink-400" />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white uppercase tracking-widest mb-0.5">Đếm Ngày Yêu</div>
                        <div className="text-[9px] text-gray-400 uppercase tracking-wider">Lưu giữ kỷ niệm</div>
                      </div>
                    </Link>
                    
                    <Link 
                      href={ROUTES.TAROT} 
                      onClick={() => setIsAppsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all group border-t border-white/5"
                    >
                      <div className="w-8 h-8 rounded-full bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20 group-hover:scale-110 transition-transform">
                        <TarotIcon className="w-6 h-6 text-fuchsia-400" />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white uppercase tracking-widest mb-0.5">Tarot Góc Vũ Trụ</div>
                        <div className="text-[9px] text-gray-400 uppercase tracking-wider">Khám phá thông điệp</div>
                      </div>
                    </Link>
                    <Link 
                      href={ROUTES.ASTRO} 
                      onClick={() => setIsAppsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-all group border-t border-white/5"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform">
                        <Bot className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white uppercase tracking-widest mb-0.5">Tr&#x1ee3; L&#xfd; Astro</div>
                        <div className="text-[9px] text-gray-400 uppercase tracking-wider">G&#x1eb7;p g&#x1ee1; &amp; T&#x01b0;&#x01a1;ng t&#xf3;c</div>
                      </div>
                    </Link>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          </div>

          {profile?.role === 'ADMIN' && (
            <m.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <Link href="/admin" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 transition-all group shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <ShieldCheck className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden md:inline">Admin</span>
              </Link>
            </m.div>
          )}

          <div className="shrink-0 relative">
            <AnimatePresence mode="wait">
              {session ? (
                <div 
                  className="relative group/user"
                  onMouseEnter={() => setIsUserDropdownOpen(true)}
                  onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  <m.div key="user" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Link 
                      href={ROUTES.PROFILE}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all shadow-inner"
                    >
                      {profile?.avatar_url ? (
                        <div className="w-7 h-7 rounded-full border border-white/20 shrink-0 overflow-hidden shadow-[0_0_8px_rgba(34,211,238,0.4)] relative">
                          <Image src={profile.avatar_url} alt="Avatar" fill sizes="28px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                          {(profile?.nickname || session.user.email || '?').slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <span className="hidden sm:inline-block text-xs font-semibold text-white/90 max-w-[100px] truncate">
                        {profile?.nickname || session.user.email?.split('@')[0]}
                      </span>
                    </Link>
                  </m.div>

                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <m.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full pt-3 w-48 z-50"
                      >
                        <div className="bg-[#0B0F19]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1">
                          <Link 
                            href={ROUTES.PROFILE} 
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-[11px] font-black text-gray-300 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
                          >
                            <User className="w-4 h-4" /> Xem hồ sơ
                          </Link>
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-black text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all uppercase tracking-widest border-t border-white/5"
                          >
                            <LogIn className="w-4 h-4 rotate-180" /> Đăng xuất
                          </button>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <m.div key="login" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <Link href={ROUTES.LOGIN} className="group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold text-white text-[10px] sm:text-[11px] tracking-wider sm:tracking-[0.15em] overflow-hidden transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600" />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <LogIn className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">ĐĂNG NHẬP</span>
                  </Link>
                </m.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"} className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 active:scale-95 transition-all">
            {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/60 lg:hidden z-[-1]" />
            <m.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-16 right-0 h-[calc(100dvh-4rem)] w-4/5 max-w-sm bg-[#0B0F19]/90 border-l border-white/5 lg:hidden z-[-1] p-6 sm:p-8 flex flex-col gap-6 overflow-y-auto">
              <div className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-4">Danh Mục</div>
              {profile?.role === 'ADMIN' && (
                <Link href="/admin" className="flex items-center gap-3 px-6 py-4 bg-amber-500/10 border border-amber-500/30 rounded-3xl text-amber-400 mb-2" onClick={() => setIsMenuOpen(false)}>
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-black tracking-widest uppercase">Quản Trị Hệ Thống</span>
                </Link>
              )}
              <div className="flex flex-col gap-2">
                {navLinks.map((link, idx) => {
                  const active = isActive(link);
                  return (
                    <m.div key={link.to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Link href={link.to} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} className={`flex items-center justify-between px-6 py-5 rounded-3xl border transition-all ${active ? `bg-white/5 border-white/10 ${link.activeColor}` : 'bg-transparent border-transparent text-gray-400 hover:text-white'}`}>
                        <span className="text-sm font-black tracking-widest">{link.label}</span>
                        <ChevronRight className={`w-4 h-4 ${active ? 'opacity-100' : 'opacity-30'}`} />
                      </Link>
                    </m.div>
                  );
                })}

                {/* TIỆN ÍCH MOBILE */}
                <m.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navLinks.length * 0.05 }}>
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="text-[10px] font-black tracking-[0.4em] text-cyan-400/50 uppercase mb-4 pl-2">TIỆN ÍCH THÊM</div>
                    
                    <Link href={ROUTES.PREDICTIONS} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-3xl hover:bg-white/5 transition-all">
                      <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                        <Dices className="w-5 h-5 text-rose-400" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-widest mb-1">Vòng Quay</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Dự đoán tương lai</div>
                      </div>
                    </Link>

                    <Link href={ROUTES.DEM_NGAY_YEU} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-3xl hover:bg-white/5 transition-all mt-2">
                      <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center border border-pink-500/20">
                        <Heart className="w-5 h-5 text-pink-400" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-widest mb-1">Đếm Ngày Yêu</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Lưu giữ kỷ niệm</div>
                      </div>
                    </Link>

                    <Link href={ROUTES.TAROT} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 px-4 py-4 rounded-3xl hover:bg-white/5 transition-all mt-2">
                      <div className="w-10 h-10 rounded-full bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20">
                        <TarotIcon className="w-7 h-7 text-fuchsia-400" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-white uppercase tracking-widest mb-1">Tarot Góc Vũ Trụ</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">Khám phá thông điệp</div>
                      </div>
                    </Link>
                  </div>
                </m.div>
              </div>
            </m.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
