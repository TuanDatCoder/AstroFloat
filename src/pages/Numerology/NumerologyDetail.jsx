import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Briefcase, AlertCircle, HelpCircle, Sparkles, LayoutGrid, Zap } from 'lucide-react';
import { ROUTES } from '../../constants';
import { numerologyService } from '../../services/numerologyService';
import { numerologyDetailService } from '../../services/numerologyDetailService';
import { supabase } from '../../services/supabase';
import AdBanner from '../../components/AdBanner';

// Helper component chuyển string icon_name thành icon thật
const DynamicIcon = ({ name, className }) => {
 switch(name) {
 case 'Heart': return <Heart className={className} />;
 case 'Briefcase': return <Briefcase className={className} />;
 case 'AlertCircle': return <AlertCircle className={className} />;
 default: return <Sparkles className={className} />;
 }
};

export default function NumerologyDetail() {
 const { number } = useParams();
 const [numerology, setNumerology] = useState(null);
 const [details, setDetails] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [pinnacles, setPinnacles] = useState(null);
 const [dob, setDob] = useState(() => localStorage.getItem('astrofloat_dob') || '');
 const navigate = useNavigate();

 useEffect(() => {
 const fetchDetailData = async () => {
 setLoading(true);
 try {
 // Lấy thông tin tổng quát
 const numData = await numerologyService.getNumerologyByNumber(number);
 setNumerology(numData);

 const detailsData = await numerologyDetailService.getDetailsByNumber(number);
 setDetails(detailsData || []);

 // Lấy 4 đỉnh cao nếu có DOB
 if (dob) {
 const { data: { session } } = await supabase.auth.getSession();
 const pData = await numerologyService.getPinnaclesForUser(session?.user?.id, dob);
 setPinnacles(pData);
 }

 } catch (err) {
 console.error("Lỗi lấy dữ liệu chi tiết:", err);
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

 fetchDetailData();
 }, [number]);

 if (loading) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh] z-10 relative">
 <div className="w-12 h-12 border-t-2 border-r-2 border-purple-400 rounded-full animate-spin mb-4" />
 <p className="text-purple-200/60 font-light tracking-wide text-lg">Đang đọc thông điệp vũ trụ số {number}...</p>
 </div>
 );
 }

 if (error || !numerology) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh] z-10 relative px-6">
 <p className="text-red-400 mb-8 bg-red-950/40 px-6 py-3 rounded-xl border border-red-500/20 ">
 {error ? `Lỗi: ${error}` : `Không tìm thấy tần số rung động cho số ${number}`}
 </p>
 <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors cursor-pointer">
 <ArrowLeft className="w-4 h-4" /> Trở về trang trước
 </button>
 </div>
 );
 }

 // Trình bày 4 đỉnh cao (Pinnacles)
 const renderPinnacles = (pinnacles) => {
 if (!pinnacles) return null;
 return (
 <div className="relative w-full max-w-[320px] aspect-[4/3] mx-auto mt-12 mb-8">
 {/* SVG lines connecting the peaks */}
 <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 150">
 <defs>
 <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
 <stop offset="0%" stopColor="rgba(168, 85, 247, 0.5)" />
 <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
 </linearGradient>
 </defs>
 <line x1="50" y1="120" x2="75" y2="80" stroke="url(#lineGrad)" strokeWidth="1" />
 <line x1="100" y1="120" x2="75" y2="80" stroke="url(#lineGrad)" strokeWidth="1" />
 <line x1="100" y1="120" x2="125" y2="80" stroke="url(#lineGrad)" strokeWidth="1" />
 <line x1="150" y1="120" x2="125" y2="80" stroke="url(#lineGrad)" strokeWidth="1" />
 <line x1="75" y1="80" x2="100" y2="30" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 2" />
 <line x1="125" y1="80" x2="100" y2="30" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="4 2" />
 </svg>

 {/* Level 3: Đỉnh 3 */}
 <Link to={ROUTES.PINNACLE_DETAIL(pinnacles[2].value)} className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer z-20">
 <div className="w-14 h-14 rounded-full bg-purple-500/20 border-2 border-purple-400 flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(168,85,247,0.5)] bg-slate-900 group-hover:scale-110 group-hover:bg-purple-500 transition-all">
 {pinnacles[2].value}
 </div>
 <span className="text-[10px] font-bold text-purple-300 mt-2 bg-slate-950/80 px-3 py-0.5 rounded-full border border-purple-500/20">Đỉnh 3: {pinnacles[2].age}t</span>
 </Link>

 {/* Level 2: Đỉnh 1 & 2 */}
 <Link to={ROUTES.PINNACLE_DETAIL(pinnacles[0].value)} className="absolute top-20 left-[10%] flex flex-col items-center group cursor-pointer z-20">
 <div className="w-12 h-12 rounded-full bg-slate-800 border border-purple-400/50 flex items-center justify-center text-purple-200 font-bold group-hover:bg-purple-500 transition-all">
 {pinnacles[0].value}
 </div>
 <span className="text-[9px] font-bold text-purple-400 mt-1">Đỉnh 1: {pinnacles[0].age}t</span>
 </Link>
 <Link to={ROUTES.PINNACLE_DETAIL(pinnacles[1].value)} className="absolute top-20 right-[10%] flex flex-col items-center group cursor-pointer z-20">
 <div className="w-12 h-12 rounded-full bg-slate-800 border border-purple-400/50 flex items-center justify-center text-purple-200 font-bold group-hover:bg-purple-500 transition-all">
 {pinnacles[1].value}
 </div>
 <span className="text-[9px] font-bold text-purple-400 mt-1">Đỉnh 2: {pinnacles[1].age}t</span>
 </Link>

 {/* Level 4: Đỉnh 4 */}
 <Link to={ROUTES.PINNACLE_DETAIL(pinnacles[3].value)} className="absolute top-[-20px] right-[-10px] flex flex-col items-center group cursor-pointer z-20">
 <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-200 font-bold bg-slate-900 group-hover:bg-amber-500 transition-all">
 {pinnacles[3].value}
 </div>
 <span className="text-[8px] font-bold text-amber-400 mt-1 uppercase tracking-tighter">Đỉnh 4 ({pinnacles[3].age}t+)</span>
 </Link>
 </div>
 );
 };

 return (
 <div className="flex flex-col items-center pt-8 pb-20 px-6 relative z-10 w-full max-w-5xl mx-auto">
 <div className="w-full mb-10 flex justify-start">
 <button onClick={() => navigate(-1)} className="cursor-pointer">
 <motion.div 
 whileHover={{ x: -5 }}
 className="flex items-center gap-2 text-gray-400 hover:text-purple-300 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 "
 >
 <ArrowLeft className="w-4 h-4" />
 <span className="text-sm font-medium">Trở về</span>
 </motion.div>
 </button>
 </div>

 {/* Hero Section */}
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.7, ease: "easeOut" }}
 className="w-full bg-gradient-to-b from-purple-900/40 to-slate-900/60 border border-purple-500/20 rounded-[3rem] p-10 md:p-16 mb-16 relative overflow-hidden shadow-2xl shadow-purple-900/20"
 >
 <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
 <span className="text-[200px] font-black leading-none">{numerology.number}</span>
 </div>
 
 <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
 <div className="w-32 h-32 md:w-40 md:w-40 shrink-0 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center border-4 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
 <span className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-purple-400 drop-shadow-md">
 {numerology.number}
 </span>
 </div>
 
 <div className="text-center md:text-left flex-1">
 <span className="inline-block py-1.5 px-4 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/30 text-fuchsia-300 text-xs font-semibold tracking-[0.25em] mb-4">
 THÔNG ĐIỆP CHÍNH
 </span>
 <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">
 {numerology.title}
 </h1>
 <p className="text-purple-100/80 text-lg leading-relaxed font-light mb-6">
 <strong className="text-purple-300 font-medium">Đặc điểm:</strong> {numerology.traits}
 </p>
 <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
 <p className="text-gray-300 font-light italic">
 Lời khuyên: "{numerology.advice}"
 </p>
 </div>
 </div>
 </div>
 </motion.div>

 {/* Details Sections */}
 <div className="w-full">
 <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
 <LayoutGrid className="w-6 h-6 text-fuchsia-400" />
 Giải mã chi tiết
 </h2>

 {details.length === 0 ? (
 <div className="text-center p-10 bg-white/5 rounded-2xl border border-white/10">
 <p className="text-gray-400">Chưa có bài phân tích chi tiết nào về số này trong hệ thống.</p>
 </div>
 ) : (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
 {details.map((detail, index) => (
 <motion.div
 key={detail.id || index}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5, delay: index * 0.15 }}
 className="bg-slate-900/80 border border-purple-500/10 rounded-3xl p-8 hover:bg-slate-900/80 transition-colors"
 >
 <div className="flex items-center gap-4 mb-6">
 <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
 <DynamicIcon name={detail.icon_name} className="w-6 h-6 text-fuchsia-400" />
 </div>
 <div>
 <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold block mb-1">
 {detail.topic}
 </span>
 <h3 className="text-xl font-bold text-white">{detail.title}</h3>
 </div>
 </div>
 
 <p className="text-slate-300 leading-relaxed font-light">
 {detail.content}
 </p>
 </motion.div>
 ))}
 </div>
 )}
 </div>

 {/* 4 Đỉnh Cao Section */}
 {pinnacles && (
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 whileInView={{ opacity: 1, scale: 1 }}
 viewport={{ once: true }}
 className="w-full mt-20 pt-16 border-t border-white/5"
 >
 <div className="flex flex-col items-center text-center mb-12">
 <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-4 border border-purple-500/30">
 <Zap className="w-6 h-6 text-purple-400" />
 </div>
 <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">4 Đỉnh Cao Cuộc Đời</h2>
 <p className="text-gray-500 text-sm max-w-lg">Khám phá chu kỳ thành công và các giai đoạn chuyển mình quan trọng dựa trên ngày sinh của bạn.</p>
 </div>

 <div className="bg-slate-900/70 border border-white/5 rounded-[3rem] p-10 md:p-16 flex flex-col items-center shadow-inner">
 {renderPinnacles(pinnacles)}
 
 <Link 
 to={`${ROUTES.PINNACLE_ANALYSIS}?dob=${dob}`} 
 className="mt-10 px-8 py-3 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 rounded-xl text-purple-300 font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2"
 >
 Phân tích chu kỳ chi tiết <Sparkles className="w-4 h-4" />
 </Link>
 </div>
 </motion.div>
 )}

 {/* Google Ads Placement */}
 <AdBanner slot="horizontal" className="w-full mt-16" />
 </div>
 );
}
