'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Briefcase, 
  Coins, 
  Compass, 
  Sparkles, 
  History, 
  Smile, 
  Flame, 
  Eye, 
  Compass as HealingIcon 
} from 'lucide-react';
import TarotIcon from '@/components/TarotIcon';

const topics = [
  {
    id: 2,
    slug: 'tinh-yeu',
    name: 'Trải Bài Tình Yêu',
    description: 'Bản đồ kết nối trái tim: quá khứ, hiện tại và tương lai của mối quan hệ.',
    spreadText: 'Trải bài 3 Lá',
    icon: Heart,
    color: 'from-purple-950/30 to-pink-950/20',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400',
    shadowGlow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]'
  },
  {
    id: 3,
    slug: 'su-nghiep',
    name: 'Trải Bài Sự Nghiệp',
    description: 'Chỉ hướng công danh: soi tỏ hiện trạng, cơ hội bứt phá và rào cản sự nghiệp.',
    spreadText: 'Trải bài 3 Lá',
    icon: Briefcase,
    color: 'from-blue-950/30 to-indigo-950/20',
    borderColor: 'border-blue-500/30',
    iconColor: 'text-blue-400',
    shadowGlow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]'
  },
  {
    id: 4,
    slug: 'tai-chinh',
    name: 'Trải Bài Tài Chính',
    description: 'Khai mở tài lộc: khơi thông dòng chảy tiền bạc và cách thức đón nhận may mắn.',
    spreadText: 'Trải bài 3 Lá',
    icon: Coins,
    color: 'from-teal-950/30 to-emerald-950/20',
    borderColor: 'border-teal-500/30',
    iconColor: 'text-teal-400',
    shadowGlow: 'shadow-[0_0_20px_rgba(20,184,166,0.15)]'
  },
  {
    id: 1,
    slug: 'hang-ngay',
    name: 'Thông Điệp Ngày Mới',
    description: 'Năng lượng dẫn lối: Nhận lời khuyên nhanh và thông điệp cho 24 giờ tiếp theo.',
    spreadText: 'Trải bài 1 Lá',
    icon: Compass,
    color: 'from-indigo-950/30 to-cyan-950/20',
    borderColor: 'border-indigo-500/30',
    iconColor: 'text-indigo-300',
    shadowGlow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]'
  }
];

const styles = [
  {
    id: 1,
    name: 'genz',
    label: 'Gen Z hài hước',
    description: 'Mặn mòi, lầy lội, tràn ngập teencode và bắt trend cực mạnh.',
    icon: Smile,
    badgeColor: 'bg-purple-950/40 text-purple-300 border-purple-800/30',
    glowColor: 'group-hover:border-purple-400'
  },
  {
    id: 2,
    name: 'healing',
    label: 'Chữa Lành ấm áp',
    description: 'Dịu dàng, xoa dịu tổn thương, mang năng lượng tích cực nuôi dưỡng tâm hồn.',
    icon: HealingIcon,
    badgeColor: 'bg-teal-950/40 text-teal-300 border-teal-800/30',
    glowColor: 'group-hover:border-teal-400'
  },
  {
    id: 3,
    name: 'deep',
    label: 'Sâu Sắc triết lý',
    description: 'Nghiêm túc, phân tích tâm lý sâu sắc dưới góc nhìn nhân quả và vũ trụ học.',
    icon: Eye,
    badgeColor: 'bg-blue-950/40 text-blue-300 border-blue-800/30',
    glowColor: 'group-hover:border-blue-400'
  },
  {
    id: 4,
    name: 'toxic',
    label: 'Toxic vả thật',
    description: 'Thẳng thắn, phũ phàng, vạch trần ảo tưởng và vả thẳng sự thật vào mặt.',
    icon: Flame,
    badgeColor: 'bg-rose-950/40 text-rose-300 border-rose-800/30',
    glowColor: 'group-hover:border-rose-400'
  }
];

