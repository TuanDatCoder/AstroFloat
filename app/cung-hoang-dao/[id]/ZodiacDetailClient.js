'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Moon, Briefcase, Heart, Sparkles, LayoutGrid, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdBanner from '@/components/AdBanner';

const getTopicIcon = (topic, className) => {
  const t = topic.toLowerCase();
  if (t.includes('truyền thuyết') || t.includes('nguồn gốc')) return <BookOpen className={className} />;
  if (t.includes('góc tối') || t.includes('mặt trái')) return <Moon className={className} />;
  if (t.includes('sự nghiệp') || t.includes('công việc')) return <Briefcase className={className} />;
  if (t.includes('tình yêu') || t.includes('tình duyên')) return <Heart className={className} />;
  return <Sparkles className={className} />;
};

export default function ZodiacDetailClient({ id, initialZodiac, initialDetails }) {
  const router = useRouter();

  if (!initialZodiac) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center pt-32">
        <p className="text-red-400 mb-8 bg-red-950/40 px-6 py-3 rounded-xl border border-red-500/20">Không tìm thấy chòm sao này</p>
        <button onClick={() => router.back()} className="text-cyan-300 flex items-center gap-2 uppercase text-xs font-bold tracking-widest"><ArrowLeft className="w-4 h-4" /> Quay lại</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-32 pb-20 px-6 relative z-10 w-full max-w-5xl mx-auto">
      <div className="w-full mb-10 flex justify-start">
        <button onClick={() => router.back()}>
          <motion.div whileHover={{ x: -5 }} className="flex items-center gap-2 text-gray-400 hover:text-cyan-300 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-medium">Trở về</span>
          </motion.div>
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-gradient-to-b from-cyan-900/40 to-slate-900/60 border border-cyan-500/20 rounded-[3rem] p-8 md:p-16 mb-16 relative overflow-hidden shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
           <span className="text-[150px] md:text-[250px] font-black uppercase tracking-tighter">{initialZodiac.english_name || initialZodiac.name}</span>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-[2.5rem] flex items-center justify-center border-4 border-cyan-500/30 shadow-xl overflow-hidden">
            {initialZodiac.image_url ? <img src={initialZodiac.image_url} alt={initialZodiac.name} className="w-full h-full object-cover" /> : <Sun className="w-16 h-16 text-cyan-200" />}
          </div>
          <div className="text-center md:text-left flex-1">
            <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-widest mb-4 uppercase">{initialZodiac.english_name}</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{initialZodiac.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
              <span className="px-3 py-1 bg-cyan-900/70 text-cyan-200 text-sm rounded-lg border border-cyan-500/20">Nguyên tố: {initialZodiac.element}</span>
              <span className="px-3 py-1 bg-indigo-900/70 text-indigo-200 text-sm rounded-lg border border-indigo-500/20">Hành tinh: {initialZodiac.ruling_planet}</span>
            </div>
            <p className="text-cyan-100/80 text-lg leading-relaxed font-light">{initialZodiac.description}</p>
          </div>
        </div>
      </motion.div>

      <AdBanner className="mb-12" />

      <div className="w-full">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><LayoutGrid className="w-6 h-6 text-cyan-400" /> Giải mã chi tiết</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {initialDetails.map((detail, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-slate-900/80 border border-cyan-500/10 rounded-3xl p-8 relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">{getTopicIcon(detail.topic, "w-6 h-6 text-cyan-400")}</div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold block mb-1">{detail.topic}</span>
                  <h3 className="text-xl font-bold text-white pr-6">{detail.title}</h3>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed font-light">{detail.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
