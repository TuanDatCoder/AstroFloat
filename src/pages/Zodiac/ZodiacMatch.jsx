import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X, Info, Zap, Calendar, User, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { zodiacService } from '../../services/zodiacService';
import { zodiacMatchesService } from '../../services/zodiacMatchesService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

const CustomSelect = ({ value, onChange, options, placeholder, isPink }) => {
  const [isOpen, setIsOpen] = React.useState(false);
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
        <Icons.ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute z-50 w-full mt-2 bg-slate-900/95 backdrop-blur-2xl border ${isPink ? 'border-pink-500/20' : 'border-purple-500/20'} rounded-2xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto`}
            style={{ scrollbarWidth: 'thin' }}
          >
            {options.map((opt) => {
              const isSelected = value.toString() === opt.id.toString();
              return (
                <div 
                  key={opt.id}
                  onClick={() => { onChange(opt.id.toString()); setIsOpen(false); }}
                  className={`px-4 py-3 cursor-pointer transition-all flex items-center justify-between ${isSelected ? (isPink ? 'bg-pink-500/20 text-pink-300' : 'bg-purple-500/20 text-purple-300') : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                >
                  <span className="font-bold">
                    {opt.name}
                  </span>
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

export default function ZodiacMatch() {
  const [matchMode, setMatchMode] = useState(() => sessionStorage.getItem('astro_match_mode') || 'date');
  const [sign1Id, setSign1Id] = useState(() => sessionStorage.getItem('astro_match_sign1') || '');
  const [sign2Id, setSign2Id] = useState(() => sessionStorage.getItem('astro_match_sign2') || '');
  const [allZodiacs, setAllZodiacs] = useState([]);

  useEffect(() => {
    zodiacService.getAllZodiacs().then(data => setAllZodiacs(data || []));
  }, []);

  const [dob1, setDob1] = useState(() => sessionStorage.getItem('astro_match_dob1') || '');
  const [dob2, setDob2] = useState(() => sessionStorage.getItem('astro_match_dob2') || '');
  const [result, setResult] = useState(() => {
    const saved = sessionStorage.getItem('astro_match_result');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lưu trạng thái vào session storage mỗi khi thay đổi
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
    
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      let id1, id2;

      if (matchMode === 'date') {
        id1 = await zodiacService.getZodiacIdByDate(dob1);
        id2 = await zodiacService.getZodiacIdByDate(dob2);
        
        if (!id1 || !id2) {
          setError("Không thể xác định cung hoàng đạo cho ngày sinh đã nhập.");
          setLoading(false);
          return;
        }
      } else {
        id1 = parseInt(sign1Id);
        id2 = parseInt(sign2Id);
      }

      // 2. Lấy thông tin chi tiết của 2 cung
      const sign1 = await zodiacService.getZodiacById(id1);
      const sign2 = await zodiacService.getZodiacById(id2);

      // 3. Lấy dữ liệu match từ service mới
      const matchData = await zodiacMatchesService.getZodiacMatch(id1, id2);

      // 4. Lấy attributes
      const attr1 = await zodiacMatchesService.getZodiacAttributes(id1);
      const attr2 = await zodiacMatchesService.getZodiacAttributes(id2);

      const compMap = {};
      const processAttr = (a, personKey) => {
        if (!a?.criteria) return;
        const cid = a.criteria.id;
        if (!compMap[cid]) {
          compMap[cid] = { criteria: a.criteria, p1: null, p2: null };
        }
        compMap[cid][personKey] = a;
      };
      (attr1 || []).forEach(a => processAttr(a, 'p1'));
      (attr2 || []).forEach(a => processAttr(a, 'p2'));
      const comparisons = Object.values(compMap);

      if (!matchData) {
        setError("Dữ liệu về sự tương hợp giữa hai cung này chưa được cập nhật trong hệ thống.");
      } else {
        setResult({
          sign1,
          sign2,
          match: matchData,
          comparisons
        });
      }
    } catch (err) {
      console.error(err);
      setError("Đã có lỗi xảy ra trong quá trình tính toán. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-cyan-400";
    if (score >= 40) return "text-yellow-400";
    return "text-rose-400";
  };

  return (
    <div className="flex flex-col items-center pt-10 pb-20 px-6 relative z-10 w-full max-w-7xl mx-auto min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <span className="inline-block py-1.5 px-4 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-300 text-xs font-semibold tracking-[0.25em] mb-4 shadow-[0_0_20px_rgba(244,114,182,0.15)]">
          TƯƠNG HỢP CUNG HOÀNG ĐẠO
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-400 to-indigo-400 pb-2">
          So Đôi Lứa Đôi
        </h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto font-light">
          Khám phá mức độ thấu hiểu và gắn kết giữa bạn và "người ấy" thông qua vị trí của các vì sao.
        </p>

        {/* Chế độ nhập */}
        <div className="mt-8 flex justify-center gap-4 relative z-20">
          <button 
            onClick={() => { setMatchMode('date'); setResult(null); }}
            className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-widest transition-all uppercase ${matchMode === 'date' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)]' : 'bg-black/30 text-gray-500 border border-white/5 hover:text-white hover:border-white/20'}`}
          >
            Theo Ngày Sinh
          </button>
          <button 
            onClick={() => { setMatchMode('sign'); setResult(null); }}
            className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-widest transition-all uppercase ${matchMode === 'sign' ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-black/30 text-gray-500 border border-white/5 hover:text-white hover:border-white/20'}`}
          >
            Chọn Cung
          </button>
        </div>
      </motion.div>

      {/* Input Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl mb-12"
      >
        <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 mb-4 text-pink-400">
            <User className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Người 1</h3>
          </div>
          <div className="relative group">
            {matchMode === 'date' ? (
              <>
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-pink-400 transition-colors" />
                <input 
                  type="date" 
                  value={dob1}
                  onChange={(e) => setDob1(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-pink-500/30 transition-all font-medium"
                />
              </>
            ) : (
              <CustomSelect
                value={sign1Id}
                onChange={setSign1Id}
                options={allZodiacs}
                placeholder="-- Chọn Cung --"
                isPink={true}
              />
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-center pointer-events-none hidden lg:flex">
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full"
            />
            <Heart className="w-12 h-12 text-pink-500 relative z-10 fill-pink-500/20" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 mb-4 text-purple-400">
            <User className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Người 2</h3>
          </div>
          <div className="relative group">
            {matchMode === 'date' ? (
              <>
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input 
                  type="date" 
                  value={dob2}
                  onChange={(e) => setDob2(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium"
                />
              </>
            ) : (
              <CustomSelect
                value={sign2Id}
                onChange={setSign2Id}
                options={allZodiacs}
                placeholder="-- Chọn Cung --"
                isPink={false}
              />
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleMatch}
        disabled={loading || (matchMode === 'date' ? (!dob1 || !dob2) : (!sign1Id || !sign2Id))}
        className="px-12 py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-500 rounded-2xl font-bold text-white shadow-[0_10px_30px_rgba(236,72,153,0.3)] disabled:opacity-50 transition-all flex items-center gap-3 text-lg mb-16"
      >
        {loading ? (
          <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Zap className="w-6 h-6 fill-white" />
            Bắt Đầu So Khớp
          </>
        )}
      </motion.button>

      {/* Result Section */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-300 max-w-xl text-center flex items-center gap-4"
          >
            <Info className="w-6 h-6 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl space-y-8"
          >
            {/* Score Card */}
            <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[3rem] border border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
               {/* Background Glow */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />

              <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                {/* Person 1 */}
                <div className="text-center space-y-4 flex-1">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-pink-500/20 to-pink-500/5 flex items-center justify-center border border-pink-500/20 shadow-inner">
                    <span className="text-4xl">✨</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{result.sign1.name}</h2>
                    <p className="text-pink-400 text-sm uppercase tracking-widest font-semibold mt-1">{result.sign1.english_name}</p>
                  </div>
                </div>

                {/* Score Indicator */}
                <div className="flex-1 flex flex-col items-center">
                  <div className="relative">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-white/5"
                      />
                      <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={552.92}
                        initial={{ strokeDashoffset: 552.92 }}
                        animate={{ strokeDashoffset: 552.92 - (552.92 * result.match.match_score) / 100 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className={getScoreColor(result.match.match_score)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className={`text-6xl font-black ${getScoreColor(result.match.match_score)}`}
                      >
                        {result.match.match_score}%
                      </motion.span>
                      <span className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold mt-2">Duyên Phận</span>
                    </div>
                  </div>
                </div>

                {/* Person 2 */}
                <div className="text-center space-y-4 flex-1">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center border border-purple-500/20 shadow-inner">
                    <span className="text-4xl">💫</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{result.sign2.name}</h2>
                    <p className="text-purple-400 text-sm uppercase tracking-widest font-semibold mt-1">{result.sign2.english_name}</p>
                  </div>
                </div>
              </div>

              {/* Analysis */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-black/30 p-8 rounded-[2rem] border border-white/5 space-y-4"
                >
                  <div className="flex items-center gap-3 text-pink-400 mb-2">
                    <Heart className="w-6 h-6 fill-pink-400" />
                    <h3 className="text-xl font-bold italic">Góc Độ Tình Yêu</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-light">
                    {result.match.love_analysis || "Đang phân tích dữ liệu tình yêu..."}
                  </p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-black/30 p-8 rounded-[2rem] border border-white/5 space-y-4"
                >
                  <div className="flex items-center gap-3 text-cyan-400 mb-2">
                    <Sparkles className="w-6 h-6 fill-cyan-400" />
                    <h3 className="text-xl font-bold italic">Góc Độ Tình Bạn</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-light">
                    {result.match.friendship_analysis || "Đang phân tích dữ liệu tình bạn..."}
                  </p>
                </motion.div>
              </div>

              {/* Bảng so sánh tiêu chí */}
              {result.comparisons && result.comparisons.length > 0 && (
                <div className="mt-16 bg-slate-900/40 p-8 md:p-12 rounded-[3rem] border border-white/5 relative overflow-hidden">
                  <h3 className="text-2xl md:text-3xl font-black text-center mb-10 text-white tracking-tight">So Sánh Đặc Điểm Tương Quan</h3>
                  <div className="space-y-12 relative z-10">
                    {/* Gom nhóm và tính toán điểm */}
                    {(() => {
                      const grouped = result.comparisons.reduce((acc, c) => {
                        const cat = c.criteria.category || 'Các chỉ số khác';
                        if (!acc[cat]) acc[cat] = [];
                        acc[cat].push(c);
                        return acc;
                      }, {});

                      const categoryStats = Object.entries(grouped).map(([category, items]) => {
                        // Chi tinh cap co du lieu ca 2 phia
                        const validItems = items.filter(c => c.p1?.score && c.p2?.score);
                        if (!validItems.length) return { category, items, avg: null };
                        const scores = validItems.map(c => {
                          const diff = Math.abs(c.p1.score - c.p2.score); // 0-9 (scores 1-10)
                          return Math.round((1 - diff / 9) * 100); // diff=0->100%, diff=9->0%
                        });
                        const avg = Math.round(scores.reduce((a,b)=>a+b, 0) / scores.length);
                        return { category, items, avg };
                      }).filter(c => c.avg !== null);

                      const totalAvg = Math.round(
                        categoryStats.reduce((a,b)=>a+b.avg, 0) / (categoryStats.length || 1)
                      );

                      return (
                        <>
                          {categoryStats.map(({ category, items, avg }, catIdx) => (
                            <div key={catIdx} className="space-y-8">
                              <div className="flex items-center gap-4">
                                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                                <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 uppercase tracking-widest">{category}</h4>
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-black text-xs border border-emerald-500/20 whitespace-nowrap">
                                  Hợp: {avg}%
                                </span>
                                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
                              </div>
                              
                              <div className="space-y-10">
                                {items.map((c, idx) => {
                                  const score1 = c.p1?.score || 0;
                                  const score2 = c.p2?.score || 0;
                                  const criteriaName = c.criteria.criteria_name;
                                  const iconName = c.criteria.icon_url;
                                  
                                  // Render Icon động
                                  let IconComponent = null;
                                  if (iconName) {
                                    const pascalName = iconName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
                                    IconComponent = Icons[pascalName];
                                  }
        
                                  return (
                                    <div key={idx} className="space-y-3">
                                      <div className="flex items-center justify-between text-sm">
                                        <span className="font-black text-pink-400 w-12 text-left text-lg">{score1}<span className="text-[10px] text-pink-400/50">/10</span></span>
                                        <span className="font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                                          <span className="text-gray-400">{IconComponent ? <IconComponent className="w-5 h-5" /> : '🌟'}</span> {criteriaName}
                                        </span>
                                        <span className="font-black text-purple-400 w-12 text-right text-lg">{score2}<span className="text-[10px] text-purple-400/50">/10</span></span>
                                      </div>
                                      
                                      {/* Thanh bar đôi */}
                                      <div className="flex items-center gap-1.5 h-3">
                                        <div className="flex-1 h-full bg-black/60 rounded-l-full overflow-hidden flex justify-end">
                                          <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(score1 / 10) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                                            className="h-full bg-gradient-to-l from-pink-400 to-pink-600 rounded-l-full shadow-[0_0_10px_rgba(244,114,182,0.5)]"
                                          />
                                        </div>
                                        <div className="w-1 h-full bg-white/20 rounded-full" />
                                        <div className="flex-1 h-full bg-black/60 rounded-r-full overflow-hidden">
                                          <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(score2 / 10) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: 'easeOut' }}
                                            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-r-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                          />
                                        </div>
                                      </div>
                                      
                                      {/* Luận giải */}
                                      <div className="flex gap-6 mt-3">
                                        <p className="flex-1 text-right text-[11px] leading-relaxed text-gray-400 italic font-medium">
                                          {c.p1?.description || ''}
                                        </p>
                                        <p className="flex-1 text-left text-[11px] leading-relaxed text-gray-400 italic font-medium">
                                          {c.p2?.description || ''}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}

                          {/* Tổng kết độ tương hợp chi tiết */}
                          <div className="mt-16 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8 rounded-[2rem] border border-white/10 text-center relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 blur-[50px] rounded-full" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 blur-[50px] rounded-full" />
                            <div className="relative z-10">
                              <h3 className="text-xl font-bold mb-2 text-white">TỔNG THỂ TƯƠNG QUAN CHI TIẾT</h3>
                              <p className="text-gray-400 text-xs uppercase tracking-widest mb-6">Mức độ hòa hợp trung bình qua mọi khía cạnh</p>
                              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">
                                {totalAvg}%
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              <div className="mt-12 text-center">
                 <button 
                  onClick={() => setResult(null)}
                  className="px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                  Thực hiện phép thử mới
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
