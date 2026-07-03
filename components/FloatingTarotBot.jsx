import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Heart, BookOpen, Star, ChevronRight, History, ChevronUp, Briefcase, ChevronDown } from 'lucide-react';
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
  const [tooltipHref, setTooltipHref] = useState("/");
  const [secondsClosed, setSecondsClosed] = useState(0);
  const [lastRouteTime, setLastRouteTime] = useState(0);

  // Wake & Click timeouts
  const [wakeTimeout, setWakeTimeout] = useState(null);
  const [clickTimeout, setClickTimeout] = useState(null);

  const [driftPosition, setDriftPosition] = useState({ x: 0, y: 0 });
  const [rapidClicks, setRapidClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const [newsInfo, setNewsInfo] = useState(null);
  const [nameNumerologyInfo, setNameNumerologyInfo] = useState(null);
  const [username, setUsername] = useState("");

  // Scroll to Top Rocket states
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [hideAll, setHideAll] = useState(false);

  const [activeZodiac, setActiveZodiac] = useState(null);
  const [activeZodiacName, setActiveZodiacName] = useState("");
  const [tarotTopic, setTarotTopic] = useState(null);
  const [tarotState, setTarotState] = useState(null);

  // 404 Playful Movement & Timers State/Refs
  const [is404Page, setIs404Page] = useState(false);
  const [is404PlayfulMoving, setIs404PlayfulMoving] = useState(false);
  const welcomeTimerRef = useRef(null);
  const timer404Ref1 = useRef(null);
  const timer404Ref2 = useRef(null);
  const timer404Ref3 = useRef(null);
  const timer404MoveRef = useRef(null);

  const clear404Timers = () => {
    if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
    if (timer404Ref1.current) clearTimeout(timer404Ref1.current);
    if (timer404Ref2.current) clearTimeout(timer404Ref2.current);
    if (timer404Ref3.current) clearTimeout(timer404Ref3.current);
    if (timer404MoveRef.current) clearTimeout(timer404MoveRef.current);
  };

  // Reset news info, name numerology info, active zodiac, and tarot info on route change
  useEffect(() => {
    setNewsInfo(null);
    setNameNumerologyInfo(null);
    setActiveZodiac(null);
    setActiveZodiacName("");
    setTarotTopic(null);
    setTarotState(null);
    setIs404Page(false);
    clear404Timers();
    setIs404PlayfulMoving(false);
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

  // Listen for active zodiac info
  useEffect(() => {
    const handleZodiacInfo = (e) => {
      if (e.detail && e.detail.zodiac) {
        setActiveZodiac(e.detail.zodiac);
        if (e.detail.vietnameseName) {
          setActiveZodiacName(e.detail.vietnameseName);
        }
      }
    };
    window.addEventListener('astro-bot-zodiac-info', handleZodiacInfo);
    return () => window.removeEventListener('astro-bot-zodiac-info', handleZodiacInfo);
  }, []);

  // Listen for Tarot topic selections and drawing states
  useEffect(() => {
    const handleTarotTopicSelect = (e) => {
      if (e.detail) {
        setTarotTopic(e.detail);
      }
    };
    const handleTarotState = (e) => {
      if (e.detail) {
        setTarotState(e.detail);
      }
    };
    window.addEventListener('astro-bot-tarot-topic-select', handleTarotTopicSelect);
    window.addEventListener('astro-bot-tarot-state', handleTarotState);
    return () => {
      window.removeEventListener('astro-bot-tarot-topic-select', handleTarotTopicSelect);
      window.removeEventListener('astro-bot-tarot-state', handleTarotState);
    };
  }, []);

  // Listen for name numerology info
  useEffect(() => {
    const handleNameNumerologyInfo = (e) => {
      if (e.detail) {
        setNameNumerologyInfo(e.detail);
      }
    };
    window.addEventListener('astro-bot-name-numerology-info', handleNameNumerologyInfo);
    return () => window.removeEventListener('astro-bot-name-numerology-info', handleNameNumerologyInfo);
  }, []);

  // Update tooltip text if newsInfo loads while on a news article page
  useEffect(() => {
    if (pathname?.startsWith('/tin-tuc/') && pathname !== '/tin-tuc' && newsInfo) {
      // 1. Change bot appearance/expression/outfit depending on category (keeps constant)
      const category = newsInfo.categoryName?.trim().toLowerCase() || '';
      let matchedZodiac = null;
      let targetExpression = 'reading_news';

      if (category.includes('thần số học')) {
        targetExpression = 'numerology';
      } else if (category.includes('cung hoàng đạo') || category.includes('tử vi')) {
        targetExpression = 'happy';

        // Detect specific zodiac from article title or tags
        const detectZodiacFromText = (text) => {
          if (!text) return null;
          const lowerText = text.toLowerCase();
          const zodiacMap = {
            aries: ['bạch dương', 'bach duong', 'aries'],
            taurus: ['kim ngưu', 'kim nguu', 'taurus'],
            gemini: ['song tử', 'song tu', 'gemini'],
            cancer: ['cự giải', 'cu gia', 'cancer'],
            leo: ['sư tử', 'su tu', 'leo'],
            virgo: ['xử nữ', 'xu nu', 'virgo'],
            libra: ['thiên bình', 'thien binh', 'libra'],
            scorpio: ['bọ cạp', 'bo cap', 'thiên yết', 'thien yet', 'scorpio'],
            sagittarius: ['nhân mã', 'nhan ma', 'sagittarius'],
            capricorn: ['ma kết', 'ma ket', 'capricorn'],
            aquarius: ['bảo bình', 'bao binh', 'aquarius'],
            pisces: ['song ngư', 'song ngu', 'pisces']
          };
          for (const [key, keywords] of Object.entries(zodiacMap)) {
            if (keywords.some(keyword => lowerText.includes(keyword))) return key;
          }
          return null;
        };

        const titleZodiac = detectZodiacFromText(newsInfo.title);
        const tagsText = newsInfo.tags && Array.isArray(newsInfo.tags) ? newsInfo.tags.join(' ') : '';
        const tagsZodiac = detectZodiacFromText(tagsText);

        matchedZodiac = titleZodiac || tagsZodiac;
        const fallback = category.includes('tử vi') ? 'aries' : 'cancer';
        matchedZodiac = matchedZodiac || fallback;
      } else if (category.includes('tình yêu')) {
        targetExpression = 'love';
      } else if (category.includes('sự nghiệp') || category.includes('sự nghiêp')) {
        targetExpression = 'tarot_career';
      }

      setExpression(targetExpression);
      setActiveZodiac(matchedZodiac);

      // 2. Play news tooltip sequence (Published date/views -> Author -> Category)
      clear404Timers(); 

      // Tooltip 1: Published Date and Views
      setTooltipText(`Đăng ngày ${newsInfo.publishedDate} với ${newsInfo.viewCount} lượt xem`);
      setTooltipHref(pathname);
      setIsTooltipOpen(true);

      // Tooltip 2: Author (after 3.5 seconds)
      timer404Ref1.current = setTimeout(() => {
        setIsTooltipOpen(false); // flash off

        timer404Ref2.current = setTimeout(() => {
          setTooltipText("Tác giả: Góc Vũ Trụ");
          setIsTooltipOpen(true);

          // Tooltip 3: Category (after 3.5 seconds)
          timer404Ref3.current = setTimeout(() => {
            setIsTooltipOpen(false); // flash off

            timer404MoveRef.current = setTimeout(() => {
              setTooltipText(`Chủ đề: ${newsInfo.categoryName}`);
              setIsTooltipOpen(true);

              // Close after 4 seconds
              setTimeout(() => {
                setIsTooltipOpen(false);
              }, 4000);

            }, 300);
          }, 3500);

        }, 300);
      }, 3500);
    }
  }, [newsInfo, pathname]);

  // Update tooltip text if nameNumerologyInfo loads
  useEffect(() => {
    if (nameNumerologyInfo) {
      const isNameNumerology = pathname?.startsWith('/than-so-hoc-theo-ten/ket-qua');
      const isBirthdayNumerology = pathname?.startsWith('/than-so-hoc/') && pathname !== '/than-so-hoc/tin-tuc';

      if (isNameNumerology || isBirthdayNumerology) {
        // Delay slightly to override the default pathname tooltip
        const timer = setTimeout(() => {
          const label = isNameNumerology ? 'Con số sứ mệnh' : 'Con số chủ đạo';
          setTooltipText(`${label} của bạn là số ${nameNumerologyInfo.number} đó! Hãy cùng tìm hiểu nha!`);
          setTooltipHref(pathname);
          setIsTooltipOpen(true);
          setExpression('numerology');
        }, 2500); // 2.5s is after the 2s default tooltip logic
        
        const hideTimer = setTimeout(() => {
          setIsTooltipOpen(false);
          setExpression(getPageExpression());
        }, 8500); // Hide after 6 seconds of showing

        return () => {
          clearTimeout(timer);
          clearTimeout(hideTimer);
        };
      }
    }
  }, [nameNumerologyInfo, pathname]);

  // Update tooltip text if activeZodiacName loads on a zodiac subpage
  useEffect(() => {
    if (activeZodiacName) {
      const isZodiacSubPage = pathname?.includes('/cung-hoang-dao/');
      if (isZodiacSubPage) {
        // Delay slightly to override the default welcome tooltip
        const timer = setTimeout(() => {
          setTooltipText(`Cung của bạn là ${activeZodiacName} nè! Cùng tìm hiểu nha!`);
          setTooltipHref(pathname);
          setIsTooltipOpen(true);
          setExpression('happy');
        }, 2500); // 2.5s is after the 2s default tooltip logic
        
        const hideTimer = setTimeout(() => {
          setIsTooltipOpen(false);
          setExpression(getPageExpression());
        }, 8500); // Hide after 6 seconds of showing

        return () => {
          clearTimeout(timer);
          clearTimeout(hideTimer);
        };
      }
    }
  }, [activeZodiacName, pathname]);

  // Listen for custom speech event
  useEffect(() => {
    const handleAstroSpeak = (e) => {
      if (e.detail) {
        const textPayload = typeof e.detail === 'string' ? e.detail : e.detail.text;
        setTooltipText(textPayload || "");
        setIsTooltipOpen(true);
        setExpression(e.detail.expression || 'happy');
        
        if (window.botTooltipTimer) clearTimeout(window.botTooltipTimer);
        window.botTooltipTimer = setTimeout(() => {
          setIsTooltipOpen(false);
          setExpression(getPageExpression());
        }, e.detail.duration || 6000);
      }
    };
    window.addEventListener('astro-bot-speak', handleAstroSpeak);
    return () => window.removeEventListener('astro-bot-speak', handleAstroSpeak);
  }, []);

  // Listen for custom expression event
  useEffect(() => {
    const handleAstroExpression = (e) => {
      if (e.detail) {
        setExpression(e.detail);
      }
    };
    window.addEventListener('astro-bot-expression', handleAstroExpression);
    return () => window.removeEventListener('astro-bot-expression', handleAstroExpression);
  }, []);

  // Update tooltip text if tarotTopic loads on a tarot spread page
  useEffect(() => {
    if (tarotTopic) {
      // Delay slightly to override the default welcome tooltip
      const timer = setTimeout(() => {
        setTooltipText(`Bạn đang trải bài ${tarotTopic.topicName} nha! Hãy nhấn Xào Bài để bắt đầu nhé.`);
        setTooltipHref(pathname);
        setIsTooltipOpen(true);
        setExpression(tarotTopic.expression);
      }, 2500); // 2.5s is after the 2s default tooltip logic
      
      const hideTimer = setTimeout(() => {
        setIsTooltipOpen(false);
      }, 8500); // Hide after 6 seconds of showing

      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    }
  }, [tarotTopic, pathname]);

  // Update tooltip text on Tarot drawing state changes
  useEffect(() => {
    if (tarotState && tarotState.state === 'drawing') {
      const cardText = tarotState.numCards === 1 ? '1 lá bài' : '3 lá bài';
      setTooltipText(`Bạn hãy chọn ${cardText} nha!`);
      setTooltipHref(pathname);
      setIsTooltipOpen(true);
      
      const timer = setTimeout(() => {
        setIsTooltipOpen(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [tarotState, pathname]);

  // Effect to drift only during dynamic/action expressions, staying still at center by default (and during sleep)
  useEffect(() => {
    const dynamicMoods = ['dancing', 'guitar', 'coffee', 'driving', 'singing', 'reading_news', 'searching', 'phone', 'reading', 'basketball', 'soccer', 'rocket', 'numerology', 'tarot_shuffling'];
    
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
    if (pathname?.includes('/tarot/trai-bai/') && tarotTopic) return tarotTopic.expression;
    if (pathname?.startsWith('/tin-tuc/') && pathname !== '/tin-tuc' && newsInfo) {
      const category = newsInfo.categoryName?.trim().toLowerCase() || '';
      if (category.includes('thần số học')) return 'numerology';
      if (category.includes('tình yêu')) return 'love';
      if (category.includes('sự nghiệp') || category.includes('sự nghiêp')) return 'tarot_career';
    }
    const isNameNumerology = pathname?.startsWith('/than-so-hoc-theo-ten/ket-qua');
    const isBirthdayNumerology = pathname?.startsWith('/than-so-hoc/') && pathname !== '/than-so-hoc/tin-tuc';
    if ((isNameNumerology || isBirthdayNumerology) && nameNumerologyInfo) return 'numerology';
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
    } else if (pathname?.includes('/cung-hoang-dao/') && activeZodiacName) {
      activeSuggestion = {
        greeting: `Giải mã chòm sao ${activeZodiacName}`,
        question: `Bạn có muốn tìm hiểu thêm về sự tương hợp của chòm sao này?`,
        options: [
          { label: "Bạn hợp với cung nào nhất?", href: ROUTES.ZODIAC_BEST_MATCHES, icon: Heart, color: "text-rose-400 bg-rose-500/10" },
          { label: "Bói tình duyên 2 chòm sao", href: ROUTES.ZODIAC_MATCH, icon: Compass, color: "text-cyan-400 bg-cyan-500/10" },
          { label: "Trải bài Tarot Tình Yêu", href: ROUTES.TAROT_SPREAD('tinh-yeu'), icon: TarotIcon, color: "text-purple-400 bg-purple-500/10" }
        ]
      };
    }

    setSuggestion(activeSuggestion);

    // After 2 seconds of thinking/dizzy transition, display welcome cue
    welcomeTimerRef.current = setTimeout(() => {
      if (is404Page || (pathname?.startsWith('/tin-tuc/') && pathname !== '/tin-tuc')) return; // Không hiện lời chào mặc định nếu đang ở trang 404 hoặc trang chi tiết tin tức

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
        
        // Show specific instruction after welcome message closes for Zodiac Match page
        if (pathname?.startsWith('/do-hop-cung-hoang-dao')) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('astro-bot-speak', { 
              detail: {
                text: "Hãy nhập theo ngày sinh hay cung nha!",
                expression: 'happy',
                duration: 6000
              }
            }));
          }, 800);
        }
      }, 6000);

    }, 2000);
    
    return () => {
      if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
      if (wakeTimeout) clearTimeout(wakeTimeout);
      if (clickTimeout) clearTimeout(clickTimeout);
    };
  }, [pathname, activeZodiacName]);

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
    // Clear 404 timers on manual action
    clear404Timers();
    setIs404PlayfulMoving(false);

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
    clear404Timers();
    setIs404PlayfulMoving(false);
    setIsOpen(false);
    setExpression('idle');
    setHasInteracted(true);
  };

  const handleMouseEnter = () => {
    clear404Timers();
    setIs404PlayfulMoving(false);
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

  const getTopic = () => {
    const text = typeof tooltipText === 'string' ? tooltipText.toLowerCase() : String(tooltipText || "").toLowerCase();
    const path = pathname?.toLowerCase() || "";
    
    // Check loading first (dizzy/thinking/loading state)
    if (expression === 'thinking' || expression === 'dizzy') return 'loading';
    
    if (text.includes("yêu") || text.includes("tình") || text.includes("cặp đôi") || path.includes("yeu") || path.includes("studio")) {
      return 'love';
    }
    if (text.includes("đăng ngày") || text.includes("lượt xem") || text.includes("bài viết")) {
      return 'news';
    }
    if (text.includes("sự nghiệp") || text.includes("công việc") || text.includes("tài chính") || text.includes("học tập") || path.includes("tin-tuc")) {
      return 'career';
    }
    if (text.includes("thần số") || text.includes("số") || path.includes("than-so-hoc") || path.includes("numerology")) {
      return 'numerology';
    }
    if (text.includes("cung") || text.includes("chòm sao") || text.includes("hoàng đạo") || path.includes("cung-hoang-dao") || path.includes("zodiac")) {
      return 'zodiac';
    }
    return null;
  };

  const CuteTopicIcon = ({ topic }) => {
    if (!topic) return null;
    
    const iconProps = {
      className: "w-6 h-6",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    };

    switch (topic) {
      case 'love':
        return (
          <svg {...iconProps}>
            <path d="M12 21s-6.5-4.5-8.5-7.5s-1-6.5 1.5-8.5s6 0 7 2.5c1-2.5 4.5-4.5 7-2.5s3.5 5.5 1.5 8.5s-8.5 7.5-8.5 7.5z" fill="#f43f5e" />
            <path d="M3 10c-1-1-2 0-2 1s1.5 2 3 2.5M21 10c1-1 2 0 2 1s-1.5 2-3 2.5" stroke="#ffe4e6" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="9.5" cy="9.5" r="0.6" fill="#fff" />
            <circle cx="14.5" cy="9.5" r="0.6" fill="#fff" />
            <ellipse cx="8" cy="11" rx="1" ry="0.6" fill="#f472b6" />
            <ellipse cx="16" cy="11" rx="1" ry="0.6" fill="#f472b6" />
          </svg>
        );
      case 'zodiac':
        return (
          <svg {...iconProps}>
            <ellipse cx="12" cy="12" rx="5.5" ry="5.5" fill="#22d3ee" />
            <path d="M2.5 13.5c4-2 15-2 19 0" stroke="#facc15" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="10" cy="11.5" r="0.6" fill="#0f172a" />
            <circle cx="14" cy="11.5" r="0.6" fill="#0f172a" />
            <path d="M11.5 13.5c.3.4.7.4 1 0" stroke="#0f172a" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M19 6l0.8 1.2 1.2 0.8-1.2 0.8-0.8 1.2-0.8-1.2-1.2-0.8 1.2-0.8z" fill="#facc15" />
          </svg>
        );
      case 'career':
        return (
          <svg {...iconProps}>
            <rect x="5" y="8" width="14" height="11" rx="2.5" fill="#f97316" />
            <path d="M9 8V5.5c0-.8.7-1.5 1.5-1.5h3c.8 0 1.5.7 1.5 1.5V8" stroke="#ffedd5" strokeWidth="1.5" />
            <circle cx="9" cy="12.5" r="0.6" fill="#fff" />
            <circle cx="15" cy="12.5" r="0.6" fill="#fff" />
            <path d="M11 14.5h2" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
            <circle cx="12" cy="8" r="1.2" fill="#facc15" />
          </svg>
        );
      case 'numerology':
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="11" r="6" fill="#d946ef" />
            <rect x="8" y="17" width="8" height="3" rx="1" fill="#475569" />
            <path d="M9.5 9.5c.5-.7 1.5-.7 2 0" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <text x="12" y="13.5" fill="#fff" fontSize="7" fontWeight="bold" textAnchor="middle">7</text>
            <path d="M4 6.5l0.4 0.6 0.6 0.4-0.6 0.4-0.4 0.6-0.4-0.6-0.6-0.4 0.6-0.4z" fill="#facc15" />
            <path d="M20 15.5l0.4 0.6 0.6 0.4-0.6 0.4-0.4 0.6-0.4-0.6-0.6-0.4 0.6-0.4z" fill="#facc15" />
          </svg>
        );
      case 'news':
        return (
          <svg {...iconProps}>
            <rect x="3" y="6" width="18" height="12" rx="2" fill="#10b981" />
            <path d="M3 7l9 6 9-6" stroke="#ecfdf5" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="9" cy="14" r="0.6" fill="#fff" />
            <circle cx="15" cy="14" r="0.6" fill="#fff" />
            <path d="M11.5 15.5c.3.3.7.3 1 0" stroke="#fff" strokeWidth="0.8" strokeLinecap="round" />
          </svg>
        );
      case 'loading':
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="4" fill="#a855f7" />
            <circle cx="12" cy="5" r="1.5" fill="#facc15" />
            <circle cx="12" cy="19" r="1.5" fill="#22d3ee" />
            <circle cx="5" cy="12" r="1.5" fill="#d946ef" />
            <circle cx="19" cy="12" r="1.5" fill="#10b981" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Listen for 404 page error event
  useEffect(() => {
    const handle404Page = () => {
      setIs404Page(true);
      clear404Timers();
      setIs404PlayfulMoving(false);

      // 1. Show first tooltip: "Bạn vào nhầm trang rồi!"
      setTooltipText("Bạn vào nhầm trang rồi!");
      setTooltipHref(pathname);
      setIsTooltipOpen(true);
      setExpression('annoyed');

      // 2. After 3 seconds, show: "Bạn có cần mình hỗ trợ không?"
      timer404Ref1.current = setTimeout(() => {
        setTooltipText("Bạn có cần mình hỗ trợ không?");
        setExpression('groggy');

        // 3. After 3 more seconds (total 6s), open popup suggestions (large box)
        timer404Ref2.current = setTimeout(() => {
          setIsTooltipOpen(false);
          setIsOpen(true);
          setExpression('happy');

          // 4. Close popup after 10 seconds of inactivity
          timer404Ref3.current = setTimeout(() => {
            setIsOpen(false);
            
            // 5. Playful movement of the whole bot for 8 seconds (wild moves and dancing expression)
            setIs404PlayfulMoving(true);
            setExpression('dancing');
            timer404MoveRef.current = setTimeout(() => {
              setIs404PlayfulMoving(false);
              setExpression('idle');
            }, 8000);

          }, 10000);

        }, 3000);

      }, 3000);
    };

    window.addEventListener('astro-bot-404-page', handle404Page);
    return () => {
      window.removeEventListener('astro-bot-404-page', handle404Page);
      clear404Timers();
    };
  }, [pathname]);

  if (!suggestion) return null;

  return (
    <motion.div 
      animate={
        is404PlayfulMoving 
          ? {
              x: [0, -250, 150, -350, 200, -100, 0],
              y: [0, -400, -150, -500, -300, -450, 0],
              rotate: [0, 180, -90, 360, -180, 720, 0],
              scale: [1, 1.4, 0.8, 1.5, 0.7, 1.3, 1],
            }
          : { x: 0, y: 0, rotate: 0, scale: 1 }
      }
      transition={
        is404PlayfulMoving 
          ? {
              duration: 8,
              ease: "easeInOut",
              times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
              repeat: 0,
            }
          : { duration: 0.3 }
      }
      className={`fixed bottom-6 ${isOnLeft ? 'left-6 sm:left-8' : 'right-6 sm:right-8'} z-[999] select-none transition-all duration-300 ${hideAll ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}`}
    >
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
                    Trợ lý ảo Astro
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
                  className="flex items-center justify-center gap-1 text-slate-500 hover:text-slate-300 text-[10px] uppercase tracking-widest font-bold mt-1 text-center w-full transition-colors group"
                >
                  Thu gọn <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Type 2: Proactive Short Tooltip Chat Bubble (Highly Visible Neon Style, no emojis) */}
        <AnimatePresence>
          {isTooltipOpen && !isOpen && (() => {
            const currentTopic = getTopic();
            return (
              <Link href={tooltipHref} className={`pointer-events-auto block absolute bottom-[115%] ${isOnLeft ? 'left-0' : 'right-0'} mb-4 z-[1000] group`}>
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className={`w-[210px] sm:w-[245px] bg-slate-900 border-2 border-cyan-400 rounded-2xl ${currentTopic ? 'pt-6 pb-4 px-4' : 'p-4'} shadow-[0_0_20px_rgba(34,211,238,0.35)] backdrop-blur-xl cursor-pointer hover:border-purple-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.45)] transition-all duration-300 relative text-center`}
                >
                  {/* Cute Badge centered on the top border - only show if we have a topic */}
                  {currentTopic && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border-2 border-cyan-400 rounded-full p-1.5 shadow-[0_0_12px_rgba(34,211,238,0.4)] z-[1001] flex items-center justify-center transition-all duration-300 group-hover:border-purple-400 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                      <CuteTopicIcon topic={currentTopic} />
                    </div>
                  )}

                  {/* Speech bubble pointer */}
                  <div className={`absolute -bottom-2 ${isOnLeft ? 'left-8 border-b-2 border-l-2' : 'right-8 border-b-2 border-r-2'} w-4 h-4 bg-slate-900 border-cyan-400 transform ${isOnLeft ? '-rotate-45' : 'rotate-45'} pointer-events-none transition-all duration-300 group-hover:border-purple-400`} />
                  
                  <div className="text-center">
                    <p className="text-cyan-50 text-[13px] sm:text-[14px] leading-snug font-bold tracking-wide">
                      {tooltipText}
                    </p>
                  </div>
                </motion.div>
              </Link>
            );
          })()}
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
          className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 border-2 ${isOpen || showScrollTop ? 'border-cyan-400/80 shadow-[0_0_25px_rgba(34,211,238,0.4)]' : 'border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]'} hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:border-purple-400 hover:scale-110 flex items-center justify-center cursor-pointer relative overflow-hidden group transition-all duration-300 z-50 ${expression === 'party' ? 'animate-bounce' : ''}`}
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
              numerologyNumber={nameNumerologyInfo?.number}
              zodiac={activeZodiac}
            />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
}
