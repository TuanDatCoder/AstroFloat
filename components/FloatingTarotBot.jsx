import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Compass, Heart, BookOpen, Star, ChevronRight, History, ChevronUp, Briefcase, ChevronDown, MessageSquare, Send, Lock, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/constants';
import TarotIcon from '@/components/TarotIcon';
import CosmicAIIcon from '@/components/CosmicAIIcon';
import { supabase } from '@/services/supabase';
import { tarotService } from '@/services/tarotService';
import { numerologyService } from '@/services/numerologyService';

export default function FloatingTarotBot() {
  const pathname = usePathname();
  const isOnLeft = false;

  // Scroll to Top Rocket states
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [hideAll, setHideAll] = useState(false);

  // Gesture refs for Rocket Launch
  const rocketHoldTimerRef = useRef(null);
  const rocketStartYRef = useRef(0);
  const rocketStartXRef = useRef(0);
  const [isRocketReady, setIsRocketReady] = useState(false);
  const gestureInProgressRef = useRef(false);

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

  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [expression, setExpression] = useState('idle');
  const [isHovered, setIsHovered] = useState(false);
  const [registerOutfit, setRegisterOutfit] = useState(null); // override outfit on /dang-ky

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

  // Auth & Chatbot States
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('room'); // 'room', 'chat', 'gift', 'diary', 'wheel', 'backpack'
  const [userStars, setUserStars] = useState(0);
  const [giftClaimedToday, setGiftClaimedToday] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [lastSpeechBubble, setLastSpeechBubble] = useState('');
  const [isWandering, setIsWandering] = useState(false);
  const [wanderingCoordinates, setWanderingCoordinates] = useState({ x: 0, y: 0 });

  const [isWaitingForDob, setIsWaitingForDob] = useState(false);
  const [userBirthDate, setUserBirthDate] = useState(null);
  const [dobFromStorage, setDobFromStorage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingExpression, setTypingExpression] = useState('dizzy');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'astro', text: 'Chào bạn! Mình là Astro - Trợ lý ảo của Góc Vũ Trụ. Hôm nay bạn muốn khám phá điều gì về vận mệnh nè?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const clickTimerRef = useRef(null);
  const inputTimeoutRef = useRef(null);
  const nextTypingExpressionRef = useRef('searching');

  // Sub-tabs for backpack
  const [backpackTab, setBackpackTab] = useState('constellation');
  // Sub-states for daily gift
  const [isOpeningGift, setIsOpeningGift] = useState(false);
  const [giftReward, setGiftReward] = useState("");
  // Sub-states for prediction wheel
  const [wheelRotation, setWheelRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState("");


  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeView]);

  // Astro Space Helpers
  const addStar = (amount = 1) => {
    setUserStars((prev) => {
      const next = prev + amount;
      localStorage.setItem('astro_stars_count', next.toString());
      return next;
    });
  };

  const collectCardToBackpack = (cardName) => {
    try {
      const saved = localStorage.getItem('astro_collected_cards');
      const cards = saved ? JSON.parse(saved) : [];
      if (!cards.includes(cardName)) {
        cards.push(cardName);
        localStorage.setItem('astro_collected_cards', JSON.stringify(cards));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getDailyDiary = () => {
    const today = new Date();
    const dateSeed = today.getDate() + (today.getMonth() + 1) * 31 + today.getFullYear();
    const usersCount = (dateSeed * 7) % 150 + 80;
    const tarotCount = (dateSeed * 13) % 25 + 5;
    const luckyNumber = (dateSeed * 17) % 9 + 1;
    
    const entries = [
      `Hôm nay có ${usersCount} người tới Góc Vũ Trụ. Có một bạn xem Tarot tới ${tarotCount} lần luôn! Mình vui lắm. Có vẻ hôm nay mọi người cần tìm câu trả lời từ các lá bài nhiều ghê.`,
      `Nhật ký ngày ${today.getDate()}/${today.getMonth() + 1}: Mình vừa pha một tách trà hoa cúc ảo. Hôm nay số ${luckyNumber} mang năng lượng mạnh nhất nè! Hy vọng các bạn số chủ đạo ${luckyNumber} sẽ gặp nhiều may mắn.`,
      `Hôm nay vũ trụ có nhiều rung động tích cực. Mình đã hỗ trợ ${usersCount} lượt giải mã. Một bạn còn khen mình dễ thương nữa, ngượng ngùng ghê 🥹. Tối nay mình sẽ ngắm sao một mình.`,
      `Hôm nay trăng tròn, năng lượng rất mạnh. Có ${usersCount} người ghé qua phòng mình. Mình cất được thêm vài ngôi sao vào balo. Mong ai ghé thăm cũng thấy bình yên.`
    ];
    return entries[dateSeed % entries.length];
  };

  // Load user data on startup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStars = localStorage.getItem('astro_stars_count');
      if (savedStars) {
        setUserStars(parseInt(savedStars, 10));
      }
      
      const claimed = localStorage.getItem('astro_gift_claimed_' + new Date().toDateString());
      setGiftClaimedToday(!!claimed);
    }
  }, []);

  // 0b. Login page expression events: listen for custom events from dang-nhap page
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let revertTimer = null;

    const handleLoginField = (e) => {
      const { field, action } = e.detail || {};
      if (revertTimer) clearTimeout(revertTimer);

      if (field === 'email' && action === 'typing') {
        setExpression('searching');
        setLastSpeechBubble('📧 Nhập email của bạn nào...');
        revertTimer = setTimeout(() => {
          setExpression('happy');
          setLastSpeechBubble('');
        }, 3500);
      } else if (field === 'password' && (action === 'typing' || action === 'typing-hide' || action === 'hide')) {
        setExpression('security');
        setLastSpeechBubble('🔒 Nhập mật khẩu bí mật...');
        revertTimer = setTimeout(() => {
          setExpression('happy');
          setLastSpeechBubble('');
        }, 3500);
      } else if (field === 'password' && (action === 'show' || action === 'typing-show')) {
        setExpression('thief');
        setLastSpeechBubble('👀 Ơ... nhìn trộm gì vậy!');
        revertTimer = setTimeout(() => {
          setExpression('happy');
          setLastSpeechBubble('');
        }, 3500);
      } else if (field === 'submit' && action === 'loading') {
        setExpression('thinking');
        setLastSpeechBubble('✨ Đang xác thực...');
      } else if (field === 'submit' && action === 'success') {
        setExpression('excited');
        setLastSpeechBubble('🎉 Chào mừng trở lại!');
      } else if (field === 'submit' && action === 'error') {
        setExpression('hurt');
        setLastSpeechBubble('😢 Thông tin không đúng rồi!');
        revertTimer = setTimeout(() => {
          setExpression('happy');
          setLastSpeechBubble('');
        }, 4000);
      }
    };

    window.addEventListener('astro:login-field', handleLoginField);
    return () => {
      window.removeEventListener('astro:login-field', handleLoginField);
      if (revertTimer) clearTimeout(revertTimer);
    };
  }, []);

  // 0c. Register page expression events: listen for custom events from dang-ky page
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let revertTimer = null;

    const handleRegisterField = (e) => {
      const { field, action } = e.detail || {};
      if (revertTimer) clearTimeout(revertTimer);

      // Reuse login-style events for email & password
      if (field === 'email' && action === 'typing') {
        setRegisterOutfit(null);
        setExpression('searching');
        setLastSpeechBubble('📧 Nhập email của bạn nào...');
        revertTimer = setTimeout(() => { setExpression('happy'); setLastSpeechBubble(''); }, 3500);

      } else if (field === 'password' && (action === 'typing' || action === 'typing-hide' || action === 'hide')) {
        setRegisterOutfit(null);
        setExpression('security');
        setLastSpeechBubble('🔒 Nhập mật khẩu bảo mật...');
        revertTimer = setTimeout(() => { setExpression('happy'); setLastSpeechBubble(''); }, 3500);

      } else if (field === 'password' && (action === 'show' || action === 'typing-show')) {
        setRegisterOutfit(null);
        setExpression('thief');
        setLastSpeechBubble('👀 Ơ... nhìn trộm gì vậy!');
        revertTimer = setTimeout(() => { setExpression('happy'); setLastSpeechBubble(''); }, 3500);

      // Nickname → mặc trang phục Galaxy (star explorer outfit + excited)
      } else if (field === 'nickname' && action === 'typing') {
        setRegisterOutfit('galaxy');
        setExpression('excited');
        setLastSpeechBubble('✨ Đặt tên hiệu đẽp như một ngôi sao nào!');
        revertTimer = setTimeout(() => { setRegisterOutfit(null); setExpression('happy'); setLastSpeechBubble(''); }, 4000);

      // Ngày sinh → đội bánh kem (birthday outfit) kèm hiệu ứng lấp lánh
      } else if (field === 'birthDate' && action === 'typing') {
        setRegisterOutfit('birthday');
        setExpression('party');
        setLastSpeechBubble('🎂 Sinh nhật của bạn là ngày đặc biệt nhất!');
        revertTimer = setTimeout(() => { setRegisterOutfit(null); setExpression('happy'); setLastSpeechBubble(''); }, 4000);

      // Thông tin khai sinh → Astro chăm chú viết vào sổ
      } else if (field === 'birthName' && action === 'typing') {
        setRegisterOutfit(null);
        setExpression('writing');
        setLastSpeechBubble('📜 Ghi nhận họ tên chính thức của bạn...');
        revertTimer = setTimeout(() => { setExpression('happy'); setLastSpeechBubble(''); }, 4000);

      } else if (field === 'submit' && action === 'loading') {
        setRegisterOutfit(null);
        setExpression('thinking');
        setLastSpeechBubble('✨ Đang tạo hồ sơ vũ trụ...');
      } else if (field === 'submit' && action === 'success') {
        setRegisterOutfit('birthday');
        setExpression('excited');
        setLastSpeechBubble('🎉 Hồ sơ đã được tạo!');
      } else if (field === 'submit' && action === 'error') {
        setRegisterOutfit(null);
        setExpression('hurt');
        setLastSpeechBubble('😢 Có lỗi xảy ra rồi!');
        revertTimer = setTimeout(() => { setExpression('happy'); setLastSpeechBubble(''); }, 4000);
      }
    };

    window.addEventListener('astro:register-field', handleRegisterField);
    return () => {
      window.removeEventListener('astro:register-field', handleRegisterField);
      if (revertTimer) clearTimeout(revertTimer);
    };
  }, []);

  // Living character interval logic
  useEffect(() => {
    if (!isOpen || activeView !== 'room') {
      setLastSpeechBubble('');
      return;
    }

    const livingDialogues = [
      "🌱 Mình vừa học thêm một trải bài Tarot mới.",
      "☕ Mình đi pha trà một chút nhé.",
      "🌙 Hôm nay trăng đẹp quá...",
      "📖 Mình đang đọc sách về các chòm sao.",
      "✨ Vũ trụ đang gửi nhiều năng lượng tốt lành đến bạn.",
      "🧘 Hít vào thật sâu, thở ra thật chậm nào..."
    ];

    setLastSpeechBubble(livingDialogues[Math.floor(Math.random() * livingDialogues.length)]);

    const interval = setInterval(() => {
      setLastSpeechBubble(livingDialogues[Math.floor(Math.random() * livingDialogues.length)]);
      const exprs = ['happy', 'reading', 'coffee', 'singing', 'sleepy'];
      setExpression(exprs[Math.floor(Math.random() * exprs.length)]);
    }, 15000);

    return () => clearInterval(interval);
  }, [isOpen, activeView]);

  // Wandering mode when closed (Disabled to prevent screen distraction)
  useEffect(() => {
    setIsWandering(false);
  }, []);

  // Event Listeners for click, scroll, resize, online status
  useEffect(() => {
    let scrollTimeout = null;
    let resizeTimeout = null;
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let lastTime = Date.now();

    const handleScroll = () => {
      const now = Date.now();
      const currentScrollY = window.scrollY;
      const timeDiff = now - lastTime;
      if (timeDiff > 0) {
        const distance = Math.abs(currentScrollY - lastScrollY);
        const speed = distance / timeDiff;
        if (speed > 30 && !isOpen) {
          setExpression('vertigo');
          setTooltipText("😵 Chậm thôi, mình chóng mặt quá!");
          setIsTooltipOpen(true);

          if (scrollTimeout) clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            setIsTooltipOpen(false);
            setExpression('idle');
          }, 3000);
        }
      }
      lastScrollY = currentScrollY;
      lastTime = now;
    };

    const handleResize = () => {
      if (!isOpen) {
        setExpression('shocked');
        setTooltipText("😳 Ôi màn hình biến hình, mình bị bóp méo rồi!");
        setIsTooltipOpen(true);

        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          setIsTooltipOpen(false);
          setExpression('idle');
        }, 3000);
      }
    };

    const handleOffline = () => {
      setExpression('hurt');
      setTooltipText("📡 Mất sóng vũ trụ rồi... Kiểm tra mạng nhé!");
      setIsTooltipOpen(true);
    };

    const handleOnline = () => {
      setExpression('happy');
      setTooltipText("📶 Sóng vũ trụ đã kết nối trở lại!");
      setIsTooltipOpen(true);
      setTimeout(() => setIsTooltipOpen(false), 3000);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('online', handleOnline);
      }
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [isOpen]);

  // Auth Status listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getSelectedStyleId = () => {
    if (typeof window === 'undefined') return 2;
    try {
      const saved = localStorage.getItem('tarot_selected_style');
      return saved ? parseInt(saved, 10) : 2;
    } catch (e) {
      return 2;
    }
  };

  const getNumerologyFallback = (num) => {
    const list = {
      1: { title: 'Người Tiên Phong', traits: 'Độc lập, quyết đoán, mang tố chất thủ lĩnh tự nhiên.', advice: 'Hãy học cách lắng nghe người khác nhiều hơn để trở thành một nhà lãnh đạo thực thụ.' },
      2: { title: 'Người Hòa Giải', traits: 'Nhạy cảm, biết lắng nghe, luôn tìm kiếm sự hòa bình và cân bằng.', advice: 'Đừng ngại nói lên tiếng nói của mình. Nhường nhịn là tốt nhưng bạn cũng cần bảo vệ chính kiến.' },
      3: { title: 'Người Truyền Cảm Hứng', traits: 'Hoạt ngôn, vui vẻ, mang năng lượng tích cực lan tỏa đến mọi người.', advice: 'Hãy học cách kỷ luật với bản thân. Sự sáng tạo của bạn cần một cấu trúc để thực sự tỏa sáng.' },
      4: { title: 'Người Xây Nền Tảng', traits: 'Thực tế, chi tiết, kỷ luật và luôn hướng tới sự ổn định, an toàn.', advice: 'Đôi khi hãy cho phép bản thân linh hoạt và mơ mộng một chút. Cuộc sống không phải lúc nào cũng cần theo khuôn mẫu.' },
      5: { title: 'Người Tự Do', traits: 'Yêu thích sự phiêu lưu, khám phá, không ngừng tìm kiếm trải nghiệm mới.', advice: 'Sự tự do thực sự đến từ kỷ luật. Hãy tìm một bến đỗ hoặc một mục tiêu cốt lõi để neo giữ tâm hồn bạn.' },
      6: { title: 'Người Chăm Sóc', traits: 'Mang năng lượng của một người mẹ/cha, đầy tình yêu thương và trách nhiệm.', advice: 'Hãy nhớ rằng bạn không thể cứu giúp tất cả mọi người. Hãy yêu thương bản thân mình trước tiên.' },
      7: { title: 'Người Tìm Kiếm Chân Lý', traits: 'Bí ẩn, sâu sắc, luôn muốn đi tìm bản chất thật của mọi vấn đề.', advice: 'Đừng tự nhốt mình trong thế giới nội tâm quá lâu. Hãy chia sẻ những suy nghĩ sâu sắc của bạn với thế giới.' },
      8: { title: 'Người Điều Hành', traits: 'Đại diện cho quyền lực, vật chất và sự thành công trong sự nghiệp.', advice: 'Tiền bạc và quyền lực là công cụ, không phải đích đến. Hãy học cách cân bằng giữa sự nghiệp và tình cảm.' },
      9: { title: 'Người Nhân Đạo', traits: 'Mang lý tưởng cao cả, luôn muốn cống hiến và làm cho thế giới tốt đẹp hơn.', advice: 'Hãy chấp nhận rằng thế giới này không hoàn hảo. Làm tốt những việc nhỏ bé cũng là đang cống hiến cho nhân loại.' },
      11: { title: 'Nhà Ngoại Cảm Tầm Nhìn', traits: 'Bạn mang tần số của sự thức tỉnh và trực giác nhạy bén bậc nhất. Bạn giống như một chiếc ăng-ten thu phát những tín hiệu tâm linh và ý tưởng đột phá từ vũ trụ.', advice: 'Hãy học cách "tiếp đất" (grounding). Đừng để những dòng suy nghĩ quá tải làm bạn kiệt sức; hãy biến tầm nhìn thành hành động cụ thể.' },
      22: { title: 'Nhà Kiến Tạo Bậc Thầy', traits: 'Đây là con số quyền năng nhất, kết hợp giữa tầm nhìn của số 11 và sự thực tế của số 4. Bạn có khả năng biến những giấc mơ không tưởng thành hiện thực hữu hình trên quy mô lớn.', advice: 'Đừng để gánh nặng của thế giới đè nặng lên vai bạn. Hãy học cách nghỉ ngơi và hiểu rằng sự vĩ đại cần thời gian để bồi đắp.' },
      33: { title: 'Bậc Thầy Của Sự Chữa Lành', traits: 'Con số của tình yêu vô điều kiện ở cấp độ cao nhất. Bạn sinh ra để phục vụ nhân loại, chữa lành những vết thương và nâng cao rung động của cộng đồng xung quanh.', advice: 'Bạn không thể cứu cả thế giới nếu bản thân đang kiệt quệ. Hãy học cách bảo vệ ranh giới cá nhân và yêu thương chính mình trước khi cho đi.' }
    };
    return list[num] || { title: 'Con Số Bí Ẩn', traits: 'Mang năng lượng bí ẩn đang chờ khai phá.', advice: 'Hãy tiếp tục khám phá bản thân để hiểu rõ hơn.' };
  };

  const getNumerologyKeywords = (num) => {
    const kw = {
      1: ['Độc lập', 'Quyết đoán', 'Tiên phong'],
      2: ['Thấu cảm', 'Hòa giải', 'Nhạy cảm'],
      3: ['Sáng tạo', 'Hoạt ngôn', 'Năng lượng'],
      4: ['Kỷ luật', 'Thực tế', 'Tỉ mỉ'],
      5: ['Tự do', 'Linh hoạt', 'Trải nghiệm'],
      6: ['Yêu thương', 'Trách nhiệm', 'Tận tụy'],
      7: ['Trực giác', 'Bí ẩn', 'Phân tích'],
      8: ['Bản lĩnh', 'Tham vọng', 'Điều hành'],
      9: ['Nhân ái', 'Lý tưởng', 'Vị tha'],
      11: ['Nhạy bén', 'Thức tỉnh', 'Trực giác'],
      22: ['Tầm nhìn', 'Kiến tạo', 'Kỷ luật'],
      33: ['Từ bi', 'Chữa lành', 'Bao dung']
    };
    return kw[num] || ['Bí ẩn', 'Khám phá', 'Tâm linh'];
  };

  const handleDrawTarotDirectly = async () => {
    setIsChatLoading(true);
    setExpression('tarot_shuffling');

    try {
      const styleId = getSelectedStyleId();
      const reading = await tarotService.generateReading(1, null, styleId);
      
      if (reading && reading.cards && reading.cards.length > 0) {
        const firstCard = reading.cards[0];
        const cardObj = {
          card_id: firstCard.card_id,
          name: firstCard.card_name,
          image_url: firstCard.image_url,
          orientation: firstCard.orientation,
          short_meaning: firstCard.short_meaning,
          long_meaning: firstCard.long_meaning,
          full_text: reading.full_text
        };

        tarotService.saveDailyTarotToLocal(cardObj, firstCard.orientation, reading.full_text);

        setChatMessages(prev => [...prev, {
          sender: 'astro',
          text: reading.full_text || `Lá bài hôm nay của bạn là ${firstCard.card_name} (${firstCard.orientation === 'upright' ? 'Chiều xuôi' : 'Chiều ngược'}).`,
          card: cardObj
        }]);
        collectCardToBackpack(firstCard.card_name);
        addStar(1);
        setExpression('happy');
      } else {
        throw new Error("Không bốc được bài");
      }
    } catch (e) {
      console.error(e);
      const names = ['The Fool', 'The Magician', 'The Lovers', 'The Empress', 'The Emperor', 'The Chariot', 'The Star', 'The Sun', 'The World'];
      const pickedName = names[Math.floor(Math.random() * names.length)];
      const orientation = Math.random() < 0.5 ? 'upright' : 'reversed';
      
      const cardMeanings = {
        'The Fool': { shortUp: 'sự khởi đầu mới đầy tự do', shortRev: 'sự bất cẩn, hành động bốc đồng', longUp: 'Năng lượng khuyến khích bạn bước khỏi vùng an toàn, đón nhận thử thách mới.', longRev: 'Bạn dễ đưa ra quyết định nóng vội hoặc hành động thiếu suy nghĩ.' },
        'The Magician': { shortUp: 'khả năng làm chủ bản thân', shortRev: 'năng lượng bị phân tán, trì hoãn', longUp: 'Bạn đang nắm giữ mọi công cụ cần thiết để giải quyết các vấn đề ngày hôm nay.', longRev: 'Bạn có tài năng nhưng thiếu tập trung hoặc đang lãng phí thời gian.' },
        'The Lovers': { shortUp: 'sự gắn kết và thăng hoa', shortRev: 'sự rạn nứt hoặc mất kết nối', longUp: 'Ngày tuyệt vời để kết nối, lắng nghe và chia sẻ cảm xúc chân thành.', longRev: 'Có thể có sự mâu thuẫn nhỏ hoặc bất đồng ý kiến, cần ngồi lại lắng nghe.' },
        'The Empress': { shortUp: 'sự sinh sôi và dồi dào', shortRev: 'sự trì trệ, thiếu chăm sóc bản thân', longUp: 'Năng lượng mang lại sự sinh trưởng, sung túc và tình cảm ấm áp.', longRev: 'Bạn đang bỏ bê nhu cầu của bản thân, hãy nghỉ ngơi và thư giãn.' },
        'The Emperor': { shortUp: 'kỷ luật, kiểm soát tốt công việc', shortRev: 'sự cứng nhắc hoặc độc đoán', longUp: 'Hãy thiết lập kỷ luật và làm việc có tổ chức để đạt hiệu quả cao.', longRev: 'Cảnh báo bạn đang quá khắt khe hoặc kiểm soát quá chặt làm ức chế người khác.' },
        'The Chariot': { shortUp: 'sự kiên trì vượt qua khó khăn', shortRev: 'sự quá tải hoặc mất phương hướng', longUp: 'Bạn có quyết tâm lớn để chinh phục mục tiêu của mình hôm nay.', longRev: 'Bạn đang chạy quá nhanh và ôm đồm quá nhiều việc cùng lúc.' },
        'The Star': { shortUp: 'hy vọng và sự chữa lành tâm hồn', shortRev: 'sự bi quan hoặc nghi ngờ bản thân', longUp: 'Một nguồn cảm hứng lớn đang đến để làm mới tinh thần và chữa lành những mệt mỏi.', longRev: 'Bạn cảm thấy lo lắng và mất niềm tin vào tương lai. Hãy thả lỏng cơ thể.' },
        'The Sun': { shortUp: 'tỏa sáng rực rỡ và tràn ngập niềm vui', shortRev: 'sự kiêu ngạo hoặc chủ quan', longUp: 'Một ngày ngập tràn may mắn và cơ hội tuyệt vời đón chào bạn.', longRev: 'Dễ nảy sinh sự chủ quan hoặc quá tự phụ dẫn đến sai lầm không đáng có.' },
        'The World': { shortUp: 'sự viên mãn và hoàn thành mục tiêu', shortRev: 'sự dang dở, thiếu kiên nhẫn', longUp: 'Hoàn thành chặng đường cũ thành công mỹ mãn và sẵn sàng cho khởi đầu mới.', longRev: 'Có thể gặp chút chậm trễ ở bước cuối cùng, hãy nhẫn nại đi đến cùng.' }
      };

      const details = cardMeanings[pickedName] || cardMeanings['The Fool'];
      const short_meaning = orientation === 'upright' ? details.shortUp : details.shortRev;
      const long_meaning = orientation === 'upright' ? details.longUp : details.longRev;
      
      const fallbackCard = {
        card_id: names.indexOf(pickedName) + 1,
        name: pickedName,
        orientation,
        short_meaning,
        long_meaning,
        full_text: `Vũ trụ gửi thông điệp cho bạn hôm nay: Năng lượng chính xoay quanh ${short_meaning}. Lời khuyên: ${long_meaning}`,
        image_url: `/assets/cards/${pickedName.toLowerCase().replace(/ /g, '-')}.png`
      };

      tarotService.saveDailyTarotToLocal(fallbackCard, fallbackCard.orientation, fallbackCard.full_text);

      setChatMessages(prev => [...prev, {
        sender: 'astro',
        text: fallbackCard.full_text,
        card: fallbackCard
      }]);
      collectCardToBackpack(fallbackCard.name);
      addStar(1);
      setExpression('happy');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleCalculateNumerologyDirectly = async (dobString) => {
    setIsChatLoading(true);
    setExpression('numerology');

    try {
      const lifePath = numerologyService.calculateLifePathNumber(dobString);
      if (!lifePath) throw new Error("Không thể tính số chủ đạo");

      let numerologyData = null;
      try {
        if (lifePath >= 1 && lifePath <= 9) {
          numerologyData = await numerologyService.getNumerologyByNumber(lifePath);
        } else {
          const { data } = await supabase.from('name_numerology').select('*').eq('number', lifePath).maybeSingle();
          if (data) {
            numerologyData = data;
          }
        }
      } catch (dbErr) {
        console.warn("Lỗi truy vấn DB:", dbErr);
      }

      if (!numerologyData) {
        numerologyData = getNumerologyFallback(lifePath);
      }

      const numObj = {
        number: lifePath,
        title: numerologyData.title || getNumerologyFallback(lifePath).title,
        traits: numerologyData.traits || getNumerologyFallback(lifePath).traits,
        advice: numerologyData.advice || getNumerologyFallback(lifePath).advice,
        keywords: getNumerologyKeywords(lifePath)
      };

      setChatMessages(prev => [...prev, {
        sender: 'astro',
        text: `Con số chủ đạo của bạn là **Số ${lifePath} - ${numObj.title}**!\n\n**Đặc điểm nổi bật:** ${numObj.traits}\n\n**Lời khuyên:** ${numObj.advice}`,
        numerology: numObj
      }]);
      addStar(1);
      setExpression('excited');
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, {
        sender: 'astro',
        text: 'Astro xin lỗi, ngày sinh bạn nhập không hợp lệ hoặc có chút trục trặc tính toán. Hãy thử lại ngày sinh khác nhé!'
      }]);
      setExpression('annoyed');
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    // --- Rate Limit Logic (10 messages per day) ---
    const today = new Date().toISOString().split('T')[0];
    let usage = { date: today, count: 0 };
    try {
      const stored = localStorage.getItem('astro_chat_usage');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          usage = parsed;
        }
      }
    } catch (e) {
      console.error("Local storage error", e);
    }

    if (usage.count >= 10) {
      setChatMessages(prev => [...prev, { 
        sender: 'astro', 
        text: 'Hôm nay năng lượng vũ trụ của mình cạn kiệt rồi (bạn đã hỏi hết 10 câu/ngày). Mình đi ngủ nạp năng lượng đây, ngày mai tụi mình tâm sự tiếp nhé!' 
      }]);
      setExpression('sleepy');
      setChatInput('');
      return;
    }
    // ----------------------------------------------

    const userText = chatInput.trim();
    setChatInput('');

    // 1. Kiểm tra định dạng ngày sinh (DD/MM/YYYY hoặc DD-MM-YYYY)
    const dateRegex = /\b(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})\b/;
    const match = userText.match(dateRegex);

    if (isWaitingForDob || match) {
      // Đưa tin nhắn của user vào hội thoại
      setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
      setIsWaitingForDob(false);

      if (match) {
        const day = match[1];
        const month = match[2];
        const year = match[3];
        const dobStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        await handleCalculateNumerologyDirectly(dobStr);
      } else {
        setIsChatLoading(true);
        setTimeout(() => {
          setChatMessages(prev => [...prev, {
            sender: 'astro',
            text: 'Hình như đây không phải định dạng ngày sinh rồi bạn ơi. Hãy nhập kiểu ngày/tháng/năm nha (Ví dụ: 05/09/1997).'
          }]);
          setIsWaitingForDob(true);
          setIsChatLoading(false);
        }, 800);
      }
      return;
    }

    // 2. Kiểm tra nếu tin nhắn chứa yêu cầu rút Tarot
    const lowerText = userText.toLowerCase();
    if (
      lowerText.includes('rút bài') || 
      lowerText.includes('rút 1 lá') || 
      lowerText.includes('bốc bài') || 
      lowerText.includes('daily tarot') || 
      lowerText.includes('lá bài hôm nay') || 
      lowerText.includes('tarot ngày mới')
    ) {
      setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
      await handleDrawTarotDirectly();
      return;
    }

    // 3. Keyword Detection Bypass (instant response without calling API, doesn't count towards rate limit!)
    const cleanText = userText.toLowerCase().trim();
    let instantReply = "";
    let instantMood = "happy";

    if (cleanText === "cảm ơn" || cleanText === "cảm ơn nhé" || cleanText === "thank" || cleanText === "thanks") {
      instantReply = "🥹 Không có gì đâu nè! Được giúp bạn và nhìn thấy bạn vui vẻ là niềm hạnh phúc lớn nhất của mình rồi đó!";
      instantMood = "excited";
    } else if (cleanText === "mệt" || cleanText === "mệt mỏi" || cleanText === "buồn" || cleanText === "chán" || cleanText === "mình mệt") {
      instantReply = "Nghỉ tay một chút uống cốc nước nha, mình luôn ở đây đồng hành cùng bạn mà! Muốn rút một lá bài để được vỗ về không? 🍵";
      instantMood = "shy";
    } else if (cleanText === "astro" || cleanText === "astro ơi") {
      instantReply = "Dạ mình nghe đây! Hôm nay mình có thể giúp bạn giải mã bản đồ vũ trụ hay bói bài Tarot gì nè? 🌌";
      instantMood = "wink";
    }

    if (instantReply) {
      setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
      setIsChatLoading(true);
      setTimeout(() => {
        setChatMessages(prev => [...prev, { sender: 'astro', text: instantReply }]);
        setExpression(instantMood);
        setIsChatLoading(false);
      }, 600);
      return;
    }

    // 4. Nếu là tin nhắn bình thường, gửi lên API AI
    const newMessages = [...chatMessages, { sender: 'user', text: userText }];
    setChatMessages(newMessages);
    setIsChatLoading(true);

    const generateMoods = ['thinking', 'searching', 'pondering'];
    setExpression(generateMoods[Math.floor(Math.random() * generateMoods.length)]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();
      if (data.success) {
        setChatMessages(prev => [...prev, { sender: 'astro', text: data.text }]);
        setExpression(Math.random() > 0.5 ? 'party' : 'happy');
        addStar(1);

        usage.count += 1;
        localStorage.setItem('astro_chat_usage', JSON.stringify(usage));
      } else {
        setChatMessages(prev => [...prev, { sender: 'astro', text: 'Hình như có chút trục trặc kết nối tâm linh rồi... Bạn thử lại xem sao nha!' }]);
        setExpression('annoyed');
      }
    } catch (e) {
      console.error(e);
      setChatMessages(prev => [...prev, { sender: 'astro', text: 'Lỗi kết nối rồi bạn ơi! Thử lại sau nha.' }]);
      setExpression('annoyed');
    } finally {
      setIsChatLoading(false);
    }
  };

  // Scroll to Top Rocket states and gesture refs are declared at the top of the component to avoid temporal dead zone errors

  const triggerRocketLaunch = () => {
    setIsLaunching(true);
    setExpression('rocket');
    setIsTooltipOpen(false);
    setIsOpen(false);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
      setIsLaunching(false);
      setExpression(getPageExpression());
      setSecondsClosed(0);
    }, 1200);
  };

  // Zodiac, Tarot, and 404 page states/refs are declared at the top of the component to avoid temporal dead zone errors

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
    if (isTyping) return; // Prevent overwriting driftPosition if typing
    
    const dynamicMoods = ['dancing', 'guitar', 'coffee', 'driving', 'singing', 'reading_news', 'searching', 'phone', 'reading', 'writing', 'basketball', 'soccer', 'rocket', 'numerology', 'tarot_shuffling'];
    
    if (dynamicMoods.includes(expression) && !isLaunching && !isHovered && !isOpen) {
      // Subtle drift offset while active
      const rx = (Math.random() * 12) - 6;
      const ry = (Math.random() * 12) - 6;
      setDriftPosition({ x: rx, y: ry });
    } else {
      // Revert back to center immediately for static expressions (idle, sleepy, happy, shy, hurt, annoyed, etc.)
      setDriftPosition({ x: 0, y: 0 });
    }
  }, [expression, isLaunching, isHovered, isOpen, isTyping]);

  const getPageExpression = () => {
    if (pathname === '/dang-nhap' || pathname === '/dang-ky') return 'searching';
    if (pathname === '/') return 'wizard';
    if (pathname?.startsWith('/kham-pha')) return 'searching';
    if (pathname === '/goc-vu-tru') return 'presenter';
    if (pathname === '/tarot/tarot-goc-vu-tru') return 'witch';
    if (pathname?.includes('/dieu-khoan-su-dung') || pathname?.includes('/dieu-khoan-dich-vu')) return 'lawyer';
    if (pathname?.includes('/chinh-sach-bao-mat')) return 'security';
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
    if (pathname?.startsWith('/bieu-do-pinnacle')) return 'numerology';
    if (pathname?.startsWith('/tarot')) return 'tarot';
    if (
      pathname?.startsWith('/do-hop-cung-hoang-dao') || 
      pathname?.startsWith('/cung-hoang-dao-tuong-hop-nhat') ||
      pathname?.startsWith('/tat-ca-cap-doi-cung-hoang-dao') ||
      pathname?.startsWith('/dem-ngay-yeu')
    ) return 'love';
    return 'happy';
  };

  const getPopupTheme = () => {
    const pageExp = getPageExpression();
    if (pageExp === 'lawyer') {
      return {
        cardBg: "bg-slate-950/95 border-amber-600/30 shadow-[0_15px_50px_rgba(217,119,6,0.15)]",
        pointerBg: "bg-slate-950/95 border-amber-600/30",
        gradient: "from-amber-600/10 via-transparent to-stone-900/10"
      };
    }
    if (pageExp === 'security') {
      return {
        cardBg: "bg-slate-950/95 border-emerald-500/30 shadow-[0_15px_50px_rgba(16,185,129,0.15)]",
        pointerBg: "bg-slate-950/95 border-emerald-500/30",
        gradient: "from-emerald-500/10 via-transparent to-slate-950/10"
      };
    }
    if (pageExp === 'presenter') {
      return {
        cardBg: "bg-slate-950/95 border-cyan-400/30 shadow-[0_15px_50px_rgba(34,211,238,0.25)]",
        pointerBg: "bg-slate-950/95 border-cyan-400/30",
        gradient: "from-yellow-400/10 via-transparent to-cyan-500/10"
      };
    }
    if (pageExp === 'crown') {
      return {
        cardBg: "bg-slate-950/95 border-amber-400/30 shadow-[0_15px_50px_rgba(245,158,11,0.2)]",
        pointerBg: "bg-slate-950/95 border-amber-400/30",
        gradient: "from-amber-500/10 via-transparent to-yellow-600/10"
      };
    }
    if (pageExp === 'wizard') {
      return {
        cardBg: "bg-slate-950/95 border-blue-400/30 shadow-[0_15px_50px_rgba(59,130,246,0.2)]",
        pointerBg: "bg-slate-950/95 border-blue-400/30",
        gradient: "from-blue-900/15 via-transparent to-cyan-900/15"
      };
    }
    if (pageExp === 'witch') {
      return {
        cardBg: "bg-slate-950/95 border-purple-500/30 shadow-[0_15px_50px_rgba(168,85,247,0.25)]",
        pointerBg: "bg-slate-950/95 border-purple-500/30",
        gradient: "from-purple-900/20 via-transparent to-fuchsia-900/20"
      };
    }
    if (pageExp === 'love') {
      return {
        cardBg: "bg-slate-950/95 border-rose-500/30 shadow-[0_15px_50px_rgba(244,63,94,0.2)]",
        pointerBg: "bg-slate-950/95 border-rose-500/30",
        gradient: "from-rose-500/10 via-transparent to-pink-500/10"
      };
    }
    if (pageExp === 'numerology') {
      return {
        cardBg: "bg-slate-950/95 border-blue-500/30 shadow-[0_15px_50px_rgba(59,130,246,0.2)]",
        pointerBg: "bg-slate-950/95 border-blue-500/30",
        gradient: "from-blue-500/10 via-transparent to-indigo-500/10"
      };
    }
    return {
      cardBg: "bg-slate-950/90 border-purple-500/30 shadow-[0_15px_50px_rgba(168,85,247,0.25)]",
      pointerBg: "bg-slate-950/90 border-purple-500/30",
      gradient: "from-purple-500/5 via-transparent to-cyan-500/5"
    };
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
        setUser(session.user);
        supabase.from('profiles').select('nickname, birth_date').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data?.nickname) {
              setUsername(data.nickname);
            } else if (session.user.email) {
              setUsername(session.user.email.split('@')[0]);
            }
            if (data?.birth_date) {
              setUserBirthDate(data.birth_date);
            }
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        supabase.from('profiles').select('nickname, birth_date').eq('id', session.user.id).single()
          .then(({ data }) => {
            if (data?.nickname) {
              setUsername(data.nickname);
            } else if (session.user.email) {
              setUsername(session.user.email.split('@')[0]);
            }
            if (data?.birth_date) {
              setUserBirthDate(data.birth_date);
            }
          });
      } else {
        setUser(null);
        setUsername("");
        setUserBirthDate(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Listen for local storage DOB updates reactively
  useEffect(() => {
    const checkDob = () => {
      if (typeof window !== 'undefined') {
        const val = localStorage.getItem('astrofloat_dob');
        if (val !== dobFromStorage) {
          setDobFromStorage(val);
        }
      }
    };
    checkDob();
    const timer = setInterval(checkDob, 1000);
    return () => clearInterval(timer);
  }, [dobFromStorage]);

  // Listen for user typing in specific pages to trigger random cute expressions
  useEffect(() => {
    const handleGlobalInput = (e) => {
      const isTargetPage = 
        pathname === '/than-so-hoc' || 
        pathname === '/than-so-hoc-theo-ten' || 
        pathname === '/kham-pha' ||
        pathname?.startsWith('/than-so-hoc') ||
        pathname?.startsWith('/cung-hoang-dao') ||
        pathname?.startsWith('/kham-pha');

      if (!isTargetPage) return;

      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        setIsTyping(true);

        setTypingExpression((curr) => {
          if (curr && inputTimeoutRef.current) return curr; // Keep current expression during active typing
          
          // Luân phiên thay vì ngẫu nhiên (kính lúp lần đầu -> dừng -> ống nhòm -> dừng -> kính lúp...)
          const nextExpr = nextTypingExpressionRef.current;
          nextTypingExpressionRef.current = nextExpr === 'searching' ? 'dizzy' : 'searching';
          
          return nextExpr;
        });

        if (inputTimeoutRef.current) {
          clearTimeout(inputTimeoutRef.current);
        }

        inputTimeoutRef.current = setTimeout(() => {
          inputTimeoutRef.current = null;
          setIsTyping(false);
        }, 3500); // 3.5s timeout after they stop typing before returning to normal
      }
    };

    document.addEventListener('input', handleGlobalInput);
    return () => {
      document.removeEventListener('input', handleGlobalInput);
      if (inputTimeoutRef.current) {
        clearTimeout(inputTimeoutRef.current);
        inputTimeoutRef.current = null;
      }
    };
  }, [pathname]);

  // Synchronize typing states with expression and drift position
  useEffect(() => {
    if (isTyping) {
      setExpression(typingExpression);
      setDriftPosition({ x: -9, y: -9 }); // Move up-left towards the top-left edge of the bot container
    } else {
      setExpression(getPageExpression());
      setDriftPosition({ x: 0, y: 0 });
    }
  }, [isTyping, typingExpression]);

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

    const targetExpression = getPageExpression();
    const isSpecialAI = targetExpression !== 'happy' && targetExpression !== 'idle';

    if (isFastTransition) {
      setExpression('vertigo');
    } else if (isSpecialAI) {
      setExpression('thinking');
    } else {
      setExpression(targetExpression);
    }

    // Set persistent wizard outfit when entering homepage
    if (pathname === '/' && typeof window !== 'undefined') {
      sessionStorage.setItem('astro_session_outfit', 'wizard');
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

    if (pathname === '/dang-nhap' || pathname === '/dang-ky') {
      activeSuggestion = {
        greeting: "Bạn đang ở trang đăng nhập nè!",
        question: "Đăng nhập để mở khoá mọi tính năng vũ trụ nhé:",
        options: [
          { label: "Xem thần số học ngày sinh", href: ROUTES.NUMEROLOGY, icon: Star, color: "text-amber-400 bg-amber-500/10" },
          { label: "Trải bài Tarot Tổng Quan", href: ROUTES.TAROT_SPREAD('tong-quan'), icon: TarotIcon, color: "text-purple-400 bg-purple-500/10" },
          { label: "Giải mã cung hoàng đạo", href: ROUTES.ZODIAC, icon: Compass, color: "text-cyan-400 bg-cyan-500/10" }
        ]
      };
    } else if (pathname === '/') {
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
    } else if (pathname === '/ho-so') {
      const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'bạn';
      activeSuggestion = {
        greeting: `Xin chào ${displayName}! Bạn đang ở trang hồ sơ nha!`,
        question: "Lập trình bởi TuanDatCoder nha. Bạn có muốn xem lại các chỉ số cá nhân hoặc khám phá thêm không?",
        options: [
          { label: "Xem thần số học ngày sinh", href: ROUTES.NUMEROLOGY, icon: Star, color: "text-amber-400 bg-amber-500/10" },
          { label: "Trải bài Tarot Tổng Quan", href: ROUTES.TAROT_SPREAD('tong-quan'), icon: TarotIcon, color: "text-purple-400 bg-purple-500/10" },
          { label: "Giải mã cung hoàng đạo", href: ROUTES.ZODIAC, icon: Compass, color: "text-cyan-400 bg-cyan-500/10" }
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

      if (pathname === '/dang-nhap') {
        pageName = "Đăng Nhập";
        welcomeHref = '/dang-nhap';
      } else if (pathname === '/dang-ky') {
        pageName = "Đăng Ký";
        welcomeHref = '/dang-ky';
      } else if (pathname === '/') pageName = "Trang Chủ";
      else if (pathname === '/goc-vu-tru') pageName = "Góc Vũ Trụ";
      else if (pathname === '/tarot/tarot-goc-vu-tru') pageName = "Tarot Góc Vũ Trụ";
      else if (pathname?.includes('/dieu-khoan-su-dung') || pathname?.includes('/dieu-khoan-dich-vu')) pageName = "Điều Khoản Dịch Vụ";
      else if (pathname?.includes('/chinh-sach-bao-mat')) pageName = "Chính Sách Bảo Mật";
      else if (pathname?.includes('/family-love-studio')) pageName = "Family Love Studio";
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
      else if (pathname?.startsWith('/bieu-do-pinnacle')) {
        const pinnacleNum = pathname.split('/').pop();
        pageName = `Đỉnh Cao Số ${pinnacleNum}`;
      }

      const hour = new Date().getHours();
      const day = new Date().getDay();
      const isWeekend = day === 0 || day === 6;

      let welcomeMsg = `Bạn đang ở trang ${pageName} đó!`;

      if (pathname === '/dang-nhap') {
        welcomeMsg = "Bạn đang ở trang đăng nhập! Hãy nhập thông tin để mở khoá vũ trụ nha 🔑";
      } else if (pathname === '/dang-ky') {
        welcomeMsg = "Chào bạn mới! Đăng ký để bắt đầu hành trình giải mã bản thân nha ✨";
      } else if (pathname === '/ho-so') {
        const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'bạn';
        welcomeMsg = `Xin chào ${displayName}! Bạn đang ở trang hồ sơ nha! (Lập trình bởi TuanDatCoder)`;
      } else if (pathname === '/') {
        welcomeMsg = "Chào mừng bạn đến với Góc Vũ Trụ - nơi giải mã bản thân!";
      } else if (pathname === '/goc-vu-tru') {
        welcomeMsg = "Xin chào bạn đang ở trang Góc Vũ Trụ";
      } else if (pathname?.startsWith('/kham-pha')) {
        welcomeMsg = "Chào mừng bạn đến với chuyên mục Khám Phá của Góc Vũ Trụ!";
      } else if (pathname === '/tarot/tarot-goc-vu-tru') {
        welcomeMsg = "Chào mừng bạn đến với thế giới huyền bí của Tarot Góc Vũ Trụ";
      } else if (pathname?.startsWith('/bieu-do-pinnacle')) {
        const pinnacleNum = pathname.split('/').pop();
        welcomeMsg = `Bạn đang ở đỉnh cao số ${pinnacleNum} đó nha!`;
      } else {
        // Situation 1 & 4: Night/Weekend customized welcome cues
        if (hour >= 23 || hour < 4) {
          welcomeMsg = "Cú đêm ơi, muộn thế này sao chưa ngủ nhỉ?";
        } else if (isWeekend) {
          welcomeMsg = "Cuối tuần rồi! Thư giãn và xem Tarot thôi nào";
        }
      }

      setTooltipText(welcomeMsg);
      setTooltipHref(welcomeHref);
      setIsTooltipOpen(true);
      setExpression(getPageExpression());

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
        } else if (pathname === '/') {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('astro-bot-speak', { 
              detail: {
                text: "Bên mình có các sản phẩm Thần số học và Tarot cực kỳ thú vị",
                expression: 'crown',
                duration: 4000
              }
            }));
            
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('astro-bot-speak', { 
                detail: {
                  text: "Hãy thử khám phá một tính năng để xem vận mệnh của bạn nhé!",
                  expression: 'crown',
                  duration: 5000
                }
              }));
            }, 4500);
          }, 800);
        } else if (pathname === '/goc-vu-tru') {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('astro-bot-speak', { 
              detail: {
                text: "Hãy cùng tìm hiểu nha",
                expression: 'presenter',
                duration: 3500
              }
            }));
            
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('astro-bot-speak', { 
                detail: {
                  text: "Chờ một lát, bên mình có các sản phẩm bên dưới",
                  expression: 'presenter',
                  duration: 5000
                }
              }));
            }, 4000);
          }, 800);
        } else if (pathname?.startsWith('/kham-pha')) {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('astro-bot-speak', { 
              detail: {
                text: "Nơi đây chứa đựng vô vàn kiến thức huyền học, tử vi và chòm sao thú vị",
                expression: 'wizard',
                duration: 4000
              }
            }));
            
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('astro-bot-speak', { 
                detail: {
                  text: "Hãy kéo xuống để cùng khám phá các bài viết mới nhất nhé!",
                  expression: 'wizard',
                  duration: 5000
                }
              }));
            }, 4500);
          }, 800);
        } else if (pathname === '/tarot/tarot-goc-vu-tru') {
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('astro-bot-speak', { 
              detail: {
                text: "Hãy chuẩn bị một câu hỏi trong lòng nhé...",
                expression: 'witch',
                duration: 4000
              }
            }));
            
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('astro-bot-speak', { 
                detail: {
                  text: "Khi bạn đã sẵn sàng, hãy bốc bài để nhận thông điệp từ vũ trụ",
                  expression: 'witch',
                  duration: 5000
                }
              }));
            }, 4500);
          }, 800);
        }
      }, 6000);

    }, 2000);
    
    return () => {
      if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
      if (wakeTimeout) clearTimeout(wakeTimeout);
      if (clickTimeout) clearTimeout(clickTimeout);
    };
  }, [pathname, activeZodiacName, user]);

  // 5. Sleepy idle check, periodic mood swings, and proactive Type 2 Tooltips (at 30s and 70s)
  useEffect(() => {
    if (inputTimeoutRef.current) return;

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

    // On pinnacle pages, always stay as numerology
    if (pathname?.startsWith('/bieu-do-pinnacle')) {
      setExpression('numerology');
    } else {
      setExpression('idle');
    }

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
      if (inputTimeoutRef.current) return;
      setSecondsClosed((prev) => {
        const nextSec = prev + 1;

        // Sleeps after 90 seconds (1.5 minutes)
        if (nextSec >= 90) {
          // On pinnacle pages, don't sleep - stay numerology
          if (pathname?.startsWith('/bieu-do-pinnacle')) {
            setExpression('numerology');
          } else {
            setExpression('sleepy');
          }
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
          // Don't change expression on pinnacle pages
          if (!pathname?.startsWith('/bieu-do-pinnacle')) {
            setExpression(chosen);
          }

          // Hold expression for 4 seconds then revert to idle
          setTimeout(() => {
            setExpression((curr) => {
              if (curr === 'sleepy') return 'sleepy';
              if (pathname?.startsWith('/bieu-do-pinnacle')) return 'numerology';
              return 'idle';
            });
          }, 4000);
        }

        // Situation 2: Coffee/Tea Break at 60s
        if (nextSec === 60) {
          if (!pathname?.startsWith('/bieu-do-pinnacle')) {
            setTooltipText("Làm ngụm trà sữa/cà phê cho tỉnh táo rồi khám phá tiếp nha!");
            setIsTooltipOpen(true);
            setExpression('coffee');

            setTimeout(() => {
              setIsTooltipOpen(false);
              setExpression((curr) => curr === 'sleepy' ? 'sleepy' : 'idle');
            }, 6000);
          }
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
    setIsWandering(false);

    if (gestureInProgressRef.current) {
      gestureInProgressRef.current = false;
      return;
    }

    // Click 10 times Reaction Logic
    const clickNow = Date.now();
    if (clickNow - lastClickTime < 5000) {
      const newClicks = rapidClicks + 1;
      setRapidClicks(newClicks);
      if (newClicks >= 10) {
        setExpression('excited');
        setTooltipText("🤣 Nhột quá, đừng chọc mình nữa!");
        setIsTooltipOpen(true);
        setRapidClicks(0);
        setTimeout(() => {
          setIsTooltipOpen(false);
          setExpression('idle');
        }, 3000);
        return;
      }
    } else {
      setRapidClicks(1);
    }
    setLastClickTime(clickNow);

    // If scrolled down and scroll-to-top option is ready, trigger rocket!
    if (showScrollTop) {
      triggerRocketLaunch();
      return;
    }

    // Clear any active click or wake timeouts when manually toggling
    if (clickTimeout) clearTimeout(clickTimeout);
    if (wakeTimeout) clearTimeout(wakeTimeout);

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

    // Distinguish between single click and double click
    if (clickTimerRef.current) {
      // --- DOUBLE CLICK ---
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;

      // Show hurt (bị đau) or annoyed (tức giận) expression first, and then open after a delay!
      const doubleClickMood = Math.random() > 0.5 ? 'hurt' : 'annoyed';
      setExpression(doubleClickMood);

      if (doubleClickMood === 'hurt') {
        setTooltipText("Úi da! Đau đầu quá đi mất!");
      } else {
        setTooltipText("Click gì mà nhanh và mạnh thế!");
      }
      setIsTooltipOpen(true);

      const t = setTimeout(() => {
        if (isOpen) {
          setIsOpen(false);
          setActiveView('room');
          setExpression('idle');
          setSecondsClosed(0);
        } else {
          setIsOpen(true);
          setActiveView('room');
          setExpression(getPageExpression());
        }
        setIsTooltipOpen(false);
      }, 1500);
      setClickTimeout(t);
      setHasInteracted(true);

    } else {
      // --- SINGLE CLICK (Wait 250ms for potential double click) ---
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;

        // Open immediately and show happy!
        if (isOpen) {
          setIsOpen(false);
          setActiveView('room');
          setExpression('idle');
          setSecondsClosed(0);
          setIsTooltipOpen(false);
        } else {
          setIsOpen(true);
          setActiveView('room');
          setExpression('happy'); // Vui vẻ và mở ngay lập tức
          setIsTooltipOpen(false);
        }
        setHasInteracted(true);
      }, 250);
    }
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
    
    // Check loading first (dizzy/thinking/vertigo/loading state)
    if (expression === 'thinking' || expression === 'dizzy' || expression === 'vertigo') return 'loading';
    
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

  const getActiveOutfit = () => {
    // 0. Page-specific outfit overrides
    if (pathname?.startsWith('/kham-pha')) {
      return 'discover';
    }
    if (pathname?.startsWith('/than-so-hoc-theo-ten')) {
      return 'numerology_name';
    }
    if (pathname?.startsWith('/than-so-hoc')) {
      return 'numerology_birthday';
    }
    if (pathname?.startsWith('/cung-hoang-dao')) {
      return 'zodiac_page';
    }

    // Register page: use the dynamic outfit set by register field events
    if (pathname === '/dang-ky' && registerOutfit) return registerOutfit;

    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentDate = now.getDate(); // 1-31

    const isBirthdayToday = (dobStr) => {
      if (!dobStr) return false;
      const parts = dobStr.split(/[\/\-]/);
      if (parts.length === 3) {
        let bDay, bMonth;
        if (parts[0].length === 4) { // YYYY-MM-DD
          bDay = parseInt(parts[2], 10);
          bMonth = parseInt(parts[1], 10);
        } else { // DD-MM-YYYY or DD/MM/YYYY
          bDay = parseInt(parts[0], 10);
          bMonth = parseInt(parts[1], 10);
        }
        return bDay === currentDate && bMonth === currentMonth;
      }
      return false;
    };

    // Test override
    if (typeof window !== 'undefined') {
      const testOutfit = localStorage.getItem('astro_test_outfit');
      if (testOutfit) return testOutfit;
    }

    // 1. User profile birthday
    if (isBirthdayToday(userBirthDate)) {
      return 'birthday';
    }

    // 2. Birthday from localStorage on zodiac/numerology pages
    const isOnZodiacOrNumerologyPage = 
      pathname?.startsWith('/than-so-hoc') || 
      pathname?.startsWith('/cung-hoang-dao');
    if (isOnZodiacOrNumerologyPage && isBirthdayToday(dobFromStorage)) {
      return 'birthday';
    }

    // 3. Noel (Dec 18 to Dec 27)
    if (currentMonth === 12 && currentDate >= 18 && currentDate <= 27) {
      return 'christmas';
    }

    // 4. Valentine (Feb 12 to Feb 16)
    if (currentMonth === 2 && currentDate >= 12 && currentDate <= 16) {
      return 'valentine';
    }

    // 5. Tết (Jan 15 to Feb 15 solar range approximation)
    if ((currentMonth === 1 && currentDate >= 15) || (currentMonth === 2 && currentDate <= 10)) {
      return 'tet';
    }

    // 7. Halloween (Oct 25 to Nov 1)
    if ((currentMonth === 10 && currentDate >= 25) || (currentMonth === 11 && currentDate === 1)) {
      return 'halloween';
    }

    // 8. Persistent wizard outfit (set when entering homepage, persists across session)
    if (typeof window !== 'undefined') {
      const sessionOutfit = sessionStorage.getItem('astro_session_outfit');
      if (sessionOutfit) return sessionOutfit;
    }

    return null;
  };

  // --- RENDER METHODS FOR ASTRO SPACE VIEWS ---

  const renderRoomView = (theme) => {
    return (
      <div className="flex flex-col gap-3">
        {/* Header: title left, Astro icon right */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-spin-slow" />
              Trợ lý ảo Astro
            </div>
            <p className="text-[12px] text-white font-semibold mt-0.5 leading-snug">
              {lastSpeechBubble || suggestion.greeting || "Hôm nay bạn muốn khám phá gì?"}
            </p>
          </div>

          {/* Astro AI Icon in corner */}
          <div className="relative shrink-0 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <CosmicAIIcon
                className="w-12 h-12 text-fuchsia-300 drop-shadow-[0_0_12px_rgba(217,70,239,0.8)]"
                expression={expression}
                numerologyNumber={nameNumerologyInfo?.number}
                zodiac={activeZodiac}
                outfit={getActiveOutfit()}
              />
            </motion.div>
          </div>
        </div>

        {/* Compact Mood Check */}
        <div className="flex items-center gap-2.5 bg-white/5 border border-white/5 rounded-xl px-3 py-2">
          <span className="text-[9px] text-slate-400 font-bold shrink-0 uppercase tracking-wide">Tâm trạng?</span>
          <div className="flex gap-1.5 flex-1 justify-end">
            {[
              { emoji: '😊', key: 'happy', reply: "Tuyệt vời! Cùng rút một lá bài Tarot xem niềm vui nhân đôi thế nào nhé! 🔮" },
              { emoji: '😔', key: 'sad', reply: "Đừng buồn nha, hãy rút lá bài Tarot chữa lành để vũ trụ ôm lấy bạn. ❤️" },
              { emoji: '😡', key: 'angry', reply: "Bình tĩnh lại nào, hít thở sâu và ghé qua trang Thần số học để tìm sự cân bằng nhé. 🧘" },
              { emoji: '😴', key: 'tired', reply: "Bạn mệt rồi đúng không? Nghỉ ngơi xíu đi, mình pha trà cho bạn nghe nhạc nha. 🍵" }
            ].map((m) => (
              <button
                key={m.key}
                onClick={() => {
                  setCurrentMood(m.key);
                  setExpression(m.key === 'happy' ? 'wink' : m.key === 'sad' ? 'shy' : m.key === 'angry' ? 'annoyed' : 'sleepy');
                  setLastSpeechBubble(m.reply);
                  localStorage.setItem('astro_mood_checked_' + new Date().toDateString(), 'true');
                }}
                className={`w-8 h-8 rounded-xl text-sm transition-all cursor-pointer active:scale-90 flex items-center justify-center ${
                  currentMood === m.key
                    ? 'bg-purple-600 border border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.4)] scale-110'
                    : 'bg-white/5 hover:bg-white/10 border border-white/5'
                }`}
              >
                {m.emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation rows (compact, thin outline circle, ChevronRight) */}
        <div className="flex flex-col gap-2 mt-1">
          {/* Dynamic suggestion rows - ONLY 3 suggestions */}
          {suggestion && suggestion.options && suggestion.options.slice(0, 3).map((opt, idx) => {
            const IconComponent = opt.icon || Sparkles;
            return (
              <Link
                key={idx}
                href={opt.href}
                onClick={handleOptionClick}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-purple-500/10 hover:border-purple-500/30 transition-all duration-300 w-full group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border border-current ${opt.color || "text-cyan-400 bg-cyan-500/10"} group-hover:scale-110 transition-transform shrink-0`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-white text-xs font-semibold tracking-wide text-left flex-1">
                    {opt.label}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-all shrink-0" />
              </Link>
            );
          })}

          {/* Message Astro Button (Locked when not logged in) */}
          {!user ? (
            <div className="relative group">
              <button 
                disabled
                className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/5 opacity-40 cursor-not-allowed transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center border border-current text-cyan-400 bg-cyan-500/10 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-white text-xs font-semibold tracking-wide text-left flex items-center gap-1.5">
                    Trò chuyện với Astro <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  </span>
                </div>
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-slate-900 border border-purple-500/30 rounded-lg px-2.5 py-1.5 text-[10px] text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg z-50">
                Đăng nhập để mở khóa tính năng chat!
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setActiveView('chat')}
              className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center border border-current text-cyan-400 bg-cyan-500/10 group-hover:scale-110 transition-transform shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <span className="text-white text-xs font-semibold tracking-wide text-left">
                  Trò chuyện với Astro
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          )}
        </div>

        {/* Footer: Thông điệp hôm nay (left corner) + Thu gọn (right corner) */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <button
            onClick={() => {
              setActiveView('gift');
              setExpression('wink');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-pink-500/10 to-rose-500/10 hover:from-pink-500/20 hover:to-rose-500/20 border border-pink-500/20 hover:border-pink-500/40 rounded-xl text-pink-300 font-bold text-[9px] transition-all cursor-pointer shadow-[0_0_10px_rgba(236,72,153,0.1)]"
          >
            <span>🔮</span> Thông điệp hôm nay
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-0.5 text-slate-500 hover:text-slate-300 text-[9px] uppercase tracking-widest font-bold transition-colors group cursor-pointer"
          >
            Thu gọn <ChevronDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    );
  };

  const renderGiftView = (theme) => {
    // This is now "Thông điệp hôm nay" (repurposed from the gift view)
    const handleRevealMessage = () => {
      setIsOpeningGift(true); // keeping isOpeningGift state internally so we don't have to redefine it
      setExpression('excited');

      setTimeout(() => {
        setIsOpeningGift(false);
        const messagesList = [
          "Lá bài Tarot may mắn của bạn hôm nay: The Sun ☀️ (Mọi dự định của bạn hôm nay đều sẽ thành công rực rỡ và tỏa sáng!)",
          "Thông điệp vũ trụ gửi bạn: Đừng vội vã. Những bông hoa đẹp nhất luôn cần thời gian để nở rộ. Hãy kiên trì! 🌠",
          "Lời khuyên ngày mới từ Astro: Hãy dành 5 phút hít thở sâu, uống một ly nước ấm để đánh thức mọi giác quan. 💧",
          "Lá bài Tarot may mắn của bạn hôm nay: The Star 🌟 (Niềm hy vọng lớn lao và năng lượng chữa lành đang vây quanh bạn.)",
          "Meme may mắn của Astro: Hãy cứ vui tươi và tự tin tiến lên, cả vũ trụ đang âm thầm dọn đường cho bạn! 🚀",
          "Thịnh vượng đang tìm đường đến với bạn. Hãy giữ một tâm trí cởi mở và đón nhận cơ hội mới. 💸",
          "Hãy nhớ rằng: Bạn độc nhất và có giá trị theo cách riêng của mình. Hãy tự hào về hành trình bạn đã qua! ❤️"
        ];
        const randomMsg = messagesList[Math.floor(Math.random() * messagesList.length)];
        
        const todayStr = new Date().toDateString();
        localStorage.setItem('astro_gift_claimed_' + todayStr, 'true');
        localStorage.setItem('astro_daily_reward', randomMsg);

        setGiftReward(randomMsg);
        setGiftClaimedToday(true);
        setExpression('party');
      }, 2000);
    };

    return (
      <div className="flex flex-col gap-3 min-h-[280px] text-center">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-1">
          <button 
            onClick={() => {
              setActiveView('room');
              setExpression('idle');
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-[10px] uppercase font-bold tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Trở lại
          </button>
          <div className="text-[10px] font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1">
            🔮 Thông điệp vũ trụ
          </div>
        </div>

        {giftClaimedToday ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-4 bg-pink-950/20 border border-pink-500/20 rounded-2xl relative overflow-hidden min-h-[170px]">
            <div className="text-[36px] animate-bounce">🔮</div>
            <div className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">
              Thông điệp dành cho bạn hôm nay:
            </div>
            <p className="text-[11px] text-white leading-relaxed font-semibold italic bg-black/30 p-3 rounded-xl border border-white/5">
              {giftReward || localStorage.getItem('astro_daily_reward') || "Chúc bạn một ngày tràn đầy năng lượng tích cực! 🌌"}
            </p>
            <p className="text-[9px] text-slate-400">
              Chúc bạn một ngày tràn đầy năng lượng tích cực và may mắn! 🌌
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4 bg-slate-950/40 border border-white/5 rounded-2xl min-h-[170px]">
            {isOpeningGift ? (
              <div className="flex flex-col items-center gap-2">
                <div className="text-[44px] animate-pulse">🔮</div>
                <p className="text-[11px] text-pink-300 font-bold tracking-wider animate-pulse">
                  Astro đang giải mã thông điệp...
                </p>
              </div>
            ) : (
              <>
                <div className="text-[44px] hover:scale-110 transition-transform cursor-pointer animate-bounce">
                  🔮
                </div>
                <div>
                  <h5 className="text-white text-xs font-bold">Thông điệp vũ trụ hôm nay</h5>
                  <p className="text-slate-400 text-[10px] mt-1 px-4 leading-normal">
                    Nhận thông điệp ý nghĩa từ vũ trụ gửi đến riêng bạn trong ngày hôm nay!
                  </p>
                </div>
                <button
                  onClick={handleRevealMessage}
                  className="py-2 px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold text-[11px] rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all cursor-pointer active:scale-95"
                >
                  Xem Thông Điệp
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderChatView = (theme) => {
    return (
      <div className="flex flex-col h-[280px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <button 
            onClick={() => {
              setActiveView('room');
              setExpression('idle');
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-[10px] uppercase font-bold tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Trở lại
          </button>
          <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            Astro Chat
          </div>
        </div>

        {/* Messages Box */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1.5 custom-scrollbar text-[11px]">
          {chatMessages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`p-2.5 rounded-2xl max-w-[85%] text-left leading-relaxed ${
                msg.sender === 'astro' 
                  ? 'self-start bg-white/5 border border-white/5 text-slate-200 rounded-tl-none' 
                  : 'self-end bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/20 text-white rounded-tr-none'
              }`}
            >
              <div>{msg.text}</div>
              
              {/* Render Tarot Card info if present */}
              {msg.card && (
                <div className="mt-2.5 p-2 bg-slate-950/80 border border-purple-500/30 rounded-xl flex flex-col items-center gap-2 text-center shadow-[0_0_15px_rgba(168,85,247,0.15)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-transparent to-transparent pointer-events-none" />
                  
                  {msg.card.image_url ? (
                    <img 
                      src={msg.card.image_url} 
                      alt={msg.card.name} 
                      className={`w-20 h-32 rounded-lg border border-purple-500/20 shadow-md transition-transform duration-500 group-hover:scale-105 ${msg.card.orientation === 'reversed' ? 'rotate-180' : ''}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="w-20 h-32 rounded-lg border border-purple-500/20 bg-slate-900 flex-col items-center justify-center shadow-md hidden">
                    <TarotIcon className="w-10 h-10 text-purple-400/60" />
                  </div>

                  <div>
                    <h5 className="font-bold text-white text-[12px]">{msg.card.name}</h5>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        msg.card.orientation === 'upright' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {msg.card.orientation === 'upright' ? 'Chiều xuôi' : 'Chiều ngược'}
                      </span>
                    </div>
                    <p className="text-[10px] text-purple-300 font-medium italic mt-1.5 leading-snug px-1 border-t border-white/5 pt-1.5">
                      "{msg.card.short_meaning}"
                    </p>
                  </div>
                </div>
              )}

              {/* Render Numerology info if present */}
              {msg.numerology && (
                <div className="mt-2.5 p-3 bg-slate-950/80 border border-cyan-500/30 rounded-xl flex flex-col gap-2 shadow-[0_0_15px_rgba(34,211,238,0.15)] relative overflow-hidden text-left">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/10 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-950/60 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.4)] text-[16px] font-black text-cyan-400 shrink-0">
                      {msg.numerology.number}
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-[12px]">{msg.numerology.title}</h5>
                      <span className="text-[9px] text-slate-400">Số chủ đạo của bạn</span>
                    </div>
                  </div>

                  {msg.numerology.keywords && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {msg.numerology.keywords.map((kw, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded-md bg-cyan-950/40 text-cyan-300 border border-cyan-500/20 text-[9px] font-semibold">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-1 text-[10px] text-slate-300 leading-normal border-t border-white/5 pt-2 flex flex-col gap-1.5">
                    <div>
                      <span className="font-bold text-cyan-400">Lời khuyên: </span>
                      {msg.numerology.advice}
                    </div>
                    <Link 
                      href={`/than-so-hoc/${msg.numerology.number}`}
                      onClick={() => setIsOpen(false)}
                      className="self-end text-[9px] text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5 mt-1 hover:underline cursor-pointer"
                    >
                      Xem chi tiết Thần số học <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
          {isChatLoading && (
            <div className="self-start bg-white/5 border border-white/5 text-slate-400 rounded-2xl rounded-tl-none p-2.5 max-w-[85%] text-left flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
              Astro đang suy nghĩ...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Buttons */}
        <div className="flex gap-1.5 mt-2.5 pt-2.5 border-t border-white/10 shrink-0">
          <button 
            onClick={handleDrawTarotDirectly}
            disabled={isChatLoading}
            className="flex-1 py-1.5 px-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded-xl text-[9px] sm:text-[10px] text-purple-300 font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            🔮 Rút Tarot hôm nay
          </button>
          <button 
            onClick={() => {
              setChatMessages(prev => [...prev, { 
                sender: 'astro', 
                text: 'Hãy nhập ngày sinh của bạn theo định dạng ngày/tháng/năm nha (Ví dụ: 05/09/1997) để mình tính số chủ đạo nhé!' 
              }]);
              setIsWaitingForDob(true);
            }}
            disabled={isChatLoading}
            className="flex-1 py-1.5 px-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl text-[9px] sm:text-[10px] text-cyan-300 font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            🔢 Số chủ đạo
          </button>
        </div>

        {/* Input Box */}
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5 shrink-0">
          <input 
            type="text" 
            value={chatInput} 
            onChange={(e) => {
              const val = e.target.value;
              setChatInput(val);
              if (chatMessages.length > 20 || val.length > 50) {
                setExpression(Math.random() > 0.5 ? 'dizzy' : 'hurt');
              } else if (val.length > 0) {
                setExpression('reading_news');
              } else {
                setExpression('idle');
              }
            }} 
            onBlur={() => {
              if (!isChatLoading) setExpression('idle');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Hỏi Astro điều gì đó..." 
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-purple-500/40"
          />
          <button 
            onClick={handleSendMessage}
            disabled={isChatLoading || !chatInput.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white p-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

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
          : isWandering
            ? { x: wanderingCoordinates.x, y: wanderingCoordinates.y, scale: 1.1 }
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
          : isWandering
            ? { duration: 6, ease: "easeInOut" }
            : { duration: 0.3 }
      }
      className={`fixed bottom-6 ${isOnLeft ? 'left-6 sm:left-8' : 'right-6 sm:right-8'} z-[999] select-none transition-all duration-300 ${hideAll ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'}`}
    >
      <div className={`relative flex flex-col ${isOnLeft ? 'items-start' : 'items-end'}`}>
        
        {/* Type 1: Dialogue Bubble Menu (Opens manually on click) */}
        <AnimatePresence>
          {isOpen && (() => {
            const theme = getPopupTheme();
            return (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className={`absolute bottom-[115%] ${isOnLeft ? 'left-0' : 'right-0'} mb-4 w-[280px] sm:w-[320px] ${theme.cardBg} rounded-3xl p-5 backdrop-blur-xl pointer-events-auto`}
              >
                <div className={`absolute inset-0 bg-gradient-to-tr ${theme.gradient} rounded-3xl pointer-events-none`} />
                <div className={`absolute -bottom-2 ${isOnLeft ? 'left-8 border-b border-l' : 'right-8 border-b border-r'} w-4 h-4 ${theme.pointerBg} transform ${isOnLeft ? '-rotate-45' : 'rotate-45'} pointer-events-none`} />

              <div className="relative z-10 flex flex-col gap-3">
                {activeView === 'room' && renderRoomView(theme)}
                {activeView === 'chat' && renderChatView(theme)}
                {activeView === 'gift' && renderGiftView(theme)}
                {activeView === 'wheel' && renderWheelView(theme)}
                {activeView === 'diary' && renderDiaryView(theme)}
                {activeView === 'backpack' && renderBackpackView(theme)}
              </div>
            </motion.div>
            );
          })()}
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
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.8}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            rocketStartYRef.current = e.clientY;
            rocketStartXRef.current = e.clientX;
            gestureInProgressRef.current = false;
            rocketHoldTimerRef.current = setTimeout(() => {
              setIsRocketReady(true);
              setExpression('rocket'); // Hint to the user that rocket is ready
            }, 600);
          }}
          onPointerMove={(e) => {
            if (isRocketReady) {
              if (rocketStartYRef.current - e.clientY > 30) {
                // Swiped up after holding 3s
                gestureInProgressRef.current = true;
                setIsRocketReady(false);
                if (rocketHoldTimerRef.current) clearTimeout(rocketHoldTimerRef.current);
                e.currentTarget.releasePointerCapture(e.pointerId);
                triggerRocketLaunch();
              }
            } else if (rocketHoldTimerRef.current) {
              // Cancel if they move too much before 3s (either vertically or horizontally)
              if (
                Math.abs(rocketStartYRef.current - e.clientY) > 15 ||
                Math.abs(rocketStartXRef.current - e.clientX) > 15
              ) {
                clearTimeout(rocketHoldTimerRef.current);
              }
            }
          }}
          onPointerUp={(e) => {
            try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(err){}
            if (rocketHoldTimerRef.current) clearTimeout(rocketHoldTimerRef.current);
            if (isRocketReady) {
              setIsRocketReady(false);
              setExpression(getPageExpression()); // Revert if didn't swipe
              gestureInProgressRef.current = true; // Prevent click from firing since they held 3s
            }
          }}
          onPointerCancel={(e) => {
            try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(err){}
            if (rocketHoldTimerRef.current) clearTimeout(rocketHoldTimerRef.current);
            if (isRocketReady) {
              setIsRocketReady(false);
              setExpression(getPageExpression());
            }
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          animate={
            isLaunching 
              ? { y: -800, scale: 0.5, opacity: 0 } 
              : expression === 'vortex'
                ? { rotate: 360, scale: [0.8, 1.15, 1], opacity: 1, y: 0 }
                : { y: 0, scale: 1, opacity: 1, rotate: 0 }
          }
          transition={
            isLaunching 
              ? { duration: 1.2, ease: "easeIn" } 
              : expression === 'vortex'
                ? { duration: 1.5, ease: "easeInOut" }
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
              numerologyNumber={
                pathname?.startsWith('/bieu-do-pinnacle') 
                  ? pathname.split('/').pop()
                  : nameNumerologyInfo?.number
              }
              zodiac={activeZodiac}
              outfit={getActiveOutfit()}
            />
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
}
