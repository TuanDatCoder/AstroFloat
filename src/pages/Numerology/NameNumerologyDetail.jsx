import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, Star, ChevronRight, Briefcase, Heart, Lightbulb, AlertCircle, Info, Target, Quote, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { nameNumerologyService } from '../../services/nameNumerologyService';
import { ROUTES } from '../../constants';

const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
 opacity: 1,
 transition: { staggerChildren: 0.1 }
 }
};

const itemVariants = {
 hidden: { opacity: 0, scale: 0.95 },
 visible: { 
 opacity: 1, 
 scale: 1,
 transition: { type: "spring", stiffness: 100 }
 }
};

export default function NameNumerologyDetail() {
 const [searchParams] = useSearchParams();
 const [name, setName] = useState(searchParams.get('name') || '');
 const [loading, setLoading] = useState(false);
 const [result, setResult] = useState(null);
 const [details, setDetails] = useState([]);
 const [error, setError] = useState(null);

 useEffect(() => {
 const nameParam = searchParams.get('name');
 if (nameParam) {
 autoCalculate(nameParam);
 }
 }, []);

 const autoCalculate = async (nameToCalc) => {
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
 const numerologyData = await nameNumerologyService.getNameNumerology(number);
 const numerologyDetails = await nameNumerologyService.getNameNumerologyDetails(number);
 
 const advancedMetrics = await nameNumerologyService.getAdvancedMetrics(
 analysis.soulNumber,
 analysis.personalityNumber,
 analysis.balanceNumber,
 analysis.karmicLessons
 );

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

 const handleCalculate = async () => {
 if (!name.trim()) return;
 setLoading(true);
 setResult(null);
 setDetails([]);
 setError(null);

 try {
 const analysis = await nameNumerologyService.calculateFullAnalysis(name);
 if (!analysis) {
 setError("Không tìm thấy giá trị số từ tên này. Vui lòng nhập tên khác.");
 setLoading(false);
 return;
 }

 const number = analysis.expressionNumber;
 const numerologyData = await nameNumerologyService.getNameNumerology(number);
 const numerologyDetails = await nameNumerologyService.getNameNumerologyDetails(number);
 
 const advancedMetrics = await nameNumerologyService.getAdvancedMetrics(
 analysis.soulNumber,
 analysis.personalityNumber,
 analysis.balanceNumber,
 analysis.karmicLessons
 );

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
 <div className="flex flex-col items-center pt-20 pb-24 px-6 relative z-10 w-full max-w-7xl mx-auto min-h-[80vh]">
 
 <Link to={ROUTES.NAME_NUMEROLOGY} className="self-start mb-8 flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-bold uppercase tracking-widest">
 <ArrowLeft className="w-4 h-4" /> TRỞ VỀ DANH SÁCH
 </Link>

 {/* Header Section */}
 <motion.div
 initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 className="text-center mb-16"
 >
 <span className="inline-block py-1.5 px-4 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-semibold tracking-widest mb-4 shadow-[0_0_20px_rgba(168,85,247,0.15)] uppercase">
 Thần Số Học Theo Tên
 </span>
 <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-400 to-cyan-400 pb-2">
 Giải Mã Sứ Mệnh Qua Tên Gọi
 </h1>
 <p className="text-gray-400 mt-4 max-w-xl mx-auto font-light leading-relaxed">
 Tên gọi không chỉ là định danh, nó mang tần số năng lượng riêng biệt ảnh hưởng đến vận mệnh và tính cách của bạn.
 </p>
 </motion.div>

 {/* Loading State */}
 <AnimatePresence>
 {loading && (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="flex flex-col items-center justify-center py-20"
 >
 <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
 <p className="text-purple-300 font-medium tracking-widest animate-pulse">ĐANG GIẢI MÃ NĂNG LƯỢNG...</p>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Error Message */}
 <AnimatePresence>
 {error && (
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0 }}
 className="mb-8 p-4 px-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-3"
 >
 <AlertCircle className="w-5 h-5" />
 <p className="font-medium">{error}</p>
 </motion.div>
 )}
 </AnimatePresence>

 {/* Kết quả hiển thị (Result Display) */}
 <AnimatePresence mode="wait">
 {result && (
 <motion.div
 variants={containerVariants}
 initial="hidden"
 animate="visible"
 className="w-full space-y-10"
 >
 {/* Core Indicators Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
 {/* Soul Urge & Personality */}
 <div className="flex flex-col gap-6">
 <motion.div variants={itemVariants} className="flex-1 bg-pink-500/5 p-8 rounded-[2.5rem] border border-pink-500/20 relative overflow-hidden group">
 <Heart className="absolute -right-4 -top-4 w-24 h-24 text-pink-500/5 group-hover:scale-110 transition-transform duration-500" />
 <div className="relative z-10">
 <div className="flex justify-between items-start mb-4">
 <div>
 <h3 className="text-pink-400 font-black uppercase text-[10px] tracking-widest mb-1">Chỉ số Linh Hồn</h3>
 <p className="text-white font-bold text-sm italic">{result.metrics?.soul?.title || "Khát khao tiềm ẩn"}</p>
 </div>
 <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-300 text-2xl font-black">
 {result.analysis.soulNumber}
 </div>
 </div>
 <p className="text-gray-300 text-sm font-light leading-relaxed mb-3">
 {result.metrics?.soul?.content || "Khát khao thầm kín, động lực sâu thẳm nhất và những gì thực sự khiến trái tim bạn hạnh phúc."}
 </p>
 {result.metrics?.soul?.advice && (
 <div className="text-[11px] text-pink-300/60 bg-pink-500/5 p-3 rounded-xl border border-pink-500/10 italic">
 💡 {result.metrics.soul.advice}
 </div>
 )}
 </div>
 </motion.div>

 <motion.div variants={itemVariants} className="flex-1 bg-cyan-500/5 p-8 rounded-[2.5rem] border border-cyan-500/20 relative overflow-hidden group">
 <User className="absolute -right-4 -top-4 w-24 h-24 text-cyan-500/5 group-hover:scale-110 transition-transform duration-500" />
 <div className="relative z-10">
 <div className="flex justify-between items-start mb-4">
 <div>
 <h3 className="text-cyan-400 font-black uppercase text-[10px] tracking-widest mb-1">Chỉ số Nhân Cách</h3>
 <p className="text-white font-bold text-sm italic">{result.metrics?.personality?.title || "Vẻ ngoài xã hội"}</p>
 </div>
 <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-300 text-2xl font-black">
 {result.analysis.personalityNumber}
 </div>
 </div>
 <p className="text-gray-300 text-sm font-light leading-relaxed mb-3">
 {result.metrics?.personality?.content || "Cách bạn cư xử với thế giới bên ngoài và ấn tượng đầu tiên bạn tạo ra với người khác."}
 </p>
 {result.metrics?.personality?.advice && (
 <div className="text-[11px] text-cyan-300/60 bg-cyan-500/5 p-3 rounded-xl border border-cyan-500/10 italic">
 💡 {result.metrics.personality.advice}
 </div>
 )}
 </div>
 </motion.div>
 </div>

 {/* Master Destiny Box (Sứ Mệnh) */}
 <motion.div variants={itemVariants} className="bg-slate-900/80 rounded-[3rem] border border-white/10 p-10 shadow-2xl relative overflow-hidden text-center flex flex-col items-center justify-center group min-h-[450px]">
 <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full" />
 <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full" />
 
 <p className="text-purple-400 font-black uppercase text-xs tracking-[0.3em] mb-6 relative z-10">CON SỐ SỨ MỆNH</p>
 <div className="relative mb-8">
 <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-1 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
 <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
 <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
 {result.number}
 </span>
 </div>
 </div>
 <motion.div 
 animate={{ rotate: 360 }}
 transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
 className="absolute inset-0 -m-3 opacity-20"
 >
 <Star className="w-full h-full text-indigo-400 stroke-[0.5]" />
 </motion.div>
 </div>

 <h2 className="text-3xl md:text-4xl font-black text-white mb-4 italic tracking-tight uppercase relative z-10">
 {result.title}
 </h2>
 
 <div className="w-16 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-6 relative z-10" />
 
 <p className="text-gray-400 text-sm leading-relaxed font-light px-4 relative z-10 max-w-sm">
 {result.traits}
 </p>
 </motion.div>

 {/* Karmic & Balance */}
 <div className="flex flex-col gap-6">
 <motion.div variants={itemVariants} className="flex-1 bg-amber-500/5 p-8 rounded-[2.5rem] border border-amber-500/20 relative overflow-hidden group">
 <Target className="absolute -right-4 -top-4 w-24 h-24 text-amber-500/5 group-hover:scale-110 transition-transform duration-500" />
 <div className="relative z-10">
 <div className="flex justify-between items-start mb-4">
 <div>
 <h3 className="text-amber-400 font-black uppercase text-[10px] tracking-widest mb-1">Chỉ số Cân Bằng</h3>
 <p className="text-white font-bold text-sm italic">{result.metrics?.balance?.title || "Vững vàng tâm trí"}</p>
 </div>
 <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-300 text-2xl font-black">
 {result.analysis.balanceNumber}
 </div>
 </div>
 <p className="text-gray-300 text-sm font-light leading-relaxed mb-3">
 {result.metrics?.balance?.content || "Cách bạn phản ứng và lấy lại thăng bằng khi cuộc sống gặp khủng hoảng hoặc biến cố."}
 </p>
 {result.metrics?.balance?.advice && (
 <div className="text-[11px] text-amber-300/60 bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 italic">
 💡 {result.metrics.balance.advice}
 </div>
 )}
 </div>
 </motion.div>

 <motion.div variants={itemVariants} className="flex-1 bg-emerald-500/5 p-8 rounded-[2.5rem] border border-emerald-500/20 relative overflow-hidden group">
 <AlertCircle className="absolute -right-4 -top-4 w-24 h-24 text-emerald-500/5 group-hover:scale-110 transition-transform duration-500" />
 <div className="relative z-10">
 <div className="flex justify-between items-start mb-4">
 <h3 className="text-emerald-400 font-black uppercase text-[10px] tracking-widest mt-2">Bài học Nghiệp quả</h3>
 </div>
 <div className="flex flex-wrap gap-2 mb-4">
 {result.analysis.karmicLessons.length > 0 ? (
 result.analysis.karmicLessons.map(num => (
 <span key={num} className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm">
 {num}
 </span>
 ))
 ) : (
 <span className="text-xs text-emerald-200/60 italic font-light">Tuyệt vời! Bạn không thiếu con số nào.</span>
 )}
 </div>
 <div className="space-y-3">
 {result.analysis.karmicLessons.map(num => {
 const m = result.metrics?.karmic?.find(x => x.number === num);
 if (!m) return null;
 return (
 <div key={num} className="border-l border-emerald-500/30 pl-3">
 <p className="text-emerald-200 text-[11px] font-bold uppercase">{m.title}</p>
 <p className="text-gray-400 text-[10px] leading-relaxed line-clamp-2">{m.content}</p>
 </div>
 );
 })}
 {result.analysis.karmicLessons.length === 0 && (
 <p className="text-gray-300 text-sm font-light leading-relaxed">
 Mọi con số đều hiện diện, bạn đã tích lũy đủ các công cụ cần thiết cho kiếp sống này.
 </p>
 )}
 </div>
 </div>
 </motion.div>
 </div>
 </div>

 {/* Quick Insights Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
 <motion.div variants={itemVariants} className="bg-slate-900/70 p-8 rounded-[2rem] border border-white/5 group hover:border-emerald-500/20 transition-colors">
 <div className="flex items-center gap-3 text-emerald-400 mb-4">
 <Target className="w-5 h-5" />
 <h3 className="font-black text-sm uppercase tracking-wide">Thế Mạnh</h3>
 </div>
 <p className="text-slate-400 text-sm font-light leading-relaxed">{result.strengths || "Đang cập nhật..."}</p>
 </motion.div>

 <motion.div variants={itemVariants} className="bg-slate-900/70 p-8 rounded-[2rem] border border-white/5 group hover:border-rose-500/20 transition-colors">
 <div className="flex items-center gap-3 text-rose-400 mb-4">
 <AlertCircle className="w-5 h-5" />
 <h3 className="font-black text-sm uppercase tracking-wide">Điểm Yếu</h3>
 </div>
 <p className="text-slate-400 text-sm font-light leading-relaxed">{result.weaknesses || "Đang cập nhật..."}</p>
 </motion.div>

 <motion.div variants={itemVariants} className="bg-slate-900/70 p-8 rounded-[2rem] border border-white/5 group hover:border-cyan-500/20 transition-colors">
 <div className="flex items-center gap-3 text-cyan-400 mb-4">
 <Briefcase className="w-5 h-5" />
 <h3 className="font-black text-sm uppercase tracking-wide">Sự Nghiệp</h3>
 </div>
 <p className="text-slate-400 text-sm font-light leading-relaxed">{result.career_paths || "Đang cập nhật..."}</p>
 </motion.div>

 <motion.div variants={itemVariants} className="bg-slate-900/70 p-8 rounded-[2rem] border border-white/5 group hover:border-pink-500/20 transition-colors">
 <div className="flex items-center gap-3 text-pink-400 mb-4">
 <Heart className="w-5 h-5" />
 <h3 className="font-black text-sm uppercase tracking-wide">Tình Yêu</h3>
 </div>
 <p className="text-slate-400 text-sm font-light leading-relaxed">{result.love_style || "Đang cập nhật..."}</p>
 </motion.div>
 </div>

 <motion.div variants={itemVariants} className="bg-amber-500/5 p-8 rounded-[2rem] border border-amber-500/20 lg:col-span-2">
 <div className="flex items-center gap-3 text-amber-400 mb-4">
 <Lightbulb className="w-6 h-6" />
 <h3 className="font-black text-lg uppercase tracking-wide">Lời Khuyên</h3>
 </div>
 <p className="text-slate-300 font-light leading-relaxed italic border-l-2 border-amber-500/30 pl-4">{result.advice || "Tên của bạn mang năng lượng rất đặc biệt. Hãy tự tin tỏa sáng!"}</p>
 </motion.div>
 
 {/* Detailed Topics Section */}
 {details.length > 0 && (
 <motion.div variants={itemVariants} className="space-y-6 pt-10">
 <div className="flex items-center gap-4 mb-8">
 <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
 <h3 className="text-2xl font-bold text-white uppercase tracking-widest px-4">Giải Mã Chi Tiết</h3>
 <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {details.map((detail, index) => (
 <motion.div 
 key={detail.id}
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true }}
 className="bg-slate-900/70 border border-white/5 rounded-3xl p-8 hover:bg-slate-900 transition-colors"
 >
 <div className="flex items-center gap-3 mb-4">
 <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
 <Info className="w-5 h-5" />
 </div>
 <span className="text-xs font-bold text-indigo-300/60 uppercase tracking-widest">{detail.topic}</span>
 </div>
 <h4 className="text-xl font-bold text-white mb-3">{detail.title}</h4>
 <p className="text-gray-400 leading-relaxed font-light">{detail.content}</p>
 </motion.div>
 ))}
 </div>
 </motion.div>
 )}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
