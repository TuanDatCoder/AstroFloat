'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles, Star, ArrowRight, UserCircle2, X, Zap,
  Heart, Target, AlertCircle, CalendarDays, User,
  Telescope, BookOpen, Crown, TrendingUp, Grid3x3,
  Dna, Fingerprint, Waves, Compass
} from 'lucide-react';
import { zodiacService } from '@/services/zodiacService';
import { numerologyService } from '@/services/numerologyService';
import { nameNumerologyService } from '@/services/nameNumerologyService';
import { zodiacMatchesService } from '@/services/zodiacMatchesService';
import { supabase } from '@/services/supabase';
import { authService } from '@/services/authService';
import { ROUTES } from '@/constants';


export default function DiscoverClient() {
  const [dob, setDob] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const savedDob = localStorage.getItem('astrofloat_dob') || '';
    const savedName = localStorage.getItem('astrofloat_name') || '';
    setDob(savedDob);
    setFullName(savedName);

    const initData = async () => {
      let currentDob = savedDob;
      let currentName = savedName;
      let shouldAutoFetch = !!currentDob;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
        
        if (session?.user) {
          const profile = await authService.getUserProfile(session.user.id);
          if (profile) {
            if (!localStorage.getItem('astrofloat_dob') && profile.birth_date) {
              const dateOnly = profile.birth_date.substring(0, 10);
              setDob(dateOnly);
              currentDob = dateOnly;
              shouldAutoFetch = true;
            }
            if (!localStorage.getItem('astrofloat_name') && profile.birth_name) {
              setFullName(profile.birth_name);
              currentName = profile.birth_name;
              shouldAutoFetch = true;
            }
          }
        }
      } catch (err) {
        console.error("Lỗi lấy thông tin cá nhân:", err);
      }

      if (shouldAutoFetch && currentDob) {
        handleDiscover(currentDob, currentName);
      }
    };
    initData();
  }, []);

  const handleDiscover = async (overrideDob = null, overrideName = null) => {
    const targetDob = overrideDob || dob;
    const targetName = overrideName !== null ? overrideName : fullName;
    
    if (!targetDob) return;
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      const zodiacId = await zodiacService.getZodiacIdByDate(targetDob);
      let zodiacData = null;
      let topMatches = [];
      if (zodiacId) {
        zodiacData = await zodiacService.getZodiacById(zodiacId);
        topMatches = await zodiacMatchesService.getTopMatches(zodiacId, 3);
      }

      const { data: { session } } = await supabase.auth.getSession();
      const lifePathNum = numerologyService.calculateLifePathNumber(targetDob);
      const birthGrid = numerologyService.calculateBirthGrid(targetDob);
      const pinnacles = await numerologyService.getPinnaclesForUser(session?.user?.id, targetDob);
      
      let numerologyData = null;
      if (lifePathNum) {
        try {
          numerologyData = await numerologyService.getNumerologyByNumber(lifePathNum);
        } catch {
          numerologyData = { number: lifePathNum, title: 'Bí Ẩn' };
        }
      }

      let nameAnalysis = null;
      if (targetName && targetName.trim()) {
        const analysis = await nameNumerologyService.calculateFullAnalysis(targetName);
        if (analysis) {
          const nameMasterData = await nameNumerologyService.getNameNumerology(analysis.expressionNumber);
          const advancedMetrics = await nameNumerologyService.getAdvancedMetrics(
            analysis.soulNumber,
            analysis.personalityNumber,
            analysis.balanceNumber,
            analysis.karmicLessons
          );
          nameAnalysis = { ...analysis, master: nameMasterData, metrics: advancedMetrics };
        }
      }

      setResults({ zodiac: zodiacData, topMatches, numerology: numerologyData, birthGrid, pinnacles, nameAnalysis });
      localStorage.setItem('astrofloat_dob', targetDob);
      localStorage.setItem('astrofloat_name', targetName);
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi hệ thống khi phân tích dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  const renderBirthGrid = (grid) => {
    if (!grid) return null;
    const layout = [[3, 6, 9], [2, 5, 8], [1, 4, 7]];
    return (
      <div className="grid grid-cols-3 gap-2 w-full max-w-[200px] mx-auto">
        {layout.map((row) => row.map((num) => (
          <div
            key={num}
            className={`aspect-square flex items-center justify-center rounded-2xl text-lg font-black transition-all duration-300 ${
              grid[num].length > 0
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-white/[0.03] text-white/10 border border-white/5'
            }`}
          >
            {grid[num].length > 0 ? grid[num].join('') : num}
          </div>
        )))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center pt-28 pb-24 px-4 md:px-6 relative z-10 w-full max-w-6xl mx-auto min-h-screen overflow-x-hidden">
      
      {/* ─── OPTIMIZED BACKGROUND ─── */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.05)_0%,_transparent_70%)]" />
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-[radial-gradient(circle_at_center,_rgba(147,51,234,0.06)_0%,_transparent_70%)]" />
        <div className="absolute top-[20%] right-[5%] w-96 h-96 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.05)_0%,_transparent_70%)]" />
      </div>

      {/* ─── HEADER ─── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full text-center mb-16 transform-gpu"
      >
        <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-black tracking-[0.2em] mb-6 uppercase">
          <Fingerprint className="w-4 h-4" /> Bản Sắc Tâm Linh
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-[1.1]">
          Hồ Sơ{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500">
            Năng Lượng
          </span>
        </h1>
        <p className="text-gray-400 mt-6 max-w-xl mx-auto font-medium text-base md:text-lg opacity-80">
          Phân tích sự giao thoa giữa Thần số học Pythagoras, Chiêm tinh học và Sứ mệnh tên gọi.
        </p>
      </motion.div>

      {/* ─── INPUT FORM ─── */}
      <div className="w-full max-w-3xl mx-auto mb-16 relative z-20 transform-gpu">
        <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-1 md:p-2 shadow-2xl">
          <div className="bg-slate-800/20 rounded-[2.2rem] p-6 md:p-10 border border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-8">
              <div className="space-y-2.5">
                <label className="text-xs uppercase font-black tracking-widest text-emerald-400/70 flex items-center gap-2">
                  <UserCircle2 className="w-4 h-4" /> Họ và Tên
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn Đạt"
                  className="w-full px-5 py-4.5 rounded-2xl bg-black/40 border border-white/10 text-white font-semibold focus:outline-none focus:border-emerald-500/50 transition-all"
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-xs uppercase font-black tracking-widest text-cyan-400/70 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> Ngày Sinh
                </label>
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="flex-1 px-5 py-4.5 rounded-2xl bg-black/40 border border-white/10 text-white font-semibold focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                  {(dob || fullName) && (
                    <button
                      onClick={() => { setDob(''); setFullName(''); setResults(null); }}
                      className="p-4.5 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {error && <div className="text-red-400 text-sm mb-6 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</div>}

            <button
              onClick={() => handleDiscover()}
              disabled={loading || !dob}
              className="relative w-full overflow-hidden rounded-2xl p-[1px] group/btn transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <div className="absolute inset-[-1000%] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#10b981_0%,#3b82f6_50%,#10b981_100%)] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              <div className="relative w-full h-full bg-slate-900 rounded-2xl overflow-hidden py-5 px-8 flex items-center justify-center gap-3 text-emerald-400 group-hover/btn:text-white transition-colors">
                <div className="absolute inset-0 bg-emerald-500 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Sparkles className="w-5 h-5" /> <span>Truy Xuất Phổ Năng Lượng</span></>}
              </div>
            </button>
          </div>
        </div>
      </div>



      {/* ─── RESULTS ─── */}
      <AnimatePresence mode="wait">
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full space-y-8 transform-gpu"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="relative overflow-hidden rounded-[2.5rem] border border-purple-500/20 bg-slate-900 p-10 flex flex-col justify-between min-h-[300px] shadow-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(147,51,234,0.08)_0%,_transparent_60%)] pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Zap className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 text-[10px] font-black uppercase tracking-widest">Thần Số Học · Đường Đời</span>
                  </div>
                  {results.numerology && (
                    <div className="flex items-start gap-8">
                      <span className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-400/40 leading-none">{results.numerology.number}</span>
                      <div className="pt-4">
                        <h3 className="text-white font-black text-3xl mb-2">{results.numerology.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-[220px]">{results.numerology.traits}</p>
                      </div>
                    </div>
                  )}
                </div>
                <Link href={results.numerology ? ROUTES.NUMEROLOGY_DETAIL(results.numerology.number) : '#'} className="relative z-10 mt-10 w-fit py-2.5 px-6 rounded-full bg-white/5 border border-white/5 text-purple-300 text-[10px] font-black uppercase tracking-widest hover:bg-purple-500/20 hover:text-white transition-all">Xem chi tiết</Link>
              </div>

              {/* Card 2 */}
              <div className="relative overflow-hidden rounded-[2.5rem] border border-cyan-500/20 bg-slate-900 p-10 flex flex-col justify-between min-h-[300px] shadow-xl">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(6,182,212,0.07)_0%,_transparent_60%)] pointer-events-none" />
                <div className="absolute top-6 right-6 opacity-20 w-40 h-40 relative">
                  {results.zodiac?.image_url ? <Image src={results.zodiac.image_url} alt="" fill sizes="160px" className="object-cover rounded-full" /> : <Telescope className="w-full h-full text-cyan-500/5" />}
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Compass className="w-5 h-5 text-cyan-400" />
                    <span className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">Chiêm Tinh Học · Cung Mệnh</span>
                  </div>
                  {results.zodiac && (
                    <div>
                      <h3 className="text-7xl font-black text-white leading-none mb-2">{results.zodiac.name}</h3>
                      <span className="text-cyan-300 text-[10px] font-black uppercase tracking-widest">{results.zodiac.english_name}</span>
                      <p className="text-gray-500 text-sm mt-4 leading-relaxed max-w-[280px] line-clamp-3">{results.zodiac.description}</p>
                    </div>
                  )}
                </div>
                <Link href={results.zodiac ? ROUTES.ZODIAC_DETAIL(results.zodiac.id) : '#'} className="relative z-10 mt-10 w-fit py-2.5 px-6 rounded-full bg-white/5 border border-white/5 text-cyan-300 text-[10px] font-black uppercase tracking-widest hover:bg-cyan-500/20 hover:text-white transition-all">Bản đồ sao</Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 3 */}
              <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-500/20 bg-slate-900 p-10 flex flex-col items-center shadow-xl">
                <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-10">Biểu Đồ Ngày Sinh</span>
                {renderBirthGrid(results.birthGrid)}
                <p className="text-gray-600 text-[10px] mt-8 text-center max-w-[240px]">Hệ thống Pythagoras thể hiện cường độ năng lượng trong tiềm thức.</p>
              </div>

              {/* Card 4 */}
              <div className="relative overflow-hidden rounded-[2.5rem] border border-indigo-500/20 bg-slate-900 p-10 flex flex-col items-center shadow-xl">
                <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-10">Chu Kỳ 4 Đỉnh Cao</span>
                {results.pinnacles && (
                  <div className="flex justify-center gap-4 py-4">
                    {results.pinnacles.map((p, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-slate-800 border border-indigo-500/30 flex items-center justify-center text-white font-black text-lg shadow-lg">{p.value}</div>
                        <span className="text-[9px] text-gray-500 font-bold">{p.age}t</span>
                      </div>
                    ))}
                  </div>
                )}
                <Link href={`${ROUTES.PINNACLE_ANALYSIS}?dob=${dob}`} className="mt-8 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Xem toàn bộ lộ trình <ArrowRight className="inline w-3 h-3 ml-1" /></Link>
              </div>
            </div>

            {/* Card 5 & 6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.nameAnalysis && (
                <div className="relative overflow-hidden rounded-[2.5rem] border border-violet-500/20 bg-slate-900 p-10 flex flex-col shadow-xl">
                  <span className="text-violet-400 text-[10px] font-black uppercase tracking-widest mb-10">Sứ Mệnh Tên Gọi</span>
                  <div className="flex items-center gap-8 mb-10">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-5xl font-black">{results.nameAnalysis.expressionNumber}</div>
                    <div>
                      <h4 className="text-white font-black text-2xl mb-1">{results.nameAnalysis.master?.title || 'Bí Ẩn'}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">{results.nameAnalysis.master?.traits}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[{ label: 'Linh Hồn', val: results.nameAnalysis.soulNumber }, { label: 'Nhân Cách', val: results.nameAnalysis.personalityNumber }, { label: 'Cân Bằng', val: results.nameAnalysis.balanceNumber }, { label: 'Bài Học', val: results.nameAnalysis.karmicLessons.length || '✓' }].map(m => (
                      <div key={m.label} className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
                        <span className="block text-white font-black text-lg">{m.val}</span>
                        <span className="text-[8px] text-gray-600 uppercase font-black">{m.label}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={`${ROUTES.NAME_NUMEROLOGY}?name=${encodeURIComponent(fullName)}`} className="mt-10 text-violet-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all w-fit">Phân tích đa chiều</Link>
                </div>
              )}

              {results.topMatches && results.topMatches.length > 0 && (
                <div className="relative overflow-hidden rounded-[2.5rem] border border-pink-500/20 bg-slate-900 p-10 flex flex-col shadow-xl">
                  <span className="text-pink-400 text-[10px] font-black uppercase tracking-widest mb-10">Tương Hợp Linh Hồn</span>
                  <div className="space-y-4">
                    {results.topMatches.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white/5 p-5 rounded-3xl border border-white/5 group hover:border-pink-500/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 flex items-center justify-center text-pink-300 font-black text-xs">#{idx+1}</div>
                          <div><p className="text-white font-black text-lg">{m.name}</p><p className="text-[9px] text-gray-600 uppercase tracking-widest">{m.english_name}</p></div>
                        </div>
                        <span className="text-2xl font-black text-pink-400">{m.match_score}%</span>
                      </div>
                    ))}
                  </div>
                  <Link href={isLoggedIn ? `${ROUTES.ZODIAC_ALL_MATCHES}?sign=${results.zodiac.id}` : ROUTES.LOGIN} className="mt-10 text-pink-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Xem bảng xếp hạng</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {results && (
        <div className="mt-20 py-4 px-10 rounded-full border border-white/5 bg-slate-900/50 text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] flex items-center gap-3">
          <Waves className="w-4 h-4 text-emerald-500/30" /> Đồng bộ hóa tần số thành công
        </div>
      )}
    </div>
  );
}
