'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Zap, Sparkles, Star, Clock, Crown, Target } from 'lucide-react';
import Link from 'next/link';
import { numerologyService } from '@/services/numerologyService';
import { supabase } from '@/services/supabase';
import { ROUTES } from '@/constants';

const formatContent = (text) => {
  if (!text) return null;
  const parts = text.split(/(\[.*?\])/g);
  return parts.filter(p => p && p.trim() !== '').map((part, index) => {
    const match = part.match(/^\[(.*?)\]$/);
    if (match) return <div key={index} className="mt-6 mb-3 flex items-center gap-3"><span className="text-indigo-300 font-black text-[10px] uppercase tracking-widest">{match[1]}</span><div className="h-px bg-indigo-500/20 flex-1" /></div>;
    return <p key={index} className="text-gray-400 text-sm font-light leading-relaxed mb-4 pl-3 border-l border-white/5">{part.trim()}</p>;
  });
};

function PinnacleAnalysisContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dob = searchParams.get('dob');
  const [pinnacles, setPinnacles] = useState([]);
  const [birthData, setBirthData] = useState({ m: 0, d: 0, y: 0 });
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!dob) return;
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const calculated = await numerologyService.getPinnaclesForUser(session?.user?.id, dob);
        setPinnacles(calculated);
        
        // Extract base components for pyramid
        const date = numerologyService.parseDate(dob);
        if (date) {
          const reduceDigit = (n) => {
            let s = n.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
            while (s > 9) s = s.toString().split('').reduce((acc, curr) => acc + parseInt(curr, 10), 0);
            return s;
          };
          setBirthData({
            m: reduceDigit(date.getMonth() + 1),
            d: reduceDigit(date.getDate()),
            y: reduceDigit(date.getFullYear())
          });
        }

        const uniqueNumbers = [...new Set(calculated.map(p => p.value))];
        const detailsData = await Promise.all(uniqueNumbers.map(n => numerologyService.getPinnacleByNumber(n)));
        const detailsMap = {};
        detailsData.forEach(d => { if (d) detailsMap[d.number] = d; });
        setDetails(detailsMap);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchData();
  }, [dob]);

  if (loading) return <div className="flex flex-col items-center justify-center min-h-screen text-indigo-300 uppercase text-xs font-black animate-pulse"><div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />Đang phác thảo lộ trình...</div>;

  return (
    <div className="flex flex-col items-center pt-32 pb-32 px-6 relative z-10 w-full max-w-5xl mx-auto min-h-screen overflow-hidden">
      {/* Background Glowing Orbs - dùng radial-gradient thay blur để tránh scroll jank */}
      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.1)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.08)_0%,_transparent_70%)] pointer-events-none" />
      
      <button onClick={() => router.back()} className="self-start mb-12 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-black uppercase tracking-[0.2em] text-xs"><ArrowLeft className="w-4 h-4" /> QUAY LẠI</button>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-[10px] font-black tracking-widest mb-4 uppercase">Chu kỳ vĩnh cửu</span>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">Hành Trình <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">4 Đỉnh Cao</span></h1>
      </motion.div>

      {/* Visual Pyramid Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl aspect-[16/10] relative mb-32 bg-slate-900/30 backdrop-blur-xl rounded-[4rem] border border-white/5 p-8 md:p-12 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        
        <svg viewBox="0 0 400 300" className="w-full h-full relative z-10 filter drop-shadow-[0_0_15px_rgba(99,102,241,0.4)]">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Connection Lines */}
          <g stroke="url(#lineGrad)" strokeWidth="1.5" strokeLinecap="round">
            <line x1="100" y1="260" x2="150" y2="180" />
            <line x1="200" y1="260" x2="150" y2="180" />
            <line x1="200" y1="260" x2="250" y2="180" />
            <line x1="300" y1="260" x2="250" y2="180" />
            <line x1="150" y1="180" x2="200" y2="100" />
            <line x1="250" y1="180" x2="200" y2="100" />
            <line x1="100" y1="260" x2="200" y2="40" strokeOpacity="0.3" />
            <line x1="300" y1="260" x2="200" y2="40" strokeOpacity="0.3" />
          </g>

          {/* Points/Circles */}
          {[
            { x: 100, y: 260, val: birthData.m, label: 'Tháng', color: 'indigo' },
            { x: 200, y: 260, val: birthData.d, label: 'Ngày', color: 'indigo' },
            { x: 300, y: 260, val: birthData.y, label: 'Năm', color: 'indigo' },
            { x: 150, y: 180, val: pinnacles[0]?.value, label: `Đ1 (${pinnacles[0]?.age}t)`, color: 'indigo', isPeak: true },
            { x: 250, y: 180, val: pinnacles[1]?.value, label: `Đ2 (${pinnacles[1]?.age}t)`, color: 'indigo', isPeak: true },
            { x: 200, y: 100, val: pinnacles[2]?.value, label: `Đ3 (${pinnacles[2]?.age}t)`, color: 'purple', isPeak: true },
            { x: 200, y: 40,  val: pinnacles[3]?.value, label: `Đ4 (${pinnacles[3]?.age}t)`, color: 'pink', isPeak: true },
          ].map((pt, i) => {
            const colors = {
              indigo: { circle: 'rgba(99,102,241,0.2)', stroke: '#818cf8', text: '#c7d2fe' },
              purple: { circle: 'rgba(168,85,247,0.2)', stroke: '#a855f7', text: '#e9d5ff' },
              pink: { circle: 'rgba(236,72,153,0.2)', stroke: '#ec4899', text: '#fce7f3' }
            }[pt.color];

            return (
              <g key={i} className="cursor-pointer group/pt">
                <circle 
                  cx={pt.x} cy={pt.y} r={pt.isPeak ? 20 : 16} 
                  fill="#0f172a" 
                  stroke={colors.stroke} 
                  strokeWidth={pt.isPeak ? "2" : "1"}
                  className="transition-all duration-300 group-hover/pt:r-22"
                />
                <circle 
                  cx={pt.x} cy={pt.y} r={pt.isPeak ? 20 : 16} 
                  fill={colors.circle} 
                  className="animate-pulse"
                />
                <text 
                  x={pt.x} y={pt.y} textAnchor="middle" dy="6" 
                  className={`font-black ${pt.isPeak ? 'text-[12px]' : 'text-[10px]'}`}
                  fill="white"
                >
                  {pt.val}
                </text>
                <text 
                  x={pt.x} y={pt.isPeak ? pt.y - 30 : pt.y + 35} textAnchor="middle" 
                  className="font-black text-[8px] uppercase tracking-[0.2em]"
                  fill={colors.stroke}
                >
                  {pt.label}
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>

      <div className="w-full relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-transparent hidden md:block" />
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/20 to-transparent md:hidden" />

        {/* Roadmap Labels */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 hidden md:block px-4 py-1 bg-indigo-500/20 rounded-full border border-indigo-500/30 text-[9px] font-black tracking-[0.3em] text-indigo-300 uppercase">Khởi đầu</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-12 hidden md:block px-4 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-black tracking-[0.3em] text-gray-500 uppercase">Đích đến</div>

        <div className="space-y-40 relative z-10">
          {pinnacles.map((p, index) => {
            const detail = details[p.value];
            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 50 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }} 
                className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-16 relative`}
              >
                {/* Timeline Point */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-slate-950 border-4 border-indigo-500/20 flex items-center justify-center z-20 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  </div>
                </div>
                <div className="absolute left-6 top-8 -translate-x-1/2 md:hidden flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-500 z-20" />
                </div>

                <div className={`w-full md:w-[45%] ${index % 2 === 1 ? 'md:pl-12' : 'md:pr-12'}`}>
                  <div className="bg-slate-900/60 backdrop-blur-xl p-10 md:p-12 rounded-[3.5rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative group hover:border-indigo-500/40 transition-all duration-500 overflow-hidden">
                    {/* Background Decorative Icon */}
                    <div className="absolute -top-6 -right-6 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                      <Crown className="w-32 h-32 text-indigo-400" />
                    </div>
                    
                    <div className="flex items-center gap-6 mb-8 relative z-10">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-4xl font-black text-indigo-300 shadow-inner group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500">{p.value}</div>
                      <div>
                        <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase mb-1.5 tracking-[0.3em]">
                          <Clock className="w-3 h-3" /> Giai đoạn {index + 1}
                        </div>
                        <h3 className="text-white font-black text-xl uppercase tracking-tight">
                          {index === 3 ? `${p.age} tuổi trở đi` : `${p.age} tuổi`}
                        </h3>
                      </div>
                    </div>
                    
                    <h4 className="text-2xl font-black text-white mb-6 italic tracking-tight flex items-center gap-3 relative z-10 leading-tight">
                      <span className="text-indigo-500">/</span>
                      {detail?.title || `Năng lượng số ${p.value}`}
                    </h4>
                    
                    <div className="relative z-10 group-hover:line-clamp-none line-clamp-4 transition-all duration-500">
                      {formatContent(detail?.content || "Dữ liệu vận mệnh đang được trích xuất từ vũ trụ...")}
                    </div>

                    {detail?.advice && (
                      <div className="mt-8 pt-6 border-t border-white/5 flex gap-3 text-indigo-300/70 italic text-xs relative z-10">
                        <Zap className="w-4 h-4 flex-shrink-0 text-amber-400" />
                        <p>{detail.advice}</p>
                      </div>
                    )}

                    <div className="mt-10 relative z-10">
                      <Link 
                        href={ROUTES.PINNACLE_DETAIL(p.value)} 
                        className="inline-flex items-center gap-3 text-white hover:text-indigo-300 font-black uppercase tracking-[0.25em] text-[9px] bg-indigo-500/20 hover:bg-indigo-500/30 px-6 py-3 rounded-full border border-indigo-500/30 transition-all group/btn"
                      >
                        Khám phá sâu hơn <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Summary Insight Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-40 w-full max-w-4xl p-12 md:p-20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-[4rem] border border-indigo-500/20 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 opacity-[0.03]">
          <Sparkles className="w-48 h-48 text-indigo-400" />
        </div>
        <h3 className="text-3xl md:text-4xl font-black text-white mb-8 uppercase tracking-wider italic relative z-10">Vũ trụ không bao giờ nhầm lẫn</h3>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed italic relative z-10">
          "Mỗi đỉnh cao không chỉ là một cột mốc thành công, mà là một bài học linh hồn cần phải hoàn thành. 
          Hãy đón nhận năng lượng của từng giai đoạn với tâm thế cởi mở và lòng biết ơn sâu sắc."
        </p>
        <div className="mt-12 w-20 h-1 bg-indigo-500/30 mx-auto rounded-full" />
      </motion.div>
    </div>
  );
}

export default function PinnacleAnalysisPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-indigo-300">Đang tải...</div>}>
      <PinnacleAnalysisContent />
    </Suspense>
  );
}
