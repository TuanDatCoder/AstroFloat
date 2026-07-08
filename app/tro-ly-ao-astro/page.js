'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CosmicAIIcon from '@/components/CosmicAIIcon';
import { Sparkles, Wand2, Star, Zap, Lock, Heart, Send, MessageCircle } from 'lucide-react';
import { supabase } from '@/services/supabase';
import Link from 'next/link';
import CosmicEnergyPopup from '@/components/CosmicEnergyPopup';

const OUTFITS = [
  { id: null,        label: 'Mặc định',      color: 'from-slate-600 to-slate-700',    border: 'border-slate-500/40',   dot: 'bg-slate-400',    desc: 'Phong cách gốc của Astro — thanh lịch và hiện đại.', premium: false },
  { id: 'birthday',  label: 'Sinh Nhật 🎂',  color: 'from-pink-600 to-rose-600',      border: 'border-pink-500/40',    dot: 'bg-pink-400',     desc: 'Mũ bánh kem lấp lánh! Astro đang sẵn sàng ăn mừng cùng bạn.', premium: true },
  { id: 'costume',   label: 'Siêu Anh Hùng', color: 'from-violet-600 to-purple-700',  border: 'border-violet-500/40',  dot: 'bg-violet-400',   desc: 'Áo choàng hero tím với ngôi sao vàng — Astro bảo vệ vũ trụ!', premium: true },
  { id: 'galaxy',    label: 'Thiên Văn ✨',   color: 'from-sky-600 to-blue-700',       border: 'border-sky-500/40',     dot: 'bg-sky-400',      desc: 'Áo choàng Galaxy và bản đồ sao — nhà thám hiểm thiên hà.', premium: true },
  { id: 'wizard',    label: 'Pháp Sư 🧙',    color: 'from-blue-600 to-indigo-700',    border: 'border-blue-500/40',    dot: 'bg-blue-400',     desc: 'Mũ chóp & áo choàng pháp sư huyền bí đồng hành tarot.', premium: true }
];

