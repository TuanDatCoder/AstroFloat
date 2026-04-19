import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Lightbulb, Zap, Info, ChevronRight, Calculator } from 'lucide-react';
import { numerologyService } from '../../services/numerologyService';

const formatContent = (text) => {
  if (!text) return null;
  // Regex split to keep tags like [TOPIC]
  const parts = text.split(/(\[.*?\])/g);
  
  return parts.filter(p => p && p.trim() !== '').map((part, index) => {
    const match = part.match(/^\[(.*?)\]$/);
    if (match) {
      return (
        <div key={index} className="mt-10 mb-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <h4 className="text-indigo-300 font-black text-xs uppercase tracking-[0.25em] whitespace-nowrap">{match[1]}</h4>
          </div>
          <div className="h-px bg-gradient-to-r from-indigo-500/30 to-transparent flex-1" />
        </div>
      );
    }
    
    return (
      <p key={index} className="text-gray-400 text-sm font-light leading-relaxed mb-4 last:mb-0 border-l-2 border-white/5 pl-4 ml-1">
        {part.trim()}
      </p>
    );
  });
};

export default function PinnacleDetail() {
 const { number } = useParams();
 const [pinnacle, setPinnacle] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
 async function fetchPinnacle() {
 try {
 setLoading(true);
 const data = await numerologyService.getPinnacleByNumber(parseInt(number, 10));
 if (data) {
 setPinnacle(data);
 } else {
 setError("Hiện chưa có dữ liệu chi tiết cho đỉnh cao số " + number);
 }
 } catch (err) {
 console.error(err);
 setError("Đã có lỗi xảy ra khi tải dữ liệu.");
 } finally {
 setLoading(false);
 }
 }
 fetchPinnacle();
 }, [number]);

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
 <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
 <p className="text-indigo-300 font-medium tracking-widest animate-pulse">ĐANG TRUY XUẤT NĂNG LƯỢNG ĐỈNH CAO...</p>
 </div>
 );
 }

 return (
 <div className="flex flex-col items-center pt-24 pb-32 px-6 relative z-10 w-full max-w-5xl mx-auto min-h-screen">
 
 <Link to="/discover" className="self-start mb-12 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-bold uppercase tracking-widest group">
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> QUAY LẠI HỒ SƠ
 </Link>

 {error ? (
 <div className="text-center py-20 bg-slate-900/80 rounded-[3rem] border border-white/10 w-full">
 <Info className="w-12 h-12 text-rose-400 mx-auto mb-4" />
 <h2 className="text-2xl font-bold text-white mb-2 italic">Ooops!</h2>
 <p className="text-gray-400">{error}</p>
 </div>
 ) : (
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="w-full space-y-12"
 >
 {/* Header Card */}
 <div className="bg-slate-900/70 p-10 md:p-16 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden group">
 <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700" />
 
 <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
 <div className="relative">
 <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-1 shadow-[0_0_40px_rgba(99,102,241,0.3)]">
 <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
 <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 antialiased">
 {pinnacle.number}
 </span>
 </div>
 </div>
 </div>

 <div className="flex-1 text-center md:text-left">
 <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[10px] font-black tracking-[0.3em] mb-4 uppercase">
 Giai đoạn đỉnh cao
 </span>
 <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight italic">
 {pinnacle.title}
 </h1>
 </div>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {/* Main Meaning */}
 <div className="md:col-span-2 space-y-8">
 <div className="bg-slate-900/80 p-10 rounded-[3rem] border border-white/10 shadow-xl relative group h-full">
 <div className="flex items-center gap-3 text-indigo-400 mb-6">
 <Zap className="w-6 h-6" />
 <h3 className="font-black text-xs uppercase tracking-widest">Ý nghĩa & Sự kiện chính</h3>
 </div>
 <div className="text-gray-300 text-lg font-light leading-relaxed antialiased">
 {formatContent(pinnacle.content)}
 </div>
 </div>
 </div>

 {/* Advice Sidebar */}
 <div className="space-y-8 h-full">
 <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/60 p-10 rounded-[3rem] border border-indigo-500/20 shadow-xl h-full flex flex-col justify-center">
 <div className="flex items-center gap-3 text-indigo-300 mb-6">
 <Lightbulb className="w-6 h-6 text-amber-400" />
 <h3 className="font-black text-xs uppercase tracking-widest">Lời khuyên vũ trụ</h3>
 </div>
 <p className="text-indigo-100/80 font-medium italic leading-relaxed antialiased">
 "{pinnacle.advice}"
 </p>
 <div className="mt-10 pt-8 border-t border-indigo-500/10 text-indigo-500 font-bold text-[10px] uppercase tracking-widest">
 Khám phá năng lượng con số {pinnacle.number}
 </div>
 </div>
 </div>
 </div>

 {/* Intro Section */}
 <div className="bg-slate-950/40 p-10 rounded-[3rem] border border-white/5 text-center">
 <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-6 opacity-30" />
 <h4 className="text-indigo-200 font-bold uppercase tracking-widest mb-4">Mô hình kim tự tháp (Pinnacles)</h4>
 <p className="text-gray-500 text-sm font-light max-w-2xl mx-auto leading-relaxed italic">
 Trong Thần số học, mỗi con người sẽ trải qua 4 giai đoạn đỉnh cao của cuộc đời (Pinnacles). Mỗi giai đoạn kéo dài 9 năm, đánh dấu những bước ngoặt quan trọng và các bài học cần phải vượt qua để đạt được sứ mệnh của linh hồn.
 </p>
 </div>
 </motion.div>
 )}
 </div>
 );
}
