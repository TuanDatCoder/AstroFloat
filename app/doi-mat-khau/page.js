'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { ROUTES } from '@/constants';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Kiểm tra xem user đã có session chưa (Supabase tự động set session khi click reset link)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Nếu không có session, có thể link đã hết hạn hoặc không hợp lệ
        // setError("Liên kết khôi phục không hợp lệ hoặc đã hết hạn.");
      }
    };
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      // Chuyển hướng sau 3 giây
      setTimeout(() => router.push(ROUTES.LOGIN), 3000);
    } catch (err) {
      console.error(err);
      setError("Lỗi khi cập nhật mật khẩu: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4 relative z-10 w-full overflow-hidden pt-32">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-white/[0.03] backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-xl">
            <ShieldCheck className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-widest">Đổi Mật Khẩu</h1>
          <p className="text-gray-400 font-light text-sm">Thiết lập khoá bảo vệ mới cho hồ sơ của bạn</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-2xl text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
              <CheckCircle className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Thành công!</h2>
            <p className="text-gray-400 text-sm mb-6">Mật khẩu đã được cập nhật. Đang chuyển hướng về trang đăng nhập...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
            <div>
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 mb-3 block ml-4">Mật khẩu mới</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-purple-400 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-12 py-4 text-white focus:bg-white/[0.06] focus:border-purple-500/30 outline-none transition-all" 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 mb-3 block ml-4">Xác nhận mật khẩu</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-purple-400 transition-colors" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:bg-white/[0.06] focus:border-purple-500/30 outline-none transition-all" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl hover:shadow-purple-500/10 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "ĐANG CẬP NHẬT..." : "ĐẶT LẠI MẬT KHẨU"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
