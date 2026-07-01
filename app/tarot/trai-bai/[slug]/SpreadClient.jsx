'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, RefreshCw, Eye, Share2, HelpCircle, Heart, Briefcase, Coins, Compass } from 'lucide-react';
import { tarotService } from '@/services/tarotService';

const topicDetails = {
  'tinh-yeu': {
    id: 2,
    name: 'Trải Bài Tình Yêu',
    icon: Heart,
    iconColor: 'text-pink-400',
    slots: [
      { order: 1, name: 'Trạng thái hiện tại' },
      { order: 2, name: 'Thử thách / Khó khăn' },
      { order: 3, name: 'Lời khuyên / Tương lai' }
    ]
  },
  'su-nghiep': {
    id: 3,
    name: 'Trải Bài Sự Nghiệp',
    icon: Briefcase,
    iconColor: 'text-blue-400',
    slots: [
      { order: 1, name: 'Hiện trạng công việc' },
      { order: 2, name: 'Cơ hội / Thách thức' },
      { order: 3, name: 'Định hướng hành động' }
    ]
  },
  'tai-chinh': {
    id: 4,
    name: 'Trải Bài Tài Chính',
    icon: Coins,
    iconColor: 'text-emerald-400',
    slots: [
      { order: 1, name: 'Tình hình tài chính hiện thời' },
      { order: 2, name: 'Rào cản dòng tiền' },
      { order: 3, name: 'Lời khuyên tài lộc' }
    ]
  },
  'hang-ngay': {
    id: 1,
    name: 'Thông Điệp Ngày Mới',
    icon: Compass,
    iconColor: 'text-amber-400',
    slots: [
      { order: 1, name: 'Năng lượng ngày mới' }
    ]
  }
};

