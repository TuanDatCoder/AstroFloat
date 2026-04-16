import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, LogIn, User, ChevronRight, Menu as MenuIcon, X } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [path]);

  const isActive = (link) => {
    if (link.excludes) return path.startsWith(link.to) && !path.includes(link.excludes);
    return path.startsWith(link.to);
  };

  return (
    <header className="relative z-[100] w-full">
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
        <nav className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 group"
              >
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

        {/* RIGHT SIDE: AUTH + MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <AnimatePresence mode="wait">
              {session ? (
                <motion.div key="user" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all shadow-inner"
                  >
                    {profile?.avatar_url ? (
                      <div className="w-7 h-7 rounded-full border border-white/20 shrink-0 overflow-hidden shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                        <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
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
                </motion.div>
              ) : (
                <motion.div key="login" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                  <Link
                    to="/login"
                    className="group relative flex items-center gap-2 px-5 py-2 rounded-full font-bold text-white text-[11px] tracking-[0.15em] overflow-hidden transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600" />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <LogIn className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">LOGIN</span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/80 active:scale-95 transition-all"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-[-1]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-4/5 max-w-sm bg-[#0B0F19]/90 backdrop-blur-3xl border-l border-white/5 lg:hidden z-[-1] p-8 flex flex-col gap-6"
            >
              <div className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase mb-4">
                Danh Mục
              </div>
              
              <div className="flex flex-col gap-2">
                {navLinks.map((link, idx) => {
                  const active = isActive(link);
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        className={`flex items-center justify-between px-6 py-5 rounded-3xl border transition-all ${
                          active 
                            ? `bg-white/5 border-white/10 ${link.activeColor}` 
                            : 'bg-transparent border-transparent text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="text-sm font-black tracking-widest">{link.label}</span>
                        <ChevronRight className={`w-4 h-4 ${active ? 'opacity-100' : 'opacity-30'}`} />
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-auto p-8 rounded-[2rem] bg-gradient-to-br from-purple-500/10 to-transparent border border-white/5 text-center">
                <Sparkles className="w-8 h-8 text-purple-400/40 mx-auto mb-4" />
                <p className="text-[10px] text-white/30 font-medium tracking-widest leading-relaxed uppercase">
                  Giải mã vận mệnh <br /> cùng AstroFloat
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
