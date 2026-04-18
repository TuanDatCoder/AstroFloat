import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Star, ArrowRight, UserCircle2, X, Zap, Heart, Target, AlertCircle } from 'lucide-react';
import { zodiacService } from '../services/zodiacService';
import { numerologyService } from '../services/numerologyService';
import { nameNumerologyService } from '../services/nameNumerologyService';
import { zodiacMatchesService } from '../services/zodiacMatchesService';
import { supabase } from '../services/supabase';
import { ROUTES } from '../constants';

export default function Discover() {
  const [dob, setDob] = useState(() => localStorage.getItem('astrofloat_dob') || '');
  const [fullName, setFullName] = useState(() => localStorage.getItem('astrofloat_name') || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleDiscover = async () => {
    if (!dob) return;
    setLoading(true);
    setResults(null);
    setError(null);

    try {
      // 1. Phân tích Cung Hoàng Đạo
      const zodiacId = await zodiacService.getZodiacIdByDate(dob);
      let zodiacData = null;
      let topMatches = [];
      if (zodiacId) {
        zodiacData = await zodiacService.getZodiacById(zodiacId);
        topMatches = await zodiacMatchesService.getTopMatches(zodiacId, 3);
      }
      
      // 2. Phân tích Thần Số Học (Ngày sinh)
      const { data: { session } } = await supabase.auth.getSession();
      
      const lifePathNum = numerologyService.calculateLifePathNumber(dob);
      const birthGrid = numerologyService.calculateBirthGrid(dob);
      const pinnacles = await numerologyService.getPinnaclesForUser(session?.user?.id, dob);
      let numerologyData = null;
      if (lifePathNum) {
        try {
          numerologyData = await numerologyService.getNumerologyByNumber(lifePathNum);
        } catch {
          numerologyData = { number: lifePathNum, title: 'Bí Ẩn' };
        }
      }

      // 3. Phân tích Tên (Nếu có)
      let nameAnalysis = null;
      if (fullName.trim()) {
        const analysis = await nameNumerologyService.calculateFullAnalysis(fullName);
        if (analysis) {
           const nameMasterData = await nameNumerologyService.getNameNumerology(analysis.expressionNumber);
           const advancedMetrics = await nameNumerologyService.getAdvancedMetrics(
              analysis.soulNumber,
              analysis.personalityNumber,
              analysis.balanceNumber,
              analysis.karmicLessons
           );
           nameAnalysis = {
              ...analysis,
              master: nameMasterData,
              metrics: advancedMetrics
           };
        }
      }

      setResults({
        zodiac: zodiacData,
        topMatches,
        numerology: numerologyData,
        birthGrid,
        pinnacles,
        nameAnalysis
      });
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi hệ thống khi phân tích dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  // Trình bày 4 đỉnh cao (Pinnacles)
  const renderPinnacles = (pinnacles) => {
    if (!pinnacles) return null;
    return (
      <div className="relative w-full max-w-[280px] aspect-[4/3] mx-auto mt-4">
        {/* SVG lines connecting the peaks */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 150">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(129, 140, 248, 0.5)" />
              <stop offset="100%" stopColor="rgba(129, 140, 248, 0)" />
            </linearGradient>
          </defs>
          {/* Base to Mid */}
          <line x1="50" y1="120" x2="75" y2="80" stroke="url(#lineGrad)" strokeWidth="1" />
          <line x1="100" y1="120" x2="75" y2="80" stroke="url(#lineGrad)" strokeWidth="1" />
          <line x1="100" y1="120" x2="125" y2="80" stroke="url(#lineGrad)" strokeWidth="1" />
          <line x1="150" y1="120" x2="125" y2="80" stroke="url(#lineGrad)" strokeWidth="1" />
          {/* Mid to Top */}
          <line x1="75" y1="80" x2="100" y2="30" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="125" y1="80" x2="100" y2="30" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 2" />
        </svg>

        {/* Level 3: Đỉnh 3 (Cao nhất trong chuỗi 1-2-3) */}
        <Link to={ROUTES.PINNACLE_DETAIL(pinnacles[2].value)} className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer z-20">
           <div className="w-12 h-12 rounded-full bg-indigo-500/20 border-2 border-indigo-400 flex items-center justify-center text-indigo-100 font-black shadow-[0_0_15px_rgba(99,102,241,0.5)] bg-slate-900 group-hover:scale-110 group-hover:bg-indigo-500 transition-all">
            {pinnacles[2].value}
          </div>
          <span className="text-[9px] font-bold text-indigo-300 mt-1 bg-slate-950/80 px-2 rounded-full border border-indigo-500/20 group-hover:text-white transition-colors">Đỉnh 3: {pinnacles[2].age}t</span>
        </Link>

        {/* Level 2: Đỉnh 1 & 2 */}
        <Link to={ROUTES.PINNACLE_DETAIL(pinnacles[0].value)} className="absolute top-16 left-[20%] flex flex-col items-center group cursor-pointer z-20">
           <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-200 font-bold bg-slate-900 group-hover:scale-110 group-hover:bg-purple-500 transition-all">
            {pinnacles[0].value}
          </div>
          <span className="text-[8px] font-bold text-purple-400 mt-1 group-hover:text-white transition-colors">Đỉnh 1: {pinnacles[0].age}t</span>
        </Link>
        <Link to={ROUTES.PINNACLE_DETAIL(pinnacles[1].value)} className="absolute top-16 right-[20%] flex flex-col items-center group cursor-pointer z-20">
           <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-200 font-bold bg-slate-900 group-hover:scale-110 group-hover:bg-purple-500 transition-all">
            {pinnacles[1].value}
          </div>
          <span className="text-[8px] font-bold text-purple-400 mt-1 group-hover:text-white transition-colors">Đỉnh 2: {pinnacles[1].age}t</span>
        </Link>

        {/* Level 4: Đỉnh cao nhất cuộc đời (thường đặt riêng biệt hoặc cao hơn bản chính) */}
        <Link to={ROUTES.PINNACLE_DETAIL(pinnacles[3].value)} className="absolute -top-10 right-0 flex flex-col items-center group cursor-pointer z-20">
           <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-200 font-bold bg-slate-900 group-hover:scale-110 group-hover:bg-amber-500 transition-all">
            {pinnacles[3].value}
          </div>
          <span className="text-[7px] font-bold text-amber-400 mt-1 uppercase tracking-tighter group-hover:text-white transition-colors">Đỉnh cuối cùng ({pinnacles[3].age}t+)</span>
        </Link>
      </div>
    );
  };

  // Trình bày Grid cho Pythagoras (Row 3: 3-6-9, Row 2: 2-5-8, Row 1: 1-4-7)
  const renderBirthGrid = (grid) => {
    if (!grid) return null;
    const layout = [
      [3, 6, 9],
      [2, 5, 8],
      [1, 4, 7]
    ];

    return (
      <div className="grid grid-cols-3 gap-2 w-full max-w-[200px] mx-auto bg-white/5 p-3 rounded-2xl border border-white/5">
        {layout.map((row) => row.map((num) => (
          <div
            key={num}
            className={`aspect-square flex items-center justify-center rounded-lg text-lg font-black transition-all duration-700 ${grid[num].length > 0
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-black/20 text-white/5 border border-white/5'
              }`}
          >
            {grid[num].length > 0 ? grid[num].join('') : num}
          </div>
        )))}
      </div>
    );
  };

  // Tự động load kết quả nếu quay lại trang và đã có dob
  React.useEffect(() => {
    if (dob) {
      handleDiscover(dob);
    }
  }, []);

  return (
    <div className="flex flex-col items-center pt-24 pb-20 px-6 relative z-10 w-full max-w-4xl mx-auto min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full text-center mb-10"
      >
        <span className="inline-block py-1.5 px-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-[0.2em] mb-4">
          GIẢI MÃ BẢN THÂN
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400 drop-shadow-sm pb-2">
          Hồ Sơ Năng Lượng
        </h1>
        <p className="text-emerald-100/60 mt-2 max-w-lg mx-auto font-light">
          Nhập sinh nhật của bạn để hệ thống truy xuất tần số Thần số học và biểu đồ Chòm sao tương ứng.
        </p>
      </motion.div>

      {/* Form nhập liệu */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-xl mx-auto bg-slate-900/80 backdrop-blur-md p-8 rounded-[2rem] border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col gap-6 relative z-20 mb-12"
      >
        <div className="flex flex-col gap-6">
          {/* Nhập Tên */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-bold tracking-widest text-emerald-400 ml-2">Họ và tên đầy đủ</label>
            <div className="flex gap-2 items-center w-full">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn Đạt"
                className="w-full px-5 py-4 rounded-xl bg-black/40 border border-emerald-500/20 text-white font-medium text-lg focus:outline-none focus:border-emerald-400 shadow-inner placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Nhập Ngày Sinh */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-bold tracking-widest text-emerald-400 ml-2">Ngày sinh dương lịch</label>
            <div className="flex gap-2 items-center w-full">
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-5 py-4 rounded-xl bg-black/40 border border-emerald-500/20 text-white font-medium text-lg focus:outline-none focus:border-emerald-400 shadow-inner"
              />
              {(dob || fullName) && (
                <button
                  onClick={() => {
                    setDob('');
                    setFullName('');
                    localStorage.removeItem('astrofloat_dob');
                    localStorage.removeItem('astrofloat_name');
                    setResults(null);
                  }}
                  className="flex-shrink-0 p-4 rounded-xl bg-black/40 border border-emerald-500/20 text-emerald-500/70 hover:text-emerald-400 hover:border-emerald-500/50 transition-all flex items-center justify-center cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm text-left">{error}</p>}

        <button
          onClick={() => {
            localStorage.setItem('astrofloat_dob', dob);
            localStorage.setItem('astrofloat_name', fullName);
            handleDiscover();
          }}
          disabled={loading || !dob}
          className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-lg rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50 disabled:grayscale"
        >
          {loading ? <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : "Truy Xuất Phổ Năng Lượng"}
        </button>
      </motion.div>

      {/* Kết quả */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 w-full max-w-5xl"
          >
            {/* THÀNH PHẦN 1: THẦN SỐ HỌC (Đầu tiên) */}
            <div className="bg-purple-950/40 backdrop-blur-md border border-purple-500/30 rounded-[2rem] p-8 text-left flex flex-col justify-between group hover:bg-purple-900/50 transition-colors shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none">
                <Sparkles className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <p className="text-purple-400 text-[10px] uppercase font-black tracking-widest mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> THẦN SỐ HỌC
                </p>
                {results.numerology ? (
                  <>
                    <h4 className="text-6xl font-black text-white mb-2 leading-none">
                      {results.numerology.number}
                    </h4>
                    <p className="text-xl font-bold text-purple-200 mb-3">{results.numerology.title}</p>
                    <p className="text-purple-100/70 text-sm line-clamp-3 leading-relaxed">
                      {results.numerology.traits || 'Đang giải mã tần số năng lượng của bạn...'}
                    </p>
                  </>
                ) : (
                  <h4 className="text-2xl font-bold text-gray-400">Không thể giải mã</h4>
                )}
              </div>
              <div className="relative z-10 mt-8 pt-5 border-t border-purple-500/20">
                {results.numerology && (
                  <Link to={ROUTES.NUMEROLOGY_DETAIL(results.numerology.number)} className="text-purple-300 text-sm font-semibold flex items-center gap-2 group-hover:text-purple-100 w-fit">
                    Khám phá toàn bộ <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>

            {/* THÀNH PHẦN 2: CUNG HOÀNG ĐẠO (Đầu tiên) */}
            <div className="bg-cyan-950/40 backdrop-blur-md border border-cyan-500/30 rounded-[2rem] p-8 text-left flex flex-col justify-between group hover:bg-cyan-900/50 transition-colors shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none">
                <Star className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <p className="text-cyan-400 text-[10px] uppercase font-black tracking-widest mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4" /> CUNG HOÀNG ĐẠO
                </p>
                {results.zodiac ? (
                  <>
                    <h4 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
                      {results.zodiac.name}
                    </h4>
                    <span className="inline-block px-3 py-1 bg-cyan-900/50 rounded-lg text-xs font-bold text-cyan-200 border border-cyan-500/20 mb-3 tracking-wider">
                      {results.zodiac.english_name || "ZODIAC"}
                    </span>
                    <p className="text-cyan-100/70 text-sm line-clamp-3 leading-relaxed mt-2">
                      {results.zodiac.description || 'Chưa cập nhật phổ dữ liệu tổng quan.'}
                    </p>
                  </>
                ) : (
                  <p className="text-red-400 italic text-sm mt-2 font-medium">Chúng mình chưa kịp chuẩn bị dữ liệu cung này cho bạn!</p>
                )}
              </div>
              <div className="relative z-10 mt-8 pt-5 border-t border-cyan-500/20">
                {results.zodiac && (
                  <Link to={ROUTES.ZODIAC_DETAIL(results.zodiac.id)} className="text-cyan-300 text-sm font-semibold flex items-center gap-2 group-hover:text-cyan-100 w-fit">
                    Đọc bản giải mã gốc <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>

            {/* THÀNH PHẦN 3: BIỂU ĐỒ NGÀY SINH */}
            <div className="bg-emerald-950/40 backdrop-blur-md border border-emerald-500/30 rounded-[2rem] p-8 text-left flex flex-col items-center justify-center group hover:bg-emerald-900/50 transition-colors shadow-2xl relative overflow-hidden h-full">
              <div className="w-full mb-6 relative z-10">
                <p className="text-emerald-400 text-[10px] uppercase font-black tracking-widest mb-4 flex items-center gap-2">
                  <UserCircle2 className="w-4 h-4" /> BIỂU ĐỒ NGÀY SINH
                </p>
                <div className="flex flex-col items-center justify-center w-full h-full min-h-[160px]">
                  {renderBirthGrid(results.birthGrid)}
                </div>
              </div>
              <p className="text-emerald-100/50 text-[10px] text-center italic leading-relaxed relative z-10">
                Biểu đồ thể hiện sự phân bổ năng lượng các con số trong ngày sinh của bạn.
              </p>
            </div>

            {/* THÀNH PHẦN 4: KIM TỰ THÁP (Chỉnh lại đẹp hơn) */}
            <div className="bg-indigo-950/40 backdrop-blur-md border border-indigo-500/30 rounded-[2rem] p-8 text-left flex flex-col items-center justify-between group hover:bg-indigo-900/50 transition-colors shadow-2xl relative overflow-hidden h-full">
              <div className="w-full mb-2 relative z-10">
                <p className="text-indigo-400 text-[10px] uppercase font-black tracking-widest mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> 4 ĐỈNH CAO (PYRAMID)
                </p>
                <div className="py-4">
                  {renderPinnacles(results.pinnacles)}
                </div>
              </div>
              <div className="relative z-10 mt-8 pt-5 border-t border-indigo-500/20 w-full flex justify-center">
                <Link 
                  to={`${ROUTES.PINNACLE_ANALYSIS}?dob=${dob}`} 
                  className="text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-200 transition-colors flex items-center gap-2"
                >
                  Khám phá toàn bộ <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* THÀNH PHẦN 5: GIẢI MÃ TÊN (NGẮN GỌN) - CHO XUỐNG DƯỚI CÙNG */}
            {results.nameAnalysis && (
              <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 group hover:bg-slate-800/80 transition-all shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div className="relative z-10">
                  <p className="text-purple-400 text-[10px] uppercase font-black tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> GIẢI MÃ TÊN GỌI
                  </p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                      {results.nameAnalysis.expressionNumber}
                    </div>
                    <div>
                      <h4 className="text-white font-black text-lg uppercase tracking-tight line-clamp-1">
                        {results.nameAnalysis.master?.title || "Sứ Mệnh Bí Ẩn"}
                      </h4>
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Con số sứ mệnh</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
                      <Heart className="w-4 h-4 text-pink-400 mb-1" />
                      <span className="text-white font-black text-lg">{results.nameAnalysis.soulNumber}</span>
                      <span className="text-[8px] text-gray-500 uppercase font-bold">Linh Hồn</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
                      <UserCircle2 className="w-4 h-4 text-cyan-400 mb-1" />
                      <span className="text-white font-black text-lg">{results.nameAnalysis.personalityNumber}</span>
                      <span className="text-[8px] text-gray-500 uppercase font-bold">Nhân Cách</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
                      <Target className="w-4 h-4 text-amber-400 mb-1" />
                      <span className="text-white font-black text-lg">{results.nameAnalysis.balanceNumber}</span>
                      <span className="text-[8px] text-gray-500 uppercase font-bold">Cân Bằng</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-2xl border border-white/5 flex flex-col items-center">
                      <AlertCircle className="w-4 h-4 text-red-400 mb-1" />
                      <div className="flex gap-1">
                        {results.nameAnalysis.karmicLessons.length > 0 
                          ? results.nameAnalysis.karmicLessons.slice(0, 3).map(n => <span key={n} className="text-white font-black text-xs">{n}</span>)
                          : <span className="text-emerald-400 text-[10px]">Đủ</span>
                        }
                      </div>
                      <span className="text-[8px] text-gray-500 uppercase font-bold">Số Thiếu</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative z-10 mt-6 pt-4 border-t border-white/5">
                  <Link 
                    to={`/name-numerology/result?name=${encodeURIComponent(fullName)}`} 
                    className="flex items-center justify-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-widest hover:text-purple-300 transition-colors"
                  >
                    Xem chi tiết <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* THÀNH PHẦN 6: CÁC CUNG TƯƠNG HỢP NHẤT */}
            {results.topMatches && results.topMatches.length > 0 && (
              <div className="bg-pink-950/40 backdrop-blur-md border border-pink-500/30 rounded-[2rem] p-8 group hover:bg-pink-900/50 transition-all shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none">
                  <Heart className="w-32 h-32 text-pink-400" />
                </div>
                <div className="relative z-10 w-full mb-4">
                  <p className="text-pink-400 text-[10px] uppercase font-black tracking-widest mb-6 flex items-center gap-2">
                    <Heart className="w-4 h-4" /> BẠN HỢP VỚI CUNG NÀO NHẤT?
                  </p>
                  
                  <div className="space-y-4 w-full">
                    {results.topMatches.map((match, idx) => (
                      <div key={idx} className="bg-black/30 w-full p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:border-pink-500/20 cursor-default transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center font-black text-pink-300 border border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.2)]">
                            #{idx + 1}
                          </div>
                          <div>
                            <p className="text-white font-bold text-lg leading-tight">{match.name}</p>
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest">{match.english_name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">{match.match_score}%</p>
                          <p className="text-[8px] text-gray-500 uppercase tracking-widest">Độ Hợp</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="relative z-10 mt-6 pt-5 border-t border-pink-500/20 w-full flex justify-center">
                  <Link 
                    to="/zodiac-match" 
                    className="flex items-center gap-2 text-pink-400 text-[10px] font-black uppercase tracking-widest hover:text-pink-300 transition-colors group-hover:gap-3"
                  >
                    So Khớp Chi Tiết <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
