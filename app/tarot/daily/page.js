'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, RefreshCw, Calendar, Eye, Share2, HelpCircle } from 'lucide-react';
import { tarotService } from '@/services/tarotService';
import CosmicEnergyPopup from '@/components/CosmicEnergyPopup';
import LightningIcon from '@/components/LightningIcon';

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
  const [isEnergyPopupOpen, setIsEnergyPopupOpen] = useState(false);

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
        console.error('Lỗi khi bốc bài hằng ngày:', e.message || e);
        setLoading(false);
        
        if (e.status === 429) {
          setDrawingState('idle');
          setIsEnergyPopupOpen(true);
          return;
        }

        alert('Cấu hình Supabase key chưa chính xác. Hệ thống đang sử dụng dữ liệu mô phỏng!');
        
        // Mô phỏng quẻ bài nếu Supabase bị lỗi (fallback)
        const names = ['The Fool', 'The Magician', 'The Lovers', 'The Empress', 'The Emperor', 'The Chariot', 'The Star', 'The Sun', 'The World'];
        const pickedName = names[Math.floor(Math.random() * names.length)];
        const isUpright = Math.random() < 0.5;
        const orientation = isUpright ? 'upright' : 'reversed';
        
        const cardMeanings = {
          'The Fool': { shortUp: 'sự khởi đầu mới đầy tự do', shortRev: 'sự bất cẩn, hành động bốc đồng', longUp: 'Năng lượng khuyến khích bạn bước khỏi vùng an toàn, đón nhận thử thách mới.', longRev: 'Bạn dễ đưa ra quyết định nóng vội hoặc hành động thiếu suy nghĩ.', kw: 'tự do' },
          'The Magician': { shortUp: 'khả năng làm chủ bản thân', shortRev: 'năng lượng bị phân tán, trì hoãn', longUp: 'Bạn đang nắm giữ mọi công cụ cần thiết để giải quyết các vấn đề ngày hôm nay.', longRev: 'Bạn có tài năng nhưng thiếu tập trung hoặc đang lãng phí thời gian.', kw: 'tập trung' },
          'The Lovers': { shortUp: 'sự gắn kết và thăng hoa', shortRev: 'sự rạn nứt hoặc mất kết nối', longUp: 'Ngày tuyệt vời để kết nối, lắng nghe và chia sẻ cảm xúc chân thành.', longRev: 'Có thể có sự mâu thuẫn nhỏ hoặc bất đồng ý kiến, cần ngồi lại lắng nghe.', kw: 'kết nối' },
          'The Empress': { shortUp: 'sự sinh sôi và dồi dào', shortRev: 'sự trì trệ, thiếu chăm sóc bản thân', longUp: 'Năng lượng mang lại sự sinh trưởng, sung túc và tình cảm ấm áp.', longRev: 'Bạn đang bỏ bê nhu cầu của bản thân, hãy nghỉ ngơi và thư giãn.', kw: 'dồi dào' },
          'The Emperor': { shortUp: 'kỷ luật, kiểm soát tốt công việc', shortRev: 'sự cứng nhắc hoặc độc đoán', longUp: 'Hãy thiết lập kỷ luật và làm việc có tổ chức để đạt hiệu quả cao.', longRev: 'Cảnh báo bạn đang quá khắt khe hoặc kiểm soát quá chặt làm ức chế người khác.', kw: 'kiên định' },
          'The Chariot': { shortUp: 'sự kiên trì vượt qua khó khăn', shortRev: 'sự quá tải hoặc mất phương hướng', longUp: 'Bạn có quyết tâm lớn để chinh phục mục tiêu của mình hôm nay.', longRev: 'Bạn đang chạy quá nhanh và ôm đồm quá nhiều việc cùng lúc.', kw: 'tiến lên' },
          'The Star': { shortUp: 'hy vọng và sự chữa lành tâm hồn', shortRev: 'sự bi quan hoặc nghi ngờ bản thân', longUp: 'Một nguồn cảm hứng lớn đang đến để làm mới tinh thần và chữa lành những mệt mỏi.', longRev: 'Bạn cảm thấy lo lắng và mất niềm tin vào tương lai. Hãy thả lỏng cơ thể.', kw: 'hy vọng' },
          'The Sun': { shortUp: 'tỏa sáng rực rỡ và tràn ngập niềm vui', shortRev: 'sự kiêu ngạo hoặc chủ quan', longUp: 'Một ngày ngập tràn may mắn và cơ hội tuyệt vời đón chào bạn.', longRev: 'Dễ nảy sinh sự chủ quan hoặc quá tự phụ dẫn đến sai lầm không đáng có.', kw: 'may mắn' },
          'The World': { shortUp: 'sự viên mãn và hoàn thành mục tiêu', shortRev: 'sự dang dở, thiếu kiên nhẫn', longUp: 'Hoàn thành chặng đường cũ thành công mỹ mãn và sẵn sàng cho khởi đầu mới.', longRev: 'Có thể gặp chút chậm trễ ở bước cuối cùng, hãy nhẫn nại đi đến cùng.', kw: 'viên mãn' }
        };

        const details = cardMeanings[pickedName];
        const short_meaning = isUpright ? details.shortUp : details.shortRev;
        const long_meaning = isUpright ? details.longUp : details.longRev;
        
        const fallbackCard = {
          card_id: names.indexOf(pickedName) + 1,
          name: pickedName,
          orientation,
          short_meaning,
          long_meaning,
          full_text: `Vũ trụ bắn tín hiệu cho bạn hôm nay: Năng lượng chính xoay quanh ${short_meaning}. Hãy tự tin đón nhận!`,
          image_url: `/assets/cards/${pickedName.toLowerCase().replace(/ /g, '-')}.png`
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
        <Link href="/tarot" className="text-xs uppercase tracking-widest text-slate-400 hover:text-cyan-200 flex items-center gap-1.5 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Về Trang chủ Tarot
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-indigo-950/40 rounded-full px-4.5 py-1.5 bg-indigo-950/20 mb-6 text-slate-300 text-xs sm:text-sm tracking-widest font-serif">
          <Calendar className="w-4 h-4 text-purple-400" />
          LÁ BÀI MAY MẮN HẰNG NGÀY
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-white mb-4">
          THÔNG ĐIỆP HẰNG NGÀY
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed mb-12">
          Mỗi ngày chỉ nên rút duy nhất 1 lá bài đại diện cho năng lượng chủ đạo trong ngày. Lá bài này sẽ nhắc nhở và dẫn đường cho bạn đưa ra những lựa chọn đúng đắn.
        </p>

        <AnimatePresence mode="wait">
          {drawingState === 'idle' && (
            <motion.div 
              key="draw-setup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="tarot-glass border-indigo-950/30 rounded-3xl p-8 max-w-md mx-auto"
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
                        ? 'bg-purple-950/25 text-purple-300 border-purple-500/40 shadow-sm'
                        : 'bg-black/20 text-slate-400 border-indigo-950/40 hover:text-white'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Deck representation */}
              <div className="relative w-44 h-72 mx-auto mb-8 cursor-pointer group" onClick={handleDrawCard}>
                {/* 3 cards stacked slightly offset to look like a deck */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f29] to-[#050714] border border-indigo-950/45 rounded-2xl shadow-xl transform rotate-[-6deg] translate-x-[-12px] opacity-40 group-hover:rotate-[-8deg] transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f29] to-[#050714] border border-indigo-950/45 rounded-2xl shadow-xl transform rotate-[3deg] translate-x-[8px] opacity-60 group-hover:rotate-[5deg] transition-transform duration-300" />
                
                {/* Top card */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#131a40] to-[#0b0e24] border-2 border-purple-500/40 rounded-2xl shadow-2xl flex flex-col items-center justify-between p-4 transform group-hover:scale-105 transition-all duration-300 relative">
                  {/* Mystical Pattern inside card back */}
                  <div className="absolute inset-2 border border-purple-500/10 rounded-xl flex items-center justify-center pointer-events-none">
                    <div className="w-full h-full border border-dashed border-purple-500/15 rounded-lg flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full border border-purple-500/20 flex items-center justify-center animate-spin-slow">
                        <Sparkles className="w-6 h-6 text-purple-500/40" />
                      </div>
                    </div>
                  </div>
                  
                  <span className="font-serif text-[10px] tracking-widest text-purple-400/50 uppercase font-bold relative z-10">ASTROFLOAT</span>
                  <div className="relative z-10 bg-purple-500/10 border border-purple-500/20 p-3 rounded-full text-purple-400 group-hover:text-purple-200 group-hover:border-purple-400/40 transition-colors">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="font-serif text-[10px] tracking-widest text-purple-400/50 uppercase font-bold relative z-10">DAILY ENERGY</span>
                </div>
              </div>

              <button
                onClick={handleDrawCard}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-serif font-black tracking-widest uppercase text-sm py-4 rounded-xl transition-all shadow-lg shadow-purple-600/15 active:scale-[0.98] flex items-center justify-center gap-1.5"
              >
                <span>RÚT BÀI NGÀY MỚI</span>
                <span className="font-sans font-bold normal-case text-xs flex items-center gap-0.5">
                  (-1 <LightningIcon className="w-3.5 h-3.5" />)
                </span>
              </button>
            </motion.div>
          )}

          {drawingState === 'shuffling' && (
            <motion.div 
              key="draw-shuffling"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="tarot-glass border-indigo-950/30 rounded-3xl p-12 max-w-md mx-auto flex flex-col items-center justify-center min-h-[400px]"
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
                  className="absolute inset-0 bg-[#131a40] border border-purple-500/30 rounded-xl"
                />
                <motion.div 
                  animate={{ 
                    x: [30, -30, 30], 
                    rotate: [5, -5, 5],
                    zIndex: [2, 1, 2]
                  }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#0b0e24] border border-purple-500/20 rounded-xl"
                />
              </div>
              <p className="font-serif text-lg text-purple-300 tracking-widest uppercase animate-pulse">
                ĐANG XÀO BÀI...
              </p>
              <p className="text-xs text-slate-400 mt-2">
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
                  className="relative w-48 h-80 rounded-2xl bg-gradient-to-b from-[#0a0e29] to-[#03050c] border-2 border-purple-500/60 p-1 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden"
                >
                  {/* Outer border line */}
                  <div className="absolute inset-2 border border-purple-500/20 rounded-xl pointer-events-none" />

                  {/* Mystic card header */}
                  <div className="w-full text-center relative z-10 pt-3">
                    <span className="font-serif text-[10px] tracking-widest text-purple-400/60 uppercase font-black">
                      {revealedCard.orientation === 'reversed' ? 'REVERSED' : 'UPRIGHT'}
                    </span>
                  </div>

                  {/* Mystic card image */}
                  <div className="w-36 h-52 rounded-lg bg-black/40 border border-indigo-950/40 relative flex flex-col items-center justify-center overflow-hidden">
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
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-cyan-500/10" />
                        {/* Glowing Symbol */}
                        <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 flex items-center justify-center relative">
                          <div className="absolute inset-0 bg-purple-400/5 blur-md rounded-full" />
                          <Sparkles className="w-8 h-8 text-cyan-300 animate-pulse" />
                        </div>
                        {/* Orientation marker */}
                        <div className={`mt-4 text-[9px] font-mono tracking-wider text-purple-400/60 transition-transform ${revealedCard.orientation === 'reversed' ? 'rotate-180' : ''}`}>
                          ▲
                        </div>
                      </>
                    )}
                  </div>

                  {/* Card footer title */}
                  <div className="w-full text-center relative z-10 pb-4">
                    <h3 className="font-serif text-sm font-black tracking-widest text-purple-200 uppercase">
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
                  <span className="text-xs uppercase font-serif tracking-widest text-[#cbd5e1] bg-purple-950/30 px-3 py-1 rounded-full border border-indigo-900/30">
                    {getOrientationLabel(revealedCard.orientation)}
                  </span>
                </div>
              </div>

              {/* Text interpretation column */}
              <div className="md:col-span-8 flex flex-col justify-center">
                <div className="tarot-glass border-indigo-950/20 rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-serif text-xs text-purple-400 tracking-widest uppercase font-bold mb-2">
                      QUẺ BÀI HÔM NAY CỦA BẠN
                    </h3>
                    
                    <h2 className="font-serif text-2xl md:text-3xl font-black text-white tracking-widest mb-6 border-b border-indigo-950/20 pb-4">
                      {revealedCard.name}
                    </h2>
                    
                    {/* Mystical Generated full text */}
                    <div className="text-sm sm:text-base leading-relaxed text-slate-300 font-medium italic border-l-2 border-purple-500/40 pl-4 py-1 mb-8 bg-purple-500/[0.02]">
                      &ldquo;{revealedCard.full_text}&rdquo;
                    </div>

                    <h4 className="font-serif text-sm font-bold text-white tracking-widest uppercase mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-purple-400" />
                      GIẢI NGHĨA CHI TIẾT
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {revealedCard.long_meaning}
                    </p>
                  </div>

                  {/* Actions buttons */}
                  <div className="mt-8 pt-6 border-t border-indigo-950/20 flex flex-wrap gap-4 items-center">
                    <button
                      onClick={handleShare}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-serif font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-purple-600/15"
                    >
                      <Share2 className="w-4 h-4" /> CHIA SẺ
                    </button>
                    
                    <Link
                      href="/tarot"
                      className="border border-purple-500/30 hover:bg-purple-500/10 text-purple-300 text-xs font-serif font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all active:scale-95"
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
      <CosmicEnergyPopup 
        isOpen={isEnergyPopupOpen} 
        onClose={() => setIsEnergyPopupOpen(false)}
        onClaimSuccess={(newEnergy, newMaxEnergy) => {
          // Khi nhận quà thành công, phát sự kiện cập nhật header
          window.dispatchEvent(new CustomEvent('astro:energy-update', { 
            detail: { energy: newEnergy, maxEnergy: newMaxEnergy } 
          }));
        }}
      />
    </div>
  );
}
