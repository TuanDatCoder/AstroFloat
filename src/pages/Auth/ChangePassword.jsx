import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { ROUTES } from '../../constants';

export default function ChangePassword() {
 const navigate = useNavigate();
 const [newPassword, setNewPassword] = useState('');
 const [confirmPassword, setConfirmPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [success, setSuccess] = useState(false);

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError(null);

 if (newPassword.length < 6) {
 setError('Mật khẩu phải có ít nhất 6 ký tự.');
 return;
 }

 if (newPassword !== confirmPassword) {
 setError('Mật khẩu xác nhận không khớp.');
 return;
 }

 setLoading(true);
 try {
 const { error } = await supabase.auth.updateUser({
 password: newPassword
 });

 if (error) throw error;
 
 setSuccess(true);
 setTimeout(() => {
 navigate(ROUTES.PROFILE);
 }, 3000);
 } catch (err) {
 setError(err.message || 'Có lỗi xảy ra khi đổi mật khẩu.');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen py-20 px-4 relative z-10 flex items-center justify-center">
 {/* Background Orbs */}
 <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
 <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 className="w-full max-w-md bg-slate-900/80 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
 >
 {/* Glow Header */}
 <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

 <button 
 onClick={() => navigate(-1)}
 className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group cursor-pointer"
 >
 <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
 <span className="text-sm font-medium">Quay lại</span>
 </button>

 <div className="flex flex-col items-center text-center mb-10">
 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-6">
 <ShieldCheck className="w-8 h-8 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
 </div>
 <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Đổi Mật Khẩu</h1>
 <p className="text-gray-400 text-sm font-light leading-relaxed">
 Bảo mật tài khoản của bạn bằng cách cập nhật mật khẩu mới thường xuyên.
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
 <h3 className="text-lg font-bold text-emerald-300 mb-2">Thành công!</h3>
 <p className="text-emerald-200/60 text-sm">
 Mật khẩu của bạn đã được cập nhật thành công. Đang chuyển hướng về trang cá nhân...
 </p>
 </motion.div>
 ) : (
 <form onSubmit={handleSubmit} className="space-y-6">
 <div className="space-y-2">
 <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-4">
 Mật khẩu mới
 </label>
 <div className="relative group">
 <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
 <Lock className="w-4 h-4" />
 </div>
 <input
 type={showPassword ? "text" : "password"}
 value={newPassword}
 onChange={(e) => setNewPassword(e.target.value)}
 className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-gray-600 outline-none transition-all"
 placeholder="••••••••"
 required
 />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white transition-colors"
 >
 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
 </button>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] uppercase tracking-[0.2em] font-black text-white/40 ml-4">
 Xác nhận mật khẩu
 </label>
 <div className="relative group">
 <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-purple-400 transition-colors">
 <Lock className="w-4 h-4" />
 </div>
 <input
 type={showPassword ? "text" : "password"}
 value={confirmPassword}
 onChange={(e) => setConfirmPassword(e.target.value)}
 className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-gray-600 outline-none transition-all"
 placeholder="••••••••"
 required
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
 className="w-full relative group h-14 rounded-2xl overflow-hidden font-black text-white tracking-[0.2em] uppercase text-xs transition-all active:scale-95 disabled:opacity-50"
 >
 <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 group-hover:from-cyan-400 group-hover:to-purple-500 transition-all" />
 <span className="relative z-10 flex items-center justify-center gap-3">
 {loading ? (
 <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
 ) : (
 <>Cập Nhật Mật Khẩu</>
 )}
 </span>
 </button>
 </form>
 )}
 </AnimatePresence>

 <div className="mt-10 pt-8 border-t border-white/5 text-center">
 <p className="text-xs text-gray-500 font-medium">
 Mật khẩu nên chứa cả chữ, số và ký tự đặc biệt để đảm bảo an toàn tối đa.
 </p>
 </div>
 </motion.div>
 </div>
 );
}
