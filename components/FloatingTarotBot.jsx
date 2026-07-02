import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Heart, BookOpen, Star, HelpCircle, ChevronRight, MessageSquare, History, Newspaper } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants';
import TarotIcon from '@/components/TarotIcon';
import CosmicAIIcon from '@/components/CosmicAIIcon';

export default function FloatingTarotBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [expression, setExpression] = useState('idle');

  // Define suggestion rules based on pathname
  useEffect(() => {
    // 1. Enter thinking expression immediately on path transition
    setExpression('thinking');

    let activeSuggestion = {
      greeting: "Chào bạn! Mình là Trợ Lý Vũ Trụ 🌌",
      question: "Hôm nay bạn muốn khám phá điều gì về vận mệnh nè?",
      options: [
        { label: "Giải mã cung hoàng đạo", href: ROUTES.ZODIAC, icon: Compass, color: "text-cyan-400 bg-cyan-500/10" },
        { label: "Xem Thần số học ngày sinh", href: ROUTES.NUMEROLOGY, icon: Star, color: "text-purple-400 bg-purple-500/10" },
        { label: "Tra cứu Thần số học theo tên", href: ROUTES.NAME_NUMEROLOGY, icon: BookOpen, color: "text-fuchsia-400 bg-fuchsia-500/10" }
      ]
    };

    if (pathname === '/') {
      activeSuggestion = {
        greeting: "Chào mừng bạn đến với Góc Vũ Trụ! 🌌",
        question: "Bắt đầu hành trình giải mã bản thân ngay nhé:",
        options: [
          { label: "Xem thần số học ngày sinh", href: ROUTES.NUMEROLOGY, icon: Star, color: "text-amber-400 bg-amber-500/10" },
          { label: "Tra cứu thần số học theo tên", href: ROUTES.NAME_NUMEROLOGY, icon: BookOpen, color: "text-fuchsia-400 bg-fuchsia-500/10" },
          { label: "Giải mã cung hoàng đạo", href: ROUTES.ZODIAC, icon: Compass, color: "text-cyan-400 bg-cyan-500/10" }
        ]
      };
    } else if (pathname?.startsWith('/tin-tuc')) {
      activeSuggestion = {
        greeting: "Bạn đang đọc tin tức tử vi và tâm linh đúng không? 🗞️",
        question: "Khám phá thêm các góc thú vị khác của vũ trụ:",
        options: [
          { label: "Độ hợp nhau các cung hoàng đạo", href: ROUTES.ZODIAC_MATCH, icon: Heart, color: "text-rose-400 bg-rose-500/10" },
          { label: "Trải bài Tarot Tình Yêu", href: ROUTES.TAROT_SPREAD('tinh-yeu'), icon: TarotIcon, color: "text-purple-400 bg-purple-500/10" },
          { label: "Xem thần số học cá nhân", href: ROUTES.NUMEROLOGY, icon: Star, color: "text-amber-400 bg-amber-500/10" }
        ]
      };
    } else if (
      pathname?.startsWith('/do-hop-cung-hoang-dao') || 
      pathname?.startsWith('/cung-hoang-dao-tuong-hop-nhat') ||
      pathname?.startsWith('/tat-ca-cap-doi-cung-hoang-dao') ||
      pathname?.startsWith('/dem-ngay-yeu')
    ) {
      activeSuggestion = {
        greeting: "Tình duyên chòm sao luôn đầy bí ẩn kỳ diệu! 💖",
        question: "Tìm lời giải mã chi tiết hơn cho tình cảm của bạn:",
        options: [
          { label: "Trải bài Tarot Tình Yêu", href: ROUTES.TAROT_SPREAD('tinh-yeu'), icon: TarotIcon, color: "text-purple-400 bg-purple-500/10" },
          { label: "Cung hoàng đạo tương hợp nhất", href: ROUTES.ZODIAC_BEST_MATCHES, icon: Heart, color: "text-fuchsia-400 bg-fuchsia-500/10" },
          { label: "Đo độ hợp nhau 2 chòm sao", href: ROUTES.ZODIAC_MATCH, icon: Compass, color: "text-cyan-400 bg-cyan-500/10" }
        ]
      };
    } else if (pathname?.startsWith('/tarot')) {
      activeSuggestion = {
        greeting: "Hãy thả lỏng và đón nhận thông điệp Tarot... ✨",
        question: "Kết hợp thêm các phương pháp dự đoán khác nhé:",
        options: [
          { label: "Xem bói độ hợp nhau chòm sao", href: ROUTES.ZODIAC_MATCH, icon: Heart, color: "text-rose-400 bg-rose-500/10" },
          { label: "Khám phá Vòng Quay Tương Lai", href: ROUTES.PREDICTIONS, icon: Compass, color: "text-cyan-400 bg-cyan-500/10" },
          { label: "Xem lịch sử rút bài Tarot", href: ROUTES.TAROT_HISTORY, icon: History, color: "text-indigo-400 bg-indigo-500/10" }
        ]
      };
    }

    setSuggestion(activeSuggestion);

    // Auto-open suggestion box when path changes (except on first mount if dismissed)
    const isDismissed = sessionStorage.getItem('assistantDismissed');
    
    // Set 2 seconds of thinking/analyzing time for dramatic cute effect
    const timer = setTimeout(() => {
      if (!isDismissed || hasInteracted) {
        setIsOpen(true);
        setExpression('happy');
      } else {
        setExpression('idle');
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [pathname, hasInteracted]);

  // Sleepy idle check
  useEffect(() => {
    if (isOpen) {
      setExpression('happy');
      return;
    }

    setExpression('idle');

    // After 12 seconds of being closed and idle, the bot falls asleep
    const sleepyTimer = setTimeout(() => {
      setExpression('sleepy');
    }, 12000);

    return () => clearTimeout(sleepyTimer);
  }, [isOpen]);

  const handleToggle = () => {
    if (isOpen) {
      setIsOpen(false);
      setExpression('idle');
    } else {
      setIsOpen(true);
      setExpression('happy');
    }
    setHasInteracted(true);
  };

  const handleOptionClick = () => {
    setIsOpen(false);
    setExpression('idle');
    setHasInteracted(true);
  };

  const handleMouseEnter = () => {
    if (!isOpen) {
      setExpression('happy'); // Wakes up with a smile
    }
  };

  const handleMouseLeave = () => {
    if (!isOpen) {
      setExpression('idle'); // Back to normal
    }
  };

  if (!suggestion) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999] sm:bottom-8 sm:right-8 select-none">
      <div className="relative flex flex-col items-end">
        {/* Dialogue Bubble */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="absolute bottom-[115%] right-0 mb-4 w-[280px] sm:w-[320px] bg-slate-950/90 border border-purple-500/30 rounded-3xl p-5 shadow-[0_15px_50px_rgba(168,85,247,0.25)] backdrop-blur-xl pointer-events-auto"
            >
              {/* Mystical Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-cyan-500/5 rounded-3xl pointer-events-none" />

              {/* Speech bubble tail */}
              <div className="absolute -bottom-2 right-8 w-4 h-4 bg-slate-950/90 border-b border-r border-purple-500/30 transform rotate-45 pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-3">
                {/* Greeting & Header */}
                <div>
                  <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400 animate-spin-slow" />
                    Trợ lý ảo
                  </div>
                  <h4 className="text-white text-xs font-bold leading-relaxed">
                    {suggestion.greeting}
                  </h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                    {suggestion.question}
                  </p>
                </div>

                {/* Option Buttons */}
                <div className="flex flex-col gap-2 mt-1">
                  {suggestion.options.map((option, idx) => {
                    const IconComponent = option.icon;
                    return (
                      <Link 
                        key={idx} 
                        href={option.href}
                        onClick={handleOptionClick}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center border border-white/10 ${option.color} group-hover:scale-110 transition-transform`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="text-white text-xs font-semibold tracking-wide text-left">
                            {option.label}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    );
                  })}
                </div>

                {/* Toggle/Collapse Text Button */}
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-slate-500 hover:text-slate-300 text-[10px] uppercase tracking-widest font-bold mt-1 text-center w-full transition-colors"
                >
                  Thu gọn trợ lý ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Avatar Bot */}
          <button 
            onClick={handleToggle}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border-2 ${isOpen ? 'border-cyan-400/80 shadow-[0_0_25px_rgba(34,211,238,0.4)]' : 'border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]'} hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:border-purple-400 hover:scale-110 flex items-center justify-center cursor-pointer relative overflow-hidden group transition-all duration-300 z-50`}
          >
            {/* Inner Mystical Glow */}
            <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full group-hover:bg-purple-500/35 transition-colors" />

            {/* Glowing Ring */}
            <span className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping group-hover:animate-none opacity-50" />

            {/* Avatar Icon */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <CosmicAIIcon className="w-11 h-11 text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] group-hover:rotate-6 transition-transform" expression={expression} />
            </div>
          </button>
      </div>
    </div>
  );
}
