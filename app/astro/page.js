'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CosmicAIIcon from '@/components/CosmicAIIcon';
import { Sparkles, Wand2, Star, Zap } from 'lucide-react';

const OUTFITS = [
  { id: null,        label: 'Mặc định',      color: 'from-slate-600 to-slate-700',    border: 'border-slate-500/40',   dot: 'bg-slate-400',    desc: 'Phong cách gốc của Astro — thanh lịch và hiện đại.' },
  { id: 'birthday',  label: 'Sinh Nhật 🎂',  color: 'from-pink-600 to-rose-600',      border: 'border-pink-500/40',    dot: 'bg-pink-400',     desc: 'Mũ bánh kem lấp lánh! Astro đang sẵn sàng ăn mừng cùng bạn.' },
  { id: 'costume',   label: 'Siêu Anh Hùng', color: 'from-violet-600 to-purple-700',  border: 'border-violet-500/40',  dot: 'bg-violet-400',   desc: 'Áo choàng hero tím với ngôi sao vàng — Astro bảo vệ vũ trụ!' },
  { id: 'galaxy',    label: 'Thiên Văn ✨',   color: 'from-sky-600 to-blue-700',       border: 'border-sky-500/40',     dot: 'bg-sky-400',      desc: 'Áo choàng Galaxy và bản đồ sao — nhà thám hiểm thiên hà.' },
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

export default function AstroPage() {
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [selectedExpression, setSelectedExpression] = useState('happy');
  const [previewScale, setPreviewScale] = useState(1);
  const [factIndex, setFactIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setFactIndex(i => (i + 1) % FUN_FACTS.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const handleExpressionClick = (exprId) => {
    setSelectedExpression(exprId);
    setPreviewScale(1.08);
    setTimeout(() => setPreviewScale(1), 350);
  };

  const handleSurprise = () => {
    const randomExpr = EXPRESSIONS[Math.floor(Math.random() * EXPRESSIONS.length)];
    const randomOutfit = OUTFITS[Math.floor(Math.random() * OUTFITS.length)];
    setSelectedExpression(randomExpr.id);
    setSelectedOutfit(randomOutfit.id);
    setPreviewScale(1.12);
    setTimeout(() => setPreviewScale(1), 400);
  };

  const currentOutfit = OUTFITS.find(o => o.id === selectedOutfit) || OUTFITS[0];
  const currentExpression = EXPRESSIONS.find(e => e.id === selectedExpression) || EXPRESSIONS[0];

  return (
    <main className="min-h-screen pt-20 pb-16 px-4 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-bold tracking-widest uppercase mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Trợ Lý Vũ Trụ
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-400 mb-4">
            Gặp Gỡ Astro
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
            Người bạn đồng hành AI của Góc Vũ Trụ. Khám phá các trang phục và biểu cảm!
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">

          {/* ─── LEFT: Preview column ─── */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="sticky top-24 space-y-4">

            {/* Astro preview card */}
            <div className="relative bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-white/10 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

              {/* Astro big display */}
              <div className="flex justify-center mb-6">
                <motion.div animate={{ scale: previewScale }} transition={{ type: 'spring', stiffness: 400, damping: 20 }} className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 blur-2xl scale-150" />
                  <div className="relative w-44 h-44 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                    <CosmicAIIcon expression={selectedExpression} outfit={selectedOutfit} className="w-full h-full" />
                  </div>
                </motion.div>
              </div>

              {/* State labels */}
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-2xl">{currentExpression.icon}</span>
                  <span className={`text-lg font-black ${currentExpression.color}`}>{currentExpression.label}</span>
                </div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Trang phục: <span className="text-gray-300 font-bold">{currentOutfit.label}</span>
                </div>
              </div>

              {/* Outfit description */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={String(selectedOutfit) + selectedExpression}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                  className="text-center text-sm text-gray-400 italic leading-relaxed px-2 mb-6 min-h-[44px]"
                >
                  {currentOutfit.desc}
                </motion.p>
              </AnimatePresence>

              {/* Surprise button */}
              <button
                onClick={handleSurprise}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600/80 to-cyan-600/80 hover:from-purple-500 hover:to-cyan-500 rounded-2xl font-black text-white text-sm tracking-wider uppercase transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
              >
                <Wand2 className="w-4 h-4" />
                Bất ngờ với tôi!
              </button>
            </div>

            {/* Fun fact ticker */}
            <div className="bg-white/3 border border-white/8 rounded-2xl px-5 py-4">
              <div className="text-[9px] text-cyan-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Star className="w-3 h-3" /> Bạn có biết?
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={factIndex}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="text-xs text-gray-300 leading-relaxed"
                >
                  {FUN_FACTS[factIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ─── RIGHT: Pickers ─── */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="space-y-8">

            {/* Outfit picker */}
            <div>
              <h2 className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                <span className="flex-1 h-px bg-white/10" /> Trang Phục <span className="flex-1 h-px bg-white/10" />
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {OUTFITS.map((outfit) => (
                  <motion.button
                    key={String(outfit.id)}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedOutfit(outfit.id)}
                    className={`relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all text-center ${
                      selectedOutfit === outfit.id
                        ? `bg-gradient-to-b ${outfit.color} ${outfit.border} shadow-lg`
                        : 'bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/15'
                    }`}
                  >
                    {selectedOutfit === outfit.id && (
                      <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${outfit.dot}`} />
                    )}
                    <div className="w-14 h-14">
                      <CosmicAIIcon expression="happy" outfit={outfit.id} className="w-full h-full" />
                    </div>
                    <span className="text-[9px] font-black text-white uppercase tracking-wider leading-tight">
                      {outfit.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Expression picker */}
            <div>
              <h2 className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                <span className="flex-1 h-px bg-white/10" /> Biểu Cảm <span className="flex-1 h-px bg-white/10" />
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-2">
                {EXPRESSIONS.map((expr) => (
                  <motion.button
                    key={expr.id}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleExpressionClick(expr.id)}
                    className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border transition-all text-center ${
                      selectedExpression === expr.id
                        ? `${expr.bg} shadow-md`
                        : 'bg-white/3 border-white/8 hover:bg-white/6'
                    }`}
                  >
                    <span className="text-xl leading-none">{expr.icon}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wide leading-tight ${
                      selectedExpression === expr.id ? expr.color : 'text-gray-500'
                    }`}>
                      {expr.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-purple-500/15 rounded-2xl p-6">
              <h3 className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" /> Tương tác với Astro ngoài trang web
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: '🖱️', text: 'Hover vào Astro để thấy biểu cảm ngượng ngùng' },
                  { icon: '👆', text: 'Click một lần để mở bảng gợi ý' },
                  { icon: '⚡', text: 'Click đúp — Astro biểu lộ cảm xúc mạnh' },
                  { icon: '🌙', text: 'Để yên 90 giây — Astro sẽ ngủ quên!' },
                  { icon: '🎂', text: 'Vào đúng ngày sinh — Astro đội mũ bánh kem' },
                  { icon: '🔟', text: 'Click nhanh 10 lần — Astro nhột lắm đấy!' },
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-gray-400 text-xs leading-relaxed">
                    <span className="text-base shrink-0 mt-0.5">{tip.icon}</span>
                    <span>{tip.text}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </main>
  );
}
