import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles, Star, ArrowRight, UserCircle2, X, Zap,
  Heart, Target, AlertCircle, CalendarDays, User,
  Telescope, BookOpen, Crown, TrendingUp, Grid3x3
} from 'lucide-react';
import { zodiacService } from '../services/zodiacService';
import { numerologyService } from '../services/numerologyService';
import { nameNumerologyService } from '../services/nameNumerologyService';
import { zodiacMatchesService } from '../services/zodiacMatchesService';
import { supabase } from '../services/supabase';
import { authService } from '../services/authService';
import { ROUTES } from '../constants';
import AdBanner from '../components/AdBanner';

export default function Discover() {
  const [dob, setDob] = useState(() => localStorage.getItem('astrofloat_dob') || '');
  const [fullName, setFullName] = useState(() => localStorage.getItem('astrofloat_name') || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      setIsLoggedIn(!!session);
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
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi hệ thống khi phân tích dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const initData = async () => {
      let currentDob = dob;
      let currentName = fullName;
      let shouldAutoFetch = !!currentDob;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
        
        if (session?.user) {
          const profile = await authService.getUserProfile(session.user.id);
          
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
      } catch (err) {
        console.error("Lỗi lấy thông tin cá nhân:", err);
      }

      if (shouldAutoFetch && currentDob) {
        handleDiscover(currentDob, currentName);
      }
    };

    initData();
  }, []);

  const renderBirthGrid = (grid) => {
    if (!grid) return null;
    const layout = [[3, 6, 9], [2, 5, 8], [1, 4, 7]];
    return (
      <div className="grid grid-cols-3 gap-1.5 w-full max-w-[180px] mx-auto">
        {layout.map((row) => row.map((num) => (
          <div
            key={num}
            className={`aspect-square flex items-center justify-center rounded-xl text-base font-black transition-all ${
              grid[num].length > 0
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-white/3 text-white/10 border border-white/5'
            }`}
          >
            {grid[num].length > 0 ? grid[num].join('') : num}
          </div>
        )))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center pt-20 pb-24 px-4 md:px-6 relative z-10 w-full max-w-6xl mx-auto min-h-screen">

      {/* ─── HEADER ─── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full text-center mb-10"
      >
        <span className="inline-block py-1.5 px-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-black tracking-[0.25em] mb-4 uppercase">
          Giải Mã Bản Thân
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
          Hồ Sơ{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-400">
            Năng Lượng
          </span>
        </h1>
        <p className="text-gray-500 mt-3 max-w-md mx-auto font-light text-sm">
          Nhập thông tin để hệ thống phân tích tần số Thần số học, biểu đồ Chòm sao và sứ mệnh tên gọi.
        </p>
      </motion.div>

      {/* ─── INPUT FORM ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-2xl mx-auto mb-12 relative z-20"
      >
        <div className="bg-slate-900/80 border border-white/8 rounded-[2rem] p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Tên */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 flex items-center gap-1.5">
                <User className="w-3 h-3" /> Họ và Tên
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn Đạt"
                className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-white/8 text-white font-medium focus:outline-none focus:border-emerald-500/40 placeholder:text-gray-600 transition-colors text-sm"
              />
            </div>
            {/* Ngày sinh */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-black tracking-widest text-gray-500 flex items-center gap-1.5">
                <CalendarDays className="w-3 h-3" /> Ngày Sinh
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="flex-1 px-4 py-3.5 rounded-xl bg-black/40 border border-white/8 text-white font-medium focus:outline-none focus:border-emerald-500/40 transition-colors text-sm"
                />
                {(dob || fullName) && (
                  <button
                    onClick={() => {
                      setDob(''); setFullName('');
                      localStorage.removeItem('astrofloat_dob');
                      localStorage.removeItem('astrofloat_name');
                      setResults(null);
                    }}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/8 text-gray-500 hover:text-white hover:border-red-500/30 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

          <button
            onClick={() => {
              localStorage.setItem('astrofloat_dob', dob);
              localStorage.setItem('astrofloat_name', fullName);
              handleDiscover();
            }}
            disabled={loading || !dob}
            className="w-full h-13 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:grayscale active:scale-[0.98]"
          >
            {loading
              ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              : <><Sparkles className="w-4 h-4" /> Truy Xuất Phổ Năng Lượng</>
            }
          </button>
        </div>
      </motion.div>

      {/* ─── NATIVE AD BANNER PLACEMENT ─── */}
      <AdBanner slot="horizontal" className="w-full max-w-4xl" />

      {/* ─── RESULTS ─── */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full space-y-6"
          >
            {/* ═══ HERO BANNER: Số + Cung ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Số Đường Đời */}
              <div className="relative overflow-hidden rounded-[2rem] border border-purple-500/20 bg-gradient-to-br from-purple-950/80 to-slate-900/80 p-8 flex flex-col justify-between min-h-[220px] group">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-0 right-0 p-6 opacity-5 select-none"><Sparkles className="w-32 h-32" /></div>
                <div className="relative z-10">
                  <p className="text-purple-400 text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 mb-5">
                    <Sparkles className="w-3.5 h-3.5" /> Thần Số Học · Số Đường Đời
                  </p>
                  {results.numerology ? (
                    <div className="flex items-end gap-5">
                      <span className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-300 leading-none">
                        {results.numerology.number}
                      </span>
                      <div className="mb-2">
                        <p className="text-white font-black text-xl leading-tight">{results.numerology.title}</p>
                        <p className="text-purple-200/60 text-xs font-light mt-1 line-clamp-2 max-w-[200px]">{results.numerology.traits}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Không đủ dữ liệu</p>
                  )}
                </div>
                {results.numerology && (
                  <Link to={ROUTES.NUMEROLOGY_DETAIL(results.numerology.number)} className="relative z-10 mt-6 flex items-center gap-2 text-purple-300 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors w-fit">
                    Xem chi tiết <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {/* Cung Hoàng Đạo */}
              <div className="relative overflow-hidden rounded-[2rem] border border-cyan-500/20 bg-gradient-to-br from-cyan-950/80 to-slate-900/80 p-8 flex flex-col justify-between min-h-[220px] group">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                 <div className="absolute top-0 right-0 p-4 opacity-40 select-none pointer-events-none">
                   {results.zodiac?.image_url ? (
                     <img src={results.zodiac.image_url} alt={results.zodiac.name} className="w-32 h-32 object-cover rounded-3xl filter drop-shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-transform duration-700 group-hover:scale-110" />
                   ) : (
                     <Star className="w-32 h-32 text-cyan-500/10" />
                   )}
                 </div>
                <div className="relative z-10">
                  <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 mb-5">
                    <Telescope className="w-3.5 h-3.5" /> Chiêm Tinh Học · Cung Hoàng Đạo
                  </p>
                  {results.zodiac ? (
                    <div>
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-6xl font-black text-white leading-none">{results.zodiac.name}</span>
                      </div>
                      <span className="inline-block px-2.5 py-1 bg-cyan-900/50 rounded-lg text-[10px] font-black text-cyan-300 border border-cyan-500/20 uppercase tracking-widest mb-3">
                        {results.zodiac.english_name}
                      </span>
                      <p className="text-cyan-100/60 text-xs font-light line-clamp-2 leading-relaxed">
                        {results.zodiac.description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-sm">Chưa có dữ liệu cung này</p>
                  )}
                </div>
                {results.zodiac && (
                  <Link to={ROUTES.ZODIAC_DETAIL(results.zodiac.id)} className="relative z-10 mt-6 flex items-center gap-2 text-cyan-300 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors w-fit">
                    Đọc bản giải mã <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>

            {/* ═══ ROW 2: Biểu đồ + Đỉnh cao ═══ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Biểu đồ Pythagoras */}
              <div className="relative overflow-hidden rounded-[2rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-950/80 to-slate-900/80 p-8 flex flex-col group">
                <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <p className="relative z-10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 mb-6">
                  <Grid3x3 className="w-3.5 h-3.5" /> Biểu Đồ Ngày Sinh · Pythagoras
                </p>
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-6">
                  {renderBirthGrid(results.birthGrid)}
                  <p className="text-emerald-100/40 text-[10px] text-center italic max-w-[220px] leading-relaxed">
                    Phân bổ năng lượng các con số trong ngày sinh
                  </p>
                </div>
              </div>

              {/* 4 Đỉnh Cao */}
              <div className="relative overflow-hidden rounded-[2rem] border border-indigo-500/20 bg-gradient-to-br from-indigo-950/80 to-slate-900/80 p-8 flex flex-col group">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <p className="relative z-10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 mb-6">
                  <Crown className="w-3.5 h-3.5" /> 4 Đỉnh Cao · Pinnacles
                </p>

                {results.pinnacles && results.pinnacles.length >= 4 ? (
                  <div className="relative z-10 flex-1 flex flex-col items-center justify-center">

                    {/* Pyramid SVG skeleton */}
                    <div className="relative w-full max-w-[300px] mx-auto" style={{ aspectRatio: '4/3' }}>
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 240 180">
                        <defs>
                          <linearGradient id="pg1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="rgba(129,140,248,0.5)" />
                            <stop offset="100%" stopColor="rgba(129,140,248,0)" />
                          </linearGradient>
                        </defs>
                        {/* Base lines */}
                        <line x1="50" y1="148" x2="88" y2="96" stroke="url(#pg1)" strokeWidth="1" />
                        <line x1="120" y1="148" x2="88" y2="96" stroke="url(#pg1)" strokeWidth="1" />
                        <line x1="120" y1="148" x2="152" y2="96" stroke="url(#pg1)" strokeWidth="1" />
                        <line x1="190" y1="148" x2="152" y2="96" stroke="url(#pg1)" strokeWidth="1" />
                        {/* Mid to apex lines */}
                        <line x1="88" y1="96" x2="120" y2="36" stroke="url(#pg1)" strokeWidth="1.5" strokeDasharray="5 3" />
                        <line x1="152" y1="96" x2="120" y2="36" stroke="url(#pg1)" strokeWidth="1.5" strokeDasharray="5 3" />
                      </svg>

                      {/* Apex — Đỉnh 3 */}
                      <Link to={ROUTES.PINNACLE_DETAIL(results.pinnacles[2].value)}
                        className="absolute flex flex-col items-center group cursor-pointer z-20"
                        style={{ top: '0%', left: '50%', transform: 'translate(-50%, -10%)' }}>
                        <div className="w-14 h-14 rounded-full bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-indigo-100 font-black text-xl bg-slate-900 group-hover:scale-110 group-hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                          {results.pinnacles[2].value}
                        </div>
                        <span className="text-[9px] font-bold text-indigo-300 mt-1.5 bg-slate-950/90 px-2 py-0.5 rounded-full border border-indigo-500/20 whitespace-nowrap group-hover:text-white transition-colors">
                          Đỉnh 3 · {results.pinnacles[2].age} tuổi
                        </span>
                      </Link>

                      {/* Mid left — Đỉnh 1 */}
                      <Link to={ROUTES.PINNACLE_DETAIL(results.pinnacles[0].value)}
                        className="absolute flex flex-col items-center group cursor-pointer z-20"
                        style={{ top: '43%', left: '18%' }}>
                        <div className="w-11 h-11 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-200 font-black bg-slate-900 group-hover:scale-110 group-hover:bg-purple-500 transition-all">
                          {results.pinnacles[0].value}
                        </div>
                        <span className="text-[8px] font-bold text-purple-400 mt-1 whitespace-nowrap group-hover:text-white transition-colors">Đỉnh 1 · {results.pinnacles[0].age} tuổi</span>
                      </Link>

                      {/* Mid right — Đỉnh 2 */}
                      <Link to={ROUTES.PINNACLE_DETAIL(results.pinnacles[1].value)}
                        className="absolute flex flex-col items-center group cursor-pointer z-20"
                        style={{ top: '43%', right: '18%' }}>
                        <div className="w-11 h-11 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-200 font-black bg-slate-900 group-hover:scale-110 group-hover:bg-purple-500 transition-all">
                          {results.pinnacles[1].value}
                        </div>
                        <span className="text-[8px] font-bold text-purple-400 mt-1 whitespace-nowrap group-hover:text-white transition-colors">Đỉnh 2 · {results.pinnacles[1].age} tuổi</span>
                      </Link>

                      {/* Base left — Đỉnh 1 base dot */}
                      <div className="absolute w-2 h-2 rounded-full bg-indigo-500/40 border border-indigo-500/60"
                        style={{ bottom: '8%', left: '18%' }} />
                      {/* Base mid */}
                      <div className="absolute w-2 h-2 rounded-full bg-indigo-500/40 border border-indigo-500/60"
                        style={{ bottom: '8%', left: '50%', transform: 'translateX(-50%)' }} />
                      {/* Base right */}
                      <div className="absolute w-2 h-2 rounded-full bg-indigo-500/40 border border-indigo-500/60"
                        style={{ bottom: '8%', right: '18%' }} />

                      {/* Pinnacle 4 — separate floating top right */}
                      <Link to={ROUTES.PINNACLE_DETAIL(results.pinnacles[3].value)}
                        className="absolute flex flex-col items-center group cursor-pointer z-20"
                        style={{ top: '-8%', right: '-4%' }}>
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-200 font-black bg-slate-900 group-hover:scale-110 group-hover:bg-amber-500 transition-all">
                          {results.pinnacles[3].value}
                        </div>
                        <span className="text-[7px] font-bold text-amber-400 mt-1 whitespace-nowrap group-hover:text-white transition-colors">Đỉnh cuối · {results.pinnacles[3].age} tuổi+</span>
                      </Link>
                    </div>

                    <Link to={`${ROUTES.PINNACLE_ANALYSIS}?dob=${dob}`}
                      className="mt-6 flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                      Xem toàn bộ hành trình <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm italic">Chưa có dữ liệu đỉnh cao</p>
                )}
              </div>

            </div>

            {/* ═══ ROW 3: Tên + Tương hợp (conditional) ═══ */}
            {(results.nameAnalysis || (results.topMatches && results.topMatches.length > 0)) && (
              <div className={`grid grid-cols-1 gap-4 ${results.nameAnalysis && results.topMatches?.length > 0 ? 'md:grid-cols-2' : ''}`}>

                {/* Giải mã tên */}
                {results.nameAnalysis && (
                  <div className="relative overflow-hidden rounded-[2rem] border border-violet-500/20 bg-gradient-to-br from-violet-950/80 to-slate-900/80 p-8 flex flex-col group">
                    <div className="absolute -top-12 -left-12 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
                    <p className="relative z-10 text-violet-400 text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 mb-6">
                      <BookOpen className="w-3.5 h-3.5" /> Giải Mã Tên Gọi
                    </p>
                    <div className="relative z-10 flex items-start gap-5 mb-6">
                      <div className="w-18 h-18 min-w-[4.5rem] w-18 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-lg">
                        {results.nameAnalysis.expressionNumber}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-black">Con số sứ mệnh</p>
                        <h4 className="text-white font-black text-xl leading-tight">{results.nameAnalysis.master?.title || 'Sứ Mệnh Bí Ẩn'}</h4>
                        <p className="text-violet-200/50 text-xs mt-1 line-clamp-2">{results.nameAnalysis.master?.traits}</p>
                      </div>
                    </div>

                    {/* 4 chỉ số phụ */}
                    <div className="relative z-10 grid grid-cols-4 gap-2">
                      {[
                        { icon: Heart, color: 'text-pink-400', label: 'Linh Hồn', val: results.nameAnalysis.soulNumber },
                        { icon: UserCircle2, color: 'text-cyan-400', label: 'Nhân Cách', val: results.nameAnalysis.personalityNumber },
                        { icon: Target, color: 'text-amber-400', label: 'Cân Bằng', val: results.nameAnalysis.balanceNumber },
                        { icon: AlertCircle, color: 'text-rose-400', label: 'Số Thiếu', val: results.nameAnalysis.karmicLessons.length > 0 ? results.nameAnalysis.karmicLessons.slice(0, 2).join(', ') : '✓' },
                      ].map(({ icon: Icon, color, label, val }) => (
                        <div key={label} className="bg-white/4 rounded-xl p-2.5 flex flex-col items-center border border-white/5">
                          <Icon className={`w-3.5 h-3.5 ${color} mb-1`} />
                          <span className="text-white font-black text-sm">{val}</span>
                          <span className="text-[8px] text-gray-500 uppercase font-bold text-center leading-tight mt-0.5">{label}</span>
                        </div>
                      ))}
                    </div>

                    <Link to={`${ROUTES.NAME_NUMEROLOGY_RESULT}?name=${encodeURIComponent(fullName)}`} className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-violet-300 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                      Phân tích chi tiết <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                {/* Cung tương hợp */}
                {results.topMatches && results.topMatches.length > 0 && (
                  <div className="relative overflow-hidden rounded-[2rem] border border-pink-500/20 bg-gradient-to-br from-pink-950/80 to-slate-900/80 p-8 flex flex-col group">
                    <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
                    <p className="relative z-10 text-pink-400 text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 mb-6">
                      <Heart className="w-3.5 h-3.5" /> Cung Hợp Nhất
                    </p>
                    <div className="relative z-10 flex-1 flex flex-col gap-3">
                      {results.topMatches.map((match, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-black/30 px-4 py-3 rounded-xl border border-white/5 hover:border-pink-500/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center font-black text-pink-300 text-xs border border-pink-500/20">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm">{match.name}</p>
                              <p className="text-[9px] text-gray-500 uppercase tracking-widest">{match.english_name}</p>
                            </div>
                          </div>
                          <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                            {match.match_score}%
                          </span>
                        </div>
                      ))}
                    </div>
                    <Link 
                      to={isLoggedIn ? `${ROUTES.ZODIAC_ALL_MATCHES}?sign=${results.zodiac.id}` : ROUTES.LOGIN} 
                      className="relative z-10 mt-6 pt-4 border-t border-pink-500/10 flex items-center gap-2 text-pink-300 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                    >
                      <TrendingUp className="w-3 h-3" /> 
                      {isLoggedIn ? "Xem toàn bộ BXH" : "Đăng nhập để xem toàn bộ"} 
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
