import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Key, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

export default function ForgotPassword() {
 const navigate = useNavigate();
 const [email, setEmail] = useState('');
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [success, setSuccess] = useState(false);

 const handleSubmit = async (e) => {
 e.preventDefault();
 setLoading(true);
 setError(null);
 setSuccess(false);

 try {
 await authService.resetPassword(email);
 setSuccess(true);
 } catch (err) {
 console.error(err);
 setError(err.message || "Đã có lỗi xảy ra. Vui lòng kiểm tra lại email.");
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="flex flex-col items-center justify-center min-h-[90vh] py-20 px-4 relative z-10 w-full overflow-hidden">
 {/* Background Decor */}
 <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />
 <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 transition={{ duration: 0.6 }}
 className="w-full max-w-md bg-slate-900/80 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
 >
 {/* Glow Header */}
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

 <Link
 to="/login"
 className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
 >
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 <span className="text-sm font-medium">Quay lại đăng nhập</span>
 </Link>

 <div className="text-center mb-10 relative z-10">
 <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)] border border-white/5">
 <Key className="w-10 h-10 text-cyan-300 drop-shadow-md" />
 </div>
 <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
 Quên Mật Khẩu
 </h1>
 <p className="text-gray-400 font-light text-sm">
 Nhập email để nhận đường dẫn khôi phục tài khoản
 </p>
 </div>

 <AnimatePresence mode="wait">
 {success ? (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center"
 >
 <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
 <h3 className="text-lg font-bold text-emerald-300 mb-2">Đã gửi email!</h3>
 <p className="text-emerald-200/60 text-sm">
 Một liên kết khôi phục đã được gửi đến <strong className="text-emerald-300">{email}</strong>. Vui lòng kiểm tra hộp thư đến của bạn.
 </p>
 <button 
 onClick={() => setSuccess(false)}
 className="mt-6 text-xs text-gray-500 hover:text-white underline transition-colors"
 >
 Gửi lại yêu cầu?
 </button>
 </motion.div>
 ) : (
 <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
 <div>
 <label className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-2 block ml-2">Sơ đồ Email của bạn</label>
 <div className="relative group">
 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors pointer-events-none" />
 <input 
 type="email" 
 required 
 value={email} 
 onChange={(e) => setEmail(e.target.value)} 
 className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] pl-12 pr-4 py-4 text-white focus:outline-none focus:border-cyan-500/60 shadow-inner transition-all hover:bg-black/60 focus:bg-black/80" 
 placeholder="email@cuaban.com" 
 />
 </div>
 </div>

 {error && (
 <motion.div 
 initial={{ opacity: 0, x: -10 }}
 animate={{ opacity: 1, x: 0 }}
 className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs leading-relaxed"
 >
 <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
 <span>{error}</span>
 </motion.div>
 )}

 <button 
 type="submit" 
 disabled={loading}
 className="group relative w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-[1.5rem] font-black text-white tracking-[0.2em] uppercase text-xs shadow-[0_10px_30px_rgba(34,211,238,0.2)] disabled:opacity-50 transition-all flex items-center justify-center gap-3 border border-white/10 overflow-hidden"
 >
 <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
 {loading ? (
 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
 ) : (
 <>
 <Sparkles className="w-4 h-4 relative z-10" /> <span className="relative z-10">GỬI YÊU CẦU</span>
 </>
 )}
 </button>
 </form>
 )}
 </AnimatePresence>

 <div className="mt-10 pt-8 border-t border-white/5 text-center">
 <p className="text-xs text-gray-500 font-medium italic">
 AstroFloat bảo vệ quyền truy cập vào bản đồ tinh tú của bạn.
 </p>
 </div>
 </motion.div>
 </div>
 );
}