export default function TarotHomeClient() {
  const [selectedStyle, setSelectedStyle] = useState(2); // Mặc định là healing
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  React.useEffect(() => {
    const savedStyle = localStorage.getItem('tarot_selected_style');
    if (savedStyle) {
      setSelectedStyle(parseInt(savedStyle, 10));
    }
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleStyleChange = (id) => {
    setSelectedStyle(id);
    localStorage.setItem('tarot_selected_style', id.toString());
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 border border-indigo-950/40 rounded-full px-4.5 py-1.5 bg-indigo-950/25 mb-6 text-slate-300 text-xs sm:text-sm tracking-widest font-serif"
        >
          <TarotIcon className="w-7 h-7 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
          KẾT NỐI KHÔNG GIAN TÂM LINH
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-black tracking-widest leading-tight text-white mb-6"
        >
          TAROT <span className="bg-gradient-to-r from-indigo-200 via-purple-200 to-cyan-200 bg-clip-text text-transparent">GÓC VŨ TRỤ</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-300 text-sm sm:text-base leading-relaxed"
        >
          Lắng nghe lời thì thầm của số phận qua những lá bài cổ xưa. Chọn một chủ đề trải bài và văn phong trò chuyện để nhận thông điệp phù hợp nhất với tần số của bạn.
        </motion.p>
      </div>

      {/* Style selector */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8 border-b border-indigo-950/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-white flex items-center">
              <span className="font-sans text-purple-400 mr-2 font-black text-2xl sm:text-3xl">1.</span>
              <span className="pt-1">CHỌN GIỌNG ĐIỆU GIẢI NGHĨA</span>
            </h2>
          </div>
          <span className="text-xs tracking-wider text-slate-400 font-serif hidden sm:inline">VĂN PHONG DIỄN ĐẠT CỦA BÀI ĐỌC</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {styles.map((style) => {
            const StyleIcon = style.icon;
            const isSelected = selectedStyle === style.id;
            return (
              <div
                key={style.id}
                onClick={() => handleStyleChange(style.id)}
                className={`group cursor-pointer rounded-2xl p-5 border text-left transition-all duration-300 relative overflow-hidden ${
                  isSelected 
                    ? 'bg-purple-950/30 border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.15)]' 
                    : 'bg-[#0a0e29]/40 border-indigo-950/20 hover:border-purple-500/30'
                }`}
              >
                {/* Background Selection Aura */}
                {isSelected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                )}
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-purple-500/20 text-purple-300' : 'bg-indigo-950/20 text-slate-400 group-hover:text-purple-300'} transition-colors`}>
                    <StyleIcon className="w-5 h-5" />
                  </div>
                  
                  {/* Selected Radio Indicator */}
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-purple-400 bg-purple-500/20' : 'border-indigo-950/60'}`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />}
                  </div>
                </div>

                <h3 className="font-serif font-bold text-base text-white tracking-wider mb-2 relative z-10">
                  {style.label}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed relative z-10">
                  {style.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Topics selector */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8 border-b border-indigo-950/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-white flex items-center">
              <span className="font-sans text-purple-400 mr-2 font-black text-2xl sm:text-3xl">2.</span>
              <span className="pt-1">CHỌN CHỦ ĐỀ TRẢI BÀI</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/tarot/thu-vien"
              className="text-xs tracking-widest text-purple-300 hover:text-white font-sans font-bold uppercase bg-purple-900/30 px-3 py-1.5 rounded-lg border border-purple-500/30 transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              Thư Viện 78 Lá Bài &rarr;
            </Link>
            <span className="text-xs tracking-wider text-slate-400 font-serif hidden md:inline">BẮT ĐẦU KẾT NỐI VŨ TRỤ</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((topic) => {
            const TopicIcon = topic.icon;
            return (
              <Link 
                href={`/tarot/trai-bai/${topic.slug}?style=${selectedStyle}`} 
                key={topic.id}
                className="group block"
              >
                <div className={`tarot-glass tarot-glass-hover rounded-3xl p-6 md:p-8 flex items-start gap-6 border-indigo-950/20 h-full relative overflow-hidden bg-gradient-to-br ${topic.color} ${topic.shadowGlow}`}>
                  
                  {/* Decorative Symbol backdrop */}
                  <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                    <TopicIcon className="w-40 h-40" />
                  </div>
                  
                  {/* Glowing border outline */}
                  <div className={`absolute inset-0 border border-transparent group-hover:${topic.borderColor} rounded-3xl pointer-events-none transition-all duration-300`} />

                  <div className={`p-4 rounded-2xl bg-indigo-950/25 border border-indigo-900/10 ${topic.iconColor} group-hover:scale-110 transition-transform`}>
                    <TopicIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>

                  <div className="flex-grow text-left">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] tracking-wider text-slate-400 group-hover:text-purple-300 transition-colors uppercase font-bold">
                        Bắt đầu đọc &rarr;
                      </span>
                      <span className="font-sans text-[10px] bg-purple-500/20 text-purple-200 px-2 py-0.5 rounded border border-purple-500/30 tracking-wider uppercase font-bold">
                        {topic.spreadText} (-{topic.slug === 'hang-ngay' ? 1 : 3} ⚡)
                      </span>
                    </div>

                    <h3 className="font-serif font-black text-lg sm:text-xl text-white tracking-widest mb-3">
                      {topic.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md">
                      {topic.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Daily Quick Widget & History Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t border-indigo-950/20 pt-12">
        <div className="tarot-glass rounded-3xl p-6 text-left flex items-center justify-between border-indigo-950/20">
          <div>
            <h3 className="font-serif font-bold text-lg text-white mb-1">
              Bạn Muốn Trải Nghiệm Nhanh?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Xem lá bài may mắn và năng lượng cốt lõi đại diện cho ngày hôm nay của bạn chỉ với một lần rút.
            </p>
          </div>
          <Link href="/tarot/daily" className="shrink-0 bg-purple-600 hover:bg-purple-500 text-white text-xs font-serif font-bold uppercase tracking-widest px-5 py-3 rounded-full transition-all active:scale-95 shadow-lg shadow-purple-600/15">
            BỐC HẰNG NGÀY
          </Link>
        </div>

        <div className="tarot-glass rounded-3xl p-6 text-left flex items-center justify-between border-indigo-950/20">
          <div>
            <h3 className="font-serif font-bold text-lg text-white mb-1">
              Lịch Sử Trải Bài Của Bạn
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Tìm lại lời chỉ dẫn đã nhận từ vũ trụ và so sánh sự thay đổi năng lượng của bạn qua từng ngày.
            </p>
          </div>
          <Link href="/tarot/history" className="shrink-0 border border-purple-500/30 hover:bg-purple-500/10 text-purple-300 text-xs font-serif font-bold uppercase tracking-widest px-5 py-3 rounded-full transition-all active:scale-95 flex items-center gap-2">
            <History className="w-3.5 h-3.5" />
            LỊCH SỬ
          </Link>
        </div>
      </div>

      {/* Floating Button for Tarot Goc Vu Tru */}
      <div 
        className={`fixed bottom-6 left-6 md:bottom-10 md:left-10 z-50 flex pointer-events-none transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <Link 
          href="/tarot/tarot-goc-vu-tru" 
          className="pointer-events-auto group relative flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-indigo-950/80 backdrop-blur-md border border-fuchsia-500/50 rounded-full hover:bg-fuchsia-900/40 transition-all duration-300 shadow-[0_0_30px_rgba(192,38,211,0.2)] hover:shadow-[0_0_40px_rgba(192,38,211,0.4)] hover:-translate-y-1"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 opacity-20 group-hover:opacity-30 transition-opacity" />
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse" />
          <span className="text-[10px] md:text-xs font-bold text-white tracking-widest uppercase relative z-10 hidden sm:inline-block">
            Giải Mã Tarot Góc Vũ Trụ
          </span>
          <span className="text-[10px] md:text-xs font-bold text-white tracking-widest uppercase relative z-10 sm:hidden">
            Giải Mã
          </span>
        </Link>
      </div>
    </div>
  );
}
