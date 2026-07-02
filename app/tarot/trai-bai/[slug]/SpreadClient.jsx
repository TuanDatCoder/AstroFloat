'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Eye, Share2, HelpCircle, Loader2, Heart, Briefcase, Coins, Compass, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import GalaxyAIIcon from '@/components/GalaxyAIIcon';
import { tarotService } from '@/services/tarotService';

const topicDetails = {
  'tinh-yeu': {
    id: 2,
    name: 'Trải Bài Tình Yêu',
    description: 'Trải bài Tarot Tình Yêu giúp bạn thấu hiểu sâu sắc các khía cạnh trong mối quan hệ của mình. Từ việc nhìn nhận trạng thái hiện tại, nhận diện những khó khăn thử thách đang tồn tại, cho đến những lời khuyên hữu ích để nuôi dưỡng tình cảm. Hãy giữ tâm trí tĩnh lặng và tập trung vào người ấy khi bốc bài để nhận được thông điệp chính xác nhất từ vũ trụ.',
    icon: Heart,
    iconColor: 'text-purple-400',
    slots: [
      { order: 1, name: 'Trạng thái hiện tại' },
      { order: 2, name: 'Thử thách / Khó khăn' },
      { order: 3, name: 'Lời khuyên / Tương lai' }
    ]
  },
  'su-nghiep': {
    id: 3,
    name: 'Trải Bài Sự Nghiệp',
    description: 'Sử dụng trải bài Sự Nghiệp để soi sáng con đường công danh của bạn. Trải bài này sẽ giúp bạn phân tích kỹ lưỡng hiện trạng công việc, nhận diện những cơ hội bứt phá hoặc rào cản ngầm, và chỉ ra định hướng hành động tốt nhất để thăng tiến. Thích hợp khi bạn đang đứng trước ngã rẽ sự nghiệp hoặc cần động lực phát triển.',
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
    description: 'Mở khóa dòng chảy tiền bạc với trải bài Tài Chính. Việc thấu hiểu tình hình tài chính hiện thời và những rào cản vô hình sẽ giúp bạn thu hút sự thịnh vượng. Trải bài cung cấp những lời khuyên thực tế từ vũ trụ để bạn quản lý chi tiêu khôn ngoan và đón nhận may mắn tài lộc.',
    icon: Coins,
    iconColor: 'text-teal-400',
    slots: [
      { order: 1, name: 'Tình hình tài chính hiện thời' },
      { order: 2, name: 'Rào cản dòng tiền' },
      { order: 3, name: 'Lời khuyên tài lộc' }
    ]
  },
  'hang-ngay': {
    id: 1,
    name: 'Thông Điệp Ngày Mới',
    description: 'Bắt đầu ngày mới đầy năng lượng với một lá bài Tarot chỉ dẫn. Thông điệp ngày mới giúp bạn định chuẩn lại tần số, chuẩn bị tâm lý đón nhận những sự kiện trong 24 giờ tới, và mang đến lời khuyên ngắn gọn, súc tích để bạn luôn vững vàng trong mọi tình huống.',
    icon: Compass,
    iconColor: 'text-indigo-300',
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

  // AI Summary States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);

  // Mảng tượng trưng cho bộ bài (78 lá, ta mô tả 22 lá để vẽ quạt bài)
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
        // Lưu kết quả hiện tại
        if (typeof window !== 'undefined') {
          localStorage.setItem(`astrofloat_tarot_current_${topicSlug}`, JSON.stringify({
            result: reading,
            styleId: styleId
          }));
        }
      }, 1500);
    } catch (e) {
      console.error('Lỗi khi bốc bài:', e.message || e);
      
      // Fallback mô phỏng nếu Supabase lỗi hoặc chưa nhập key
      setTimeout(() => {
        const names = ['The Fool', 'The Magician', 'The Lovers', 'The Empress', 'The Emperor', 'The Chariot', 'The Star', 'The Sun', 'The World'];
        const shuffledNames = [...names].sort(() => 0.5 - Math.random());
        
        const cardMeanings = {
          'The Fool': { shortUp: 'sự khởi đầu mới đầy tự do', shortRev: 'sự bất cẩn, hành động bốc đồng', keywords: ['khởi đầu', 'tự do', 'phiêu lưu'] },
          'The Magician': { shortUp: 'khả năng làm chủ và biến ước mơ thành hiện thực', shortRev: 'năng lượng bị phân tán, trì hoãn', keywords: ['sáng tạo', 'tập trung', 'ý chí'] },
          'The Lovers': { shortUp: 'sự gắn kết sâu sắc và thăng hoa cảm xúc', shortRev: 'sự rạn nứt hoặc mất kết nối', keywords: ['gắn kết', 'hòa hợp', 'lựa chọn'] },
          'The Empress': { shortUp: 'sự sinh sôi, dồi dào năng lượng sáng tạo', shortRev: 'sự trì trệ, thiếu chăm sóc bản thân', keywords: ['nuôi dưỡng', 'sáng tạo', 'thịnh vượng'] },
          'The Emperor': { shortUp: 'kỷ luật, kiểm soát tốt tình thế', shortRev: 'sự cứng nhắc hoặc độc đoán', keywords: ['kỷ luật', 'kiên định', 'kiểm soát'] },
          'The Chariot': { shortUp: 'sự quyết tâm vượt qua chướng ngại', shortRev: 'sự mất phương hướng hoặc quá tải', keywords: ['quyết tâm', 'tiến lên', 'kiên trì'] },
          'The Star': { shortUp: 'hy vọng, niềm tin và chữa lành tâm hồn', shortRev: 'sự thất vọng hoặc nghi ngờ bản thân', keywords: ['hy vọng', 'chữa lành', 'niềm tin'] },
          'The Sun': { shortUp: 'sự tỏa sáng, thành công rực rỡ và niềm vui', shortRev: 'sự kiêu ngạo hoặc chủ quan', keywords: ['tỏa sáng', 'thành công', 'niềm vui'] },
          'The World': { shortUp: 'sự viên mãn, hoàn thành xuất sắc chặng đường', shortRev: 'sự dang dở, thiếu kiên nhẫn phút cuối', keywords: ['viên mãn', 'trọn vẹn', 'hoàn thành'] }
        };

        const mockCards = topicInfo.slots.map((slot, i) => {
          const cardName = shuffledNames[i % shuffledNames.length];
          const isUpright = Math.random() < 0.5;
          const orientation = isUpright ? 'upright' : 'reversed';
          const details = cardMeanings[cardName] || { shortUp: 'năng lượng tích cực', shortRev: 'sự trì hoãn cần kiên nhẫn', keywords: ['tarot', 'năng lượng'] };
          const short_meaning = isUpright ? details.shortUp : details.shortRev;
          
          return {
            position: slot.order,
            position_name: slot.name,
            card_id: i + 1,
            card_name: cardName,
            orientation,
            short_meaning,
            long_meaning: `Lá bài ${cardName} ở thế ${isUpright ? 'Xuôi' : 'Ngược'} đại diện cho ${slot.name}. Thông điệp vũ trụ gửi đến bạn là: ${short_meaning}. Hãy kiên định và đón nhận thông điệp một cách cởi mở nhất.`,
            keywords: details.keywords,
            image_url: `/assets/cards/${cardName.toLowerCase().replace(/ /g, '-')}.png`
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

        // Lưu local history
        tarotService.saveReadingToLocal(mockReading);

        setResult(mockReading);
        setGameState('done');
        setLoading(false);
        // Lưu kết quả hiện tại
        if (typeof window !== 'undefined') {
          localStorage.setItem(`astrofloat_tarot_current_${topicSlug}`, JSON.stringify({
            result: mockReading,
            styleId: styleId
          }));
        }
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
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`astrofloat_tarot_current_${topicSlug}`);
    }
    setSelectedCardsIndices([]);
    setResult(null);
    setAiResult(null);
    setAiError(null);
    setAiLoading(false);
    setGameState('idle');
  };

  // Restore state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`astrofloat_tarot_current_${topicSlug}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.result) {
            setResult(parsed.result);
            if (parsed.aiResult) {
              setAiResult(parsed.aiResult);
            }
            setGameState('done');
          }
        } catch (e) {
          console.error('Failed to parse saved tarot reading', e);
        }
      }
    }
  }, [topicSlug]);

  const askAi = async () => {
    if (!result) return;
    setAiLoading(true);
    setAiError(null);

    const stylesMap = { 1: 'genz', 2: 'healing', 3: 'deep', 4: 'toxic' };
    const styleName = stylesMap[styleId] || 'healing';

    try {
      const response = await fetch('/api/tarot/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicName: topicInfo.name,
          cards: result.cards,
          fullText: result.full_text,
          styleName,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setAiResult(data.analysis);
        if (typeof window !== 'undefined') {
          localStorage.setItem(`astrofloat_tarot_current_${topicSlug}`, JSON.stringify({
            result,
            styleId,
            aiResult: data.analysis
          }));
        }
      } else {
        setAiError(data.error || 'Có lỗi xảy ra khi kết nối với AI.');
      }
    } catch (e) {
      console.error('Lỗi khi gọi AI:', e);
      setAiError(e.message || 'Lỗi mạng khi kết nối với AI.');
    } finally {
      setAiLoading(false);
    }
  };

  const TopicIcon = topicInfo.icon;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
      {/* Back Link */}
      <div className="text-left mb-8">
        <Link href="/tarot" className="text-xs uppercase tracking-widest text-slate-400 hover:text-cyan-200 flex items-center gap-1.5 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Về Trang chủ Tarot
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-indigo-950/40 rounded-full px-4.5 py-1.5 bg-indigo-950/20 mb-6 text-slate-300 text-xs sm:text-sm tracking-widest font-serif">
          <TopicIcon className={`w-4 h-4 ${topicInfo.iconColor}`} />
          {topicInfo.name.toUpperCase()}
        </div>

        {gameState !== 'done' && (
          <>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-white mb-4">
              THIẾT LẬP NĂNG LƯỢNG
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto mb-12">
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
              className="tarot-glass border-indigo-950/30 rounded-3xl p-10 max-w-md mx-auto"
            >
              <div className="relative w-40 h-64 mx-auto mb-8">
                <div className="absolute inset-0 bg-[#0a0f29] border border-purple-500/20 rounded-2xl shadow-xl transform rotate-[-4deg] translate-x-[-8px] opacity-50" />
                <div className="absolute inset-0 bg-[#131a40] border-2 border-purple-500/30 rounded-2xl shadow-2xl flex flex-col items-center justify-center" />
                <div className="absolute inset-3 border border-purple-500/10 rounded-xl flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border border-purple-500/20 flex items-center justify-center animate-spin-slow">
                    <Sparkles className="w-5 h-5 text-purple-400/40" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleShuffle}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-serif font-black tracking-widest uppercase text-sm py-4.5 rounded-xl transition-all shadow-lg shadow-purple-600/15 active:scale-[0.98]"
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
              className="tarot-glass border-indigo-950/30 rounded-3xl p-12 max-w-md mx-auto flex flex-col items-center justify-center min-h-[380px]"
            >
              <div className="relative w-36 h-56 mb-8">
                <motion.div 
                  animate={{ 
                    x: [-35, 35, -35], 
                    rotate: [-8, 8, -8],
                    zIndex: [1, 3, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#1c245c] border border-purple-500/30 rounded-xl"
                />
                <motion.div 
                  animate={{ 
                    x: [35, -35, 35], 
                    rotate: [8, -8, 8],
                    zIndex: [3, 1, 3]
                  }}
                  transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#0b0e24] border border-purple-500/10 rounded-xl"
                />
              </div>
              <p className="font-serif text-base text-purple-300 tracking-widest uppercase font-bold animate-pulse">
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
                          ? 'border-purple-500 bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                          : 'border-indigo-950/40 bg-black/20'
                      }`}
                    >
                      <span className="font-serif text-[10px] tracking-widest uppercase text-purple-300 font-bold">
                        VỊ TRÍ {slot.order}: {slot.name}
                      </span>
                      
                      {hasCard ? (
                        <motion.div 
                          initial={{ scale: 0.7, rotate: 10, opacity: 0 }}
                          animate={{ scale: 1, rotate: 0, opacity: 1 }}
                          className="w-24 h-40 bg-gradient-to-b from-[#1c245c] to-[#050714] border border-purple-400/50 rounded-xl shadow-lg relative flex flex-col items-center justify-center"
                        >
                          <div className="absolute inset-1.5 border border-purple-500/10 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-400/20" />
                          </div>
                        </motion.div>
                      ) : (
                        <div className="w-24 h-40 border border-indigo-950/20 bg-black/20 rounded-xl flex items-center justify-center">
                          <HelpCircle className="w-6 h-6 text-indigo-950/30" />
                        </div>
                      )}
                      
                      <span className="text-[10px] text-slate-400">
                        {hasCard ? 'Đã rút' : 'Đang chờ rút...'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Fan Pile of Cards */}
              <div className="relative h-60 max-w-lg mx-auto mb-6">
                <h3 className="font-serif text-sm tracking-widest text-slate-400 font-semibold mb-8 uppercase">
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
                        className={`absolute w-16 h-28 cursor-pointer rounded-lg bg-gradient-to-b from-[#0a0f29] to-[#050714] border border-purple-500/20 shadow-lg flex items-center justify-center ${
                          isDrawn ? 'pointer-events-none' : 'hover:border-purple-400'
                        }`}
                      >
                        <div className="w-12 h-24 border border-indigo-950/40 rounded-md flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 text-purple-500/20" />
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
              className="tarot-glass border-indigo-950/30 rounded-3xl p-12 max-w-md mx-auto flex flex-col items-center justify-center min-h-[380px]"
            >
              {/* Spinner */}
              <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
                <RefreshCw className="w-10 h-10 text-purple-400 animate-spin" />
                <div className="absolute inset-0 bg-purple-500/20 blur-md rounded-full" />
              </div>
              <p className="font-serif text-base text-purple-300 tracking-widest uppercase font-bold animate-pulse">
                ĐANG KẾT NỐI VŨ TRỤ...
              </p>
              <p className="text-xs text-slate-400 mt-2">
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
              <div className="tarot-glass border-indigo-950/20 rounded-3xl p-6 md:p-8 mb-6 text-center relative overflow-hidden bg-purple-950/10">
                <div className="absolute -left-12 -top-12 opacity-5 text-purple-400 pointer-events-none">
                  <Sparkles className="w-40 h-40" />
                </div>
                <h3 className="font-serif text-xs text-purple-400 tracking-widest uppercase font-black mb-3">
                  BẢN ĐỒ GIẢI MÃ VŨ TRỤ DÀNH CHO BẠN
                </h3>
                <p className="font-serif italic text-lg md:text-xl text-slate-200 leading-relaxed max-w-3xl mx-auto">
                  &ldquo;{result.full_text}&rdquo;
                </p>
              </div>

              {/* Note about Upright/Reversed */}
              <div className="max-w-3xl mx-auto mb-10 text-center">
                <p className="text-xs text-slate-400 leading-relaxed bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-3 inline-block">
                  <strong className="text-purple-300">Ghi chú:</strong> Khi rút bài, các lá bài có thể xuất hiện <strong>Xuôi (Upright)</strong> mang ý nghĩa trực diện tích cực, hoặc <strong>Ngược (Reversed)</strong> biểu thị năng lượng bị trì hoãn, ngược lại hoặc đang hướng vào bên trong.
                </p>
              </div>

              {/* Cards layout */}
              <div className="grid grid-cols-1 gap-8 mb-12">
                {result.cards && Array.isArray(result.cards) && result.cards.map((c, i) => (
                  <div key={i} className={`grid grid-cols-1 ${result.cards.length === 1 ? 'md:grid-cols-1 place-items-center' : 'md:grid-cols-12'} gap-6 items-center border-b border-indigo-950/20 pb-8 last:border-0 last:pb-0`}>
                    
                    {/* Visual Card */}
                    <div className={`${result.cards.length === 1 ? 'flex flex-col items-center' : 'md:col-span-3 flex flex-col items-center'}`}>
                      <div className="relative w-40 h-64 rounded-2xl bg-gradient-to-b from-[#0a0e29] to-[#03050c] border-2 border-purple-500/50 p-1 flex flex-col items-center justify-between shadow-xl relative overflow-hidden">
                        <div className="absolute inset-1.5 border border-purple-500/20 rounded-xl pointer-events-none" />
                        
                        <div className="w-full text-center relative z-10 pt-2">
                          <span className="font-serif text-[8px] tracking-widest text-purple-400/60 uppercase font-black">
                            {c.orientation === 'reversed' ? 'REVERSED' : 'UPRIGHT'}
                          </span>
                        </div>

                        {/* Mystic card image */}
                        <div className="w-32 h-44 rounded-md bg-black/40 border border-indigo-950/40 relative flex flex-col items-center justify-center overflow-hidden">
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
                              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-cyan-500/10" />
                              <div className="w-12 h-12 rounded-full border border-purple-500/20 flex items-center justify-center relative">
                                <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
                              </div>
                              <div className={`mt-3 text-[8px] font-mono tracking-wider text-purple-400/60 transition-transform ${c.orientation === 'reversed' ? 'rotate-180' : ''}`}>
                                ▲
                              </div>
                            </>
                          )}
                        </div>

                        <div className="w-full text-center relative z-10 pb-3">
                          <h3 className="font-serif text-xs font-black tracking-widest text-purple-300 uppercase truncate px-2">
                            {c.card_name}
                          </h3>
                        </div>

                        {c.orientation === 'reversed' && (
                          <div className="absolute inset-0 bg-black/5 pointer-events-none transform rotate-180 mix-blend-overlay" />
                        )}
                      </div>
                    </div>

                    {/* Explanations Details */}
                    <div className={`${result.cards.length === 1 ? 'w-full max-w-2xl text-center' : 'md:col-span-9 text-left'}`}>
                      <div className="tarot-glass border-indigo-950/20 rounded-2xl p-6">
                        <div className={`flex flex-wrap items-center ${result.cards.length === 1 ? 'justify-center' : 'justify-between'} gap-4 mb-3 border-b border-indigo-950/10 pb-2`}>
                          <span className="font-serif text-[10px] tracking-widest uppercase text-purple-400 font-black">
                            VỊ TRÍ {c.position || (i + 1)}: {c.position_name}
                          </span>
                          <span className="text-xs uppercase font-serif tracking-widest text-cyan-300 font-bold bg-purple-950/30 px-2 py-0.5 rounded border border-indigo-900/30">
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
                              <span key={kIdx} className="text-[9px] uppercase font-bold tracking-widest text-cyan-300/80 bg-purple-950/30 border border-[#0b0f24]/30 px-2 py-0.5 rounded">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed italic border-l border-purple-500/30 pl-3 mb-4 bg-purple-500/[0.02] py-0.5">
                          Thông điệp: {c.short_meaning}
                        </p>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {c.long_meaning}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* AI Analysis Container */}
              <div className="mt-16 mb-16 text-left max-w-4xl mx-auto">
                {!aiResult && !aiLoading && (
                  <div className="tarot-glass border-dashed border-2 border-purple-500/30 rounded-3xl p-8 text-center relative overflow-hidden bg-gradient-to-br from-indigo-950/10 to-purple-950/5">
                    <GalaxyAIIcon className="w-14 h-14 text-purple-400 mx-auto mb-4 animate-pulse" />
                    <h3 className="font-serif text-xl font-bold text-white mb-2">Trí Tuệ Nhân Tạo Góc Vũ Trụ</h3>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mb-6">
                      Để AI tổng hợp các lá bài bạn vừa rút và đưa ra những hướng đi/lời khuyên cụ thể.
                    </p>
                    <button
                      onClick={askAi}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-serif font-black tracking-widest uppercase text-xs px-8 py-4 rounded-xl transition-all shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      <GalaxyAIIcon className="w-5 h-5" /> Hỏi AI Góc Vũ Trụ
                    </button>
                    {aiError && <p className="text-rose-400 text-xs mt-4">Lỗi: {aiError}</p>}
                  </div>
                )}

                {aiLoading && (
                  <div className="tarot-glass border border-purple-500/20 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[250px]">
                    <GalaxyAIIcon className="w-12 h-12 text-purple-400 animate-pulse mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                    <p className="font-serif text-sm text-purple-300 tracking-widest uppercase font-bold animate-pulse">
                      AI đang phân tích sâu quẻ bài của bạn...
                    </p>
                  </div>
                )}

                {aiResult && (
                  <div className="tarot-glass border border-purple-500/30 rounded-3xl p-8 relative overflow-hidden bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-fuchsia-950/20">
                    <div className="flex items-center gap-3 border-b border-indigo-950/20 pb-4 mb-6">
                      <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                        <GalaxyAIIcon className="w-6 h-6 animate-pulse" />
                      </div>
                      <h3 className="font-serif text-base font-bold text-white tracking-widest uppercase">AI GIẢI MÃ SÂU SẮC</h3>
                    </div>
                    <div className="prose prose-invert prose-purple max-w-none text-slate-300 text-sm md:text-base leading-relaxed">
                      <ReactMarkdown>{aiResult}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 items-center justify-center border-t border-indigo-950/20 pt-8 mt-4">
                <button
                  onClick={resetSpread}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-serif font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow-lg shadow-purple-600/15"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> TRẢI BÀI LẠI
                </button>
                <button
                  onClick={handleShare}
                  className="border border-purple-500/30 hover:bg-purple-500/10 text-purple-300 text-xs font-serif font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> CHIA SẺ QUẺ
                </button>
                <Link
                  href="/tarot"
                  className="text-xs font-serif font-bold text-slate-400 hover:text-white uppercase tracking-widest px-4 py-3"
                >
                  CHỌN CHỦ ĐỀ KHÁC
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEO Text Content visible when idle */}
        {gameState === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 text-left bg-indigo-950/20 border border-indigo-900/40 rounded-3xl p-8 sm:p-10"
          >
            <h2 className="font-serif text-2xl font-bold text-white mb-4">Ý Nghĩa Của {topicInfo.name}</h2>
            <p className="text-slate-300 leading-relaxed mb-6 text-sm sm:text-base">
              {topicInfo.description}
            </p>
            <h3 className="font-serif text-xl font-bold text-white mb-3">Cấu trúc trải bài {numCardsNeeded} lá:</h3>
            <ul className="list-disc pl-5 text-slate-300 space-y-2 text-sm sm:text-base mb-6">
              {topicInfo.slots.map((slot, idx) => (
                <li key={idx}><strong className="text-purple-300">Lá số {slot.order}:</strong> {slot.name}</li>
              ))}
            </ul>
            <p className="text-slate-400 text-sm italic">
              Để trải bài được chính xác, hãy hít thở sâu, thả lỏng cơ thể và tập trung vào câu hỏi của bạn trong khoảng 10 giây trước khi nhấn nút "Xào Bài". Thông điệp từ vũ trụ luôn mang tính chất định hướng, quyền quyết định luôn nằm ở chính bạn.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
