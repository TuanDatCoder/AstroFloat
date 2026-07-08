'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/services/supabase';
import { ROUTES } from '@/constants';
import Link from 'next/link';

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const handleVerification = async () => {
      try {
        // 1. Check for PKCE code in query params
        const code = searchParams.get('code');
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          setStatus('success');
          return;
        }

        // 2. Check if we already have a session (e.g. from implicit flow hash fragment handled by client SDK)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setStatus('success');
          return;
        }

        // 3. Listen to auth state change (some browsers take a split second to parse the hash)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            setStatus('success');
            subscription.unsubscribe();
          }
        });

        // Timeout if nothing happens in 4 seconds
        const timeout = setTimeout(() => {
          subscription.unsubscribe();
          setStatus('error');
          setErrorMessage('Không tìm thấy thông tin xác thực hoặc liên kết xác nhận đã hết hạn.');
        }, 4000);

        return () => clearTimeout(timeout);
      } catch (err) {
        console.error("Verification error:", err);
        setStatus('error');
        setErrorMessage(err.message || 'Xác nhận email thất bại.');
      }
    };

    handleVerification();
  }, [searchParams]);

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (status !== 'success') return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(ROUTES.ZODIAC); // Redirect to dashboard / welcome page
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, router]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-md bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(147,51,234,0.1)_0%,_transparent_60%)] pointer-events-none" />

      {status === 'verifying' && (
        <div className="py-10 flex flex-col items-center gap-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
            <Sparkles className="w-6 h-6 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">Đang Xác Thực</h1>
          <p className="text-gray-400 font-light text-sm px-4">
            Hệ thống đang kết nối với vũ trụ để kích hoạt hồ sơ năng lượng của bạn...
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="py-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle className="w-10 h-10 text-emerald-400 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
            Kích Hoạt Thành Công
          </h1>
          <p className="text-gray-300 mb-8 text-sm font-light leading-relaxed px-2">
            Tài khoản của bạn đã được kích hoạt thành công! Hãy sẵn sàng khám phá bản đồ sao và thần số học của chính mình.
          </p>
          <div className="text-[11px] text-gray-500 font-medium tracking-wider mb-6 uppercase">
            Tự động chuyển hướng sau <span className="font-bold text-cyan-400">{countdown}</span> giây...
          </div>
          <Link 
            href={ROUTES.ZODIAC}
            className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl hover:shadow-cyan-500/10 flex items-center justify-center gap-2 uppercase transition-all active:scale-95"
          >
            Bắt đầu khám phá <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="py-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.2)]">
            <XCircle className="w-10 h-10 text-rose-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-pink-400">
            Xác Thực Thất Bại
          </h1>
          <p className="text-gray-400 mb-8 text-sm font-light leading-relaxed px-2">
            {errorMessage || 'Liên kết xác nhận đã hết hạn, không hợp lệ hoặc đã được sử dụng.'}
          </p>
          <div className="flex flex-col w-full gap-4">
            <Link 
              href={ROUTES.LOGIN}
              className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 uppercase transition-all active:scale-95"
            >
              Đến trang đăng nhập
            </Link>
            <Link 
              href={ROUTES.REGISTER}
              className="text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest py-2"
            >
              Đăng ký tài khoản mới
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function ConfirmationPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4 relative z-10 w-full overflow-hidden pt-32 bg-[#020617]">
      {/* Decorative background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Suspense fallback={
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden text-center py-16 flex flex-col items-center gap-6">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin" />
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">Đang tải...</h1>
        </div>
      }>
        <ConfirmContent />
      </Suspense>
    </div>
  );
}
