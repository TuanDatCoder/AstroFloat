'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { 
  User, Sparkles, Star, Briefcase, Heart, Lightbulb, 
  AlertCircle, Info, Target, ArrowLeft, UserCircle2, BookOpen, Crown 
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { nameNumerologyService } from '@/services/nameNumerologyService';
import { ROUTES } from '@/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100 }
  }
};

function NameNumerologyResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [name, setName] = useState(searchParams.get('name') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [details, setDetails] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const nameParam = searchParams.get('name');
    if (nameParam) {
      setName(nameParam);
      calculate(nameParam);
    }
  }, [searchParams]);

  const calculate = async (nameToCalc) => {
    if (!nameToCalc.trim()) return;
    setLoading(true);
    setResult(null);
    setDetails([]);
    setError(null);

    try {
      const analysis = await nameNumerologyService.calculateFullAnalysis(nameToCalc);
      if (!analysis) {
        setError("Không tìm thấy giá trị số từ tên này. Vui lòng nhập tên khác.");
        setLoading(false);
        return;
      }

      const number = analysis.expressionNumber;
      const [numerologyData, numerologyDetails, advancedMetrics] = await Promise.all([
        nameNumerologyService.getNameNumerology(number),
        nameNumerologyService.getNameNumerologyDetails(number),
        nameNumerologyService.getAdvancedMetrics(
          analysis.soulNumber,
          analysis.personalityNumber,
          analysis.balanceNumber,
          analysis.karmicLessons
        )
      ]);

      if (!numerologyData) {
        setResult({ 
          number, 
          title: "Sứ Mệnh Bí Ẩn", 
          traits: "Chúng tôi đang nghiên cứu thêm về con số sứ mệnh này từ tên của bạn.",
          analysis,
          metrics: advancedMetrics
        });
      } else {
        setResult({ ...numerologyData, number, analysis, metrics: advancedMetrics });
        setDetails(numerologyDetails || []);
      }
    } catch (err) {
      console.error(err);
      setError("Đã có lỗi xảy ra. Hãy thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center pt-28 pb-24 px-6 relative z-10 w-full max-w-7xl mx-auto min-h-screen">
      
      {/* Optimized Background Decorations */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.05)_0%,_transparent_70%)]" />
        <div className="absolute top-1/4 -left-24 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.06)_0%,_transparent_70%)]" />
        <div className="absolute bottom-1/4 -right-24 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05)_0%,_transparent_70%)]" />
      </div>

      <button 
        onClick={() => router.back()} 
        className="self-start mb-12 flex items-center gap-2 text-purple-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 py-2 px-6 rounded-full border border-white/5 hover:bg-purple-500/20"
      >
        <ArrowLeft className="w-4 h-4" /> TRỞ VỀ
      </button>

      {/* Header Section */}
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20 transform-gpu"
      >
        <span className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-black tracking-[0.2em] mb-6 uppercase shadow-xl">
          <BookOpen className="w-4 h-4" /> Giải Mã Tên Gọi
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-400 to-cyan-400 leading-[1.1] pb-4">
          Phổ Năng Lượng<br />Của Bạn
        </h1>
        {name && (
          <p className="text-gray-400 mt-6 text-2xl font-light italic">
            Dành cho: <span className="text-white font-black uppercase tracking-wider">{name}</span>
          </p>
        )}
      </m.div>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-6" />
            <p className="text-purple-300 font-black tracking-[0.3em] uppercase text-xs animate-pulse">ĐANG GIẢI MÃ NĂNG LƯỢNG...</p>
          </m.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <m.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-8 p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-bold">{error}</p>
          </m.div>
        )}
      </AnimatePresence>

      {/* Kết quả hiển thị (Result Display) */}
      <AnimatePresence mode="wait">
        {result && (
          <m.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full space-y-10 transform-gpu"
          >
            {/* Core Indicators Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {/* Soul Urge & Personality */}
              <div className="flex flex-col gap-6">
                <m.div variants={itemVariants} className="flex-1 bg-slate-900 border border-pink-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
                  <Heart className="absolute -right-6 -top-6 w-32 h-32 text-pink-500/5 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-pink-400 font-black uppercase text-[10px] tracking-widest mb-1.5">Chỉ số Linh Hồn</h3>
                        <p className="text-white font-black text-lg">{result.metrics?.soul?.title || "Khát khao tiềm ẩn"}</p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-300 text-3xl font-black">
                        {result.analysis.soulNumber}
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm font-medium leading-relaxed mb-6 prose prose-invert prose-pink max-w-none prose-p:leading-relaxed">
                      <ReactMarkdown>{result.metrics?.soul?.content || "Khát khao thầm kín, động lực sâu thẳm nhất và những gì thực sự khiến trái tim bạn hạnh phúc."}</ReactMarkdown>
                    </div>
                    {result.metrics?.soul?.advice && (
                      <div className="text-[11px] text-pink-300/80 bg-pink-500/5 p-4 rounded-2xl border border-pink-500/10 italic">
                        💡 {result.metrics.soul.advice}
                      </div>
                    )}
                  </div>
                </m.div>

                <m.div variants={itemVariants} className="flex-1 bg-slate-900 border border-cyan-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
                  <User className="absolute -right-6 -top-6 w-32 h-32 text-cyan-500/5 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-cyan-400 font-black uppercase text-[10px] tracking-widest mb-1.5">Chỉ số Nhân Cách</h3>
                        <p className="text-white font-black text-lg">{result.metrics?.personality?.title || "Vẻ ngoài xã hội"}</p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-300 text-3xl font-black">
                        {result.analysis.personalityNumber}
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm font-medium leading-relaxed mb-6 prose prose-invert prose-cyan max-w-none prose-p:leading-relaxed">
                      <ReactMarkdown>{result.metrics?.personality?.content || "Cách bạn cư xử với thế giới bên ngoài và ấn tượng đầu tiên bạn tạo ra với người khác."}</ReactMarkdown>
                    </div>
                    {result.metrics?.personality?.advice && (
                      <div className="text-[11px] text-cyan-300/80 bg-cyan-500/5 p-4 rounded-2xl border border-cyan-500/10 italic">
                        💡 {result.metrics.personality.advice}
                      </div>
                    )}
                  </div>
                </m.div>
              </div>

              {/* Master Destiny Box (Sứ Mệnh) */}
              <m.div variants={itemVariants} className="bg-slate-900 rounded-[3rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden text-center flex flex-col items-center justify-center group min-h-[500px]">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 to-indigo-600/5 opacity-50" />
                
                <p className="text-purple-400 font-black uppercase text-xs tracking-[0.4em] mb-10 relative z-10">CON SỐ SỨ MỆNH</p>
                <div className="relative mb-12">
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-1 shadow-2xl relative z-10">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                      <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-indigo-200">
                        {result.number}
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-[-20px] bg-[radial-gradient(circle_at_center,_rgba(147,51,234,0.15)_0%,_transparent_70%)] rounded-full" />
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 italic tracking-tight uppercase relative z-10 leading-tight">
                  {result.title}
                </h2>
                
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-8 relative z-10" />
                
                <p className="text-gray-400 text-sm leading-relaxed font-medium px-6 relative z-10 max-w-sm">
                  {result.traits}
                </p>
              </m.div>

              {/* Karmic & Balance */}
              <div className="flex flex-col gap-6">
                <m.div variants={itemVariants} className="flex-1 bg-slate-900 border border-amber-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
                  <Target className="absolute -right-6 -top-6 w-32 h-32 text-amber-500/5 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-amber-400 font-black uppercase text-[10px] tracking-widest mb-1.5">Chỉ số Cân Bằng</h3>
                        <p className="text-white font-black text-lg">{result.metrics?.balance?.title || "Vững vàng tâm trí"}</p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-300 text-3xl font-black">
                        {result.analysis.balanceNumber}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">
                      {result.metrics?.balance?.content || "Cách bạn phản ứng và lấy lại thăng bằng khi cuộc sống gặp khủng hoảng hoặc biến cố."}
                    </p>
                    {result.metrics?.balance?.advice && (
                      <div className="text-[11px] text-amber-300/80 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/10 italic">
                        💡 {result.metrics.balance.advice}
                      </div>
                    )}
                  </div>
                </m.div>

                <m.div variants={itemVariants} className="flex-1 bg-slate-900 border border-emerald-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group shadow-xl">
                  <AlertCircle className="absolute -right-6 -top-6 w-32 h-32 text-emerald-500/5 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-emerald-400 font-black uppercase text-[10px] tracking-widest">Bài học Nghiệp quả</h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5 mb-6">
                      {result.analysis.karmicLessons.length > 0 ? (
                        result.analysis.karmicLessons.map(num => (
                          <span key={num} className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center justify-center font-black text-lg shadow-inner">
                            {num}
                          </span>
                        ))
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/5 py-2 px-4 rounded-full border border-emerald-500/20">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase">Bạn đã tích lũy đủ bài học</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      {result.analysis.karmicLessons.map(num => {
                        const m = result.metrics?.karmic?.find(x => x.number === num);
                        if (!m) return null;
                        return (
                          <div key={num} className="border-l-2 border-emerald-500/20 pl-4 py-1">
                            <p className="text-emerald-300 text-[11px] font-black uppercase mb-1 tracking-wider">{m.title}</p>
                            <p className="text-gray-500 text-[10px] leading-relaxed line-clamp-2 font-medium">{m.content}</p>
                          </div>
                        );
                      })}
                      {result.analysis.karmicLessons.length === 0 && (
                        <p className="text-gray-400 text-sm font-medium leading-relaxed italic">
                          Mọi con số đều hiện diện, bạn đã sở hữu đủ các công cụ cần thiết cho kiếp sống hiện tại.
                        </p>
                      )}
                    </div>
                  </div>
                </m.div>
              </div>
            </div>

            {/* Quick Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
              {[
                { icon: Target, label: 'Thế Mạnh', color: 'text-emerald-400', border: 'hover:border-emerald-500/30', content: result.strengths },
                { icon: AlertCircle, label: 'Điểm Yếu', color: 'text-rose-400', border: 'hover:border-rose-500/30', content: result.weaknesses },
                { icon: Briefcase, label: 'Sự Nghiệp', color: 'text-cyan-400', border: 'hover:border-cyan-500/30', content: result.career_paths },
                { icon: Heart, label: 'Tình Yêu', color: 'text-pink-400', border: 'hover:border-pink-500/30', content: result.love_style }
              ].map((item, i) => (
                <m.div 
                  key={i} 
                  variants={itemVariants} 
                  className={`bg-slate-900/50 p-8 rounded-[2rem] border border-white/5 transition-all duration-300 ${item.border} group`}
                >
                  <div className={`flex items-center gap-3 ${item.color} mb-6`}>
                    <item.icon className="w-5 h-5" />
                    <h3 className="font-black text-xs uppercase tracking-widest">{item.label}</h3>
                  </div>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed line-clamp-6 group-hover:text-gray-300 transition-colors">
                    {item.content || "Dữ liệu phân tích đang được cập nhật..."}
                  </p>
                </m.div>
              ))}
            </div>

            <m.div variants={itemVariants} className="bg-slate-900 border border-amber-500/20 p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/5 rounded-full" />
              <div className="flex items-center gap-4 text-amber-400 mb-6">
                <Lightbulb className="w-8 h-8" />
                <h3 className="font-black text-xl uppercase tracking-[0.2em]">Lời Khuyên Khai Sáng</h3>
              </div>
              <p className="text-gray-300 text-lg font-light leading-relaxed italic border-l-4 border-amber-500/40 pl-8">
                {result.advice || "Tên của bạn mang năng lượng rất đặc biệt. Hãy tin vào trực giác và tự tin tỏa sáng trên hành trình của mình!"}
              </p>
            </m.div>
            
            {/* Detailed Topics Section */}
            {details.length > 0 && (
              <m.div variants={itemVariants} className="space-y-10 pt-16">
                <div className="flex items-center gap-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
                  <h3 className="text-3xl font-black text-white uppercase tracking-[0.3em] px-4">Giải Mã Chi Tiết</h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {details.map((detail, index) => (
                    <m.div 
                      key={detail.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-slate-900 border border-white/5 rounded-[2rem] p-10 hover:border-purple-500/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          <Info className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-purple-400/60 uppercase tracking-[0.2em]">{detail.topic}</span>
                      </div>
                      <h4 className="text-2xl font-black text-white mb-4 group-hover:text-purple-300 transition-colors">{detail.title}</h4>
                      <p className="text-gray-400 leading-relaxed font-medium text-sm">{detail.content}</p>
                    </m.div>
                  ))}
                </div>
              </m.div>
            )}
          </m.div>
        )}
      </AnimatePresence>

      {/* Decorative footer */}
      {result && (
        <div className="mt-20 flex flex-col items-center opacity-30">
          <div className="w-px h-20 bg-gradient-to-b from-purple-500 to-transparent mb-6" />
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">Tần Số Năng Lượng Đã Được Thiết Lập</p>
        </div>
      )}
    </div>
  );
}

export default function NameNumerologyResult() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
        <p className="text-purple-300 text-xs font-black tracking-widest uppercase animate-pulse">Đang kết nối vũ trụ...</p>
      </div>
    }>
      <NameNumerologyResultContent />
    </Suspense>
  );
}
