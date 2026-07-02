'use client';
import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight } from 'lucide-react';

export default function FloatingButton() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide on scroll down, show on scroll up. Only hide if scrolled past 100px.
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div 
      className={`fixed bottom-6 left-6 md:bottom-10 md:left-10 z-50 flex pointer-events-none transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <a 
        href="https://tinhyeu.gocvutru.com/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center gap-3 px-6 py-3.5 bg-[#0B0F19]/80 backdrop-blur-md border border-rose-500/50 rounded-full hover:bg-rose-500/20 transition-all duration-300 shadow-[0_0_30px_rgba(244,63,94,0.2)] hover:shadow-[0_0_40px_rgba(244,63,94,0.4)] hover:-translate-y-1"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 opacity-20 group-hover:opacity-30 transition-opacity" />
        <Heart className="w-4 h-4 text-rose-400 fill-rose-400/50 animate-pulse" />
        <span className="text-sm font-bold text-white tracking-widest uppercase relative z-10">
          Truy cập ForeverDays
        </span>
        <ArrowRight className="w-4 h-4 text-white relative z-10 group-hover:translate-x-1 transition-transform" />
      </a>
    </div>
  );
}
