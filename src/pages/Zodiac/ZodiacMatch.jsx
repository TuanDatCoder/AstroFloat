import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, X, Info, Zap, Calendar, User, ArrowRight } from 'lucide-react';
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

export default function ZodiacMatch() {
  const [dob1, setDob1] = useState('');
  const [dob2, setDob2] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleMatch = async () => {
    if (!dob1 || !dob2) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      // 1. Lấy ID cung hoàng đạo cho cả 2 ngày sinh
      const id1 = await zodiacService.getZodiacIdByDate(dob1);
      const id2 = await zodiacService.getZodiacIdByDate(dob2);

      if (!id1 || !id2) {
        setError("Không thể xác định cung hoàng đạo cho ngày sinh đã nhập.");
        setLoading(false);
        return;
      }

      // 2. Lấy thông tin chi tiết của 2 cung
      const sign1 = await zodiacService.getZodiacById(id1);
      const sign2 = await zodiacService.getZodiacById(id2);

      // 3. Lấy dữ liệu match từ service mới
      const matchData = await zodiacMatchesService.getZodiacMatch(id1, id2);

      if (!matchData) {
        setError("Dữ liệu về sự tương hợp giữa hai cung này chưa được cập nhật trong hệ thống.");
      } else {
        setResult({
          sign1,
          sign2,
          match: matchData
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
            <h3 className="font-bold uppercase tracking-wider text-sm">Bạn (Người 1)</h3>
          </div>
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-pink-400 transition-colors" />
            <input 
              type="date" 
              value={dob1}
              onChange={(e) => setDob1(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-pink-500/30 transition-all font-medium"
            />
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
            <h3 className="font-bold uppercase tracking-wider text-sm">Người ấy (Người 2)</h3>
          </div>
          <div className="relative group">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="date" 
              value={dob2}
              onChange={(e) => setDob2(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-purple-500/30 transition-all font-medium"
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleMatch}
        disabled={loading || !dob1 || !dob2}
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
