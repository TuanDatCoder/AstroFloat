'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Heart, Briefcase, Users, Zap, Trophy, Shield, ArrowLeft, Star, ChevronDown } from 'lucide-react';
import { zodiacService } from '@/services/zodiacService';
import { supabase } from '@/services/supabase';
import { ROUTES } from '@/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 18 } }
};

const CATEGORY_MAP = [
  { id: 'love', name: 'Tình Yêu', dbCats: ['Tình yêu'], icon: Heart, textColor: 'text-pink-400', barFrom: '#f472b6', barTo: '#fb7185' },
  { id: 'friend', name: 'Tình Bạn', dbCats: ['Xã hội'], icon: Users, textColor: 'text-sky-400', barFrom: '#38bdf8', barTo: '#22d3ee' },
  { id: 'work', name: 'Sự Nghiệp', dbCats: ['Sự nghiệp', 'Tiền bạc', 'Sự nghiệp & Tiền bạc'], icon: Briefcase, textColor: 'text-emerald-400', barFrom: '#34d399', barTo: '#2dd4bf' },
  { id: 'personality', name: 'Tính Cách', dbCats: ['Tính cách', 'Góc tối', 'Góc khuất'], icon: Zap, textColor: 'text-purple-400', barFrom: '#a78bfa', barTo: '#818cf8' },
];

const RANK_STYLES = [
  { ring: 'ring-2 ring-amber-400/70', numBg: 'bg-gradient-to-br from-amber-300 to-orange-500', numText: 'text-black', glow: 'shadow-[0_0_30px_rgba(251,191,36,0.25)]', nameColor: 'text-amber-300', scoreColor: 'from-amber-200 to-amber-500' },
  { ring: 'ring-2 ring-slate-400/60', numBg: 'bg-gradient-to-br from-slate-300 to-slate-500', numText: 'text-black', glow: 'shadow-[0_0_20px_rgba(148,163,184,0.15)]', nameColor: 'text-slate-200', scoreColor: 'from-slate-200 to-slate-400' },
  { ring: 'ring-2 ring-orange-600/60', numBg: 'bg-gradient-to-br from-orange-400 to-red-500', numText: 'text-white', glow: 'shadow-[0_0_20px_rgba(234,88,12,0.15)]', nameColor: 'text-orange-300', scoreColor: 'from-orange-300 to-red-400' },
];
const DEFAULT_STYLE = { ring: 'ring-1 ring-white/5', numBg: 'bg-white/5', numText: 'text-gray-400', glow: '', nameColor: 'text-white', scoreColor: null };

function ScoreBar({ score, barFrom, barTo }) {
  return (
    <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${score}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: `linear-gradient(to right, ${barFrom}, ${barTo})` }}
      />
    </div>
  );
}

