'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Sparkles, X, Info, Zap, Calendar, User, ArrowRight, ChevronDown,
  Briefcase, Users, Database, MessageCircle, Target, Star, Moon, Sun,
  Flame, Wind, Waves, Mountain, Leaf, Eye, Shield, Crown, Compass,
  Gem, Music, Palette, BookOpen, Globe, Coffee, Feather
} from 'lucide-react';
import { zodiacService } from '@/services/zodiacService';
import { zodiacMatchesService } from '@/services/zodiacMatchesService';
import { supabase } from '@/services/supabase';
import { authService } from '@/services/authService';
import { ZODIAC_CATEGORIES } from '@/constants';

// Icon lookup map thay thế cho import * as LucideIcons
const ICON_MAP = {
  Heart, Briefcase, Users, Database, MessageCircle, Target, Star, Moon, Sun,
  Flame, Wind, Waves, Mountain, Leaf, Eye, Shield, Crown, Compass, Sparkles,
  Gem, Music, Palette, BookOpen, Globe, Coffee, Feather, Zap, Info, User
};
const getIcon = (name) => ICON_MAP[name] || Sparkles;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const CustomSelect = ({ value, onChange, options, placeholder, isPink }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.id.toString() === value.toString());

  return (
    <div className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-4 text-left cursor-pointer flex justify-between items-center transition-all ${isOpen ? (isPink ? 'border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.15)]' : 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]') : (isPink ? 'hover:border-pink-500/30' : 'hover:border-purple-500/30')}`}
      >
        <span className={selectedOption ? "text-white font-bold tracking-wide" : "text-gray-500 font-medium tracking-wide"}>
          {selectedOption ? `${selectedOption.name} (${selectedOption.english_name})` : placeholder}
        </span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`absolute z-50 w-full mt-2 bg-slate-900/95 border ${isPink ? 'border-pink-500/20' : 'border-purple-500/20'} rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto custom-scrollbar`}>
            {options.map((opt) => {
              const isSelected = value.toString() === opt.id.toString();
              return (
                <div key={opt.id} onClick={() => { onChange(opt.id.toString()); setIsOpen(false); }} className={`px-4 py-3 cursor-pointer transition-all flex items-center justify-between ${isSelected ? (isPink ? 'bg-pink-500/20 text-pink-300' : 'bg-purple-500/20 text-purple-300') : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                  <span className="font-bold">{opt.name}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">{opt.english_name}</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ZodiacMatchClient({ allZodiacs }) {
  const [matchMode, setMatchMode] = useState('date');
  const [sign1Id, setSign1Id] = useState('');
  const [sign2Id, setSign2Id] = useState('');
  const [dob1, setDob1] = useState('');
  const [dob2, setDob2] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Khởi tạo từ sessionStorage
    setMatchMode(sessionStorage.getItem('astro_match_mode') || 'date');
    setSign1Id(sessionStorage.getItem('astro_match_sign1') || '');
    setSign2Id(sessionStorage.getItem('astro_match_sign2') || '');
    setDob1(sessionStorage.getItem('astro_match_dob1') || '');
    setDob2(sessionStorage.getItem('astro_match_dob2') || '');
    const savedResult = sessionStorage.getItem('astro_match_result');
    if (savedResult) {
      try { setResult(JSON.parse(savedResult)); } catch (e) {}
    }

    const loadUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        try {
          const profile = await authService.getUserProfile(session.user.id);
          if (profile) {
            if (!sessionStorage.getItem('astro_match_dob1') && profile.birth_date) setDob1(profile.birth_date.substring(0, 10));
            if (!sessionStorage.getItem('astro_match_sign1') && profile.sun_sign_id) setSign1Id(profile.sun_sign_id.toString());
          }
        } catch(e) {}
      }
    };
    loadUserData();
  }, []);

  // Lưu state vào sessionStorage
  useEffect(() => { sessionStorage.setItem('astro_match_mode', matchMode); }, [matchMode]);
  useEffect(() => { sessionStorage.setItem('astro_match_sign1', sign1Id); }, [sign1Id]);
  useEffect(() => { sessionStorage.setItem('astro_match_sign2', sign2Id); }, [sign2Id]);
  useEffect(() => { sessionStorage.setItem('astro_match_dob1', dob1); }, [dob1]);
  useEffect(() => { sessionStorage.setItem('astro_match_dob2', dob2); }, [dob2]);
  useEffect(() => {
    if (result) sessionStorage.setItem('astro_match_result', JSON.stringify(result));
    else sessionStorage.removeItem('astro_match_result');
  }, [result]);

  const handleMatch = async () => {
    if (matchMode === 'date' && (!dob1 || !dob2)) return;
    if (matchMode === 'sign' && (!sign1Id || !sign2Id)) return;
    setLoading(true); setResult(null); setError(null);
    try {
      let id1, id2;
      if (matchMode === 'date') {
        id1 = await zodiacService.getZodiacIdByDate(dob1);
        id2 = await zodiacService.getZodiacIdByDate(dob2);
        if (!id1 || !id2) { setError("Không thể xác định cung cho ngày sinh đã nhập."); setLoading(false); return; }
      } else {
        id1 = parseInt(sign1Id); id2 = parseInt(sign2Id);
      }
      const sign1 = await zodiacService.getZodiacById(id1);
      const sign2 = await zodiacService.getZodiacById(id2);
      const matchData = await zodiacMatchesService.getZodiacMatch(id1, id2);
      const attr1 = await zodiacMatchesService.getZodiacAttributes(id1);
      const attr2 = await zodiacMatchesService.getZodiacAttributes(id2);

      const compMap = {};
      const processAttr = (a, personKey) => {
        if (!a?.criteria) return;
        const cid = a.criteria.id;
        if (!compMap[cid]) compMap[cid] = { criteria: a.criteria, p1: null, p2: null };
        compMap[cid][personKey] = a;
      };
      (attr1 || []).forEach(a => processAttr(a, 'p1'));
      (attr2 || []).forEach(a => processAttr(a, 'p2'));
      const comparisons = Object.values(compMap);

      let sum = 0, countCats = 0;
      ZODIAC_CATEGORIES.forEach(cat => {
        const relevant = comparisons.filter(c => cat.dbCats.some(d => (c.criteria?.category || '') === d));
        if (relevant.length === 0) return;
        let catSum = 0, catCount = 0;
        relevant.forEach(c => {
          if (c.p1?.score && c.p2?.score) {
            catSum += Math.round((1 - Math.abs(c.p1.score - c.p2.score) / 9) * 100);
            catCount++;
          }
        });
        if (catCount > 0) { sum += Math.round(catSum / catCount); countCats++; }
      });
      const calculatedScore = countCats > 0 ? Math.round(sum / countCats) : null;
      if (!matchData && !calculatedScore) setError("Dữ liệu chưa được cập nhật.");
      else setResult({ sign1, sign2, match: matchData, comparisons, calculatedScore });
    } catch (err) { setError("Lỗi tính toán."); } finally { setLoading(false); }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-cyan-400";
    if (score >= 40) return "text-yellow-400";
    return "text-rose-400";
  };

  return (
    <div className="flex flex-col items-center pt-32 pb-20 px-6 relative z-10 w-full max-w-7xl mx-auto min-h-[80vh]">
      <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <span className="inline-block py-1.5 px-4 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-300 text-xs font-semibold tracking-[0.25em] mb-4 uppercase">
          TƯƠNG HỢP CUNG HOÀNG ĐẠO
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-400 pb-2">
          So Đôi Lứa Đôi
        </h1>
        <div className="mt-8 flex justify-center gap-4">
          <button onClick={() => { setMatchMode('date'); setResult(null); }} className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all uppercase ${matchMode === 'date' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-black/60 text-gray-500 border border-white/5'}`}>Theo Ngày Sinh</button>
          <button onClick={() => { setMatchMode('sign'); setResult(null); }} className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all uppercase ${matchMode === 'sign' ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white' : 'bg-black/60 text-gray-500 border border-white/5'}`}>Chọn Cung</button>
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
        <motion.div variants={itemVariants} className="bg-slate-900/80 p-6 rounded-3xl border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 mb-4 text-pink-400"><User className="w-5 h-5" /><h3 className="font-bold uppercase tracking-wider text-sm">Người 1</h3></div>
          {matchMode === 'date' ? (
            <input type="date" value={dob1} onChange={(e) => setDob1(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-pink-500/30" />
          ) : (
            <CustomSelect value={sign1Id} onChange={setSign1Id} options={allZodiacs} placeholder="-- Chọn Cung --" isPink={true} />
          )}
        </motion.div>
        <div className="hidden lg:flex items-center justify-center relative"><Heart className="w-12 h-12 text-pink-500 fill-pink-500/20" /></div>
        <motion.div variants={itemVariants} className="bg-slate-900/80 p-6 rounded-3xl border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 mb-4 text-purple-400"><User className="w-5 h-5" /><h3 className="font-bold uppercase tracking-wider text-sm">Người 2</h3></div>
          {matchMode === 'date' ? (
            <input type="date" value={dob2} onChange={(e) => setDob2(e.target.value)} className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-purple-500/30" />
          ) : (
            <CustomSelect value={sign2Id} onChange={setSign2Id} options={allZodiacs} placeholder="-- Chọn Cung --" isPink={false} />
          )}
        </motion.div>
      </motion.div>

      <button onClick={handleMatch} disabled={loading} className="px-12 py-4 bg-gradient-to-r from-pink-600 to-indigo-600 rounded-2xl font-bold text-white shadow-xl flex items-center gap-3 text-lg mb-16 uppercase">
        {loading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><Zap className="w-6 h-6 fill-white" /> So Khớp</>}
      </button>

      <AnimatePresence mode="wait">
        {result && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-5xl space-y-8">
            <div className="bg-slate-900/80 rounded-[3rem] border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10 text-center">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white">{result.sign1.name}</h2>
                  <p className="text-pink-400 text-sm uppercase font-semibold mt-2">{result.sign1.english_name}</p>
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative">
                    <motion.svg 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                      className="w-48 h-48 transform -rotate-90"
                    >
                      <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                      <motion.circle 
                        cx="96" cy="96" r="88" 
                        stroke="currentColor" strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={552.92} 
                        initial={{ strokeDashoffset: 552.92 }} 
                        animate={{ strokeDashoffset: 552.92 - (552.92 * (result.calculatedScore || 50)) / 100 }} 
                        transition={{ duration: 1.5, ease: "easeOut" }} 
                        className={getScoreColor(result.calculatedScore || 50)} 
                      />
                    </motion.svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-6xl font-black ${getScoreColor(result.calculatedScore || 50)}`}>
                        {result.calculatedScore || 50}%
                      </span>
                      <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold mt-2">
                        Duyên Phận
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white">{result.sign2.name}</h2>
                  <p className="text-purple-400 text-sm uppercase font-semibold mt-2">{result.sign2.english_name}</p>
                </div>
              </div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div variants={itemVariants} className="bg-black/60 p-8 rounded-[2rem] border border-white/5 space-y-4">
                  <div className="flex items-center gap-3 text-pink-400 mb-2">
                    <Heart className="w-6 h-6 fill-pink-400" />
                    <h3 className="text-xl font-bold italic">Góc Độ Tình Yêu</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-light">
                    {result.match?.love_analysis || "Đang phân tích sự kết hợp giữa các vì sao..."}
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-black/60 p-8 rounded-[2rem] border border-white/5 space-y-4">
                  <div className="flex items-center gap-3 text-cyan-400 mb-2">
                    <Sparkles className="w-6 h-6 fill-cyan-400" />
                    <h3 className="text-xl font-bold italic">Góc Độ Tình Bạn</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-light">
                    {result.match?.friendship_analysis || "Đang phân tích sự hòa hợp trong cuộc sống..."}
                  </p>
                </motion.div>
              </div>

              {/* Detailed Comparison Sections */}
              <div className="mt-16 bg-slate-900/70 p-8 md:p-12 rounded-[3rem] border border-white/5 relative overflow-hidden">
                <h3 className="text-2xl md:text-3xl font-black text-center mb-10 text-white tracking-tight uppercase">So Sánh Đặc Điểm Tương Quan</h3>
                
                <div className="space-y-16 relative z-10">
                  {[
                    { id: 'personality', name: 'Tính cách', cats: ['Tính cách'], icon: User },
                    { id: 'love', name: 'Tình yêu', cats: ['Tình yêu'], icon: Heart },
                    { id: 'career', name: 'Sự nghiệp', cats: ['Sự nghiệp'], icon: Briefcase },
                    { id: 'money', name: 'Tiền bạc', cats: ['Tiền bạc'], icon: Database },
                    { id: 'social', name: 'Xã hội', cats: ['Xã hội'], icon: MessageCircle },
                    { id: 'dark', name: 'Góc tối', cats: ['Góc tối', 'Góc khuất'], icon: Target },
                  ].map((group) => {
                    const groupComparisons = result.comparisons.filter(c => 
                      group.cats.includes(c.criteria?.category)
                    );
                    
                    if (groupComparisons.length === 0) return null;

                    // Calculate group score
                    let gSum = 0;
                    groupComparisons.forEach(c => {
                      if (c.p1?.score && c.p2?.score) {
                        gSum += Math.round((1 - Math.abs(c.p1.score - c.p2.score) / 9) * 100);
                      }
                    });
                    const groupScore = Math.round(gSum / groupComparisons.length);
                    const GroupIcon = group.icon;

                    return (
                      <div key={group.id} className="space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
                          <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 uppercase tracking-widest flex items-center gap-2">
                            <GroupIcon className="w-4 h-4" /> {group.name}
                          </h4>
                          <span className={`px-3 py-1 rounded-full bg-emerald-500/10 ${getScoreColor(groupScore)} font-black text-xs border border-emerald-500/20 whitespace-nowrap`}>
                            Hợp: {groupScore}%
                          </span>
                          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1"></div>
                        </div>

                        <div className="space-y-10">
                          {groupComparisons.map((c, idx) => {
                            const iconName = c.criteria.icon_url?.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
                            const CriteriaIcon = getIcon(iconName);
                            return (
                              <div key={idx} className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-black text-pink-400 w-12 text-left text-lg">
                                    {c.p1?.score || 0}<span className="text-[10px] text-pink-400/50">/10</span>
                                  </span>
                                  <span className="font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                    <CriteriaIcon className="w-4 h-4 text-gray-500" /> {c.criteria.criteria_name}
                                  </span>
                                  <span className="font-black text-purple-400 w-12 text-right text-lg">
                                    {c.p2?.score || 0}<span className="text-[10px] text-purple-400/50">/10</span>
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 h-3">
                                  <div className="flex-1 h-full bg-black/40 rounded-l-full overflow-hidden flex justify-end relative">
                                    <motion.div 
                                      initial={{ width: 0 }} 
                                      animate={{ width: `${(c.p1?.score || 0) * 10}%` }}
                                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                      className="h-full bg-gradient-to-l from-pink-500 to-pink-600 rounded-l-full shadow-[0_0_8px_rgba(236,72,153,0.3)]" 
                                    />
                                  </div>
                                  
                                  <div className="w-1 h-full bg-white/10 rounded-full"></div>

                                  <div className="flex-1 h-full bg-black/40 rounded-r-full overflow-hidden relative">
                                    <motion.div 
                                      initial={{ width: 0 }} 
                                      animate={{ width: `${(c.p2?.score || 0) * 10}%` }} 
                                      transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-r-full shadow-[0_0_8px_rgba(168,85,247,0.3)]" 
                                    />
                                  </div>
                                </div>

                                <div className="flex gap-6 mt-3">
                                  <p className="flex-1 text-right text-[11px] leading-relaxed text-gray-400 italic font-medium">
                                    {c.p1?.description || "Dữ liệu đang cập nhật..."}
                                  </p>
                                  <p className="flex-1 text-left text-[11px] leading-relaxed text-gray-400 italic font-medium">
                                    {c.p2?.description || "Dữ liệu đang cập nhật..."}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-16 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8 rounded-[2rem] border border-white/10 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(236,72,153,0.1)_0%,_transparent_60%)] pointer-events-none" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.1)_0%,_transparent_60%)] pointer-events-none" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2 text-white">TỔNG THỂ TƯƠNG QUAN CHI TIẾT</h3>
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-6">Mức độ hòa hợp trung bình qua mọi khía cạnh</p>
                    <div className={`text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400`}>
                      {result.calculatedScore || 50}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button 
                onClick={() => setResult(null)}
                className="px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 hover:text-white transition-colors border border-white/5 hover:border-white/20 bg-white/5"
              >
                Thực hiện phép thử mới
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
