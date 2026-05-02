import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Star, ArrowRight, Compass, Moon, UserCircle2 } from 'lucide-react';
import AdBanner from '../components/AdBanner';
import { ROUTES } from '../constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-32 pb-40 px-6 min-h-screen relative overflow-hidden w-full">
      
      {/* Background Orbs - Use high performance radial-gradient instead of heavy blur */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,_rgba(147,51,234,0.15)_0%,_transparent_60%)] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.1)_0%,_transparent_60%)] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] bg-[radial-gradient(circle_at_center,_rgba(67,56,202,0.08)_0%,_transparent_60%)] rounded-full pointer-events-none" />
      
      <div 
        className="absolute top-1/4 left-[10%] text-cyan-400/10 z-0 pointer-events-none float-card-1"
      >
        <Star className="w-16 h-16" />
      </div>

      <div 
        className="absolute bottom-1/4 right-[10%] text-purple-400/10 z-0 pointer-events-none float-card-2"
      >
        <Moon className="w-24 h-24" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-6xl w-full relative z-10 flex flex-col items-center"
      >
        {/* Nhãn Tag Nổi */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-white/5 border border-white/10 text-white/80 text-[10px] font-black tracking-[0.4em] mb-8 shadow-2xl uppercase">
            <Sparkles className="w-3 h-3 text-emerald-400" /> 
            Khám Phá Bản Thể Vũ Trụ 
            <Sparkles className="w-3 h-3 text-purple-400" />
          </div>
        </motion.div>

        {/* Tiêu đề thanh lịch hơn */}
        <motion.h1 
          variants={itemVariants}
          className="text-6xl md:text-8xl lg:text-[100px] font-black text-white mb-8 tracking-tighter leading-[0.9]"
        >
          Giải Mã Vận Mệnh <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-emerald-400 to-cyan-400 animate-gradient-x">
            Của Riêng Bạn.
          </span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p 
          variants={itemVariants}
          className="text-slate-400 text-lg md:text-xl font-light mb-16 max-w-2xl mx-auto leading-relaxed px-4"
        >
          Chào mừng bạn đến với <span className="text-white font-medium">Góc Vũ Trụ</span>. 
          Nơi khoa học cổ đại gặp gỡ nghệ thuật hiện đại để giải mã rung động của linh hồn bạn qua các con số và tinh tú.
        </motion.p>

        {/* Cỗ Máy Khám Phá Nổi Bật Trung Tâm */}
        <motion.div variants={itemVariants} className="w-full flex justify-center mb-32">
          <Link to={ROUTES.DISCOVER}>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(16,185,129,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-4 md:px-12 md:py-6 bg-white text-black rounded-full font-black text-sm md:text-lg tracking-widest flex items-center justify-center gap-3 transition-all uppercase overflow-hidden group hover:pr-12 md:hover:pr-14"
            >
              <Compass className="w-5 h-5 md:w-6 md:h-6" /> 
              Bắt đầu hành trình
              <motion.div 
                className="absolute right-4 md:right-6 opacity-0 group-hover:opacity-100 transition-all"
                initial={false}
              >
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>

        {/* Google Ads Placeholder */}
        <motion.div variants={itemVariants} className="w-full">
          <AdBanner slot="horizontal" />
        </motion.div>

        {/* Features Grid - 3 Columns */}
        <motion.div variants={itemVariants} className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {/* Zodiac Card */}
          <Link to={ROUTES.ZODIAC} className="group">
            <div className="relative h-full p-10 bg-slate-900/70 rounded-[3rem] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-8 rotate-3 group-hover:rotate-0 transition-transform">
                <Star className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">12 Chòm Sao</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed mb-8">
                Phân tích tính cách và vận mệnh dựa trên bản đồ sao của riêng bạn.
              </p>
              <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                Khám phá ngay <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Numerology Day Card */}
          <Link to={ROUTES.NUMEROLOGY} className="group">
            <div className="relative h-full p-10 bg-slate-900/70 rounded-[3rem] border border-white/5 hover:border-purple-500/30 transition-all duration-500 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 -rotate-3 group-hover:rotate-0 transition-transform">
                <Sparkles className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">Thần Số Học</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed mb-8">
                Tìm hiểu con số chủ đạo và sứ mệnh cuộc đời qua ngày sinh.
              </p>
              <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-purple-400 uppercase tracking-widest">
                Khám phá ngay <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Name Numerology Card */}
          <Link to={ROUTES.NAME_NUMEROLOGY} className="group">
            <div className="relative h-full p-10 bg-slate-900/70 rounded-[3rem] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 rotate-6 group-hover:rotate-0 transition-transform">
                <UserCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">Thần Số Tên</h3>
              <p className="text-slate-400 text-sm font-light leading-relaxed mb-8">
                Giải mã tần số năng lượng ẩn sau cái tên và linh hồn của bạn.
              </p>
              <div className="mt-auto flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                Khám phá ngay <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
