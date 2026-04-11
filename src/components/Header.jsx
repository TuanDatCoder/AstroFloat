import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, LogIn, User, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

const navLinks = [
  { to: '/discover', label: 'GIẢI MÃ', activeColor: 'text-emerald-300', glowColor: 'rgba(16,185,129,0.8)', hoverClass: 'hover:text-emerald-300' },
  { to: '/zodiac', label: 'CHÒM SAO', activeColor: 'text-cyan-300', glowColor: 'rgba(34,211,238,0.8)', hoverClass: 'hover:text-cyan-300', exact: false, excludes: 'match' },
  { to: '/zodiac-match', label: 'TƯƠNG HỢP', activeColor: 'text-pink-300', glowColor: 'rgba(244,114,182,0.8)', hoverClass: 'hover:text-pink-300' },
  { to: '/numerology', label: 'THẦN SỐ HỌC', activeColor: 'text-purple-300', glowColor: 'rgba(168,85,247,0.8)', hoverClass: 'hover:text-purple-300' },
  { to: '/name-numerology', label: 'THẦN SỐ TÊN', activeColor: 'text-indigo-300', glowColor: 'rgba(129,140,248,0.8)', hoverClass: 'hover:text-indigo-300' },
];

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('nickname, avatar_url')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isActive = (link) => {
    if (link.excludes) return path.startsWith(link.to) && !path.includes(link.excludes);
    return path.startsWith(link.to);
  };

  return (
    <header className="relative z-50 w-full">
      {/* Đường glow mỏng chạy ngang dưới header */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <nav className="flex items-center justify-between px-6 lg:px-10 h-16 bg-black/30 backdrop-blur-xl">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6, ease: 'easeInOut' }}>
            <Sparkles className="w-5 h-5 text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
          </motion.div>
          <span className="text-lg font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300">
            AstroFloat
          </span>
        </Link>

        {/* NAV LINKS — Desktop */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-3.5 py-1.5 group"
              >
                {/* Background highlight khi active */}
                {active && (
                  <motion.span
                    layoutId="nav-highlight"
                    className="absolute inset-0 rounded-full bg-white/5 border border-white/10"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 text-xs font-bold tracking-[0.12em] transition-all duration-200 ${
                    active
                      ? `${link.activeColor} drop-shadow-[0_0_8px_${link.glowColor}]`
                      : `text-gray-400 ${link.hoverClass}`
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* AUTH BUTTON */}
        <div className="shrink-0">
          <AnimatePresence mode="wait">
            {session ? (
              <motion.div key="user" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                    {(profile?.nickname || session.user.email || '?').slice(0, 1).toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-white/90 max-w-[100px] truncate">
                    {profile?.nickname || session.user.email?.split('@')[0]}
                  </span>
                </Link>
              </motion.div>
            ) : (
              <motion.div key="login" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <Link
                  to="/login"
                  className="group relative flex items-center gap-2 px-5 py-2 rounded-full font-bold text-white text-sm tracking-[0.12em] overflow-hidden transition-all duration-300"
                >
                  {/* Nền gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/70 to-purple-500/70 rounded-full" />
                  {/* Viền sáng nhỏ */}
                  <div className="absolute inset-0 rounded-full border border-white/20" />
                  {/* Hiệu ứng lướt sáng khi hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <LogIn className="w-3.5 h-3.5 relative z-10 shrink-0" />
                  <span className="relative z-10">ĐĂNG NHẬP</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* NAV LINKS — Mobile (chạy theo hàng ngang bên dưới) */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto scrollbar-none px-4 py-2 bg-black/20 backdrop-blur-md border-t border-white/5">
        {navLinks.map((link) => {
          const active = isActive(link);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold tracking-[0.1em] transition-all shrink-0 ${
                active
                  ? `${link.activeColor} bg-white/8 border border-white/10`
                  : `text-gray-500 ${link.hoverClass}`
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
