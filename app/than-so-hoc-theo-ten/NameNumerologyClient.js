'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, User, Calculator, ArrowRight, Fingerprint } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/services/supabase';
import { authService } from '@/services/authService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function NameNumerologyClient({ initialNumbers }) {
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          const profile = await authService.getUserProfile(session.user.id);
          if (!localStorage.getItem('astrofloat_name') && profile.birth_name) {
            setName(profile.birth_name);
          }
        } catch(e) {}
      }
    };
    checkUser();
  }, []);

  const handleSearch = () => {
    if (!name.trim()) return;
    router.push(`/than-so-hoc-theo-ten/ket-qua?name=${encodeURIComponent(name.trim())}`);
  };

  return (
    <div className="flex flex-col items-center pt-32 pb-32 px-6 relative z-10 w-full max-w-7xl mx-auto min-h-screen">
      
      {/* Optimized Background Decorations */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.05)_0%,_transparent_70%)]" />
        <div className="absolute top-1/4 -left-24 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.06)_0%,_transparent_70%)]" />
        <div className="absolute bottom-1/4 -right-24 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_70%)]" />
      </div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center mb-16 transform-gpu"
      >
        <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-black tracking-[0.2em] mb-6 uppercase shadow-xl">
          <BookOpen className="w-4 h-4" /> Thư Viện Thần Số Học
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight">
          Giải Mã <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">Tên Gọi</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">
          Mỗi cái tên đều mang một tần số rung động riêng biệt, ẩn chứa chìa khóa mở ra cánh cửa về sứ mệnh và vận mệnh của bạn.
        </p>
      </motion.div>

      {/* Search Input Box */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-2xl bg-slate-900 border border-white/10 p-2 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] mb-32 relative overflow-hidden group transform-gpu"
      >
        <div className="bg-slate-800/30 rounded-[2.2rem] p-6 md:p-8 border border-white/5">
          <div className="flex flex-col gap-5">
            <div className="relative group/input">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-400/50 group-focus-within/input:text-purple-400 transition-colors" />
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Nhập tên đầy đủ của bạn..." 
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white text-xl focus:outline-none focus:border-purple-500/50 font-bold transition-all placeholder:text-gray-600" 
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
              />
            </div>
            <button 
              onClick={handleSearch} 
              disabled={!name.trim()} 
              className="relative w-full overflow-hidden rounded-2xl p-[1px] group/btn transition-transform active:scale-[0.98] disabled:opacity-50"
            >
              <div className="absolute inset-[-1000%] animate-[spin_10s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a855f7_0%,#6366f1_50%,#a855f7_100%)] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              <div className="relative w-full h-full bg-slate-900 rounded-2xl py-5 px-8 flex items-center justify-center gap-3 text-purple-400 group-hover/btn:text-white transition-colors">
                <Calculator className="w-5 h-5" /> 
                <span className="font-black uppercase tracking-[0.2em] text-base">Giải Mã Sứ Mệnh</span>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Grid of Numbers */}
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="visible" 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full transform-gpu"
      >
        {initialNumbers.map((num) => (
          <motion.div 
            key={num.id} 
            variants={itemVariants} 
            className="group relative bg-slate-900 border border-white/5 p-10 rounded-[2.5rem] flex flex-col items-center text-center hover:border-purple-500/20 hover:bg-slate-800/50 transition-all duration-500 shadow-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(147,51,234,0.06)_0%,_transparent_60%)] pointer-events-none" />
            
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500/10 to-indigo-600/10 border border-purple-500/20 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <span className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-indigo-300">{num.number}</span>
            </div>
            
            <h3 className="text-3xl font-black text-white mb-4 tracking-tight uppercase group-hover:text-purple-300 transition-colors italic leading-none">{num.title}</h3>
            
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10 line-clamp-3 group-hover:text-gray-400 transition-colors">
              {num.traits}
            </p>
            
            <button 
              onClick={() => router.push(`/than-so-hoc-theo-ten/ket-qua?name=${encodeURIComponent(num.title)}`)}
              className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-purple-400/60 group-hover:text-purple-300 transition-colors"
            >
              <span>Tìm hiểu thêm</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
