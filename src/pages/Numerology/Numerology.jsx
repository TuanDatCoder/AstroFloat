import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Database, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { numerologyService } from '../../services/numerologyService';
import { supabase } from '../../services/supabase';
import { authService } from '../../services/authService';

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

export default function Numerology() {
 const [data, setData] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [dob, setDob] = useState(() => localStorage.getItem('astrofloat_dob') || '');
 const [calcLoading, setCalcLoading] = useState(false);
 const navigate = useNavigate();

 const fetchData = async () => {
 setLoading(true);
 try {
 const numerologies = await numerologyService.getAllNumerologies();
 setData(numerologies || []);
 } catch (err) {
 console.error("Lỗi lấy dữ liệu:", err);
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetchData();
 supabase.auth.getSession().then(async ({ data }) => {
   if (data.session?.user) {
     try {
       const profile = await authService.getUserProfile(data.session.user.id);
       if (!localStorage.getItem('astrofloat_dob') && profile.birth_date) {
         setDob(profile.birth_date.substring(0, 10));
       }
     } catch(e) {}
   }
 });

 const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
   if (currentSession?.user) {
     try {
       const profile = await authService.getUserProfile(currentSession.user.id);
       if (!localStorage.getItem('astrofloat_dob') && profile.birth_date) {
         setDob(profile.birth_date.substring(0, 10));
       }
     } catch(e) {}
   }
 });

 return () => subscription.unsubscribe();
 }, []);

 const handleLookup = () => {
 if (!dob) return;
 setCalcLoading(true);
 setError(null);
 try {
 const number = numerologyService.calculateLifePathNumber(dob);
 if (number) {
 navigate(`/numerology/${number}`);
 } else {
 setError("Ngày sinh không hợp lệ.");
 }
 } catch (err) {
 setError("Đã xảy ra lỗi khi tính toán.");
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
 className="text-center mb-16"
 >
 <span className="inline-block py-1.5 px-4 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-semibold tracking-[0.25em] mb-4 shadow-[0_0_20px_rgba(168,85,247,0.15)] transform-gpu">
 PHÂN TÍCH TẦN SỐ RUNG ĐỘNG
 </span>
 <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-400 to-pink-400 drop-shadow-sm pb-2">
 Thần Số Học
 </h1>
 </motion.div>

 {/* Form tính toán */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.6, delay: 0.2 }}
 className="mb-12 w-full max-w-lg mx-auto bg-slate-900/80 p-6 md:p-8 rounded-[2rem] border border-purple-500/20 shadow-2xl flex flex-col sm:flex-row gap-4 items-center relative z-20"
 >
 <div className="flex-1 w-full relative">
 <label className="text-[10px] uppercase font-bold tracking-widest text-purple-400 mb-2 block px-2">Ngày sinh của bạn</label>
 <div className="flex gap-2 items-center w-full">
 <input 
 type="date" 
 value={dob}
 onChange={(e) => {
 setDob(e.target.value);
 localStorage.setItem('astrofloat_dob', e.target.value);
 }}
 className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
 />
 {dob && (
 <button
 onClick={() => {
 setDob('');
 localStorage.removeItem('astrofloat_dob');
 }}
 className="flex-shrink-0 p-3 rounded-xl bg-black/40 border border-white/10 text-purple-500/70 hover:text-purple-400 focus:outline-none transition-all flex items-center justify-center cursor-pointer hover:border-purple-500/50"
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
 className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 rounded-xl font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 h-[48px]"
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
 <div className="w-12 h-12 border-t-2 border-r-2 border-purple-400 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
 <p className="text-purple-200/60 font-light tracking-wide text-lg">Đang đọc thông điệp vũ trụ...</p>
 </motion.div>
 ) : data.length === 0 ? (
 <motion.div 
 key="empty"
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 transition={{ type: "spring", duration: 0.8 }}
 className="flex flex-col items-center p-12 bg-white/[0.03] rounded-3xl border border-white/10 shadow-2xl w-full max-w-xl"
 >
 <Database className="w-16 h-16 text-purple-400 mb-6 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]" />
 <h2 className="text-2xl font-bold mb-3 text-white">Bảng numerologies đang trống!</h2>
 <p className="text-gray-400 text-center leading-relaxed">Hệ thống chưa tìm thấy dữ liệu nào trong Database. Vui lòng thêm dữ liệu thực tế vào bảng <span className="text-purple-300 font-mono">numerologies</span> thông qua Supabase Dashboard để tiếp tục.</p>
 </motion.div>
 ) : (
 <motion.div 
 key="grid"
 variants={containerVariants}
 initial="hidden"
 animate="visible"
 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
 >
 {data.map((item, index) => (
 <Link to={`/numerology/${item.number}`} key={item.number || index} className="block">
 <motion.div
 variants={itemVariants}
 className="hover:-translate-y-2 hover:scale-[1.02] transform-gpu will-change-transform group p-[1px] rounded-[2rem] overflow-hidden bg-gradient-to-b from-white/10 to-transparent shadow-xl h-full transition-transform duration-300 ease-out"
 >
 <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out" />
 
 <div className="relative h-full px-8 py-10 bg-slate-900/90 md: rounded-[31px] flex flex-col justify-between border border-white/5 transition-colors duration-500 group-hover:bg-slate-900/70">
 <div className={`float-card-${index % 3}`}>
 <div className="flex justify-between items-start mb-6">
 <span className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-purple-400 opacity-90 tracking-tighter drop-shadow-lg">
 {item.number}
 </span>
 <div className="bg-purple-900/30 p-2.5 rounded-2xl border border-purple-500/20 rotate-3 group-hover:rotate-12 transition-transform duration-500">
 <Sparkles className="w-5 h-5 text-purple-400 drop-shadow-md" />
 </div>
 </div>
 
 <h3 className="text-2xl font-bold mb-3 text-white tracking-wide">
 {item.title}
 </h3>
 <p className="text-slate-300 text-sm leading-relaxed font-light mb-6 line-clamp-2">
 {item.traits}
 </p>
 
 {item.strengths && (
 <div className="mb-4 bg-purple-950/20 p-4 rounded-2xl border border-purple-500/10">
 <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest block mb-2 opacity-80">Điểm nổi bật</span>
 <p className="text-sm text-gray-300 font-medium leading-relaxed line-clamp-2">{item.strengths}</p>
 </div>
 )}
 </div>
 
 <div className="mt-6 pt-5 border-t border-white/5 flex justify-between items-center text-xs text-purple-400/60 font-semibold tracking-widest relative z-10 overflow-hidden">
 <span className="group-hover:text-purple-300 transition-colors duration-300">CHI TIẾT VẬN MỆNH</span>
 <motion.div
 initial={{ x: -10, opacity: 0 }}
 whileHover={{ x: 0, opacity: 1 }}
 className="group-hover:opacity-100 transition-opacity duration-300"
 >
 <ArrowRight className="w-4 h-4 text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transform -translate-x-2 group-hover:translate-x-0 transition-transform duration-300 ease-out" />
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
