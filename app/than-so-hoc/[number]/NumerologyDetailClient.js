'use client';

import React, { useEffect, useState } from 'react';
import { m } from 'framer-motion';
import { ArrowLeft, Heart, Briefcase, AlertCircle, Sparkles, LayoutGrid, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { numerologyService } from '@/services/numerologyService';
import { supabase } from '@/services/supabase';
import { Crown, Clock, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const DynamicIcon = ({ name, className }) => {
  switch(name) {
    case 'Heart': return <Heart className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'AlertCircle': return <AlertCircle className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export default function NumerologyDetailClient({ number, initialNumerology, initialDetails }) {
  const [pinnacles, setPinnacles] = useState(null);
  const [birthData, setBirthData] = useState({ m: 0, d: 0, y: 0 });
  const [dob, setDob] = useState('');
  const router = useRouter();

  useEffect(() => {
    const savedDob = localStorage.getItem('astrofloat_dob') || '';
    setDob(savedDob);

    const fetchPinnacles = async () => {
      if (savedDob) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const pData = await numerologyService.getPinnaclesForUser(session?.user?.id, savedDob);
          setPinnacles(pData);
          
          const date = numerologyService.parseDate(savedDob);
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
        } catch (e) {}
      }
    };
    fetchPinnacles();
  }, [number, dob]); // Added dob to dependencies

  // Thông báo cho bot AI biết kết quả thần số học ngày sinh
  useEffect(() => {
    if (number) {
      window.dispatchEvent(new CustomEvent('astro-bot-name-numerology-info', {
        detail: { number }
      }));
    }
  }, [number]);

  if (!initialNumerology) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center pt-32">
        <p className="text-red-400 mb-8 bg-red-950/40 px-6 py-3 rounded-xl border border-red-500/20">
          Không tìm thấy thông tin cho số {number}
        </p>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-purple-300 hover:text-purple-200 uppercase text-xs font-bold tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-32 pb-20 px-6 relative z-10 w-full max-w-5xl mx-auto">
      <div className="w-full mb-10 flex justify-start">
        <button onClick={() => router.back()}>
          <m.div whileHover={{ x: -5 }} className="flex items-center gap-2 text-gray-400 hover:text-purple-300 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-medium">Trở về</span>
          </m.div>
        </button>
      </div>

      <m.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-gradient-to-b from-purple-900/40 to-slate-900/60 border border-purple-500/20 rounded-[3rem] p-10 md:p-16 mb-16 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <span className="text-[200px] font-black leading-none">{initialNumerology.number}</span>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center border-4 border-purple-500/30 shadow-xl">
            <span className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-purple-400">{initialNumerology.number}</span>
          </div>
          <div className="text-center md:text-left flex-1">
            <span className="inline-block py-1.5 px-4 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/30 text-fuchsia-300 text-xs font-semibold tracking-widest mb-4">THÔNG ĐIỆP CHÍNH</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">{initialNumerology.title}</h1>
            <div className="text-purple-100/80 text-lg leading-relaxed font-light mb-6 prose prose-invert prose-fuchsia max-w-none prose-p:leading-relaxed prose-p:mb-4">
              <ReactMarkdown>{`**Đặc điểm:** ${initialNumerology.traits}`}</ReactMarkdown>
            </div>
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5"><p className="text-gray-300 font-light italic">Lời khuyên: "{initialNumerology.advice}"</p></div>
          </div>
        </div>
      </m.div>


      <div className="w-full">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><LayoutGrid className="w-6 h-6 text-fuchsia-400" /> Giải mã chi tiết</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {initialDetails.map((detail, index) => (
            <m.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-slate-900/80 border border-purple-500/10 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20"><DynamicIcon name={detail.icon_name} className="w-6 h-6 text-fuchsia-400" /></div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold block mb-1">{detail.topic}</span>
                  <h3 className="text-xl font-bold text-white">{detail.title}</h3>
                </div>
              </div>
              <div className="text-slate-300 leading-relaxed font-light prose prose-invert prose-fuchsia max-w-none 
                prose-p:leading-loose prose-p:mb-6
                prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-fuchsia-400
                prose-strong:text-fuchsia-300 prose-strong:font-bold
                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8 prose-ul:space-y-3
                prose-li:marker:text-fuchsia-500 prose-li:pl-2
                prose-blockquote:border-l-4 prose-blockquote:border-fuchsia-500 prose-blockquote:bg-fuchsia-500/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic">
                <ReactMarkdown>{detail.content}</ReactMarkdown>
              </div>
            </m.div>      
          ))}
        </div>
      </div>

      {pinnacles && (
        <div className="w-full mt-24 pt-20 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="text-center md:text-left">
              <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-black tracking-[0.3em] mb-4 uppercase">Định mệnh rực rỡ</span>
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight italic">4 Đỉnh Cao Cuộc Đời</h2>
            </div>
            <Link href={`${ROUTES.PINNACLE_ANALYSIS}?dob=${dob}`} className="px-6 py-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">
              Xem toàn bộ phân tích <ArrowRight className="w-3 h-3 inline ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Larger Pyramid */}
            <div className="lg:col-span-7 bg-slate-950/40 rounded-[4rem] border border-white/5 p-8 md:p-12 relative overflow-hidden group min-h-[450px] flex items-center justify-center shadow-2xl">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2),transparent_75%)]" />
               <svg viewBox="0 0 400 320" className="w-full h-full relative z-10 filter drop-shadow-[0_0_25px_rgba(99,102,241,0.5)]">
                  <g stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeDasharray="5 5">
                    <line x1="80" y1="280" x2="150" y2="180" /> <line x1="220" y1="280" x2="150" y2="180" />
                    <line x1="220" y1="280" x2="290" y2="180" /> <line x1="360" y1="280" x2="290" y2="180" />
                    <line x1="150" y1="180" x2="220" y2="90" /> <line x1="290" y1="180" x2="220" y2="90" />
                    <line x1="80" y1="280" x2="220" y2="30" strokeOpacity="0.4" /> <line x1="360" y1="280" x2="220" y2="30" strokeOpacity="0.4" />
                  </g>
                  {[
                    { x: 80, y: 280, val: birthData?.m || '?', label: 'M', color: '#94a3b8', isBase: true },
                    { x: 220, y: 280, val: birthData?.d || '?', label: 'D', color: '#94a3b8', isBase: true },
                    { x: 360, y: 280, val: birthData?.y || '?', label: 'Y', color: '#94a3b8', isBase: true },
                    { x: 150, y: 180, val: pinnacles[0]?.value, label: `Đ1`, color: '#818cf8', isPeak: true },
                    { x: 290, y: 180, val: pinnacles[1]?.value, label: `Đ2`, color: '#818cf8', isPeak: true },
                    { x: 220, y: 90,  val: pinnacles[2]?.value, label: `Đ3`, color: '#a855f7', isPeak: true },
                    { x: 220, y: 30,  val: pinnacles[3]?.value, label: `Đ4`, color: '#ec4899', isPeak: true },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r={pt.isPeak ? "22" : "14"} fill="#0f172a" stroke={pt.color} strokeWidth="2" className="transition-all duration-300" />
                      {pt.isPeak && <circle cx={pt.x} cy={pt.y} r="22" fill={pt.color} fillOpacity="0.1" className="animate-pulse" />}
                      <text x={pt.x} y={pt.y} textAnchor="middle" dy={pt.isPeak ? "7" : "5"} className={`font-black fill-white ${pt.isPeak ? 'text-[14px]' : 'text-[9px]'}`}>{pt.val}</text>
                      <text x={pt.x} y={pt.isPeak ? pt.y - 32 : pt.y + 24} textAnchor="middle" className="font-black text-[8px] uppercase tracking-[0.2em]" fill={pt.color}>{pt.label}</text>
                    </g>
                  ))}
               </svg>
            </div>

            {/* Right: Milestone List */}
            <div className="lg:col-span-5 space-y-6 relative">
               <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-transparent" />
                {pinnacles.map((p, i) => (
                 <Link key={i} href={ROUTES.PINNACLE_DETAIL(p.value)} className="block group">
                   <m.div initial={{ opacity:0, x:20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay: i*0.1 }} className="ml-12 bg-white/5 border border-white/5 hover:border-indigo-500/30 p-6 rounded-[2rem] flex items-center gap-6 transition-all">
                      <div className="w-12 h-12 shrink-0 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl font-black text-indigo-300 group-hover:bg-indigo-500 group-hover:text-white transition-all">{p.value}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-indigo-400/70 mb-1">
                          <Clock className="w-2.5 h-2.5" /> Giai đoạn {i+1}
                        </div>
                        <h3 className="text-white font-bold text-sm tracking-tight">{i === 3 ? `${p.age} tuổi trở đi` : `${p.age} tuổi`}</h3>
                      </div>
                      <Crown className="w-5 h-5 text-gray-700 group-hover:text-indigo-400/40 transition-colors" />
                   </m.div>
                 </Link>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
