'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, LogIn, Crown, Gift, X, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants';
import { supabase } from '@/services/supabase';
import CosmicEnergyIcon from '@/components/CosmicEnergyIcon';
import LightningIcon from '@/components/LightningIcon';

export default function CosmicEnergyPopup({ isOpen, onClose, onClaimSuccess }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null); // null | 'success' | 'error'
  const [message, setMessage] = useState('');

  const handleClaimGift = async () => {
    setLoading(true);
    setClaimStatus(null);
    setMessage('');
    try {
      // Đọc token từ session để truyền Authorization header (nếu đã đăng nhập)
      const { data: { session } } = await supabase.auth.getSession();
      const headers = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/energy/claim-gift', {
        method: 'POST',
        headers
      });
      const data = await res.json();

      if (data.success) {
        setClaimStatus('success');
        setMessage('Cộng thành công +5 Năng Lượng Vũ Trụ!');
        if (onClaimSuccess) {
          onClaimSuccess(data.energy, data.max_energy);
        }
      } else {
        setClaimStatus('error');
        setMessage(data.message || 'Hôm nay bạn đã nhận quà rồi. Hãy quay lại vào ngày mai nhé!');
      }
    } catch (err) {
      console.error(err);
      setClaimStatus('error');
      setMessage('Có lỗi xảy ra khi kết nối vũ trụ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Dark Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-md bg-[#0B0F19]/90 border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden text-center"
          >
            {/* Glowing background radial */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(168,85,247,0.1)_0%,_transparent_60%)] pointer-events-none" />

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute right-6 top-6 w-8 h-8 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Sphere */}
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_35px_rgba(168,85,247,0.25)]">
              <CosmicEnergyIcon className="w-12 h-12" />
            </div>

            {/* Content */}
            <h3 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 mb-4 uppercase tracking-widest leading-snug">
              Dòng chảy năng lượng<br/>đang yếu dần...
            </h3>
            
            <p className="text-gray-400 font-light text-sm leading-relaxed mb-6 px-2">
              Các vì sao cần thêm thời gian để tái tạo nguồn năng lượng vũ trụ của bạn. 
            </p>

            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-black tracking-widest mb-8 font-sans">
              <LightningIcon className="w-3.5 h-3.5" />
              <span>NĂNG LƯỢNG YẾU</span>
            </div>

            {/* Feedback Message */}
            {claimStatus && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-2xl border text-sm font-medium ${
                  claimStatus === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}
              >
                {claimStatus === 'success' ? (
                  <div className="flex items-center gap-2 justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{message}</span>
                  </div>
                ) : (
                  <span>{message}</span>
                )}
              </motion.div>
            )}

            {/* Primary CTA – full energy page */}
            <Link
              href="/tarot/nap-nang-luong"
              onClick={onClose}
              className="block w-full text-center py-4 rounded-2xl font-sans font-black text-sm tracking-wide uppercase bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-lg shadow-purple-700/30 hover:scale-[1.02] active:scale-[0.98] transition-all mb-4"
            >
              ⚡ Nạp Năng Lượng Vũ Trụ
            </Link>

            {/* Options */}
            <div className="flex flex-col gap-3 text-left">
              {/* Option 1: Login */}
              <button 
                onClick={() => { onClose(); router.push(ROUTES.LOGIN); }}
                className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-purple-500/30 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
                    <LogIn className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-wider">Kết Nối Vũ Trụ</h4>
                    <p className="text-[10px] text-gray-500 font-light mt-0.5">Nhận thêm +20 Energy và lưu lịch sử</p>
                  </div>
                </div>
                <div className="text-[10px] font-black tracking-widest text-purple-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  ĐĂNG NHẬP
                </div>
              </button>

              {/* Option 2: Claim Daily Gift */}
              <button 
                onClick={handleClaimGift}
                disabled={loading || claimStatus === 'success'}
                className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-pink-500/30 rounded-2xl hover:bg-white/10 transition-all group disabled:opacity-50 disabled:pointer-events-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/20 flex items-center justify-center">
                    {loading ? (
                      <Loader2 className="w-5 h-5 text-pink-400 animate-spin" />
                    ) : (
                      <Gift className="w-5 h-5 text-pink-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-wider">Nhận Tinh Hoa Vũ Trụ</h4>
                    <p className="text-[10px] text-gray-500 font-light mt-0.5">Nhận quà hằng ngày +5 Energy</p>
                  </div>
                </div>
                <div className="text-[10px] font-black tracking-widest text-pink-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  NHẬN QUÀ
                </div>
              </button>

              {/* Option 3: Premium */}
              <button 
                onClick={() => alert('Tính năng gói Hội viên Premium đang được các vì sao phát triển, sẽ ra mắt sớm!')}
                className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-yellow-500/30 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-white tracking-wider">Năng Lượng Vô Tận</h4>
                    <p className="text-[10px] text-gray-500 font-light mt-0.5">Không bao giờ lo cạn kiệt linh lực</p>
                  </div>
                </div>
                <div className="text-[10px] font-black tracking-widest text-yellow-400 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  PREMIUM
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
