'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Database, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { numerologyService } from '@/services/numerologyService';
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

export default function NumerologyListClient({ initialData }) {
  const [data] = useState(initialData || []);
  const [dob, setDob] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const savedDob = localStorage.getItem('astrofloat_dob') || '';
    setDob(savedDob);

    const checkAuth = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session?.user) {
          const profile = await authService.getUserProfile(sessionData.session.user.id);
          if (!savedDob && profile.birth_date) {
            setDob(profile.birth_date.substring(0, 10));
          }
        }
      } catch (e) {}
    };
    checkAuth();
  }, []);

  const handleLookup = () => {
    if (!dob) return;
    setError(null);
    try {
      const number = numerologyService.calculateLifePathNumber(dob);
      if (number) {
        router.push(`/than-so-hoc/${number}`);
      } else {
        setError("Ngày sinh không hợp lệ.");
      }
    } catch (err) {
      setError("Đã xảy ra lỗi khi tính toán.");
    }
  };

  return (
    <div className="flex flex-col items-center pt-32 pb-20 px-6 relative z-10 w-full max-w-7xl mx-auto min-h-[80vh]">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
        <span className="inline-block py-1.5 px-4 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-semibold tracking-[0.25em] mb-4 uppercase">
          PHÂN TÍCH TẦN SỐ RUNG ĐỘNG
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-400 to-pink-400 pb-2">
          Thần Số Học
        </h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-12 w-full max-w-lg mx-auto bg-slate-900/80 p-6 md:p-8 rounded-[2rem] border border-purple-500/20 shadow-2xl flex flex-col sm:flex-row gap-4 items-center relative z-20">
        <div className="flex-1 w-full relative">
          <label className="text-[10px] uppercase font-bold tracking-widest text-purple-400 mb-2 block px-2">Ngày sinh của bạn</label>
          <div className="flex gap-2 items-center w-full">
            <input type="date" value={dob} onChange={(e) => { setDob(e.target.value); localStorage.setItem('astrofloat_dob', e.target.value); }} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors" />
            {dob && (
              <button onClick={() => { setDob(''); localStorage.removeItem('astrofloat_dob'); }} className="flex-shrink-0 p-3 rounded-xl bg-black/40 border border-white/10 text-purple-500/70 hover:text-purple-400 transition-all flex items-center justify-center cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="w-full sm:w-auto sm:self-end">
          <button onClick={handleLookup} disabled={!dob} className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 rounded-xl font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50 transition-all h-[48px] uppercase">
            Giải Mã
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-red-400 mb-8 bg-red-950/40 px-6 py-3 rounded-xl border border-red-500/20">
            Lỗi: {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {data.map((item, index) => (
          <Link href={`/than-so-hoc/${item.number}`} key={item.number} className="block">
            <motion.div variants={itemVariants} className="hover:-translate-y-2 hover:scale-[1.02] group p-[1px] rounded-[2rem] overflow-hidden bg-gradient-to-b from-white/10 to-transparent shadow-xl h-full transition-transform duration-300">
              <div className="relative h-full px-8 py-10 bg-slate-900/90 rounded-[31px] flex flex-col justify-between border border-white/5 transition-colors group-hover:bg-slate-900/70">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-purple-400 opacity-90 tracking-tighter drop-shadow-lg">
                      {item.number}
                    </span>
                    <div className="bg-purple-900/30 p-2.5 rounded-2xl border border-purple-500/20">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white tracking-wide">{item.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed font-light mb-6 line-clamp-2">{item.traits}</p>
                </div>
                <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center text-xs text-purple-400/60 font-semibold tracking-widest uppercase">
                  <span>CHI TIẾT VẬN MỆNH</span>
                  <ArrowRight className="w-4 h-4 text-purple-300 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
