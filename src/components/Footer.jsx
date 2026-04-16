import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, MapPin, ChevronRight, Globe, Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-20 w-full border-t border-white/5 bg-[#0B0F19]/80 backdrop-blur-xl pt-16 pb-10 px-6 lg:px-12 mt-20">
      {/* Subtle Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mb-12">

        {/* Column 1: Brand */}
        <div className="flex flex-col items-center md:items-start space-y-5">
          <div className="flex items-center gap-2.5 text-xl font-black">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300">
              AstroFloat
            </span>
          </div>
          <p className="text-gray-400 text-sm font-light leading-relaxed max-w-sm text-center md:text-left">
            Giải mã tần số rung động của linh hồn thông qua Thần Số Học và Chiêm Tinh Học. Đồng hành cùng bạn trên hành trình khám phá bản thân.
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-purple-400 transition-colors"><Globe className="w-5 h-5" /></a>
            <a href="#" className="hover:text-pink-400 transition-colors"><Mail className="w-5 h-5" /></a>
            <a href="#" className="hover:text-red-400 transition-colors"><Send className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-white font-bold text-xs tracking-widest uppercase mb-6 opacity-40">Khám Phá</h3>
          <ul className="grid grid-cols-2 gap-x-8 gap-y-3 w-full max-w-xs md:max-w-none">
            {[
              { to: '/discover', label: 'Giải Mã' },
              { to: '/zodiac', label: 'Chòm Sao' },
              { to: '/zodiac-match', label: 'Tương Hợp' },
              { to: '/numerology', label: 'Thần Số' },
              { to: '/name-numerology', label: 'Thần Số Tên' }
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-gray-400 hover:text-cyan-300 transition-colors text-sm font-medium flex items-center gap-1.5 group">
                  <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-cyan-400 transition-colors" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 text-sm text-gray-400">
          <h3 className="text-white font-bold text-xs tracking-widest uppercase mb-2 opacity-40">Kết Nối</h3>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-purple-400/60" />
            <span>contact@astrofloat.app</span>
          </div>
        </div>

      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 font-bold tracking-widest uppercase">
        <p>&copy; {new Date().getFullYear()} AstroFloat • Created by TuanDatCoder</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
          <a href="#" className="hover:text-white transition-colors">Điều khoản</a>
        </div>
      </div>
    </footer>
  );
}
