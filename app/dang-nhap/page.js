'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, UserCircle, LogIn, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/authService';
import { ROUTES } from '@/constants';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const data = await authService.login(formData.email, formData.password);
      if (data?.user) {
        const profile = await authService.getUserProfile(data.user.id);
        if (profile?.role === 'ADMIN') router.push('/admin');
        else router.push('/');
      }
    } catch (err) { setError("Email hoặc mật khẩu không chính xác."); } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4 relative z-10 w-full overflow-hidden pt-32">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-slate-900/80 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(147,51,234,0.12)_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(6,182,212,0.08)_0%,_transparent_60%)] pointer-events-none" />
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-xl"><UserCircle className="w-10 h-10 text-cyan-300" /></div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2 uppercase tracking-widest">Đăng Nhập</h1>
          <p className="text-gray-400 font-light text-sm">Kết nối với hồ sơ năng lượng vũ trụ</p>
        </div>

        {error && <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-200 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="relative z-10 flex flex-col gap-5">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-2 block ml-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-cyan-500 outline-none" placeholder="email@example.com" />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-purple-400 mb-2 block ml-2">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white focus:border-purple-500 outline-none" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl font-black text-white tracking-widest shadow-xl flex items-center justify-center gap-3 uppercase">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn className="w-5 h-5" /> Mở Khoá</>}
          </button>
          <p className="text-sm text-center text-gray-400 mt-2">Chưa có hồ sơ? <Link href={ROUTES.REGISTER} className="text-cyan-400 font-bold hover:underline">Đăng ký ngay</Link></p>
        </form>
      </motion.div>
    </div>
  );
}
