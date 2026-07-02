import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageCircleHeart } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/constants';
import TarotIcon from '@/components/TarotIcon';

export default function FloatingTarotBot() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check if the user has dismissed it in this session
    const isDismissed = sessionStorage.getItem('tarotBotDismissed');
    
    if (!isDismissed) {
      // Show the bot after a short delay so it feels organic
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
    sessionStorage.setItem('tarotBotDismissed', 'true');
  };

  const messages = [
    "Hôm nay bạn muốn trải bài ra sao?",
    "Tình duyên của bạn dạo này thế nào?",
    "Vũ trụ đang có thông điệp dành cho bạn đấy!"
  ];
  
  // Pick a random message for variety
  const [message] = useState(() => messages[Math.floor(Math.random() * messages.length)]);

  return (
    <AnimatePresence>
      {isVisible && (
        <m.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-6 left-6 z-[100] sm:bottom-8 sm:left-8"
        >
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* The Chat Bubble */}
            <m.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute bottom-[110%] left-0 mb-3 w-[240px] sm:w-[260px]"
            >
              <Link href={ROUTES.TAROT} className="block group">
                <div className="bg-slate-900 border border-fuchsia-500/30 rounded-2xl p-4 shadow-[0_10px_40px_rgba(217,70,239,0.2)] relative before:content-[''] before:absolute before:-bottom-2 before:left-8 before:w-4 before:h-4 before:bg-slate-900 before:border-b before:border-r before:border-fuchsia-500/30 before:transform before:rotate-45 group-hover:border-fuchsia-400/50 transition-colors duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-fuchsia-500/20 flex flex-shrink-0 items-center justify-center border border-fuchsia-500/30">
                      <Sparkles className="w-4 h-4 text-fuchsia-400 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-white text-xs sm:text-sm font-medium leading-relaxed">
                        {message}
                      </p>
                      <span className="text-[10px] font-black tracking-widest text-fuchsia-400 uppercase mt-2 block group-hover:text-fuchsia-300 transition-colors">
                        Rút bài ngay →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </m.div>

            {/* The Bot Avatar */}
            <Link href={ROUTES.TAROT}>
              <m.div
                animate={isHovered ? { y: -5 } : { y: [0, -8, 0] }}
                transition={isHovered ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-fuchsia-500/40 shadow-[0_0_20px_rgba(217,70,239,0.3)] flex items-center justify-center cursor-pointer relative overflow-hidden group hover:shadow-[0_0_30px_rgba(217,70,239,0.5)] hover:border-fuchsia-400 transition-all duration-300"
              >
                {/* Glow effect inside */}
                <div className="absolute inset-0 bg-fuchsia-500/20 blur-md rounded-full group-hover:bg-fuchsia-500/30 transition-colors" />
                <TarotIcon className="w-8 h-8 text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] relative z-10" />
              </m.div>
            </Link>

            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 border border-slate-600 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition-colors shadow-lg z-20"
              aria-label="Đóng gợi ý"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
