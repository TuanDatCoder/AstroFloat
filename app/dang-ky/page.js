'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, Calendar, Sparkles, UserCircle, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/services/authService';
import { ROUTES } from '@/constants';

// Helper to dispatch expression events to FloatingTarotBot
const dispatchRegisterEvent = (field, action) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('astro:register-field', { detail: { field, action } }));
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', nickname: '', phone: '', gender: 'Khác', birthName: '', birthDate: '',
  });

  // Debounce refs to avoid firing on every single keystroke
  const debounceRefs = useRef({});

  const dispatchDebounced = (field, action, delay = 300) => {
    if (debounceRefs.current[field]) clearTimeout(debounceRefs.current[field]);
    debounceRefs.current[field] = setTimeout(() => {
      dispatchRegisterEvent(field, action);
    }, delay);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (value.length === 0) return; // Don't trigger on empty

    if (name === 'email') {
      dispatchDebounced('email', 'typing');
    } else if (name === 'password') {
      dispatchDebounced('password', showPassword ? 'typing-show' : 'typing-hide');
    } else if (name === 'nickname') {
      dispatchDebounced('nickname', 'typing');
    } else if (name === 'birthDate') {
      dispatchDebounced('birthDate', 'typing', 100);
    } else if (name === 'birthName') {
      dispatchDebounced('birthName', 'typing');
    }
  };

  const handleTogglePassword = () => {
    const next = !showPassword;
    setShowPassword(next);
    if (formData.password.length > 0) {
      dispatchRegisterEvent('password', next ? 'show' : 'hide');
    }
  };

  const handleFocus = (field) => {
    if (field === 'email') dispatchRegisterEvent('email', 'typing');
    else if (field === 'password') dispatchRegisterEvent('password', showPassword ? 'typing-show' : 'typing-hide');
    else if (field === 'nickname') dispatchRegisterEvent('nickname', 'typing');
    else if (field === 'birthDate') dispatchRegisterEvent('birthDate', 'typing');
    else if (field === 'birthName') dispatchRegisterEvent('birthName', 'typing');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    dispatchRegisterEvent('submit', 'loading');
    try {
      await authService.register(formData);
      dispatchRegisterEvent('submit', 'success');
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Lỗi đăng ký.');
      dispatchRegisterEvent('submit', 'error');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-32 bg-[#020617] relative z-10 w-full overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="bg-slate-900/60 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] text-center max-w-lg shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.1)_0%,_transparent_60%)] pointer-events-none" />
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <Sparkles className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Đăng Ký Thành Công!</h2>
          <p className="text-gray-300 mb-6 font-light leading-relaxed">
            Hồ sơ năng lượng của bạn đã được khởi tạo thành công. 
            <span className="block mt-4 text-emerald-300 font-bold text-sm bg-emerald-500/10 border border-emerald-500/20 py-3 px-4 rounded-xl">
              Vui lòng kiểm tra email của bạn để xác nhận tài khoản trước khi đăng nhập!
            </span>
          </p>
          <Link 
            href={ROUTES.LOGIN}
            className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl hover:shadow-cyan-500/10 flex items-center justify-center gap-2 uppercase transition-all active:scale-95"
          >
            Đến trang đăng nhập
          </Link>
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
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500/60 transition-colors"
                  placeholder="Email"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password')}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-purple-500/60 transition-colors"
                  placeholder="Mật khẩu"
                />
                <button type="button" onClick={handleTogglePassword} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div>
                <input
                  type="text"
                  name="nickname"
                  required
                  value={formData.nickname}
                  onChange={handleChange}
                  onFocus={() => handleFocus('nickname')}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-cyan-500/60 transition-colors"
                  placeholder="Nickname (tên hiệu vũ trụ)"
                />
              </div>
            </div>
            <div className="space-y-5">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest border-b border-white/10 pb-2">2. Thông Tin Khai Sinh</h3>
              <div>
                <input
                  type="text"
                  name="birthName"
                  required
                  value={formData.birthName}
                  onChange={handleChange}
                  onFocus={() => handleFocus('birthName')}
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3.5 text-white outline-none focus:border-purple-500/70 transition-colors"
                  placeholder="Họ và Tên khai sinh"
                />
              </div>
              <div>
                <input
                  type="date"
                  name="birthDate"
                  required
                  value={formData.birthDate}
                  onChange={handleChange}
                  onFocus={() => handleFocus('birthDate')}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-pink-500/60 transition-colors"
                />
              </div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full font-black text-white tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-60">
            {loading ? 'Đang xử lý...' : 'GHI NHẬN HỒ SƠ'}
          </button>
          <p className="text-center text-gray-400 mt-4">Đã có hồ sơ? <Link href={ROUTES.LOGIN} className="text-cyan-400 font-bold">Hãy kết nối</Link></p>
        </form>
      </motion.div>
    </div>
  );
}
