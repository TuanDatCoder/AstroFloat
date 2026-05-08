'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Sparkles, Star, ArrowRight, Compass, Moon, UserCircle2, 
  Newspaper, HelpCircle, Zap, ShieldCheck, Heart, 
  Gem, BookOpen, ChevronDown
} from 'lucide-react';
import AdBanner from '@/components/AdBanner';
import { ROUTES } from '@/constants';
import { newsService } from '@/services/newsService';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const faqItems = [
  {
    q: "Thần số học là gì và tại sao nên biết con số chủ đạo?",
    a: "Thần số học là bộ môn khoa học nghiên cứu về năng lượng của các con số ảnh hưởng đến cuộc đời con người. Biết con số chủ đạo giúp bạn hiểu rõ điểm mạnh, điểm yếu và sứ mệnh cốt lõi của bản thân để định hướng tương lai chính xác hơn."
  },
  {
    q: "Thông tin cá nhân của tôi có được bảo mật không?",
    a: "Chúng tôi cam kết bảo mật tuyệt đối thông tin ngày sinh và họ tên của bạn. Dữ liệu chỉ được sử dụng để tính toán các chỉ số cá nhân và không được chia sẻ cho bên thứ ba."
  },
  {
    q: "Làm thế nào để biết cung hoàng đạo của mình chính xác nhất?",
    a: "Bạn chỉ cần cung cấp ngày tháng năm sinh. Hệ thống của Góc Vũ Trụ sẽ tự động xác định cung mặt trời và cung cấp các phân tích chuyên sâu về tính cách, tình duyên và sự nghiệp của bạn."
  }
];

