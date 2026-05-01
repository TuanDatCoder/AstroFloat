import React from 'react';
import { ShieldOff, Home, LogIn } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#020617] flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rose-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-xl px-4">
        
        {/* Icon */}
        <div className="w-28 h-28 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shadow-2xl shadow-rose-500/10">
          <ShieldOff className="w-14 h-14 text-rose-400" />
        </div>

        {/* Error code */}
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-black tracking-[0.4em] text-rose-500">
            Error 403 · Unauthorized
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-white">Truy cập bị từ chối</h2>
          <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed pt-2 italic">
            Bạn không có quyền truy cập vào khu vực này. Chỉ quản trị viên mới được phép vào đây.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button 
            onClick={() => { window.location.href = '/'; }}
            className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 active:scale-95 text-white rounded-2xl font-black border border-white/10 transition-all uppercase tracking-widest text-xs cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Về Trang Chủ
          </button>

          <button 
            onClick={() => { window.location.href = '/login'; }}
            className="flex items-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white rounded-2xl font-black transition-all shadow-xl shadow-rose-500/20 uppercase tracking-widest text-xs cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            Đăng nhập lại
          </button>
        </div>
      </div>

      {/* Footer watermark */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase font-black tracking-[0.5em] text-gray-800 select-none pointer-events-none">
        Góc Vũ Trụ · Access Denied
      </div>
    </div>
  );
}
