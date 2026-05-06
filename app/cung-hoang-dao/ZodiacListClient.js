'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Sun, ArrowRight, Database, X, Lock, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabase';
import { authService } from '@/services/authService';
import { ROUTES } from '@/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 20 }
  }
};

export default function ZodiacListClient({ initialData }) {
  const [data] = useState(initialData || []);
  const [dob, setDob] = useState('');
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Chỉ chạy ở phía Client
    const savedDob = localStorage.getItem('astrofloat_dob') || '';
    setDob(savedDob);

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        try {
          const profile = await authService.getUserProfile(data.session.user.id);
          if (!savedDob && profile.birth_date) {
            setDob(profile.birth_date.substring(0, 10));
          }
        } catch(e) {}
      }
    });
  }, []);

  const handleLookup = () => {
    if (!dob) return;
    const date = new Date(dob);
    if (isNaN(date)) return;
    const d = date.getDate();
    const m = date.getMonth() + 1;
    router.push(`/cung-hoang-dao/sinh-ngay-${d}-thang-${m}-la-cung-gi`);
  };

  return (
    <div className="flex flex-col items-center pt-32 pb-20 px-6 relative z-10 w-full max-w-7xl mx-auto min-h-[80vh]">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12">
        <span className="inline-block py-1.5 px-4 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-[0.25em] mb-4 uppercase">
          CHIÊM TINH HỌC
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 pb-2">
          Cung Hoàng Đạo
        </h1>
        
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 px-4 relative z-20">
          <Link href={ROUTES.ZODIAC_MATCH} className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="w-full px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 text-white font-black tracking-[0.2em] text-xs uppercase transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(236,72,153,0.3)] border border-white/10"
            >
              <Zap className="w-4 h-4 fill-white" />
              Kiểm Tra Tương Hợp
            </motion.button>
          </Link>
          <Link href={ROUTES.ZODIAC_ALL_MATCHES} className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="w-full px-10 py-4 rounded-2xl bg-slate-900 border border-indigo-500/30 text-indigo-300 hover:text-white font-black tracking-[0.2em] text-xs uppercase transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(79,70,229,0.1)] hover:bg-indigo-500/10"
            >
              <Sparkles className="w-4 h-4" />
              Bảng Xếp Hạng
            </motion.button>
          </Link>
          {!session && (
            <Link href={ROUTES.LOGIN} className="w-full sm:w-auto">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full px-8 py-3 rounded-full bg-slate-800 border border-slate-700 text-gray-400 font-bold tracking-widest text-sm uppercase transition-all flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" /> Đăng nhập để xem Matrix
              </motion.button>
            </Link>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-12 w-full max-w-lg mx-auto bg-slate-900/80 p-6 md:p-8 rounded-[2rem] border border-cyan-500/20 shadow-2xl flex flex-col sm:flex-row gap-4 items-center relative z-20">
        <div className="flex-1 w-full relative">
          <label className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-2 block px-2">Ngày sinh của bạn</label>
          <div className="flex gap-2 items-center w-full">
            <input type="date" value={dob} onChange={(e) => { setDob(e.target.value); localStorage.setItem('astrofloat_dob', e.target.value); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
            {dob && (
              <button onClick={() => { setDob(''); localStorage.removeItem('astrofloat_dob'); }} className="flex-shrink-0 p-3 rounded-xl bg-black/40 border border-white/10 text-cyan-500/70 hover:text-cyan-400 transition-all flex items-center justify-center cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="w-full sm:w-auto sm:self-end">
          <button onClick={handleLookup} disabled={!dob} className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50 transition-all h-[48px] uppercase">
            Giải Mã
          </button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {data.map((sign, index) => (
          <Link href={ROUTES.ZODIAC_DETAIL(sign.id)} key={sign.id} className="block">
            <motion.div variants={itemVariants} className="hover:-translate-y-2 hover:scale-[1.02] group p-[1px] rounded-[2rem] overflow-hidden bg-gradient-to-b from-white/10 to-transparent shadow-xl h-full transition-transform duration-300">
              <div className="relative h-full px-8 py-10 bg-slate-900/80 rounded-[31px] flex flex-col justify-between border border-white/5 transition-colors group-hover:bg-slate-900/90">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold text-white tracking-tight">{sign.name}</h2>
                    <span className="text-[10px] uppercase font-bold text-cyan-300 border border-cyan-400/20 px-3 py-1.5 rounded-full bg-cyan-950/40">
                      {sign.english_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 rounded-full bg-cyan-900/30 border border-cyan-500/10">
                      {String(sign.element).toLowerCase() === "nước" ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-orange-400" />}
                    </div>
                    <p className="text-cyan-200 text-sm font-semibold">{sign.element}</p>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed font-light line-clamp-3">
                    {sign.description || "Chưa có mô tả cho cung này."}
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-white/5 flex justify-between items-center text-xs text-cyan-400/60 font-semibold tracking-widest uppercase">
                  <span>KHÁM PHÁ</span>
                  <ArrowRight className="w-4 h-4 text-cyan-300 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
