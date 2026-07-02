import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Heart, BookOpen, Star, ChevronRight, History, ChevronUp, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants';
import TarotIcon from '@/components/TarotIcon';
import CosmicAIIcon from '@/components/CosmicAIIcon';
import { supabase } from '@/services/supabase';

export default function FloatingTarotBot() {
  const pathname = usePathname();
  const isOnLeft = false;
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [expression, setExpression] = useState('idle');
  const [isHovered, setIsHovered] = useState(false);

  // Proactive tooltips (Type 2) state
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipHref, setTooltipHref] = useState("");
  const [username, setUsername] = useState("");

  const [secondsClosed, setSecondsClosed] = useState(0);
  const [lastRouteTime, setLastRouteTime] = useState(0);

  const [wakeTimeout, setWakeTimeout] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);

  const [driftPosition, setDriftPosition] = useState({ x: 0, y: 0 });
  const [rapidClicks, setRapidClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const [newsInfo, setNewsInfo] = useState(null);

  // Scroll to Top Rocket states
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [hideAll, setHideAll] = useState(false);

  // Reset news info on route change
  useEffect(() => {
    setNewsInfo(null);
  }, [pathname]);

  // Listen for news details loaded from NewsDetailClient
  useEffect(() => {
    const handleNewsInfo = (e) => {
      if (e.detail) {
        setNewsInfo(e.detail);
      }
    };
    window.addEventListener('astro-bot-news-info', handleNewsInfo);
    return () => window.removeEventListener('astro-bot-news-info', handleNewsInfo);
  }, []);

  // Update tooltip text if newsInfo loads while on a news article page
  useEffect(() => {
    if (pathname?.startsWith('/tin-tuc/') && pathname !== '/tin-tuc' && newsInfo) {
      setTooltipText(`Đăng ngày ${newsInfo.publishedDate} với ${newsInfo.viewCount} lượt xem`);
      setTooltipHref(pathname);
    }
  }, [newsInfo, pathname]);

  // Effect to drift only during dynamic/action expressions, staying still at center by default (and during sleep)
  useEffect(() => {
    const dynamicMoods = ['dancing', 'guitar', 'coffee', 'driving', 'singing', 'reading_news', 'searching', 'phone', 'reading', 'basketball', 'soccer', 'rocket'];
    
    if (dynamicMoods.includes(expression) && !isLaunching && !isHovered && !isOpen) {
      // Subtle drift offset while active
      const rx = (Math.random() * 12) - 6;
      const ry = (Math.random() * 12) - 6;
      setDriftPosition({ x: rx, y: ry });
    } else {
      // Revert back to center immediately for static expressions (idle, sleepy, happy, shy, hurt, annoyed, etc.)
      setDriftPosition({ x: 0, y: 0 });
    }
  }, [expression, isLaunching, isHovered, isOpen]);

  // Get default expression depending on pathname
  const getPageExpression = () => {
    if (pathname?.startsWith('/tarot')) return 'tarot';
    if (
      pathname?.startsWith('/do-hop-cung-hoang-dao') || 
      pathname?.startsWith('/cung-hoang-dao-tuong-hop-nhat') ||
      pathname?.startsWith('/tat-ca-cap-doi-cung-hoang-dao') ||
      pathname?.startsWith('/dem-ngay-yeu')
    ) return 'love';
    return 'happy';
  };

  // Scroll listener to activate scroll to top arrow
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = docHeight - winHeight;

      // 1. Hide the entire bot at the absolute bottom (within 50px) to clear the footer
      if (scrollableHeight > 60 && scrollTop >= scrollableHeight - 50) {
        setHideAll(true);
      } else {
        setHideAll(false);
      }

      // 2. Show the rocket/scroll to top arrow if scrolled past 2/3 of scrollable height
      const twoThirdsHeight = scrollableHeight * (2 / 3);
      if (scrollableHeight > 100 && scrollTop > twoThirdsHeight) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger once initially
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. Fetch user session and details from Supabase to greet them
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase.from('profiles').select('nickname').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data?.nickname) {
              setUsername(data.nickname);
            } else if (session.user.email) {
              setUsername(session.user.email.split('@')[0]);
            }
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        supabase.from('profiles').select('nickname').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data?.nickname) {
              setUsername(data.nickname);
            } else if (session.user.email) {
              setUsername(session.user.email.split('@')[0]);
            }
          });
      } else {
        setUsername("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Welcome user tooltip once per session when their username loads
  useEffect(() => {
    if (username) {
      const hasWelcomed = sessionStorage.getItem('botWelcomedUser');
      if (!hasWelcomed) {
        sessionStorage.setItem('botWelcomedUser', 'true');
        
        const timer = setTimeout(() => {
          setTooltipText(`Chào mừng ${username} trở lại! Chúc bạn ngày mới ngập tràn cát tường!`);
          setTooltipHref(ROUTES.HOME);
          setIsTooltipOpen(true);
          setExpression('excited');
          
          setTimeout(() => {
            setIsTooltipOpen(false);
          }, 6000);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [username]);

  // 3. Listen for dynamic calculating/magic events from other pages (Tarot AI, etc.)
  useEffect(() => {
    const handleCustomExpression = (e) => {
      if (e.detail) {
        setExpression(e.detail);
      }
    };
    window.addEventListener('astro-bot-expression', handleCustomExpression);
    return () => window.removeEventListener('astro-bot-expression', handleCustomExpression);
  }, []);

  // 4. Update menu suggestions and trigger page entry welcome tooltip (Type 2)
  useEffect(() => {
    // Determine transition speed (if page transition is fast, trigger dizzy easter egg)
    const now = Date.now();
    const isFastTransition = lastRouteTime > 0 && now - lastRouteTime < 4500;
    setLastRouteTime(now);

    if (isFastTransition) {
      setExpression('dizzy');
    } else {
      setExpression('thinking');
    }

    setIsTooltipOpen(false);
    setSecondsClosed(0);

    let activeSuggestion = {
      greeting: "Chào bạn! Mình là Trợ Lý Vũ Trụ",
      question: "Hôm nay bạn muốn khám phá điều gì về vận mệnh nè?",
      options: [
        { label: "Giải mã cung hoàng đạo", href: ROUTES.ZODIAC, icon: Compass, color: "text-cyan-400 bg-cyan-500/10" },
        { label: "Xem Thần số học ngày sinh", href: ROUTES.NUMEROLOGY, icon: Star, color: "text-purple-400 bg-purple-500/10" },
        { label: "Tra cứu Thần số học theo tên", href: ROUTES.NAME_NUMEROLOGY, icon: BookOpen, color: "text-fuchsia-400 bg-fuchsia-500/10" }
      ]
    };

    if (pathname === '/') {
      activeSuggestion = {
        greeting: "Chào mừng bạn đến với Góc Vũ Trụ!",
        question: "Bắt đầu hành trình giải mã bản thân ngay nhé:",
        options: [
          { label: "Xem thần số học ngày sinh", href: ROUTES.NUMEROLOGY, icon: Star, color: "text-amber-400 bg-amber-500/10" },
          { label: "Tra cứu thần số học theo tên", href: ROUTES.NAME_NUMEROLOGY, icon: BookOpen, color: "text-fuchsia-400 bg-fuchsia-500/10" },
          { label: "Giải mã cung hoàng đạo", href: ROUTES.ZODIAC, icon: Compass, color: "text-cyan-400 bg-cyan-500/10" }
        ]
      };
    } else if (pathname?.startsWith('/tin-tuc')) {
      activeSuggestion = {
        greeting: "Bạn đang đọc tin tức tử vi và tâm linh đúng không?",
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
        greeting: "Tình duyên chòm sao luôn đầy bí ẩn kỳ diệu!",
        question: "Tìm lời giải mã chi tiết hơn cho tình cảm của bạn:",
        options: [
          { label: "Trải bài Tarot Tình Yêu", href: ROUTES.TAROT_SPREAD('tinh-yeu'), icon: TarotIcon, color: "text-purple-400 bg-purple-500/10" },
          { label: "Cung hoàng đạo tương hợp nhất", href: ROUTES.ZODIAC_BEST_MATCHES, icon: Heart, color: "text-fuchsia-400 bg-fuchsia-500/10" },
          { label: "Đo độ hợp nhau 2 chòm sao", href: ROUTES.ZODIAC_MATCH, icon: Compass, color: "text-cyan-400 bg-cyan-500/10" }
        ]
      };
    } else if (pathname?.startsWith('/tarot')) {
      activeSuggestion = {
        greeting: "Hãy thả lỏng và đón nhận thông điệp Tarot...",
        question: "Kết hợp thêm các phương pháp dự đoán khác nhé:",
        options: [
          { label: "Xem bói độ hợp nhau chòm sao", href: ROUTES.ZODIAC_MATCH, icon: Heart, color: "text-rose-400 bg-rose-500/10" },
          { label: "Khám phá Vòng Quay Tương Lai", href: ROUTES.PREDICTIONS, icon: Compass, color: "text-cyan-400 bg-cyan-500/10" },
          { label: "Xem lịch sử rút bài Tarot", href: ROUTES.TAROT_HISTORY, icon: History, color: "text-indigo-400 bg-indigo-500/10" }
        ]
      };
    }

    setSuggestion(activeSuggestion);

    // After 2 seconds of thinking/dizzy transition, display welcome cue
    const timer = setTimeout(() => {
      setExpression(getPageExpression());

      let pageName = "Góc Vũ Trụ";
      let welcomeHref = pathname || "/";

      if (pathname === '/') pageName = "Trang Chủ";
      else if (pathname?.startsWith('/tarot')) {
        pageName = "Tarot";
        welcomeHref = ROUTES.TAROT;
      }
      else if (pathname?.startsWith('/than-so-hoc')) {
        pageName = "Thần Số Học";
        welcomeHref = ROUTES.NUMEROLOGY;
      }
      else if (pathname?.startsWith('/cung-hoang-dao')) {
        pageName = "Cung Hoàng Đạo";
        welcomeHref = ROUTES.ZODIAC;
      }
      else if (pathname?.startsWith('/dem-ngay-yeu')) {
        pageName = "Đếm Ngày Yêu";
        welcomeHref = ROUTES.ZODIAC_MATCH;
      }
      else if (pathname?.startsWith('/do-hop-cung-hoang-dao')) {
        pageName = "Độ Hợp Cung Hoàng Đạo";
        welcomeHref = ROUTES.ZODIAC_MATCH;
      }
      else if (pathname?.startsWith('/tin-tuc')) pageName = "Tin Tức";
      else if (pathname?.startsWith('/kham-pha')) pageName = "Khám Phá";
      else if (pathname?.startsWith('/vong-quay-tuong-lai')) pageName = "Vòng Quay Tương Lai";
      else if (pathname?.startsWith('/family-love-studio')) pageName = "Family Love Studio";

      const hour = new Date().getHours();
      const day = new Date().getDay();
      const isWeekend = day === 0 || day === 6;

      let welcomeMsg = `Bạn đang ở trang ${pageName} đó!`;

      // Situation 1 & 4: Night/Weekend customized welcome cues
      if (hour >= 23 || hour < 4) {
        welcomeMsg = "Cú đêm ơi, muộn thế này sao chưa ngủ nhỉ?";
      } else if (isWeekend) {
        welcomeMsg = "Cuối tuần rồi! Thư giãn và xem Tarot thôi nào";
      }

      setTooltipText(welcomeMsg);
      setTooltipHref(welcomeHref);
      setIsTooltipOpen(true);
      setExpression('happy');

      // Auto close welcome tooltip after 6s
      setTimeout(() => {
        setIsTooltipOpen(false);
        setExpression(getPageExpression());
      }, 6000);

    }, 2000);
    
    return () => {
      clearTimeout(timer);
      if (wakeTimeout) clearTimeout(wakeTimeout);
      if (clickTimeout) clearTimeout(clickTimeout);
    };
  }, [pathname]);

  // 5. Sleepy idle check, periodic mood swings, and proactive Type 2 Tooltips (at 30s and 70s)
  useEffect(() => {
    if (isHovered) {
      setExpression('happy');
      setSecondsClosed(0);
      return;
    }

    if (isOpen) {
      setExpression(getPageExpression());
      setSecondsClosed(0);
      return;
    }

    setExpression('idle');

    const getRandomTip = () => {
      const loveTips = [
        { text: "Liệu hai bạn có phải cặp đôi tương hợp nhất?", href: ROUTES.ZODIAC_BEST_MATCHES },
        { text: "Bốc một lá bài Tarot xem tình duyên nhé?", href: ROUTES.TAROT_SPREAD('tinh-yeu') },
        { text: "Chòm sao của bạn hợp với cung nào nhất?", href: ROUTES.ZODIAC_MATCH },
        { text: "Đo độ hợp nhau giữa hai bạn nhé", href: ROUTES.ZODIAC_MATCH }
      ];
      const tarotTips = [
        { text: "Vũ trụ đang gửi thông điệp cho bạn qua các lá bài đấy", href: ROUTES.TAROT },
        { text: "Hôm nay bạn muốn bốc bài Tình Yêu hay Sự Nghiệp?", href: ROUTES.TAROT },
        { text: "Tập trung tinh thần và đón nhận thông điệp Tarot nhé", href: ROUTES.TAROT },
        { text: "Xem lịch sử rút bài Tarot của bạn nhé", href: ROUTES.TAROT_HISTORY }
      ];
      const generalTips = [
        { text: "Bạn có biết con số chủ đạo của mình chưa?", href: ROUTES.NUMEROLOGY },
        { text: "Cung hoàng đạo của bạn ẩn chứa bí mật gì?", href: ROUTES.ZODIAC },
        { text: "Tra cứu thần số học theo tên thử nhé?", href: ROUTES.NAME_NUMEROLOGY },
        { text: "Bạn muốn thử bốc một lá bài Tarot không?", href: ROUTES.TAROT }
      ];

      if (
        pathname?.startsWith('/do-hop-cung-hoang-dao') || 
        pathname?.startsWith('/cung-hoang-dao-tuong-hop-nhat') ||
        pathname?.startsWith('/tat-ca-cap-doi-cung-hoang-dao') ||
        pathname?.startsWith('/dem-ngay-yeu')
      ) {
        return loveTips[Math.floor(Math.random() * loveTips.length)];
      }
      if (pathname?.startsWith('/tarot')) {
        return tarotTips[Math.floor(Math.random() * tarotTips.length)];
      }
      return generalTips[Math.floor(Math.random() * generalTips.length)];
    };

    // Heartbeat clock counting every 1 second
    const interval = setInterval(() => {
      setSecondsClosed((prev) => {
        const nextSec = prev + 1;

        // Sleeps after 90 seconds (1.5 minutes)
        if (nextSec >= 90) {
          setExpression('sleepy');
          setIsTooltipOpen(false);
          clearInterval(interval);
          return 90;
        }

        // Mood shifts every 15 seconds (15s, 30s, 45s, etc.)
        if (nextSec % 15 === 0) {
          // Trigger proactive tooltip at 30 seconds
          if (nextSec === 30) {
            const tip = getRandomTip();
            setTooltipText(tip.text);
            setTooltipHref(tip.href);
            setIsTooltipOpen(true);

            setTimeout(() => {
              setIsTooltipOpen(false);
            }, 6000);
          }

          const moods = ['wink', 'excited', 'happy', 'shocked', 'driving', 'reading', 'dancing', 'coffee', 'shy', 'blushing', 'reading_news', 'searching', 'singing', 'phone', 'guitar', 'basketball', 'soccer'];
          const chosen = moods[Math.floor(Math.random() * moods.length)];
          setExpression(chosen);

          // Hold expression for 4 seconds then revert to idle
          setTimeout(() => {
            setExpression((curr) => curr === 'sleepy' ? 'sleepy' : 'idle');
          }, 4000);
        }

        // Situation 2: Coffee/Tea Break at 60s
        if (nextSec === 60) {
          setTooltipText("Làm ngụm trà sữa/cà phê cho tỉnh táo rồi khám phá tiếp nha!");
          setIsTooltipOpen(true);
          setExpression('coffee');

          setTimeout(() => {
            setIsTooltipOpen(false);
            setExpression((curr) => curr === 'sleepy' ? 'sleepy' : 'idle');
          }, 6000);
        }

        return nextSec;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, pathname, isHovered]);

  const handleToggle = () => {
    // If scrolled down and scroll-to-top option is ready, trigger rocket!
    if (showScrollTop) {
      setIsLaunching(true);
      setExpression('rocket');
      setIsTooltipOpen(false);
      setIsOpen(false);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      setTimeout(() => {
        setIsLaunching(false);
        setExpression(getPageExpression());
        setSecondsClosed(0);
      }, 1200); // Wait for scroll to finish
      return;
    }

    // Clear any active click or wake timeouts when manually toggling
    if (clickTimeout) clearTimeout(clickTimeout);
    if (wakeTimeout) clearTimeout(wakeTimeout);

    // Situation 3: Rapid multi-clicks check (Dizzy state)
    const now = Date.now();
    const diff = now - lastClickTime;
    setLastClickTime(now);

    let currentClicks = rapidClicks;
    if (diff < 2000) {
      currentClicks += 1;
    } else {
      currentClicks = 1;
    }
    setRapidClicks(currentClicks);

    if (currentClicks >= 3) {
      setExpression('dizzy');
      setTooltipText("Úi da! Bạn click nhiều quá làm mình chóng mặt ghê!");
      setIsTooltipOpen(true);
      setRapidClicks(0);

      const t = setTimeout(() => {
        setExpression(isOpen ? 'idle' : getPageExpression());
        setIsTooltipOpen(false);
        setSecondsClosed(0);
      }, 2500);
      setClickTimeout(t);
      return;
    }

    // If sleeping or groggy, get annoyed (bực mình)
    if (expression === 'sleepy' || expression === 'groggy') {
      setExpression('annoyed');
      setTooltipText("Bực mình ghê ta... Đang ngủ ngon lành mà!");
      setIsTooltipOpen(true);
      
      const t = setTimeout(() => {
        setExpression(isOpen ? 'idle' : getPageExpression());
        setIsTooltipOpen(false);
        setSecondsClosed(0);
      }, 2000);
      setClickTimeout(t);
      return;
    }

    // Normal click: Random between 'shy' (ngại ngái) or 'hurt' (u đầu)
    const randomClickMood = Math.random() > 0.5 ? 'shy' : 'hurt';
    setExpression(randomClickMood);

    // Check special pages (Home or Tarot) for specific text bubbles
    if (pathname === '/') {
      setTooltipText("Xin chào! Chào mừng bạn ghé thăm Trang Chủ Góc Vũ Trụ!");
      setIsTooltipOpen(true);
    } else if (pathname?.startsWith('/tarot')) {
      setTooltipText("Chào mừng bạn đến với Tarot Góc Vũ Trụ!");
      setIsTooltipOpen(true);
    }

    const t = setTimeout(() => {
      if (isOpen) {
        setIsOpen(false);
        setExpression('idle');
        setSecondsClosed(0);
      } else {
        setIsOpen(true);
        setExpression(getPageExpression());
      }
      setIsTooltipOpen(false);
    }, 1500);
    setClickTimeout(t);
    setHasInteracted(true);
  };

  const handleOptionClick = () => {
    setIsOpen(false);
    setExpression('idle');
    setHasInteracted(true);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (expression === 'sleepy') {
      setExpression('groggy');
      const t = setTimeout(() => {
        setExpression('happy');
      }, 1500);
      setWakeTimeout(t);
    } else if (expression !== 'annoyed' && expression !== 'hurt' && expression !== 'shy') {
      setExpression('blushing');
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (wakeTimeout) {
      clearTimeout(wakeTimeout);
      setWakeTimeout(null);
    }
    if (expression !== 'annoyed' && expression !== 'hurt' && expression !== 'shy') {
      setExpression(isOpen ? getPageExpression() : 'idle');
    }
  };

  const getTopicIcon = () => {
    const text = tooltipText?.toLowerCase() || "";
    const path = pathname?.toLowerCase() || "";
    
    if (text.includes("yêu") || text.includes("tình") || text.includes("cặp đôi") || path.includes("yeu") || path.includes("studio")) {
      return <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20 shrink-0" />;
    }
    if (text.includes("sự nghiệp") || text.includes("công việc") || text.includes("tài chính") || text.includes("học tập") || text.includes("bài viết") || text.includes("đăng ngày") || path.includes("tin-tuc")) {
      return <Briefcase className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0" />;
    }
    if (text.includes("thần số") || text.includes("số") || path.includes("than-so-hoc") || path.includes("numerology")) {
      return <Sparkles className="w-4 h-4 text-fuchsia-400 shrink-0" />;
    }
    if (text.includes("cung") || text.includes("chòm sao") || text.includes("hoàng đạo") || path.includes("cung-hoang-dao") || path.includes("zodiac")) {
      return <Compass className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
    return null;
  };

  if (!suggestion) return null;

  return (
    <div className={`fixed bottom-6 ${isOnLeft ? 'left-6 sm:left-8' : 'right-6 sm:right-8'} z-[999] select-none transition-all duration-300 ${hideAll ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}`}>
      <div className={`relative flex flex-col ${isOnLeft ? 'items-start' : 'items-end'}`}>
        
        {/* Type 1: Dialogue Bubble Menu (Opens manually on click) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className={`absolute bottom-[115%] ${isOnLeft ? 'left-0' : 'right-0'} mb-4 w-[280px] sm:w-[320px] bg-slate-950/90 border border-purple-500/30 rounded-3xl p-5 shadow-[0_15px_50px_rgba(168,85,247,0.25)] backdrop-blur-xl pointer-events-auto`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-cyan-500/5 rounded-3xl pointer-events-none" />
              <div className={`absolute -bottom-2 ${isOnLeft ? 'left-8 border-b border-l' : 'right-8 border-b border-r'} w-4 h-4 bg-slate-950/90 border-purple-500/30 transform ${isOnLeft ? '-rotate-45' : 'rotate-45'} pointer-events-none`} />

              <div className="relative z-10 flex flex-col gap-3">
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

        {/* Type 2: Proactive Short Tooltip Chat Bubble (Highly Visible Neon Style, no emojis) */}
        <AnimatePresence>
          {isTooltipOpen && !isOpen && !showScrollTop && (
            <Link href={tooltipHref} className={`pointer-events-auto block absolute bottom-[115%] ${isOnLeft ? 'left-0' : 'right-0'} mb-4 z-[1000]`}>
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className="w-[210px] sm:w-[245px] bg-slate-900 border-2 border-cyan-400 rounded-2xl p-4 shadow-[0_0_20px_rgba(34,211,238,0.35)] backdrop-blur-xl cursor-pointer hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.45)] transition-all duration-300 relative text-center"
              >
                {/* Speech bubble pointer */}
                <div className={`absolute -bottom-2 ${isOnLeft ? 'left-8 border-b-2 border-l-2' : 'right-8 border-b-2 border-r-2'} w-4 h-4 bg-slate-900 border-cyan-400 transform ${isOnLeft ? '-rotate-45' : 'rotate-45'} pointer-events-none`} />
                
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {getTopicIcon()}
                  <p className="text-cyan-50 text-[13px] sm:text-[14px] leading-snug font-bold tracking-wide">
                    {tooltipText}
                  </p>
                </div>
              </motion.div>
            </Link>
          )}
        </AnimatePresence>

        {/* Scroll-to-top glowing up arrow indicator overlay */}
        {showScrollTop && !isLaunching && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-500 text-white rounded-full p-1 border border-white/20 shadow-[0_0_12px_rgba(34,211,238,0.85)] animate-bounce z-50 pointer-events-none">
            <ChevronUp className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Floating Avatar Bot (Framer motion animated button for rocket launch shooting offscreen) */}
        <motion.button 
          onClick={handleToggle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          animate={
            isLaunching 
              ? { y: -800, scale: 0.5, opacity: 0 } 
              : { y: 0, scale: 1, opacity: 1 }
          }
          transition={
            isLaunching 
              ? { duration: 1.2, ease: "easeIn" } 
              : { type: "spring", damping: 15, stiffness: 200 }
          }
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border-2 ${isOpen || showScrollTop ? 'border-cyan-400/80 shadow-[0_0_25px_rgba(34,211,238,0.4)]' : 'border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]'} hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:border-purple-400 hover:scale-110 flex items-center justify-center cursor-pointer relative overflow-hidden group transition-all duration-300 z-50`}
        >
          <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full group-hover:bg-purple-500/35 transition-colors" />
          <span className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping group-hover:animate-none opacity-50" />
          <motion.div 
            animate={{ x: driftPosition.x, y: driftPosition.y }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="relative z-10 flex flex-col items-center justify-center"
          >
            <CosmicAIIcon 
              className="w-11 h-11 text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] group-hover:rotate-6 transition-transform" 
              expression={isLaunching ? 'rocket' : expression} 
            />
          </motion.div>
        </motion.button>
      </div>
    </div>
  );
}
