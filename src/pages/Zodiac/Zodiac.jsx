import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Sun, ArrowRight, Database, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { zodiacService } from '../../services/zodiacService';
import { supabase } from '../../services/supabase';
import { Lock } from 'lucide-react';

const containerVariants = {
 hidden: { opacity: 0 },
 visible: {
 opacity: 1,
 transition: {
 staggerChildren: 0.15,
 delayChildren: 0.2
 }
 }
};

const itemVariants = {
 hidden: { opacity: 0, y: 30 },
 visible: { 
 opacity: 1, 
 y: 0,
 transition: { type: "spring", stiffness: 80, damping: 20 }
 }
};

export default function Zodiac() {
 const [data, setData] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [dob, setDob] = useState(() => localStorage.getItem('astrofloat_dob') || '');
 const [calcLoading, setCalcLoading] = useState(false);
 const [session, setSession] = useState(null);
 const navigate = useNavigate();

 const fetchData = async () => {
 setLoading(true);
 try {
 const zodiacs = await zodiacService.getAllZodiacs();
 setData(zodiacs || []);
 } catch (err) {
 console.error("Lỗi lấy dữ liệu:", err);
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchData();
 supabase.auth.getSession().then(({ data }) => setSession(data.session));
 const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
 setSession(session);
 });
 return () => subscription.unsubscribe();
 }, []);

 const handleLookup = async () => {
 if (!dob) return;
 setCalcLoading(true);
 setError(null);
 try {
 const id = await zodiacService.getZodiacIdByDate(dob);
 if (id) {
 navigate(`/zodiac/${id}`);
 } else {
 setError("Hệ thống chưa có đủ phổ dữ liệu cho ngày sinh này.");
 }
 } catch (err) {
 setError(err.message);
 } finally {
 setCalcLoading(false);
 }
 };

 return (
 <div className="flex flex-col items-center pt-10 pb-20 px-6 relative z-10 w-full max-w-7xl mx-auto min-h-[80vh]">
 <motion.div
 initial={{ opacity: 0, y: -30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.8, ease: "easeOut" }}
 className="text-center mb-12"
 >
 <span className="inline-block py-1.5 px-4 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-[0.25em] mb-4 shadow-[0_0_20px_rgba(34,211,238,0.15)] transform-gpu">
 CHIÊM TINH HỌC
 </span>
 <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 drop-shadow-sm pb-2">
 Cung Hoàng Đạo
 </h1>
 <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 px-4">
 <Link to="/zodiac-match" className="w-full sm:w-auto">
 <motion.button 
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 className="w-full px-8 py-3 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-300 hover:text-white font-bold tracking-widest text-sm uppercase shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all flex items-center justify-center gap-2"
 >
 <Sparkles className="w-4 h-4" />
 Kiểm Tra Mức Độ Tương Hợp
 </motion.button>
 </Link>
 {session ? (
 <Link to="/zodiac-best-matches" className="w-full sm:w-auto">
 <motion.button 
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 className="w-full px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white font-bold tracking-widest text-sm uppercase shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all flex items-center justify-center gap-2"
 >
 <Database className="w-4 h-4" />
 Xem Matrix Tuyệt Đỉnh Hợp Nhau
 </motion.button>
 </Link>
 ) : (
 <Link to="/login" className="w-full sm:w-auto">
 <motion.button 
 whileHover={{ scale: 1.05 }}
 whileTap={{ scale: 0.95 }}
 className="w-full px-8 py-3 rounded-full bg-slate-800 border border-slate-700 text-gray-400 font-bold tracking-widest text-sm uppercase transition-all flex items-center justify-center gap-2 hover:bg-slate-700 hover:text-gray-300"
 >
 <Lock className="w-4 h-4" />
 Đăng nhập để xem Matrix Tương Hợp
 </motion.button>
 </Link>
 )}
 </div>
 </motion.div>

 {/* Form tính toán */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.6, delay: 0.2 }}
 className="mb-12 w-full max-w-lg mx-auto bg-slate-900/80 p-6 md:p-8 rounded-[2rem] border border-cyan-500/20 shadow-2xl flex flex-col sm:flex-row gap-4 items-center relative z-20"
 >
 <div className="flex-1 w-full relative">
 <label className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-2 block px-2">Ngày sinh của bạn</label>
 <div className="flex gap-2 items-center w-full">
 <input 
 type="date" 
 value={dob}
 onChange={(e) => {
 setDob(e.target.value);
 localStorage.setItem('astrofloat_dob', e.target.value);
 }}
 className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
 />
 {dob && (
 <button
 onClick={() => {
 setDob('');
 localStorage.removeItem('astrofloat_dob');
 }}
 className="flex-shrink-0 p-3 rounded-xl bg-black/40 border border-white/10 text-cyan-500/70 hover:text-cyan-400 focus:outline-none transition-all flex items-center justify-center cursor-pointer hover:border-cyan-500/50"
 >
 <X className="w-5 h-5" />
 </button>
 )}
 </div>
 </div>
 <div className="w-full sm:w-auto sm:self-end">
 <button 
 onClick={handleLookup}
 disabled={calcLoading || !dob}
 className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold text-white shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 h-[48px]"
 >
 {calcLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Giải Mã"}
 </button>
 </div>
 </motion.div>

 <AnimatePresence mode="wait">
 {error && (
 <motion.p 
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.9 }}
 className="text-red-400 mb-8 bg-red-950/40 px-6 py-3 rounded-xl border border-red-500/20 "
 >
 Lỗi: {error}
 </motion.p>
 )}

 {loading ? (
 <motion.div 
 key="loading"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="flex flex-col items-center py-20"
 >
 <div className="w-12 h-12 border-t-2 border-r-2 border-cyan-400 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
 <p className="text-cyan-200/60 font-light tracking-wide text-lg">Đang kết nối vũ trụ...</p>
 </motion.div>
 ) : data.length === 0 ? (
 <motion.div 
 key="empty"
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 transition={{ type: "spring", duration: 0.8 }}
 className="flex flex-col items-center p-12 bg-white/[0.03] rounded-3xl border border-white/10 shadow-2xl w-full max-w-xl"
 >
 <Database className="w-16 h-16 text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]" />
 <h2 className="text-2xl font-bold mb-3 text-white">Bảng zodiac_signs đang trống!</h2>
 <p className="text-gray-400 text-center leading-relaxed">Hệ thống chưa tìm thấy dữ liệu nào trong Database. Vui lòng thêm dữ liệu thực tế vào bảng <span className="text-cyan-300 font-mono">zodiac_signs</span> thông qua Supabase Dashboard để tiếp tục.</p>
 </motion.div>
 ) : (
 <motion.div 
 key="grid"
 variants={containerVariants}
 initial="hidden"
 animate="visible"
 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
 >
 {data.map((sign, index) => (
 <Link to={`/zodiac/${sign.id}`} key={sign.id || index} className="block">
 <motion.div
 variants={itemVariants}
 className="hover:-translate-y-2 hover:scale-[1.02] transform-gpu will-change-transform group p-[1px] rounded-[2rem] overflow-hidden bg-gradient-to-b from-white/10 to-transparent shadow-xl h-full transition-transform duration-300 ease-out"
 >
 <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
 
 <div className="relative h-full px-8 py-10 bg-slate-900/80 rounded-[31px] flex flex-col justify-between border border-white/5 transition-colors duration-500 group-hover:bg-slate-900/80">
 <div className={`float-card-${index % 3}`}>
 <div className="flex justify-between items-start mb-6">
 <h2 className="text-3xl font-bold text-white tracking-tight">{sign.name}</h2>
 {sign.english_name && (
 <span className="text-[10px] uppercase font-bold text-cyan-300 border border-cyan-400/20 px-3 py-1.5 rounded-full bg-cyan-950/40 shadow-inner">
 {sign.english_name}
 </span>
 )}
 </div>
 
 <div className="flex items-center gap-2 mb-6">
 <div className="p-2 rounded-full bg-cyan-900/30 border border-cyan-500/10">
 {String(sign.element).toLowerCase() === "nước" && <Moon className="w-4 h-4 text-blue-400 drop-shadow-md" />}
 {String(sign.element).toLowerCase() === "lửa" && <Sun className="w-4 h-4 text-orange-400 drop-shadow-md" />}
 {(String(sign.element).toLowerCase() === "khí" || String(sign.element).toLowerCase() === "đất") && <Sparkles className="w-4 h-4 text-emerald-400 drop-shadow-md" />}
 </div>
 <p className="text-cyan-200 text-sm font-semibold tracking-wide">{sign.element}</p>
 </div>
 
 <p className="text-slate-300 text-sm leading-relaxed font-light mt-2 line-clamp-3">
 {sign.description || "Chưa có mô tả cho cung này."}
 </p>
 </div>
 
 <div className="mt-8 pt-5 border-t border-white/5 flex justify-between items-center text-xs text-cyan-400/60 font-semibold tracking-widest relative z-10 overflow-hidden">
 <span className="group-hover:text-cyan-300 transition-colors duration-300">KHÁM PHÁ</span>
 <motion.div
 initial={{ x: -10, opacity: 0 }}
 whileHover={{ x: 0, opacity: 1 }}
 className="group-hover:opacity-100 transition-opacity duration-300"
 >
 <ArrowRight className="w-4 h-4 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-300 ease-out" />
 </motion.div>
 </div>
 </div>
 </motion.div>
 </Link>
 ))}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
