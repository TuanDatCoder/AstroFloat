'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Sparkles, Star, Users, Rocket, ArrowLeft, Mail } from 'lucide-react';
import { ROUTES } from '@/constants';

export default function FamilyLoveStudioClient() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEmailClick = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  return (
    <div className="flex flex-col items-center pt-32 pb-20 px-6 relative z-10 w-full max-w-5xl mx-auto min-h-screen">
      <div className="w-full mb-10 flex justify-start">
        <Link href={ROUTES.HOME}>
          <div className="flex items-center gap-2 text-gray-400 hover:text-cyan-300 hover:-translate-x-1 transition-all duration-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-medium">Trở về Trang chủ</span>
          </div>
        </Link>
      </div>

      <div className="w-full bg-gradient-to-b from-purple-900/20 to-slate-900/60 border border-purple-500/20 rounded-[3rem] p-8 md:p-16 mb-16 relative overflow-hidden shadow-2xl text-center">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.15)_0%,_transparent_60%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <Heart className="w-12 h-12 text-pink-400 fill-pink-400/20" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 mb-6 tracking-tight">
            Family Love Studio
          </h1>
          
          <p className="text-lg md:text-xl text-purple-200/80 max-w-2xl font-light leading-relaxed mb-10">
            Chúng tôi là những người đam mê khám phá vũ trụ, chiêm tinh và sự kết nối giữa con người với các vì sao. Góc Vũ Trụ được tạo ra bằng tất cả tình yêu thương và khát khao mang lại giá trị tinh thần tích cực.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
            <div className="bg-white/5 border border-purple-500/10 rounded-3xl p-6 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
              <Sparkles className="w-8 h-8 text-cyan-400 mb-4" />
              <h3 className="text-white font-bold mb-2">Sáng Tạo</h3>
              <p className="text-sm text-gray-400">Thiết kế những trải nghiệm độc đáo, mượt mà và đậm chất vũ trụ.</p>
            </div>
            <div className="bg-white/5 border border-purple-500/10 rounded-3xl p-6 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
              <Users className="w-8 h-8 text-pink-400 mb-4" />
              <h3 className="text-white font-bold mb-2">Kết Nối</h3>
              <p className="text-sm text-gray-400">Tạo ra cộng đồng những người chung đam mê chiêm tinh học.</p>
            </div>
            <div className="bg-white/5 border border-purple-500/10 rounded-3xl p-6 flex flex-col items-center text-center hover:bg-white/10 transition-colors">
              <Star className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-white font-bold mb-2">Chữa Lành</h3>
              <p className="text-sm text-gray-400">Truyền tải những thông điệp vũ trụ mang năng lượng chữa lành.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center text-center max-w-2xl">
        <Rocket className="w-10 h-10 text-cyan-400 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-4">Tham gia hành trình cùng chúng tôi</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Mọi đóng góp, phản hồi hay lời nhắn gửi từ các bạn đều là nguồn động lực to lớn giúp Family Love Studio tiếp tục phát triển Góc Vũ Trụ ngày một hoàn thiện hơn.
        </p>
        <a 
          href="https://mail.google.com/mail/?view=cm&fs=1&to=devprojectlabvn@gmail.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          onClick={handleEmailClick}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold tracking-widest text-sm uppercase transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
        >
          Gửi email cho Studio
        </a>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0B0F19] border border-cyan-500/30 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_40px_rgba(34,211,238,0.15)] flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Mail className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Soạn Email mới?</h3>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              Bạn sẽ được chuyển hướng an toàn sang trang web Gmail để bắt đầu gửi thư cho Studio.
            </p>
            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 hover:text-white transition-colors font-semibold text-sm"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={() => {
                  setShowConfirm(false);
                  window.open('https://mail.google.com/mail/?view=cm&fs=1&to=devprojectlabvn@gmail.com', '_blank', 'noopener,noreferrer');
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] text-sm"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