const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.id.toString() === value?.toString());

  return (
    <div className="relative inline-block w-full min-w-[280px] text-left">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-900/70 border border-white/10 rounded-2xl px-6 py-3 cursor-pointer flex justify-between items-center transition-all ${isOpen ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'hover:border-white/20'}`}
      >
        <span className={selectedOption ? "text-white font-bold" : "text-gray-500 font-medium"}>
          {selectedOption ? `${selectedOption.name} (${selectedOption.english_name})` : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute z-50 w-full mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar`}
          >
            {options.map((opt) => {
              const isSelected = value?.toString() === opt.id.toString();
              return (
                <div 
                  key={opt.id}
                  onClick={() => { onChange(opt.id.toString()); setIsOpen(false); }}
                  className={`px-6 py-3 cursor-pointer transition-all flex items-center justify-between ${isSelected ? 'bg-amber-500/10 text-amber-300' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <span className="font-bold">{opt.name}</span>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">{opt.english_name}</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ZodiacAllMatchesClient({ allZodiacs, attributesMatrix, initSign: initialSignId }) {
  const searchParams = useSearchParams();
  const [selectedSignId, setSelectedSignId] = useState(searchParams.get('sign') || initialSignId || '');

  useEffect(() => {
    async function detectUserSign() {
      const currentSign = searchParams.get('sign') || initialSignId;
      if (!currentSign && allZodiacs?.length > 0) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: profile } = await supabase.from('profiles').select('birth_date').eq('id', session.user.id).single();
          if (profile?.birth_date) {
            const zId = await zodiacService.getZodiacIdByDate(profile.birth_date);
            if (zId) {
              setSelectedSignId(zId.toString());
              return;
            }
          }
        }
        setSelectedSignId(allZodiacs[0].id.toString());
      } else if (currentSign) {
        setSelectedSignId(currentSign);
      }
    }
    detectUserSign();
  }, [searchParams, initialSignId, allZodiacs]);

  const ranking = useMemo(() => {
    if (!selectedSignId || !allZodiacs.length || !attributesMatrix.length) return [];
    const targetId = parseInt(selectedSignId);
    const targetAttrs = attributesMatrix.filter(a => a.zodiac_id === targetId);
    if (!targetAttrs.length) return [];

    return allZodiacs
      .filter(s => s.id !== targetId)
      .map(sign => {
        const otherAttrs = attributesMatrix.filter(a => a.zodiac_id === sign.id);
        const catScores = {};
        let sum = 0, n = 0;

        CATEGORY_MAP.forEach(cat => {
          const relevant = targetAttrs.filter(a => cat.dbCats.some(d => (a.criteria?.category || '') === d));
          if (!relevant.length || !otherAttrs.length) return;
          let cs = 0, cnt = 0;
          relevant.forEach(ta => {
            const oa = otherAttrs.find(x => x.criteria_id === ta.criteria_id);
            if (oa && ta.score && oa.score) { cs += Math.round((1 - Math.abs(ta.score - oa.score) / 9) * 100); cnt++; }
          });
          if (cnt) { const v = Math.round(cs / cnt); catScores[cat.id] = v; sum += v; n++; }
        });

        const overall = n ? Math.round(sum / n) : null;
        return overall !== null ? { sign, catScores, overall } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.overall - a.overall);
  }, [selectedSignId, allZodiacs, attributesMatrix]);

  const targetSign = allZodiacs.find(z => z.id.toString() === selectedSignId);

  return (
    <div className="flex flex-col items-center pt-32 pb-24 px-4 md:px-6 relative z-10 w-full max-w-3xl mx-auto min-h-screen">

      {/* Back button */}
      <Link
        href={`${ROUTES.ZODIAC_BEST_MATCHES}?sign=${selectedSignId}`}
        className="absolute top-24 left-4 md:left-6 flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-[10px] font-black uppercase tracking-widest bg-cyan-950/50 border border-cyan-500/20 px-3 py-2 rounded-full transition-colors z-20 shadow-lg"
      >
        <ArrowLeft className="w-3 h-3" /> Matrix Nhóm
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 w-full"
      >
        <span className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold tracking-[0.2em] mb-5">
          <Star className="w-3 h-3" /> BẢNG XẾP HẠNG TƯƠNG HỢP
        </span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400">
            {targetSign?.name || '—'}
          </span>{' '}
          hợp với ai nhất?
        </h1>

        <div className="mb-8">
          <CustomSelect 
            value={selectedSignId}
            onChange={setSelectedSignId}
            options={allZodiacs}
            placeholder="-- Chọn cung hiện tại --"
          />
        </div>

        <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed font-light">
          Đánh giá toàn diện theo 4 chiều: Tình Yêu · Tình Bạn · Sự Nghiệp · Tính Cách. Sắp xếp từ tương hợp cao nhất đến thấp nhất.
        </p>
      </motion.div>

      {/* Content */}
      {ranking.length === 0 ? (
        <div className="text-center bg-slate-900/70 p-12 rounded-[3rem] border border-white/5 w-full shadow-2xl">
          <Shield className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-sm font-medium">Chưa đủ dữ liệu để xếp hạng cho cung này.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col gap-4"
        >
          {ranking.map(({ sign, catScores, overall }, idx) => {
            const style = RANK_STYLES[idx] ?? DEFAULT_STYLE;
            const isTop = idx < 3;

            return (
              <motion.div
                key={sign.id}
                variants={itemVariants}
                className={`relative w-full rounded-3xl border bg-slate-900/80 p-6 md:p-8 ${style.ring} ${style.glow} transition-all hover:bg-slate-800/70`}
              >
                {/* Decorative glow blob for top 3 */}
                {isTop && (
                  <div
                    className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-[80px] opacity-10 pointer-events-none"
                    style={{ background: idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : '#f97316' }}
                  />
                )}

                {/* Row: Rank Badge + Sign Info + Overall */}
                <div className="flex items-center gap-5 mb-6">
                  {/* Rank badge */}
                  <div className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-black text-lg ${style.numBg} ${style.numText} border border-white/10 shadow-lg`}>
                    {idx === 0 ? <Trophy className="w-6 h-6" /> : `#${idx + 1}`}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-2xl font-black leading-none tracking-tight ${style.nameColor}`}>{sign.name}</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1.5 font-bold">{sign.english_name}</p>
                  </div>

                  {/* Overall Score */}
                  <div className="shrink-0 text-right">
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Tổng thể</p>
                    <p className={`text-4xl font-black leading-none ${style.scoreColor ? `text-transparent bg-clip-text bg-gradient-to-b ${style.scoreColor}` : 'text-white'}`}>
                      {overall}<span className="text-lg text-white/30 ml-0.5">%</span>
                    </p>
                  </div>
                </div>

                {/* 4 Category bars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {CATEGORY_MAP.map(cat => {
                    const score = catScores[cat.id] ?? 0;
                    const Icon = cat.icon;
                    return (
                      <div key={cat.id}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${cat.textColor}`}>
                            <Icon className="w-3.5 h-3.5 shrink-0" /> {cat.name}
                          </span>
                          <span className="text-[12px] font-black text-white">{score}%</span>
                        </div>
                        <ScoreBar score={score} barFrom={cat.barFrom} barTo={cat.barTo} />
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
