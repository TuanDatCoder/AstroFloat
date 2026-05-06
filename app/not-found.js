'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ArrowLeft, Telescope } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F19] text-white px-6 text-center relative overflow-hidden pt-20">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.1)_0%,_transparent_60%)]" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 flex flex-col items-center">
        <div className="w-32 h-32 bg-indigo-500/10 rounded-full flex items-center justify-center mb-10 border border-indigo-500/20 shadow-[0_0_50px_rgba(99,102,241,0.2)]"><Telescope className="w-16 h-16 text-indigo-400" /></div>
        <h1 className="text-8xl md:text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-800 leading-none mb-4 tracking-tighter">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 italic uppercase tracking-widest text-indigo-300">Tín hiệu vũ trụ bị mất</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-12 font-light leading-relaxed">Có vẻ như bạn đã đi lạc vào một hố đen không xác định. Đừng lo lắng, hãy quay lại quỹ đạo chính để tiếp tục khám phá bản thân.</p>
        <Link href="/">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white text-black rounded-full font-black text-sm tracking-widest flex items-center gap-3 uppercase shadow-2xl hover:shadow-white/10 transition-all">
            <Home className="w-4 h-4" /> Về trang chủ
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
