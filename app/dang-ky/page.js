'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, Calendar, Sparkles, UserCircle, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/authService';
import { ROUTES } from '@/src/constants';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', nickname: '', phone: '', gender: 'Khác', birthName: '', birthDate: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await authService.register(formData);
      setSuccess(true);
      setTimeout(() => router.push(ROUTES.LOGIN), 3000);
    } catch (err) { setError(err.message || 'Lỗi đăng ký.'); } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-32">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-emerald-950/40 border border-emerald-500/30 p-10 rounded-3xl text-center max-w-lg">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"><Sparkles className="w-10 h-10 text-emerald-400" /></div>
          <h2 className="text-3xl font-bold text-white mb-4 uppercase tracking-widest">Đăng Ký Thành Công!</h2>
          <p className="text-emerald-100/80 mb-6 font-light">Hồ sơ năng lượng của bạn đã được lưu trữ. Đang chuyển hướng...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4 relative z-10 w-full pt-32">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl bg-slate-900/80 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl">
        <div className="text-center mb-10">
          <span className="inline-block py-1 px-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold tracking-widest mb-4 uppercase">BƯỚC VÀO VŨ TRỤ</span>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">Thiết Lập Hồ Sơ Số Học</h1>
        </div>

        <form onSubmit={handleRegister}>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
              {error}
            </motion.div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest border-b border-white/10 pb-2">1. Tài Khoản</h3>
              <div><input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none" placeholder="Email" /></div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" required minLength={6} value={formData.password} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none" placeholder="Mật khẩu" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
              <div><input type="text" name="nickname" required value={formData.nickname} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none" placeholder="Nickname" /></div>
            </div>
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest border-b border-white/10 pb-2">2. Thông Tin Khai Sinh</h3>
              <div><input type="text" name="birthName" required value={formData.birthName} onChange={handleChange} className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3.5 text-white outline-none" placeholder="Họ và Tên khai sinh" /></div>
              <div><input type="date" name="birthDate" required value={formData.birthDate} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none" /></div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full font-black text-white tracking-widest uppercase">
            {loading ? 'Đang xử lý...' : 'GHI NHẬN HỒ SƠ'}
          </button>
          <p className="text-center text-gray-400 mt-4">Đã có hồ sơ? <Link href={ROUTES.LOGIN} className="text-cyan-400 font-bold">Hãy kết nối</Link></p>
        </form>
      </motion.div>
    </div>
  );
}