export default function Home() {
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsService.getArticles();
        setLatestNews(data?.slice(0, 3) || []);
      } catch (err) {
        console.error("Lỗi fetch tin tức:", err);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen relative bg-[#05070A] overflow-x-hidden">
      
      {/* Optimized Static Background - No Blur/Animations during scroll */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,_rgba(147,51,234,0.15)_0%,_transparent_50%),_radial-gradient(circle_at_80%_80%,_rgba(16,185,129,0.1)_0%,_transparent_50%)]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 w-full pt-32 pb-24 flex flex-col items-center px-6 text-center transform-gpu">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl w-full flex flex-col items-center"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-slate-900 border border-white/10 text-white/80 text-[10px] font-black tracking-[0.4em] mb-10 uppercase shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" /> 
              Tâm Điểm Năng Lượng Vũ Trụ 
              <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" />
            </div>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-[100px] font-black text-white mb-10 tracking-tighter leading-[0.9]"
          >
            Giải Mã Bản Đồ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-emerald-400 to-cyan-400">
              Vận Mệnh.
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-slate-400 text-lg md:text-xl font-light mb-16 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Khám phá rung động của linh hồn qua <span className="text-white font-medium italic">Thần Số Học</span> và 
            các tinh tú từ <span className="text-white font-medium italic">Chiêm Tinh Học</span> hiện đại.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 mb-24">
            <Link href={ROUTES.DISCOVER}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-black rounded-full font-black text-sm tracking-widest flex items-center gap-3 transition-all uppercase hover:bg-emerald-400 shadow-xl shadow-white/10"
              >
                <Compass className="w-5 h-5" /> 
                Bắt đầu khám phá
              </motion.button>
            </Link>
            <Link href={ROUTES.NUMEROLOGY}>
              <motion.button
                whileHover={{ backgroundColor: "rgba(255,255,255,0.05)", scale: 1.02 }}
                className="px-10 py-5 border border-white/10 text-white rounded-full font-black text-sm tracking-widest uppercase transition-all"
              >
                Xem số chủ đạo
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Services Grid */}
      <section className="relative z-10 w-full max-w-7xl px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            href={ROUTES.ZODIAC}
            icon={<Star className="w-10 h-10 text-cyan-400" />}
            title="12 Chòm Sao"
            desc="Phân tích tính cách và vận mệnh dựa trên bản đồ sao của riêng bạn."
            color="cyan"
            floatClass="float-card-0"
          />
          <ServiceCard 
            href={ROUTES.NUMEROLOGY}
            icon={<Sparkles className="w-10 h-10 text-purple-400" />}
            title="Thần Số Học"
            desc="Tìm hiểu con số chủ đạo và sứ mệnh cuộc đời qua ngày tháng năm sinh."
            color="purple"
            floatClass="float-card-1"
          />
          <ServiceCard 
            href={ROUTES.NAME_NUMEROLOGY}
            icon={<UserCircle2 className="w-10 h-10 text-emerald-400" />}
            title="Thần Số Tên"
            desc="Giải mã tần số năng lượng ẩn sau cái tên và linh hồn của bạn."
            color="emerald"
            floatClass="float-card-2"
          />
        </div>
      </section>

      {/* SEO Content Section - Premium Redesign */}
      <section className="relative z-10 w-full py-32 bg-slate-900/40 border-y border-white/5 transform-gpu overflow-hidden">
        {/* Decorative background for this section */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="space-y-4">
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em]">Tầm Nhìn Sứ Mệnh</span>
               <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] uppercase tracking-tight">
                Tại sao bạn cần biết <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 italic">Vận Mệnh Của Mình?</span>
              </h2>
            </div>

            <div className="space-y-6 text-slate-400 leading-loose text-lg font-light">
              <p>
                Vũ trụ không vận hành một cách ngẫu nhiên. Mỗi con người sinh ra đều mang trong mình một mã code năng lượng riêng biệt, được thể hiện qua các con số và vị trí của các hành tinh tại thời điểm khai sinh.
              </p>
              <p>
                <span className="text-white font-bold underline decoration-indigo-500/50 underline-offset-4">Thần Số Học</span> cung cấp bản đồ về con đường sự nghiệp và phát triển bản thân. Trong khi đó, <span className="text-white font-bold underline decoration-purple-500/50 underline-offset-4">Chiêm Tinh Học</span> giúp bạn thấu hiểu sâu sắc về thế giới nội tâm và các mối quan hệ xã hội.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
                <FeatureItem icon={<Zap className="text-amber-400" />} text="Định hướng sự nghiệp" />
                <FeatureItem icon={<Heart className="text-rose-400" />} text="Hàn gắn tình cảm" />
                <FeatureItem icon={<ShieldCheck className="text-cyan-400" />} text="Thấu hiểu bản thân" />
                <FeatureItem icon={<Gem className="text-purple-400" />} text="Khai phá tiềm năng" />
              </div>
            </div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
             whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 1, type: "spring" }}
             className="relative flex items-center justify-center"
          >
            {/* Multi-layered Rotating Rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[110%] h-[110%] border border-white/5 rounded-full border-dashed"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-[95%] h-[95%] border border-indigo-500/10 rounded-full border-dotted"
            />
            
            {/* Main Visual Container */}
            <div className="relative w-full aspect-square max-w-[550px] rounded-[4rem] overflow-hidden group shadow-[0_0_80px_rgba(79,70,229,0.2)] border border-white/10 bg-slate-900">
               {/* High-quality Cosmic Image from Unsplash */}
               <img 
                src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000" 
                alt="Cosmic Destiny Portal" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80"
               />
               <Sparkles className="w-24 h-24 text-white opacity-20 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest News */}
      <section className="relative z-10 w-full py-24 max-w-7xl px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2 flex items-center gap-3">
              <Newspaper className="w-6 h-6 text-indigo-400" /> Tin Tức Vũ Trụ
            </h2>
            <p className="text-gray-500 font-medium">Cập nhật chuyển động từ các tinh tú.</p>
          </div>
          <Link href={ROUTES.NEWS} className="text-xs font-black text-white hover:text-indigo-400 transition-colors uppercase tracking-widest">
            Xem tất cả <ArrowRight className="w-4 h-4 inline ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestNews.map((news, idx) => (
            <motion.div 
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={ROUTES.NEWS_DETAIL(news.slug)} className="group">
                <div className="bg-slate-900 border border-white/5 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all h-full flex flex-col group-hover:-translate-y-2">
                  <div className="h-48 bg-slate-800 overflow-hidden">
                    <img src={news.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-400 transition-colors">{news.title}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2 mb-4 font-light">{news.summary}</p>
                    <div className="mt-auto flex items-center justify-between">
                       <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Khám phá ngay</span>
                       <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 w-full py-24 max-w-4xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2 flex items-center justify-center gap-3">
             <HelpCircle className="w-8 h-8 text-emerald-400" /> FAQ
          </h2>
          <p className="text-gray-500 italic text-sm">Thắc mắc thường gặp</p>
        </div>
        <div className="space-y-4">
          {faqItems.map((item, idx) => (
            <FAQItem key={idx} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 w-full py-32 flex flex-col items-center px-6 bg-indigo-600/5">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl"
        >
          <h2 className="text-4xl font-black text-white mb-8 uppercase leading-tight">Thay đổi cuộc đời <br /> <span className="text-indigo-400 italic">Ngay Hôm Nay</span></h2>
          <Link href={ROUTES.REGISTER}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(79,70,229,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-indigo-600 text-white rounded-full font-black text-sm tracking-widest uppercase transition-all shadow-xl shadow-indigo-600/20"
            >
              Đăng ký thành viên
            </motion.button>
          </Link>
        </motion.div>
      </section>
      
    </div>
  );
}

function ServiceCard({ href, icon, title, desc, color, floatClass }) {
  const borderMap = {
    cyan: "hover:border-cyan-500/50",
    purple: "hover:border-purple-500/50",
    emerald: "hover:border-emerald-500/50"
  };

  const textMap = {
    cyan: "group-hover:text-cyan-400",
    purple: "group-hover:text-purple-400",
    emerald: "group-hover:text-emerald-400"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Link href={href} className="h-full">
        <div className={`h-full p-10 bg-slate-900 border border-white/5 rounded-[2.5rem] ${borderMap[color]} transition-all flex flex-col items-center text-center group hover:-translate-y-2`}>
          <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors ${floatClass}`}>
            {icon}
          </div>
          <h2 className={`text-xl font-black text-white mb-3 uppercase tracking-tight transition-colors ${textMap[color]}`}>{title}</h2>
          <p className="text-slate-400 text-xs leading-relaxed mb-6 font-light">{desc}</p>
          <div className="mt-auto text-[10px] font-black text-white/40 group-hover:text-white uppercase tracking-widest flex items-center gap-2">
            Chi tiết <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FeatureItem({ icon, text }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all group-hover:scale-110">
        {icon}
      </div>
      <span className="text-sm font-black text-white uppercase tracking-widest">{text}</span>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden transition-colors hover:border-white/10">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-5 flex items-center justify-between text-left">
        <span className="font-bold text-white text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-gray-500 text-xs leading-relaxed border-t border-white/5 pt-4">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
