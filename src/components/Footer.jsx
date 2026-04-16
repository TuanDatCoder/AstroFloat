import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative z-20 w-full border-t border-white/5 bg-slate-950/60 backdrop-blur-lg pt-12 pb-8 px-6 lg:px-12 mt-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* Brand Group */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xs">
          <div className="flex items-center gap-2 text-xl font-medium tracking-wide mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300 font-bold">
              AstroFloat
            </span>
          </div>
          <p className="text-gray-400 text-sm font-light leading-relaxed">
            Nền tảng giải mã tần số rung động của linh hồn thông qua Thần Số Học và Chiêm Tinh Học.
          </p>
        </div>
        
        {/* Links Group */}
        <div className="flex flex-col items-center md:items-end gap-4 text-sm tracking-widest text-gray-400">
          <div className="flex flex-wrap justify-center gap-6 mb-2">
            <Link to="/discover" className="hover:text-emerald-300 transition-colors">GIẢI MÃ</Link>
            <Link to="/zodiac" className="hover:text-cyan-300 transition-colors">CHÒM SAO</Link>
            <Link to="/numerology" className="hover:text-purple-300 transition-colors">THẦN SỐ</Link>
          </div>
          <p className="text-xs text-gray-600 font-sans tracking-wide">
            &copy; {new Date().getFullYear()} AstroFloat Universe by TuanDatCoder. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