const EXPRESSIONS = [
  { id: 'happy',       label: 'Vui vẻ',       icon: '😊', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  { id: 'excited',     label: 'Phấn khích',   icon: '🤩', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  { id: 'love',        label: 'Tình yêu',     icon: '💕', color: 'text-rose-400',   bg: 'bg-rose-500/10 border-rose-500/30'   },
  { id: 'blushing',    label: 'Thẹn thùng',   icon: '🥰', color: 'text-pink-400',   bg: 'bg-pink-500/10 border-pink-500/30'   },
  { id: 'wink',        label: 'Nháy mắt',     icon: '😉', color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/30'   },
  { id: 'dancing',     label: 'Nhảy múa',     icon: '💃', color: 'text-fuchsia-400',bg: 'bg-fuchsia-500/10 border-fuchsia-500/30' },
  { id: 'singing',     label: 'Ca hát',       icon: '🎤', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  { id: 'coffee',      label: 'Cà phê',       icon: '☕', color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/30' },
  { id: 'reading',     label: 'Đọc sách',     icon: '📖', color: 'text-emerald-400',bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { id: 'writing',     label: 'Viết lách',    icon: '✍️', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
  { id: 'searching',   label: 'Tìm kiếm',     icon: '🔍', color: 'text-sky-400',    bg: 'bg-sky-500/10 border-sky-500/30'     },
  { id: 'thinking',    label: 'Suy nghĩ',     icon: '🤔', color: 'text-slate-400',  bg: 'bg-slate-500/10 border-slate-500/30' },
  { id: 'vertigo',     label: 'Chóng mặt',    icon: '🌀', color: 'text-cyan-300',   bg: 'bg-cyan-500/10 border-cyan-500/30'   },
  { id: 'dizzy',       label: 'Ống nhòm',     icon: '🔭', color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30'   },
  { id: 'shocked',     label: 'Kinh ngạc',    icon: '😱', color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/30'     },
  { id: 'sleepy',      label: 'Buồn ngủ',     icon: '😴', color: 'text-indigo-300', bg: 'bg-indigo-500/10 border-indigo-500/30' },
  { id: 'rocket',      label: 'Tên lửa',      icon: '🚀', color: 'text-orange-300', bg: 'bg-orange-500/10 border-orange-500/30' },
  { id: 'numerology',  label: 'Thần số học',  icon: '🔢', color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/30' },
  { id: 'crown',       label: 'Vương miện',   icon: '👑', color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/30' },
  { id: 'wizard',      label: 'Pháp sư',      icon: '🧙', color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/30'   },
  { id: 'witch',       label: 'Phù thủy',     icon: '🧹', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30'},
  { id: 'driving',     label: 'Lái xe',       icon: '🚗', color: 'text-lime-400',   bg: 'bg-lime-500/10 border-lime-500/30'   },
  { id: 'basketball',  label: 'Bóng rổ',      icon: '🏀', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30'},
  { id: 'soccer',      label: 'Bóng đá',      icon: '⚽', color: 'text-green-400',  bg: 'bg-green-500/10 border-green-500/30' },
  { id: 'hurt',        label: 'Đau đớn',      icon: '🤕', color: 'text-red-300',    bg: 'bg-red-500/10 border-red-500/30'     },
  { id: 'annoyed',     label: 'Khó chịu',     icon: '😤', color: 'text-orange-300', bg: 'bg-orange-500/10 border-orange-500/30'},
  { id: 'shy',         label: 'Ngại ngùng',   icon: '🙈', color: 'text-pink-300',   bg: 'bg-pink-500/10 border-pink-500/30'   },
];

const FUN_FACTS = [
  'Astro được tạo ra để đồng hành cùng hành trình khám phá vũ trụ của bạn!',
  'Astro có hơn 26 biểu cảm khác nhau — mỗi trạng thái là một tính cách riêng.',
  'Chiếc vòng quỹ đạo quanh Astro tượng trưng cho sự kết nối giữa bạn và vũ trụ.',
  'Astro sẽ buồn ngủ nếu bạn để trang yên quá 90 giây!',
  'Khi bạn click nhanh 10 lần vào Astro — có easter egg đấy!',
  'Astro đội mũ sinh nhật vào đúng ngày sinh của bạn.',
  'Anten trên đầu Astro thu nhận tín hiệu năng lượng từ vũ trụ.',
];

const POKE_REACTIONS = [
  { text: "Ui da! Bạn chọc nhột Astro quá! 😆", expression: "excited" },
  { text: "Nè nè, đừng chạm vào chiếc ăng-ten siêu bắt sóng của mình chứ! 📡", expression: "annoyed" },
  { text: "Hihi! Bạn vuốt má mình thích thế! 🥰", expression: "blushing" },
  { text: "Bạn vừa chạm vào lõi năng lượng vũ trụ của mình đấy! ❤️", expression: "love" },
  { text: "Chạm mạnh nữa là mình phóng bay lên vũ trụ luôn á! 🚀", expression: "rocket" },
];

const DRAG_START_MESSAGES = [
  "Oái! Bạn kéo mình đi đâu thế? 🤪",
  "Aaaa! Bồng bềnh giữa không trung thích quá! ☁️",
  "Vui quá! Bay cao cùng Astro nào! ✨",
  "Ối! Giữ thăng bằng cho mình với! 🌀"
];

const QUICK_QUESTIONS = [
  { q: 'Astro từ đâu đến?', a: 'Mình sinh ra từ lõi năng lượng của dải ngân hà, đi chu du khắp nơi để giải mã các vì sao! ✨', expr: 'excited' },
  { q: 'Hôm nay thế nào?', a: 'Mình đang tràn đầy năng lượng và rất vui vì được gặp bạn hôm nay! 🥰', expr: 'blushing' },
  { q: 'Bói bài Tarot?', a: 'Biết chứ! Trải bài Tarot hay Thần số học mình đều thạo cả. Mời bạn khám phá! 🔮', expr: 'wizard' },
  { q: 'Hù! Bắt bạn nè!', a: 'Oái! Làm mình giật cả mình! Bạn đừng nghịch thế chứ! 😱', expr: 'shocked' },
  { q: 'Biết nhảy không?', a: 'Chuyện nhỏ! Cùng hòa theo nhịp điệu vũ trụ nào! La la la~ 💃', expr: 'dancing' },
];

export default function AstroPlaygroundPage() {
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [selectedExpression, setSelectedExpression] = useState('happy');
  const [previewScale, setPreviewScale] = useState(1);
  const [factIndex, setFactIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bubbleText, setBubbleText] = useState("Chào bạn! Hãy chạm, kéo hoặc gãi má để chơi đùa cùng mình nhé! ✨");
  const [isDragging, setIsDragging] = useState(false);
  const [reactionActive, setReactionActive] = useState(false);
  
  // New features state
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isEnergyPopupOpen, setIsEnergyPopupOpen] = useState(false);

  const factIntervalRef = useRef(null);
  const reactionTimeoutRef = useRef(null);

  // Authenticate status check
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fun Fact auto ticker
  useEffect(() => {
    factIntervalRef.current = setInterval(() => {
      setFactIndex(i => (i + 1) % FUN_FACTS.length);
    }, 4000);
    return () => clearInterval(factIntervalRef.current);
  }, []);

  const handleExpressionClick = (exprId) => {
    if (reactionActive && !isTyping) return;
    setSelectedExpression(exprId);
    setPreviewScale(1.08);
    setTimeout(() => setPreviewScale(1), 250);
  };

  const handleSurprise = () => {
    if (reactionActive || isTyping) return;
    const randomExpr = EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)];
    setSelectedExpression(randomExpr.id);
    setPreviewScale(1.12);
    setTimeout(() => setPreviewScale(1), 300);

    // If logged in, randomize outfit too
    if (isLoggedIn) {
      const randomOutfit = OUTFITS[Math.floor(Math.random() * OUTFITS.length)];
      setSelectedOutfit(randomOutfit.id);
    }
  };

  // 1. Drag & Drop Interactions
  const handleDragStart = () => {
    if (isTyping) return;
    setIsDragging(true);
    setReactionActive(true);
    setSelectedExpression('excited');
    const msg = DRAG_START_MESSAGES[Math.floor(Math.random() * DRAG_START_MESSAGES.length)];
    setBubbleText(msg);
  };

  const handleDragEnd = () => {
    if (isTyping) return;
    setIsDragging(false);
    setReactionActive(false);
    setSelectedExpression('wink');
    setBubbleText("Thả ra là mình tự động bật ngược trở lại vị trí ngay nè! 💫");
    setTimeout(() => {
      if (!reactionActive && !isTyping) setSelectedExpression('happy');
    }, 1500);
  };

  // 2. Poke & Pet (Chạm/Sờ) Interactions
  const handleAstroPoke = () => {
    if (isDragging || isTyping) return;
    setReactionActive(true);
    if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);

    const reaction = POKE_REACTIONS[Math.floor(Math.random() * POKE_REACTIONS.length)];
    setSelectedExpression(reaction.expression);
    setBubbleText(reaction.text);
    setPreviewScale(1.15);
    setTimeout(() => setPreviewScale(1), 200);

    reactionTimeoutRef.current = setTimeout(() => {
      if (!isTyping) {
        setSelectedExpression('happy');
        setBubbleText("Vui ghê! Hãy tiếp tục tương tác với mình nhé! 🥰");
        setReactionActive(false);
      }
    }, 2000);
  };

  const handleQuestionClick = (qa) => {
    if (reactionActive || isTyping) return;
    if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
    
    setSelectedExpression(qa.expr);
    setBubbleText(qa.a);
    setPreviewScale(1.05);
    setTimeout(() => setPreviewScale(1), 250);
  };

  // 3. Chat Interaction
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;
    
    const userMsg = chatInput.trim();
    setChatInput('');
    setIsTyping(true);
    setReactionActive(true);
    setBubbleText("...");
    setSelectedExpression('thinking');
    if (reactionTimeoutRef.current) clearTimeout(reactionTimeoutRef.current);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({ messages: [{ sender: 'user', text: userMsg }] })
      });

      if (res.status === 429) {
        // Hết năng lượng
        setIsTyping(false);
        setReactionActive(true);
        setSelectedExpression('shocked');
        setBubbleText("Linh lực vũ trụ của mình đang cạn kiệt rồi... 🔮");
        setIsEnergyPopupOpen(true);
        return;
      }

      const data = await res.json();
      setIsTyping(false);

      if (data.success) {
        setSelectedExpression('excited');
        setBubbleText(data.text);
        
        // Phát sự kiện cập nhật năng lượng trên Header
        window.dispatchEvent(new CustomEvent('astro:energy-update', { 
          detail: { energy: data.energy, maxEnergy: data.max_energy } 
        }));
      } else {
        throw new Error(data.error || 'Lỗi xử lý tin nhắn');
      }

      reactionTimeoutRef.current = setTimeout(() => {
        if (!isTyping) setReactionActive(false);
      }, 5000);

    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setSelectedExpression('shocked');
      setBubbleText("Có chút đứt gãy kết nối với vũ trụ rồi. Hãy thử lại sau nhé! 📡");
      setReactionActive(false);
    }
  };

  const currentOutfit = OUTFITS.find(o => o.id === selectedOutfit) || OUTFITS[0];
  const currentExpression = EXPRESSIONS.find(e => e.id === selectedExpression) || EXPRESSIONS[0];

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 relative overflow-hidden bg-slate-950">
      {/* Animated Cosmic Background */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: 'opacity', background: 'radial-gradient(circle, rgba(147,51,234,0.15) 0%, rgba(147,51,234,0) 70%)' }}
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full" 
        />
        <motion.div 
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          style={{ willChange: 'opacity', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(6,182,212,0) 70%)' }}
          className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] translate-x-1/2 translate-y-1/2 rounded-full" 
        />
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ willChange: 'opacity', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(99,102,241,0) 70%)' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full" 
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-purple-200 text-xs font-bold tracking-widest uppercase mb-5 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Tương tác Vũ trụ AI
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-400 mb-4 drop-shadow-sm">
            Sân Chơi Astro
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed font-medium">
            Chạm, chọc nhột, kéo thả hoặc trò chuyện với Trợ lý vũ trụ đáng yêu của bạn!
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
          {/* ─── LEFT: Interactive Preview Card ─── */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="sticky top-24 space-y-5">
            
            {/* Glassmorphism Astro Card */}
            <div className="relative bg-slate-900/80 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden transform-gpu">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 opacity-50" />

              {/* Chat Bubble above Astro */}
              <div className="relative min-h-[70px] mb-8 bg-slate-900/80 border border-purple-500/30 rounded-2xl p-4 text-center text-sm text-purple-100 font-medium leading-relaxed shadow-lg flex items-center justify-center transform-gpu">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={bubbleText}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="block"
                  >
                    {isTyping ? (
                      <span className="flex items-center gap-1.5 text-purple-400">
                        Astro đang gõ <span className="flex gap-0.5"><span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'0ms'}}/><span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'150ms'}}/><span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay:'300ms'}}/></span>
                      </span>
                    ) : bubbleText}
                  </motion.span>
                </AnimatePresence>
                <div className="absolute bottom-[-7px] left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 bg-slate-900 border-r border-b border-purple-500/30 rotate-45 z-10" />
              </div>

              {/* Astro Display - Draggable & Clickable */}
              <div className="flex justify-center mb-8 relative z-20">
                <motion.div 
                  drag 
                  dragConstraints={{ left: -70, right: 70, top: -70, bottom: 70 }}
                  dragElastic={0.25}
                  dragTransition={{ bounceStiffness: 500, bounceDamping: 18 }}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onClick={handleAstroPoke}
                  animate={{ scale: previewScale }} 
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }} 
                  className="relative cursor-grab active:cursor-grabbing group"
                >
                  {/* Outer glow ring on hover */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 blur-xl scale-[1.3] group-hover:scale-[1.5] opacity-50 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative w-48 h-48 drop-shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <CosmicAIIcon expression={selectedExpression} outfit={selectedOutfit} className="w-full h-full" />
                  </div>
                </motion.div>
              </div>

              {/* State labels */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2.5 mb-1.5 bg-white/5 w-max mx-auto px-4 py-1.5 rounded-full border border-white/5">
                  <span className="text-2xl drop-shadow-sm">{currentExpression.icon}</span>
                  <span className={`text-sm font-black ${currentExpression.color}`}>{currentExpression.label}</span>
                </div>
                <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                  Trang phục: <span className="text-cyan-300">{currentOutfit.label}</span>
                </div>
              </div>

              {/* Surprise button */}
              <button
                onClick={handleSurprise}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-2xl font-black text-white text-sm tracking-[0.15em] uppercase transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-white/10"
              >
                <Wand2 className="w-4 h-4" />
                Bất ngờ vũ trụ!
              </button>
            </div>

            {/* Fun fact ticker */}
            <div className="bg-slate-900/90 border border-white/10 rounded-2xl px-5 py-4 shadow-md relative overflow-hidden group transform-gpu">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-purple-500" />
              <div className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-700" /> Bạn có biết?
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={factIndex}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="text-xs text-gray-300 leading-relaxed font-medium"
                >
                  {FUN_FACTS[factIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ─── RIGHT: Controls & Chat ─── */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="space-y-6">
            
            {/* Chat Input Section */}
            <div className="bg-slate-900/90 border border-white/10 rounded-[2rem] p-6 shadow-lg relative overflow-hidden transform-gpu">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-40" />
              <h2 className="text-[11px] font-black text-white/70 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-cyan-400" /> Trò chuyện cùng Astro
              </h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {QUICK_QUESTIONS.map((qa, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleQuestionClick(qa)}
                    className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 text-cyan-100 text-[11px] font-medium rounded-full transition-all active:scale-95 shadow-sm whitespace-nowrap"
                  >
                    {qa.q}
                  </button>
                ))}
              </div>

              {isLoggedIn ? (
                <form onSubmit={handleChatSubmit} className="relative mt-2 flex items-center">
                  <input 
                    type="text" 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Hỏi Astro điều gì đó..."
                    disabled={isTyping}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-full py-3.5 pl-5 pr-14 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50"
                  />
                  <button 
                    type="submit"
                    disabled={!chatInput.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>
              ) : (
                <div className="mt-2 w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 px-5 text-sm flex items-center justify-between">
                  <span className="text-gray-400">Đăng nhập để trò chuyện...</span>
                  <Link href="/dang-nhap" className="text-cyan-400 font-bold hover:underline flex items-center gap-1 text-[11px] uppercase tracking-wide">
                    <Lock className="w-3 h-3" /> Đăng nhập
                  </Link>
                </div>
              )}
            </div>

            {/* Outfit picker */}
            <div className="bg-slate-900/90 border border-white/10 rounded-[2rem] p-6 shadow-lg transform-gpu">
              <div className="mb-5 flex justify-between items-center">
                <h2 className="text-[11px] font-black text-white/70 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" /> Tủ Đồ Trang Phục
                </h2>
                {!isLoggedIn && (
                  <Link href="/dang-nhap" className="text-[10px] text-amber-400 font-bold uppercase tracking-wide hover:underline flex items-center gap-1 bg-amber-500/10 px-2 py-1 rounded-md">
                    <Lock className="w-3 h-3" /> Mở khóa ngay
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {OUTFITS.map((outfit) => {
                  const isLocked = outfit.premium && !isLoggedIn;
                  return (
                    <div key={String(outfit.id)} className="relative group">
                      <motion.button
                        whileHover={isLocked ? {} : { scale: 1.05, y: -2 }}
                        whileTap={isLocked ? {} : { scale: 0.95 }}
                        onClick={() => { if (!isLocked) setSelectedOutfit(outfit.id); }}
                        disabled={isLocked}
                        className={`relative w-full flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all text-center h-full ${
                          isLocked 
                            ? 'bg-slate-900/50 border-white/5 opacity-50 cursor-not-allowed grayscale'
                            : selectedOutfit === outfit.id
                              ? `bg-gradient-to-b ${outfit.color} border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)] ring-1 ring-white/20`
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        {selectedOutfit === outfit.id && !isLocked && (
                          <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${outfit.dot} shadow-[0_0_8px_currentColor]`} />
                        )}
                        <div className="w-12 h-12 relative flex items-center justify-center">
                          <CosmicAIIcon expression="happy" outfit={outfit.id} className="w-full h-full" />
                          {isLocked && (
                            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                              <Lock className="w-4 h-4 text-amber-400" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider leading-tight line-clamp-2 mt-auto">
                          {outfit.label}
                        </span>
                      </motion.button>
                      
                      {isLocked && (
                        <div className="pointer-events-none absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-slate-900 border border-amber-500/30 text-[10px] text-amber-100 p-2.5 rounded-xl text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-xl z-50">
                          Đăng nhập để khám phá phong cách này!
                          <div className="mt-1.5">
                            <span className="text-cyan-400 font-bold">ĐĂNG NHẬP NGAY →</span>
                          </div>
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-b border-r border-amber-500/30 rotate-45" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Expression picker */}
            <div className="bg-slate-900/90 border border-white/10 rounded-[2rem] p-6 shadow-lg transform-gpu">
              <h2 className="text-[11px] font-black text-white/70 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" /> Bảng Biểu Cảm Xúc
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-2.5">
                {EXPRESSIONS.map((expr) => (
                  <motion.button
                    key={expr.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleExpressionClick(expr.id)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
                      selectedExpression === expr.id
                        ? `${expr.bg} shadow-[0_4px_15px_rgba(0,0,0,0.2)] ring-1 ring-white/10 scale-105`
                        : 'bg-slate-900/40 border-white/5 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl leading-none filter drop-shadow-sm">{expr.icon}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wide leading-tight ${
                      selectedExpression === expr.id ? expr.color : 'text-gray-400'
                    }`}>
                      {expr.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tips & Interactive Instructions */}
            <div className="bg-gradient-to-br from-purple-900/40 to-cyan-900/40 border border-purple-500/20 rounded-2xl p-5 shadow-inner transform-gpu">
              <h3 className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-yellow-400" /> Bí Kíp Chơi Đùa Cùng Astro
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '🖱️', text: 'Giữ chuột vào Astro và kéo để nhấc bổng lơ lửng.' },
                  { icon: '👆', text: 'Click trực tiếp vào Astro để xem phản ứng bất ngờ!' },
                  { icon: '💬', text: 'Nhập tin nhắn vào ô trò chuyện để giao tiếp với Astro.' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-gray-300 text-xs leading-relaxed font-medium">
                    <span className="text-base shrink-0 drop-shadow-sm">{tip.icon}</span>
                    <span>{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
      <CosmicEnergyPopup 
        isOpen={isEnergyPopupOpen} 
        onClose={() => setIsEnergyPopupOpen(false)}
        onClaimSuccess={(newEnergy, newMaxEnergy) => {
          // Khi nhận quà thành công, cập nhật giao diện
          window.dispatchEvent(new CustomEvent('astro:energy-update', { 
            detail: { energy: newEnergy, maxEnergy: newMaxEnergy } 
          }));
          setBubbleText("Tuyệt vời! Dòng chảy năng lượng của mình đã hồi phục một phần! 🥰");
          setSelectedExpression('happy');
        }}
      />
    </main>
  );
}
