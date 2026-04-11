import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BookOpen, User, Calculator } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { nameNumerologyService } from '../../services/nameNumerologyService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function NameNumerology() {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await nameNumerologyService.getAllNameNumerologies();
        setNumbers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSearch = () => {
    if (!name.trim()) return;
    navigate(`/name-numerology/result?name=${encodeURIComponent(name.trim())}`);
  };

  return (
    <div className="flex flex-col items-center pt-24 pb-32 px-6 relative z-10 w-full max-w-7xl mx-auto min-h-screen">
      
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-black tracking-widest mb-6 shadow-xl uppercase">
          <BookOpen className="w-4 h-4" /> Thư Viện Thần Số Học
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
          Giải Mã <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Tên Gọi</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
          Tên gọi mang tần số năng lượng riêng biệt ảnh hưởng đến vận mệnh.
          Hãy tra cứu ngay hoặc khám phá ý nghĩa các con số bên dưới.
        </p>
      </motion.div>

      {/* Direct Search Input */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-2xl p-6 rounded-[2.5rem] border border-white/10 shadow-2xl mb-24 relative overflow-hidden"
      >
        <div className="flex flex-col gap-4">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-400/50 group-focus-within:text-purple-400 transition-colors" />
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên đầy đủ của bạn..."
              className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-4 py-4 text-white text-lg placeholder:text-gray-600 focus:outline-none focus:border-purple-500/30 focus:bg-black/60 transition-all font-medium"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={!name.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-2xl font-black text-white shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Calculator className="w-5 h-5" />
            TRA CỨU NGAY
          </button>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-64 bg-slate-900/40 rounded-[2.5rem] animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
        >
          {numbers.map((num) => (
            <motion.div
              key={num.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center group transition-all hover:bg-slate-800/80 hover:border-purple-500/30 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-600/10 border border-purple-500/20 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
                  {num.number}
                </span>
              </div>

              <h3 className="text-2xl font-black text-white mb-3 tracking-tight uppercase group-hover:text-purple-300 transition-colors italic">
                {num.title}
              </h3>

              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4" />

              <p className="text-gray-400 text-sm font-light leading-relaxed mb-8 line-clamp-3">
                {num.traits}
              </p>

              <div className="mt-auto space-y-4 w-full">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500 px-4 group-hover:text-purple-400/60 transition-colors">
                  <span>Khám Phá Sứ Mệnh</span>
                  <div className="h-px w-8 bg-current opacity-20" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Footer Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-24 p-10 bg-indigo-500/5 rounded-[3rem] border border-indigo-500/20 text-center max-w-4xl"
      >
        <Sparkles className="w-10 h-10 text-indigo-400 mx-auto mb-6 opacity-50" />
        <h4 className="text-xl font-bold text-white mb-4 italic uppercase tracking-wider">Mọi cái tên đều ẩn chứa một thông điệp</h4>
        <p className="text-gray-400 leading-relaxed font-light italic">
          "Con số là ngôn ngữ của vũ trụ. Bằng cách khám phá các con số này, chúng ta đang từng bước tìm thấy bản ngã thật sự của chính mình và rung động của linh hồn."
        </p>
      </motion.div>

    </div>
  );
}
