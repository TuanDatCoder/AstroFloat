'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { authService } from '@/services/authService';
import { ROUTES } from '@/constants';

export default function ForgotPasswordPage() {
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
      setError("Không thể gửi email khôi phục. Vui lòng kiểm tra lại địa chỉ email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4 relative z-10 w-full overflow-hidden pt-32">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(147,51,234,0.1)_0%,_transparent_60%)] pointer-events-none" />
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-white/[0.03] backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-xl">
            <Sparkles className="w-10 h-10 text-cyan-300" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-widest">Quên Mật Khẩu</h1>
          <p className="text-gray-400 font-light text-sm px-4">Nhập email của bạn để nhận liên kết khôi phục quyền truy cập vũ trụ</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-2xl text-red-200 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6 relative z-10"
          >
            <div className="mb-6 p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-[2rem] text-cyan-100 text-sm leading-relaxed">
              <p className="font-bold text-lg mb-2 text-white">Email đã được gửi!</p>
              Hãy kiểm tra hộp thư đến của bạn (và cả thư rác) để tìm liên kết đặt lại mật khẩu.
            </div>
            <Link 
              href={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
            <div>
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 mb-3 block ml-4">
                Địa chỉ Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white focus:bg-white/[0.06] focus:border-cyan-500/30 outline-none transition-all placeholder:text-gray-700" 
                  placeholder="yourname@galaxy.com" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl hover:shadow-cyan-500/10 flex items-center justify-center gap-3 uppercase transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>Gửi yêu cầu <Send className="w-4 h-4" /></>
              )}
            </button>

            <Link 
              href={ROUTES.LOGIN}
              className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-[10px] font-black uppercase tracking-widest mt-4"
            >
              <ArrowLeft className="w-3 h-3" /> Quay lại đăng nhập
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
}
