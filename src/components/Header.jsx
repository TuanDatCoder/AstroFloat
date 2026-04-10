import React from 'react';
import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="relative z-50 flex flex-col md:flex-row justify-between items-center p-6 lg:px-12 backdrop-blur-md border-b border-white/5 bg-black/20 gap-4 md:gap-0">
      <Link to="/" className="flex items-center gap-2 text-xl font-medium tracking-wide">
        <motion.div 
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
        >
          <Moon className="w-6 h-6 text-cyan-400" />
        </motion.div>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300 font-bold">
          AstroFloat
        </span>
      </Link>

      <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-xs sm:text-sm tracking-widest text-gray-300 font-medium">
        <Link 
          to="/discover" 
          className={`transition-colors ${path.startsWith('/discover') ? 'text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] font-bold' : 'hover:text-emerald-300 text-gray-400'}`}
        >
          GIẢI MÃ
        </Link>
        <Link 
          to="/zodiac" 
          className={`transition-colors ${path.startsWith('/zodiac') && !path.includes('match') ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] font-bold' : 'hover:text-cyan-300 text-gray-400'}`}
        >
          CHÒM SAO
        </Link>
        <Link 
          to="/zodiac-match" 
          className={`transition-colors ${path.startsWith('/zodiac-match') ? 'text-pink-300 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)] font-bold' : 'hover:text-pink-300 text-gray-400'}`}
        >
          TƯƠNG HỢP
        </Link>
        <Link 
          to="/numerology" 
          className={`transition-colors ${path.startsWith('/numerology') ? 'text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] font-bold' : 'hover:text-purple-300 text-gray-400'}`}
        >
          THẦN SỐ HỌC
        </Link>
        <Link 
          to="/name-numerology" 
          className={`transition-colors ${path.startsWith('/name-numerology') ? 'text-indigo-300 drop-shadow-[0_0_8px_rgba(129,140,248,0.8)] font-bold' : 'hover:text-indigo-300 text-gray-400'}`}
        >
          THẦN SỐ TÊN
        </Link>
      </div>
    </nav>
  );
}