export default function SpreadClient({ topicSlug }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const styleParam = searchParams.get('style');
  const styleId = styleParam ? parseInt(styleParam, 10) : 2; // Mặc định: Chữa Lành

  const topicInfo = topicDetails[topicSlug] || topicDetails['tinh-yeu']; // Fallback nếu slug bậy
  const numCardsNeeded = topicInfo.slots.length;

  const [gameState, setGameState] = useState('idle'); // idle -> shuffling -> drawing -> revealing -> done
  const [selectedCardsIndices, setSelectedCardsIndices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Mảng tượng trưng cho bộ bài (78 lá, ta mô tả 20 lá để vẽ quạt bài)
  const deckSize = 22;
  const dummyDeck = Array.from({ length: deckSize }, (_, i) => i);

  // Kích hoạt xào bài
  const handleShuffle = () => {
    setGameState('shuffling');
    setTimeout(() => {
      setGameState('drawing');
    }, 1800);
  };

  // Click chọn rút một lá bài
  const handleDrawCard = (cardIdx) => {
    if (gameState !== 'drawing' || selectedCardsIndices.length >= numCardsNeeded) return;
    if (selectedCardsIndices.includes(cardIdx)) return;

    const newSelections = [...selectedCardsIndices, cardIdx];
    setSelectedCardsIndices(newSelections);

    // Khi rút đủ số lá bài cần thiết
    if (newSelections.length === numCardsNeeded) {
      handleRevealReading();
    }
  };

  // Gửi quẻ bài lên server xử lý bốc ngẫu nhiên & ráp template
  const handleRevealReading = async () => {
    setLoading(true);
    setGameState('revealing');

    try {
      // Gọi API bốc bài qua DB function
      const reading = await tarotService.generateReading(topicInfo.id, null, styleId);
      
      // Đợi hiệu ứng quay bài 1.5 giây
      setTimeout(() => {
        setResult(reading);
        setGameState('done');
        setLoading(false);
      }, 1500);
    } catch (e) {
      console.error('Lỗi khi bốc bài:', e);
      
      // Fallback mô phỏng nếu Supabase lỗi hoặc chưa nhập key
      setTimeout(() => {
        const mockCards = topicInfo.slots.map((slot, i) => {
          const names = ['The Fool', 'The Magician', 'The Lovers', 'The Empress', 'The Emperor', 'The Chariot', 'The Star', 'The Sun', 'The World'];
          const pickedName = names[Math.floor(Math.random() * names.length)];
          const isUpright = Math.random() < 0.5;
          return {
            position: slot.order,
            position_name: slot.name,
            card_id: i + 1,
            card_name: pickedName,
            orientation: isUpright ? 'upright' : 'reversed',
            short_meaning: isUpright ? 'năng lượng khởi sắc và ngập tràn may mắn' : 'sự trì hoãn tạm thời cần kiên nhẫn',
            long_meaning: `Lá bài ${pickedName} ở vị thế ${isUpright ? 'Xuôi' : 'Ngược'} đại diện cho ${slot.name}. Năng lượng vũ trụ nhắc nhở bạn hãy cởi mở, lắng nghe trực giác và sẵn sàng vượt qua các thử thách nội tâm.`,
            keywords: ['may mắn', 'tự tin', 'trực giác'],
            image_url: `/assets/cards/${pickedName.toLowerCase().replace(/ /g, '-')}.png`
          };
        });

        const mockFullText = `[Quẻ bài demo] Năng lượng của bạn đang chuyển biến. Trong quá khứ/hiện tại, bạn có ${mockCards[0]?.short_meaning}. Trở ngại chính là ${mockCards[1]?.short_meaning || 'không đáng kể'}. Lời khuyên tối hậu từ vũ trụ: ${mockCards[2]?.short_meaning || 'hãy vững tin'}.`;

        const mockReading = {
          reading_id: 'mock-uuid-1234',
          topic_id: topicInfo.id,
          style_id: styleId,
          full_text: mockFullText,
          cards: mockCards
        };

        // Lưu local
        tarotService.saveReadingToLocal(mockReading);

        setResult(mockReading);
        setGameState('done');
        setLoading(false);
      }, 1500);
    }
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `Kết quả trải bài ${topicInfo.name}`,
        text: `Tôi vừa rút được quẻ Tarot tuyệt vời tại AstroFloat. Xem giải mã dành riêng cho bạn!`,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép liên kết chia sẻ quẻ bài!');
    }
  };

  const resetSpread = () => {
    setSelectedCardsIndices([]);
    setResult(null);
    setGameState('idle');
  };

  const TopicIcon = topicInfo.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
      {/* Back Link */}
      <div className="text-left mb-8">
        <Link href="/tarot" className="text-xs uppercase tracking-widest text-[#ebdcb9]/60 hover:text-amber-200 flex items-center gap-1.5 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Về Trang chủ Tarot
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-amber-950/40 rounded-full px-4.5 py-1.5 bg-amber-950/15 mb-6 text-[#ebdcb9]/80 text-xs sm:text-sm tracking-widest font-serif">
          <TopicIcon className={`w-4 h-4 ${topicInfo.iconColor}`} />
          {topicInfo.name.toUpperCase()}
        </div>

        {gameState !== 'done' && (
          <>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-white mb-4">
              THIẾT LẬP NĂNG LƯỢNG
            </h1>
            <p className="text-xs sm:text-sm text-[#ebdcb9]/75 leading-relaxed max-w-xl mx-auto mb-12">
              Tập trung tinh thần, nghĩ về câu hỏi của bạn. Bấm xào bài để xáo trộn năng lượng, sau đó rút đủ {numCardsNeeded} lá bài để giải mã.
            </p>
          </>
        )}

        <AnimatePresence mode="wait">
          {/* IDLE STATE */}
          {gameState === 'idle' && (
            <motion.div
              key="state-idle"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="tarot-glass border-amber-950/30 rounded-3xl p-10 max-w-md mx-auto"
            >
              <div className="relative w-40 h-64 mx-auto mb-8">
                <div className="absolute inset-0 bg-[#24173d] border border-amber-500/20 rounded-2xl shadow-xl transform rotate-[-4deg] translate-x-[-8px] opacity-50" />
                <div className="absolute inset-0 bg-[#2d1d4d] border-2 border-amber-500/30 rounded-2xl shadow-2xl flex flex-col items-center justify-center" />
                <div className="absolute inset-3 border border-amber-500/10 rounded-xl flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-amber-500/20 flex items-center justify-center animate-spin-slow">
                    <Sparkles className="w-5 h-5 text-amber-500/40" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleShuffle}
                className="w-full bg-amber-600 hover:bg-amber-500 text-black font-serif font-black tracking-widest uppercase text-sm py-4.5 rounded-xl transition-all shadow-lg shadow-amber-600/10 active:scale-[0.98]"
              >
                XÀO BÀI (SHUFFLE)
              </button>
            </motion.div>
          )}

          {/* SHUFFLING STATE */}
          {gameState === 'shuffling' && (
            <motion.div
              key="state-shuffling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="tarot-glass border-amber-950/30 rounded-3xl p-12 max-w-md mx-auto flex flex-col items-center justify-center min-h-[380px]"
            >
              <div className="relative w-36 h-56 mb-8">
                <motion.div 
                  animate={{ 
                    x: [-35, 35, -35], 
                    rotate: [-8, 8, -8],
                    zIndex: [1, 3, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#311f54] border border-amber-500/30 rounded-xl"
                />
                <motion.div 
                  animate={{ 
                    x: [35, -35, 35], 
                    rotate: [8, -8, 8],
                    zIndex: [3, 1, 3]
                  }}
                  transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#160d26] border border-amber-500/10 rounded-xl"
                />
              </div>
              <p className="font-serif text-base text-amber-400 tracking-widest uppercase font-bold animate-pulse">
                ĐANG HỢP NHẤT DÒNG SUY NGHĨ...
              </p>
            </motion.div>
          )}

          {/* DRAWING STATE */}
          {gameState === 'drawing' && (
            <motion.div
              key="state-drawing"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              {/* Position Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center max-w-3xl mx-auto mb-16">
                {topicInfo.slots.map((slot, i) => {
                  const hasCard = selectedCardsIndices[i] !== undefined;
                  return (
                    <div 
                      key={slot.order}
                      className={`tarot-glass border-dashed border-2 rounded-2xl p-5 min-h-[220px] flex flex-col items-center justify-between transition-all duration-300 ${
                        hasCard 
                          ? 'border-amber-500 bg-amber-950/10 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                          : 'border-amber-900/30 bg-black/10'
                      }`}
                    >
                      <span className="font-serif text-[10px] tracking-widest uppercase text-amber-500 font-bold">
                        VỊ TRÍ {slot.order}: {slot.name}
                      </span>
                      
                      {hasCard ? (
                        <motion.div 
                          initial={{ scale: 0.7, rotate: 10, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          className="w-24 h-40 bg-gradient-to-b from-[#301e52] to-[#0e071c] border border-amber-500/40 rounded-xl shadow-lg relative flex flex-col items-center justify-center"
                        >
                          <div className="absolute inset-1.5 border border-amber-500/10 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-amber-500/20" />
                          </div>
                        </motion.div>
                      ) : (
                        <div className="w-24 h-40 border border-amber-900/10 bg-black/20 rounded-xl flex items-center justify-center">
                          <HelpCircle className="w-6 h-6 text-amber-900/30" />
                        </div>
                      )}
                      
                      <span className="text-[10px] text-[#ebdcb9]/40">
                        {hasCard ? 'Đã rút' : 'Đang chờ rút...'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Fan Pile of Cards */}
              <div className="relative h-60 max-w-lg mx-auto mb-6">
                <h3 className="font-serif text-sm tracking-widest text-[#ebdcb9]/60 font-semibold mb-8 uppercase">
                  Rút {numCardsNeeded - selectedCardsIndices.length} lá bài từ bộ bài dưới đây:
                </h3>
                
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-full">
                  {dummyDeck.map((val, idx) => {
                    const isDrawn = selectedCardsIndices.includes(idx);
                    // Tạo góc xoay quạt bài đều nhau
                    const angle = (idx - (deckSize - 1) / 2) * 5; 
                    const xOffset = (idx - (deckSize - 1) / 2) * 12;

                    return (
                      <motion.div
                        key={idx}
                        onClick={() => handleDrawCard(idx)}
                        style={{ 
                          transformOrigin: 'bottom center',
                        }}
                        animate={{
                          rotate: isDrawn ? 0 : angle,
                          x: isDrawn ? 0 : xOffset,
                          y: isDrawn ? -150 : 0,
                          opacity: isDrawn ? 0 : 1,
                          scale: isDrawn ? 0.3 : 1,
                          pointerEvents: isDrawn ? 'none' : 'auto'
                        }}
                        whileHover={{ y: -20, zIndex: 50, scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 100, damping: 18 }}
                        className={`absolute w-16 h-28 cursor-pointer rounded-lg bg-gradient-to-b from-[#25173f] to-[#0a0515] border border-amber-500/20 shadow-lg flex items-center justify-center ${
                          isDrawn ? 'pointer-events-none' : 'hover:border-amber-400'
                        }`}
                      >
                        <div className="w-12 h-24 border border-amber-950/20 rounded-md flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500/20" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* REVEALING READINGS STATE */}
          {gameState === 'revealing' && (
            <motion.div
              key="state-revealing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="tarot-glass border-amber-950/30 rounded-3xl p-12 max-w-md mx-auto flex flex-col items-center justify-center min-h-[380px]"
            >
              {/* Spinner */}
              <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
                <RefreshCw className="w-10 h-10 text-amber-500 animate-spin" />
                <div className="absolute inset-0 bg-amber-500/20 blur-md rounded-full" />
              </div>
              <p className="font-serif text-base text-amber-400 tracking-widest uppercase font-bold animate-pulse">
                ĐANG KẾT NỐI VŨ TRỤ...
              </p>
              <p className="text-xs text-[#ebdcb9]/60 mt-2">
                Biên dịch thông điệp từ thế giới tâm thức.
              </p>
            </motion.div>
          )}

          {/* DONE / RESULTS STATE */}
          {gameState === 'done' && result && (
            <motion.div
              key="state-done"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className="w-full text-left"
            >
              {/* Quote text from template */}
              <div className="tarot-glass border-amber-950/20 rounded-3xl p-6 md:p-8 mb-10 text-center relative overflow-hidden bg-amber-950/[0.02]">
                <div className="absolute -left-12 -top-12 opacity-5 text-amber-500 pointer-events-none">
                  <Sparkles className="w-40 h-40" />
                </div>
                <h3 className="font-serif text-xs text-amber-400 tracking-widest uppercase font-black mb-3">
                  BẢN ĐỒ GIẢI MÃ VŨ TRỤ DÀNH CHO BẠN
                </h3>
                <p className="font-serif italic text-lg md:text-xl text-[#ebdcb9] leading-relaxed max-w-3xl mx-auto">
                  &ldquo;{result.full_text}&rdquo;
                </p>
              </div>

              {/* Cards layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
                {result.cards && Array.isArray(result.cards) && result.cards.map((c, i) => (
                  <div key={i} className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-amber-950/15 pb-8 last:border-0 last:pb-0">
                    
                    {/* Visual Card */}
                    <div className="md:col-span-3 flex flex-col items-center">
                      <div className="relative w-40 h-64 rounded-2xl bg-gradient-to-b from-[#1b152d] to-[#0b071a] border-2 border-amber-500/60 p-1 flex flex-col items-center justify-between shadow-xl relative overflow-hidden">
                        <div className="absolute inset-1.5 border border-amber-500/20 rounded-xl pointer-events-none" />
                        
                        <div className="w-full text-center relative z-10 pt-2">
                          <span className="font-serif text-[8px] tracking-widest text-amber-500/60 uppercase font-black">
                            {c.orientation === 'reversed' ? 'REVERSED' : 'UPRIGHT'}
                          </span>
                        </div>

                        {/* Mystic card image */}
                        <div className="w-32 h-44 rounded-md bg-black/40 border border-amber-950/40 relative flex flex-col items-center justify-center overflow-hidden">
                          {c.image_url ? (
                            <img
                              src={c.image_url}
                              alt={c.card_name}
                              className={`w-full h-full object-cover transition-transform duration-300 ${
                                c.orientation === 'reversed' ? 'rotate-180' : ''
                              }`}
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-purple-500/10" />
                              <div className="w-12 h-12 rounded-full border border-amber-500/20 flex items-center justify-center relative">
                                <Sparkles className="w-5 h-5 text-amber-400/80 animate-pulse" />
                              </div>
                              <div className={`mt-3 text-[8px] font-mono tracking-wider text-amber-500/60 transition-transform ${c.orientation === 'reversed' ? 'rotate-180' : ''}`}>
                                ▲
                              </div>
                            </>
                          )}
                        </div>

                        <div className="w-full text-center relative z-10 pb-3">
                          <h3 className="font-serif text-xs font-black tracking-widest text-amber-200 uppercase truncate px-2">
                            {c.card_name}
                          </h3>
                        </div>

                        {c.orientation === 'reversed' && (
                          <div className="absolute inset-0 bg-black/5 pointer-events-none transform rotate-180 mix-blend-overlay" />
                        )}
                      </div>
                    </div>

                    {/* Explanations Details */}
                    <div className="md:col-span-9">
                      <div className="tarot-glass border-amber-950/20 rounded-2xl p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-3 border-b border-amber-950/10 pb-2">
                          <span className="font-serif text-[10px] tracking-widest uppercase text-amber-500 font-black">
                            VỊ TRÍ {c.position || (i + 1)}: {c.position_name}
                          </span>
                          <span className="text-xs uppercase font-serif tracking-widest text-amber-300 font-bold bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/30">
                            {c.orientation === 'reversed' ? 'Ngược (Reversed)' : 'Xuôi (Upright)'}
                          </span>
                        </div>

                        <h4 className="font-serif text-lg font-black text-white tracking-widest mb-3 uppercase">
                          {c.card_name}
                        </h4>

                        {/* Keywords */}
                        {c.keywords && Array.isArray(c.keywords) && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {c.keywords.map((kw, kIdx) => (
                              <span key={kIdx} className="text-[9px] uppercase font-bold tracking-widest text-amber-300/80 bg-amber-950/30 border border-amber-900/30 px-2 py-0.5 rounded">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-xs sm:text-sm text-[#ebdcb9] font-medium leading-relaxed italic border-l border-amber-500/30 pl-3 mb-4 bg-amber-500/[0.01] py-0.5">
                          Thông điệp: {c.short_meaning}
                        </p>

                        <p className="text-xs sm:text-sm text-[#ebdcb9]/80 leading-relaxed">
                          {c.long_meaning}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-wrap gap-4 items-center justify-center border-t border-amber-950/20 pt-8 mt-4">
                <button
                  onClick={resetSpread}
                  className="bg-amber-600 hover:bg-amber-500 text-black text-xs font-serif font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow-lg shadow-amber-600/10"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> TRẢI BÀI LẠI
                </button>
                <button
                  onClick={handleShare}
                  className="border border-amber-500/30 hover:bg-amber-500/10 text-amber-300 text-xs font-serif font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> CHIA SẺ QUẺ
                </button>
                <Link
                  href="/tarot"
                  className="text-xs font-serif font-bold text-[#ebdcb9]/60 hover:text-white uppercase tracking-widest px-4 py-3"
                >
                  CHỌN CHỦ ĐỀ KHÁC
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
