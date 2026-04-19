import React from 'react';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Background glow - pointer-events-none để không chặn click */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content - không dùng absolute để tránh chặn click */}
      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-xl px-4">
        
        {/* 404 Text */}
        <div className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-indigo-400/60 via-indigo-600/20 to-transparent select-none">
          404
        </div>

        {/* Description */}
        <div className="-mt-8 space-y-3">
          <h2 className="text-2xl md:text-4xl font-black text-white">Lạc vào hư không?</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed italic">
            Trang bạn tìm kiếm không có trong hệ mặt trời của chúng tôi.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button 
            onClick={() => { window.location.href = '/'; }}
            className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-500/25 uppercase tracking-widest text-xs cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Về Trang Chủ
          </button>
          
          <button 
            onClick={() => { window.location.href = '/discover'; }}
            className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 active:scale-95 text-white rounded-2xl font-black border border-white/10 transition-all uppercase tracking-widest text-xs cursor-pointer"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            Khám phá thêm
          </button>
        </div>
      </div>

      {/* Footer watermark */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase font-black tracking-[0.5em] text-gray-800 select-none pointer-events-none">
        AstroFloat · Lost in Space
      </div>
    </div>
  );
}
