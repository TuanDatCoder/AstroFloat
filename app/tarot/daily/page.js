'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, RefreshCw, Calendar, Eye, Share2, HelpCircle } from 'lucide-react';
import { tarotService } from '@/services/tarotService';

const stylesList = [
  { id: 1, name: 'genz', label: 'Gen Z' },
  { id: 2, name: 'healing', label: 'Chữa Lành' },
  { id: 3, name: 'deep', label: 'Sâu Sắc' },
  { id: 4, name: 'toxic', label: 'Toxic' }
];

export default function DailyTarot() {
  const [styleId, setStyleId] = useState(2); // Mặc định: Chữa Lành
  const [loading, setLoading] = useState(false);
  const [savedDaily, setSavedDaily] = useState(null);
  const [drawingState, setDrawingState] = useState('idle'); // idle -> shuffling -> drawn
  const [revealedCard, setRevealedCard] = useState(null);

  useEffect(() => {
    // Kiểm tra xem hôm nay bốc chưa
    const localDaily = tarotService.getDailyTarotFromLocal();
    if (localDaily) {
      setSavedDaily(localDaily);
      setDrawingState('drawn');
      if (localDaily.card) {
        setRevealedCard(localDaily.card);
      }
    }
  }, []);

  const handleDrawCard = async () => {
    setLoading(true);
    setDrawingState('shuffling');
    
    // Tạo hiệu ứng xào bài ảo trong 1.5 giây
    setTimeout(async () => {
      try {
        // Gọi API tạo quẻ trải bài hằng ngày (topic_id = 1)
        const reading = await tarotService.generateReading(1, null, styleId);
        
        if (reading && reading.cards && reading.cards.length > 0) {
          const firstCard = reading.cards[0];
          
          // Thêm thông tin bổ sung để vẽ card
          const cardObj = {
            card_id: firstCard.card_id,
            name: firstCard.card_name,
            image_url: firstCard.image_url,
            orientation: firstCard.orientation,
            short_meaning: firstCard.short_meaning,
            long_meaning: firstCard.long_meaning,
            full_text: reading.full_text
          };

          // Lưu local
          tarotService.saveDailyTarotToLocal(cardObj, firstCard.orientation, reading.full_text);
          
          setRevealedCard(cardObj);
          setSavedDaily({
            date: new Date().toISOString().split('T')[0],
            card: cardObj,
            orientation: firstCard.orientation,
            full_text: reading.full_text
          });
          setDrawingState('drawn');
        }
      } catch (e) {
        console.error('Lỗi khi bốc bài hằng ngày:', e);
        alert('Cấu hình Supabase key chưa chính xác. Hệ thống đang sử dụng dữ liệu mô phỏng!');
        
        // Mô phỏng quẻ bài nếu Supabase bị lỗi (fallback)
        const fallbackCard = {
          card_id: 11,
          name: 'The Sun',
          orientation: Math.random() < 0.5 ? 'upright' : 'reversed',
          short_meaning: 'tỏa sáng rực rỡ và tràn ngập niềm vui ngày mới',
          long_meaning: 'Lá bài The Sun xuất hiện dự báo một ngày ngập tràn ánh nắng và may mắn đang chào đón bạn. Mọi dự định trong hôm nay sẽ hanh thông và được mọi người hưởng ứng nhiệt tình. Hãy tự tin tỏa sáng!',
          full_text: 'Vũ trụ chúc mừng bạn! Hôm nay năng lượng của bạn sẽ tỏa sáng rực rỡ và tràn ngập niềm vui ngày mới. Đây là thời cơ vàng để gặt hái thành công.',
          image_url: '/assets/cards/the-sun.png'
        };

        tarotService.saveDailyTarotToLocal(fallbackCard, fallbackCard.orientation, fallbackCard.full_text);
        setRevealedCard(fallbackCard);
        setSavedDaily({
          date: new Date().toISOString().split('T')[0],
          card: fallbackCard,
          orientation: fallbackCard.orientation,
          full_text: fallbackCard.full_text
        });
        setDrawingState('drawn');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'Lá bài ngày mới của tôi',
        text: `Hôm nay tôi bốc được lá bài ${revealedCard?.name}. Năng lượng: ${revealedCard?.short_meaning}. Xem bói Tarot tại AstroFloat!`,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      // Coppy vào clipboard
      navigator.clipboard.writeText(`Hôm nay tôi bốc được lá bài ${revealedCard?.name}. Năng lượng: ${revealedCard?.short_meaning}.`);
      alert('Đã sao chép liên kết chia sẻ!');
    }
  };

  // Helper dịch nghĩa orientation
  const getOrientationLabel = (o) => {
    return o === 'upright' ? 'Xuôi (Upright)' : 'Ngược (Reversed)';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-center">
      {/* Back button */}
      <div className="text-left mb-10">
        <Link href="/tarot" className="text-xs uppercase tracking-widest text-[#ebdcb9]/60 hover:text-amber-200 flex items-center gap-1.5 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Về Trang chủ Tarot
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-amber-950/40 rounded-full px-4.5 py-1.5 bg-amber-950/15 mb-6 text-[#ebdcb9]/80 text-xs sm:text-sm tracking-widest font-serif">
          <Calendar className="w-4 h-4 text-amber-500" />
          LÁ BÀI MAY MẮN HẰNG NGÀY
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-white mb-4">
          THÔNG ĐIỆP HẰNG NGÀY
        </h1>

        <p className="text-sm text-[#ebdcb9]/70 leading-relaxed mb-12">
          Mỗi ngày chỉ nên rút duy nhất 1 lá bài đại diện cho năng lượng chủ đạo trong ngày. Lá bài này sẽ nhắc nhở và dẫn đường cho bạn đưa ra những lựa chọn đúng đắn.
        </p>

        <AnimatePresence mode="wait">
          {drawingState === 'idle' && (
            <motion.div 
              key="draw-setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="tarot-glass border-amber-950/30 rounded-3xl p-8 max-w-md mx-auto"
            >
              <h3 className="font-serif text-lg font-bold text-white tracking-wider mb-6">
                Chọn Style Văn Phong Ngày Mới:
              </h3>
              
              <div className="grid grid-cols-4 gap-2 mb-8">
                {stylesList.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStyleId(st.id)}
                    className={`py-2 px-1 text-xs rounded-xl border font-bold tracking-wider transition-all ${
                      styleId === st.id
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                        : 'bg-black/20 text-[#ebdcb9]/60 border-amber-950/40 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Deck representation */}
              <div className="relative w-44 h-72 mx-auto mb-8 cursor-pointer group" onClick={handleDrawCard}>
                {/* 3 cards stacked slightly offset to look like a deck */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1c1230] to-[#0a0515] border border-amber-900/30 rounded-2xl shadow-xl transform rotate-[-6deg] translate-x-[-12px] opacity-40 group-hover:rotate-[-8deg] transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1c1230] to-[#0a0515] border border-amber-900/30 rounded-2xl shadow-xl transform rotate-[3deg] translate-x-[8px] opacity-60 group-hover:rotate-[5deg] transition-transform duration-300" />
                
                {/* Top card */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#2e1d4d] to-[#0d071a] border-2 border-amber-500/40 rounded-2xl shadow-2xl flex flex-col items-center justify-between p-4 transform group-hover:scale-105 transition-all duration-300 relative">
                  {/* Mystical Pattern inside card back */}
                  <div className="absolute inset-2 border border-amber-500/10 rounded-xl flex items-center justify-center pointer-events-none">
                    <div className="w-full h-full border border-dashed border-amber-500/15 rounded-lg flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border border-amber-500/20 flex items-center justify-center animate-spin-slow">
                        <Sparkles className="w-6 h-6 text-amber-500/40" />
                      </div>
                    </div>
                  </div>
                  
                  <span className="font-serif text-[10px] tracking-widest text-amber-500/50 uppercase font-bold relative z-10">ASTROFLOAT</span>
                  <div className="relative z-10 bg-amber-500/10 border border-amber-500/20 p-3 rounded-full text-amber-400 group-hover:text-amber-200 group-hover:border-amber-400/40 transition-colors">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="font-serif text-[10px] tracking-widest text-amber-500/50 uppercase font-bold relative z-10">DAILY ENERGY</span>
                </div>
              </div>

              <button
                onClick={handleDrawCard}
                className="w-full bg-amber-600 hover:bg-amber-500 text-black font-serif font-black tracking-widest uppercase text-sm py-4 rounded-xl transition-all shadow-lg shadow-amber-600/10 active:scale-[0.98]"
              >
                RÚT BÀI NGÀY MỚI
              </button>
            </motion.div>
          )}

          {drawingState === 'shuffling' && (
            <motion.div 
              key="draw-shuffling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="tarot-glass border-amber-950/30 rounded-3xl p-12 max-w-md mx-auto flex flex-col items-center justify-center min-h-[400px]"
            >
              <div className="relative w-36 h-60 mb-8">
                {/* Shuffling animation cards */}
                <motion.div 
                  animate={{ 
                    x: [-30, 30, -30], 
                    rotate: [-5, 5, -5],
                    zIndex: [1, 2, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#2d1d4c] border border-amber-500/30 rounded-xl"
                />
                <motion.div 
                  animate={{ 
                    x: [30, -30, 30], 
                    rotate: [5, -5, 5],
                    zIndex: [2, 1, 2]
                  }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#1d1233] border border-amber-500/20 rounded-xl"
                />
              </div>
              <p className="font-serif text-lg text-amber-400 tracking-widest uppercase animate-pulse">
                ĐANG XÀO BÀI...
              </p>
              <p className="text-xs text-[#ebdcb9]/60 mt-2">
                Hội tụ năng lượng tinh thần và đón nhận thông điệp.
              </p>
            </motion.div>
          )}

          {drawingState === 'drawn' && revealedCard && (
            <motion.div 
              key="draw-result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 text-left mt-4"
            >
              {/* Card visual column */}
              <div className="md:col-span-4 flex flex-col items-center">
                <motion.div
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{ perspective: 1000 }}
                  className="relative w-48 h-80 rounded-2xl bg-gradient-to-b from-[#1b152d] to-[#0b071a] border-2 border-amber-500/60 p-1 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden"
                >
                  {/* Outer border line */}
                  <div className="absolute inset-2 border border-amber-500/20 rounded-xl pointer-events-none" />

                  {/* Mystic card header */}
                  <div className="w-full text-center relative z-10 pt-3">
                    <span className="font-serif text-[10px] tracking-widest text-amber-500/60 uppercase font-black">
                      {revealedCard.orientation === 'reversed' ? 'REVERSED' : 'UPRIGHT'}
                    </span>
                  </div>

                  {/* Mystic card image */}
                  <div className="w-36 h-52 rounded-lg bg-black/40 border border-amber-950/40 relative flex flex-col items-center justify-center overflow-hidden">
                    {revealedCard.image_url ? (
                      <img
                        src={revealedCard.image_url}
                        alt={revealedCard.name}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          revealedCard.orientation === 'reversed' ? 'rotate-180' : ''
                        }`}
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-purple-500/10" />
                        {/* Glowing Symbol */}
                        <div className="w-16 h-16 rounded-full border-2 border-amber-500/20 flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-amber-400/5 blur-md rounded-full" />
                          <Sparkles className="w-8 h-8 text-amber-400/80 animate-pulse" />
                        </div>
                        {/* Orientation marker */}
                        <div className={`mt-4 text-[9px] font-mono tracking-wider text-amber-500/60 transition-transform ${revealedCard.orientation === 'reversed' ? 'rotate-180' : ''}`}>
                          ▲
                        </div>
                      </>
                    )}
                  </div>

                  {/* Card footer title */}
                  <div className="w-full text-center relative z-10 pb-4">
                    <h3 className="font-serif text-sm font-black tracking-widest text-amber-200 uppercase">
                      {revealedCard.name}
                    </h3>
                  </div>

                  {/* Reversed rotate card wrapper if reversed */}
                  {revealedCard.orientation === 'reversed' && (
                    <div className="absolute inset-0 bg-black/5 pointer-events-none transform rotate-180 mix-blend-overlay" />
                  )}
                </motion.div>

                {/* Card indicator details */}
                <div className="mt-4 text-center">
                  <span className="text-xs uppercase font-serif tracking-widest text-amber-400 bg-amber-950/30 px-3 py-1 rounded-full border border-amber-900/30">
                    {getOrientationLabel(revealedCard.orientation)}
                  </span>
                </div>
              </div>

              {/* Text interpretation column */}
              <div className="md:col-span-8 flex flex-col justify-center">
                <div className="tarot-glass border-amber-950/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-serif text-xs text-amber-400 tracking-widest uppercase font-bold mb-2">
                      QUẺ BÀI HÔM NAY CỦA BẠN
                    </h3>
                    
                    <h2 className="font-serif text-2xl md:text-3xl font-black text-white tracking-widest mb-6 border-b border-amber-950/20 pb-4">
                      {revealedCard.name}
                    </h2>
                    
                    {/* Mystical Generated full text */}
                    <div className="text-sm sm:text-base leading-relaxed text-[#ebdcb9] font-medium italic border-l-2 border-amber-500/40 pl-4 py-1 mb-8 bg-amber-500/[0.02]">
                      &ldquo;{revealedCard.full_text}&rdquo;
                    </div>

                    <h4 className="font-serif text-sm font-bold text-white tracking-widest uppercase mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-amber-500" />
                      GIẢI NGHĨA CHI TIẾT
                    </h4>
                    <p className="text-xs sm:text-sm text-[#ebdcb9]/80 leading-relaxed">
                      {revealedCard.long_meaning}
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="mt-8 pt-6 border-t border-amber-950/20 flex flex-wrap gap-4 items-center">
                    <button
                      onClick={handleShare}
                      className="bg-amber-600 hover:bg-amber-500 text-black text-xs font-serif font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-amber-600/10"
                    >
                      <Share2 className="w-4 h-4" /> CHIA SẺ
                    </button>
                    
                    <Link
                      href="/tarot"
                      className="border border-amber-500/30 hover:bg-amber-500/10 text-amber-300 text-xs font-serif font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all active:scale-95"
                    >
                      TRẢI BÀI CHUYÊN SÂU KHÁC
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
