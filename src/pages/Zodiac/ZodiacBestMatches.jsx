import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, Link } from 'react-router-dom';
import { Heart, Briefcase, Users, Star, ArrowLeft, Zap, Sparkles } from 'lucide-react';
import { zodiacService } from '../../services/zodiacService';
import { zodiacMatchesService } from '../../services/zodiacMatchesService';
import { supabase } from '../../services/supabase';
import { ROUTES } from '../../constants';

const containerVariants = {
 hidden: { opacity: 0 },
 visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
 hidden: { opacity: 0, y: 20 },
 visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

// Map các nhóm từ UI map với các Category trong DB (Bảng zodiac_criteria)
const CATEGORY_MAP = [
 { id: 'love', name: 'Hợp Để Yêu', desc: 'Có sự đồng điệu về mặt tình cảm và cảm xúc', dbCats: ['Tình yêu'], icon: Heart, border: 'border-pink-500/30', bg: 'bg-pink-950/60', text: 'text-pink-400', gradient: 'from-pink-400 to-purple-400' },
 { id: 'friend', name: 'Hợp Làm Bạn', desc: 'Sở hữu chung năng lượng xã hội và giao tiếp', dbCats: ['Xã hội'], icon: Users, border: 'border-blue-500/30', bg: 'bg-blue-950/60', text: 'text-blue-400', gradient: 'from-blue-400 to-cyan-400' },
 { id: 'work', name: 'Hợp Trong Công Việc', desc: 'Gắn kết và thăng hoa trong sự nghiệp, tài chính', dbCats: ['Sự nghiệp', 'Tiền bạc', 'Sự nghiệp & Tiền bạc'], icon: Briefcase, border: 'border-emerald-500/30', bg: 'bg-emerald-950/60', text: 'text-emerald-400', gradient: 'from-emerald-400 to-teal-400' },
 { id: 'personality', name: 'Đồng Điệu Tính Cách', desc: 'Giống nhau ở phần góc khuất và cái tôi sâu thẳm', dbCats: ['Tính cách', 'Góc tối', 'Góc khuất'], icon: Zap, border: 'border-purple-500/30', bg: 'bg-purple-950/60', text: 'text-purple-400', gradient: 'from-purple-400 to-indigo-400' },
];

const CustomSelect = ({ value, onChange, options, placeholder }) => {
 const [isOpen, setIsOpen] = useState(false);
 const selectedOption = options.find(o => o.id.toString() === value.toString());

 return (
 <div className="relative inline-block w-full min-w-[300px] text-left">
 <div 
 onClick={() => setIsOpen(!isOpen)}
 className={`w-full bg-slate-900/70 border border-indigo-500/30 rounded-2xl px-6 py-4 cursor-pointer flex justify-between items-center transition-all ${isOpen ? 'shadow-[0_0_20px_rgba(99,102,241,0.3)] border-indigo-400' : 'hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]'}`}
 >
 <span className={selectedOption ? "text-white font-black text-lg tracking-wide w-full" : "text-gray-500 font-medium tracking-wide w-full"}>
 {selectedOption ? `${selectedOption.name} (${selectedOption.english_name})` : placeholder}
 </span>
 <Star className={`w-5 h-5 text-indigo-400 transition-transform ${isOpen ? 'rotate-180 text-indigo-300' : ''}`} />
 </div>
 
 <AnimatePresence>
 {isOpen && (
 <motion.div
 initial={{ opacity: 0, y: -10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 className={`absolute z-50 w-full mt-3 bg-slate-900/95 border border-indigo-500/30 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden max-h-64 overflow-y-auto`}
 style={{ scrollbarWidth: 'thin' }}
 >
 {options.map((opt) => {
 const isSelected = value.toString() === opt.id.toString();
 return (
 <div 
 key={opt.id}
 onClick={() => { onChange(opt.id.toString()); setIsOpen(false); }}
 className={`px-6 py-4 cursor-pointer transition-all flex items-center justify-between border-b border-white/5 last:border-b-0 ${isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
 >
 <span className="font-bold text-lg">
 {opt.name}
 </span>
 <span className="text-xs text-gray-400 uppercase tracking-widest">{opt.english_name}</span>
 </div>
 );
 })}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
};

export default function ZodiacBestMatches() {
 const [searchParams] = useSearchParams();
 const initSign = searchParams.get('sign') || '';
 
 const [selectedSignId, setSelectedSignId] = useState(initSign);
 const [allZodiacs, setAllZodiacs] = useState([]);
 const [attributesMatrix, setAttributesMatrix] = useState([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 async function loadData() {
 setLoading(true);
 try {
 const [zodiacs, matrix] = await Promise.all([
 zodiacService.getAllZodiacs(),
 zodiacMatchesService.getAllAttributesMatrix()
 ]);
 setAllZodiacs(zodiacs || []);
 setAttributesMatrix(matrix || []);
 if (!initSign && zodiacs?.length > 0) {
 const { data: { session } } = await supabase.auth.getSession();
 if (session) {
 const { data: profile } = await supabase.from('profiles').select('birth_date').eq('id', session.user.id).single();
 if (profile?.birth_date) {
 const zId = await zodiacService.getZodiacIdByDate(profile.birth_date);
 if (zId) {
 setSelectedSignId(zId.toString());
 return;
 }
 }
 }
 setSelectedSignId(zodiacs[0].id.toString());
 }
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 }
 loadData();
 }, [initSign]);

 // Tính toán Top Matches dựa theo DB
 const bestMatches = useMemo(() => {
 if (!selectedSignId || !allZodiacs.length || !attributesMatrix.length) return null;

 const targetId = parseInt(selectedSignId);
 const targetAttrs = attributesMatrix.filter(a => a.zodiac_id === targetId);
 
 if (!targetAttrs.length) return null; // Cung này chưa được nhập dữ liệu attributes

 const results = {};

 CATEGORY_MAP.forEach(cat => {
 // Lấy các criteria của Target Sign khớp với Category này
 const relevantTargetAttrs = targetAttrs.filter(a => cat.dbCats.some(dbCat => (a.criteria?.category || '') === dbCat));
 
 if (relevantTargetAttrs.length === 0) {
 results[cat.id] = [];
 return;
 }

 const matchScores = [];

 // So với 11 cung còn lại
 allZodiacs.forEach(otherSign => {
 if (otherSign.id === targetId) return;

 const otherAttrs = attributesMatrix.filter(a => a.zodiac_id === otherSign.id);
 if (!otherAttrs.length) return;

 let totalScore = 0;
 let count = 0;

 relevantTargetAttrs.forEach(tAttr => {
 const oAttr = otherAttrs.find(oa => oa.criteria_id === tAttr.criteria_id);
 if (oAttr) {
 // Tính độ tương hợp dựa trên mức chênh lệch Điểm (Score)
 if (tAttr.score && oAttr.score) {
 const diff = Math.abs(tAttr.score - oAttr.score); // 0-9 (scores 1-10)
 totalScore += Math.round((1 - diff / 9) * 100); // diff=0->100%, diff=9->0%
 count++;
 }
 }
 });

 if (count > 0) {
 matchScores.push({
 sign: otherSign,
 score: Math.round(totalScore / count)
 });
 }
 });

 // Sắp xếp giảm dần theo điểm và lấy Top 3
 results[cat.id] = matchScores.sort((a, b) => b.score - a.score).slice(0, 3);
 });

 return results;
 }, [selectedSignId, allZodiacs, attributesMatrix]);

 const selectedSignObj = allZodiacs.find(z => z.id.toString() === selectedSignId);

 return (
 <div className="flex flex-col items-center pt-20 md:pt-24 pb-20 px-4 md:px-6 relative z-10 w-full max-w-6xl mx-auto min-h-screen">
 
 {/* Navigation Top Bar */}
 <div className="w-full flex justify-between items-center mb-6 md:mb-10 gap-2">
 <Link 
 to={ROUTES.ZODIAC} 
 className="flex items-center gap-1.5 md:gap-2 text-cyan-400 hover:text-cyan-300 transition-all uppercase tracking-widest text-[9px] md:text-[10px] font-black bg-cyan-950/40 px-3 md:px-5 py-2.5 md:py-3 rounded-full border border-cyan-500/20 active:scale-95 shadow-lg shadow-cyan-900/10"
 >
 <ArrowLeft className="w-3.5 h-3.5" /> <span>Quay Lại</span>
 </Link>

 <Link 
 to={`${ROUTES.ZODIAC_ALL_MATCHES}?sign=${selectedSignId}`} 
 className="flex items-center gap-1.5 md:gap-2 text-amber-400 hover:text-amber-300 transition-all uppercase tracking-widest text-[9px] md:text-[10px] font-black bg-amber-950/50 px-3 md:px-5 py-2.5 md:py-3 rounded-full border border-amber-500/20 active:scale-95 shadow-lg shadow-amber-900/10 text-right"
 >
 <span>Toàn Bộ BXH</span> <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
 </Link>
 </div>

 <motion.div
 initial={{ opacity: 0, y: -20 }}
 animate={{ opacity: 1, y: 0 }}
 className="w-full text-center mb-16"
 >
 <span className="inline-block py-1.5 px-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold tracking-[0.2em] mb-4">
 CÁC MỐI QUAN HỆ TIỀM NĂNG
 </span>
 <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-400 to-purple-400 drop-shadow-sm pb-2 uppercase">
 Khám Phá Liên Kết
 </h1>
 <p className="text-gray-400 mt-2 max-w-2xl mx-auto font-light">
 Tìm ra những mảnh ghép phù hợp nhất giúp bạn thăng hoa trong Tình yêu, Sự nghiệp và Tình bạn.
 </p>

 {/* Dropdown để đổi Cung Tùy Ý */}
 {!loading && allZodiacs.length > 0 && (
 <div className="mt-8 relative inline-block">
 <CustomSelect 
 value={selectedSignId}
 onChange={setSelectedSignId}
 options={allZodiacs}
 placeholder="-- Chọn cung hiện tại --"
 />
 </div>
 )}
 </motion.div>

 {loading ? (
 <div className="flex flex-col items-center py-20">
 <div className="w-12 h-12 border-t-2 border-r-2 border-indigo-400 rounded-full animate-spin mb-4" />
 <p className="text-indigo-200/60">Đang phân tích dữ liệu đa chiểu...</p>
 </div>
 ) : !bestMatches ? (
 <div className="text-center bg-slate-900/70 p-8 rounded-[2rem] border border-white/5">
 <Zap className="w-12 h-12 text-gray-500 mx-auto mb-4" />
 <p className="text-gray-400">Cung {selectedSignObj?.name} hiện chưa có đủ Dữ liệu Tiêu Chí (Attributes) trong Database để tiến hành thuật toán So Khớp Nhóm.</p>
 </div>
 ) : (
 <motion.div 
 variants={containerVariants}
 initial="hidden"
 animate="visible"
 className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
 >
 {CATEGORY_MAP.map((cat) => {
 const matchesForCat = bestMatches[cat.id];
 const IconComp = cat.icon;

 return (
 <motion.div 
 key={cat.id}
 variants={itemVariants}
 className={`relative overflow-hidden p-8 rounded-[2.5rem] border ${cat.border} ${cat.bg} shadow-2xl flex flex-col`}
 >
 {/* Background Decor */}
 <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-10 blur-3xl ${cat.text}`} style={{ backgroundColor: 'currentColor' }} />
 
 <div className="relative z-10 mb-8">
 <div className="flex items-center gap-3 mb-2">
 <div className={`p-2 rounded-xl border ${cat.border} bg-black/20`}>
 <IconComp className={`w-5 h-5 ${cat.text}`} />
 </div>
 <h2 className={`text-2xl font-black ${cat.text} uppercase tracking-tighter`}>{cat.name}</h2>
 </div>
 <p className="text-gray-400 text-sm italic">{cat.desc}</p>
 </div>

 <div className="relative z-10 flex-1 flex flex-col gap-4">
 {matchesForCat && matchesForCat.length > 0 ? (
 matchesForCat.map((match, rank) => (
 <div key={rank} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:border-white/20 transition-all cursor-default">
 <div className="flex items-center gap-4">
 <div className={`w-12 h-12 rounded-full border ${cat.border} bg-white/5 flex items-center justify-center font-black ${cat.text} text-lg shadow-inner`}>
 #{rank + 1}
 </div>
 <div>
 <h3 className="text-white font-bold text-lg">{match.sign.name}</h3>
 <p className="text-[10px] text-gray-500 uppercase tracking-widest">{match.sign.english_name}</p>
 </div>
 </div>
 <div className="text-right">
 <p className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${cat.gradient}`}>
 {match.score}%
 </p>
 <p className="text-[9px] text-gray-400 uppercase tracking-wider">Độ Tương Thích</p>
 </div>
 </div>
 ))
 ) : (
 <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl bg-black/20">
 <p className="text-gray-500 text-sm">Chưa có dữ liệu thuộc nhóm Tiêu Chí {cat.name} để tính toán.</p>
 </div>
 )}
 </div>
 
 {/* Button So Sánh Chi Tiết */}
 <div className="relative z-10 mt-8 pt-5 border-t border-white/5 flex justify-center">
 <Link 
 to={ROUTES.ZODIAC_MATCH} 
 className={`flex items-center gap-2 ${cat.text} font-bold text-xs uppercase tracking-widest hover:text-white transition-colors`}
 >
 Mở tính năng So Khớp Trực Tiếp <ArrowLeft className="w-3 h-3 rotate-180" />
 </Link>
 </div>
 </motion.div>
 );
 })}
 </motion.div>
 )}
 </div>
 );
}
