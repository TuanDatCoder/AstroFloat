import React from 'react';
import Link from 'next/link';
import { Heart, Sparkles, ArrowRight, ShieldCheck, Code, User, Compass, Star, Infinity, Eye } from 'lucide-react';
import TarotIcon from '@/components/TarotIcon';
export const metadata = {
  title: 'Family Love Studio - Sáng tạo công cụ tâm linh và tình yêu | Góc Vũ Trụ',
  description: 'Khám phá hệ sinh thái sản phẩm được sáng tạo bởi Family Love Studio và nhà phát triển TuanDatCoder. Trải nghiệm Đếm Ngày Yêu, Thần số học, Cung hoàng đạo và Tarot Góc Vũ Trụ.',
  alternates: {
    canonical: '/family-love-studio',
  },
};

export default function FamilyLoveStudioPage() {
  return (
    <div className="w-full min-h-screen bg-[#070913] text-white overflow-hidden selection:bg-purple-500/30">
      
      {/* Background Decorative Orbs */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-purple-950/20 via-indigo-950/5 to-transparent z-0 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[130px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-rose-600/10 blur-[120px] rounded-full z-0 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative z-10 pt-36 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Giới thiệu Family Love Studio
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
          Sáng Tạo Công Cụ <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300">
            Tâm Linh & Tình Yêu
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl font-light leading-relaxed">
          Nơi phát triển những ứng dụng tuyệt vời giúp bạn kết nối tình yêu đôi lứa và khám phá thông điệp sâu sắc từ bản đồ năng lượng vũ trụ.
        </p>

        {/* Creator Info */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10 mb-12 backdrop-blur-md shadow-lg">
          <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
            <User className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-sm font-medium tracking-wide text-slate-200">
            Sáng tạo & Lập trình bởi: <strong className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">TuanDatCoder</strong>
          </span>
        </div>
      </section>

      {/* PRODUCT GRID SECTION */}
      <section className="relative z-10 px-6 pb-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 uppercase tracking-wider font-serif">Hệ sinh thái sản phẩm</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Các dự án công nghệ tâm huyết kết nối triệu tâm hồn và năng lượng tích cực</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Product 1: ForeverDays */}
          <div className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-rose-500/30 to-transparent hover:from-rose-500/50 transition-all duration-300 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-[#0c0d1e] z-0 rounded-[23px]" />
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-rose-400 fill-rose-400/20" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Đếm Ngày Yêu (ForeverDays)</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                  Ứng dụng tuyệt đẹp lưu giữ hành trình tình yêu đôi lứa. Giúp các cặp đôi đếm ngày bên nhau, lưu giữ kỷ niệm ngọt ngào và đếm ngược đến các cột mốc ý nghĩa của thanh xuân.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20">Tình yêu</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/5">Tiện ích đôi</span>
                </div>
              </div>
              
              <a 
                href="https://tinhyeu.gocvutru.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-[0_0_20px_rgba(244,63,94,0.2)]"
              >
                <span>Truy cập tinhyeu.gocvutru.com</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product 2: Tarot Góc Vũ Trụ */}
          <div className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-purple-500/30 to-transparent hover:from-purple-500/50 transition-all duration-300 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-[#0c0d1e] z-0 rounded-[23px]" />
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TarotIcon className="w-9 h-9 text-purple-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Tarot Góc Vũ Trụ</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                  Phân hệ Tarot trực tuyến chính xác với hệ thống 78 lá bài được mã hóa độc đáo. Đưa ra lời khuyên từ vũ trụ về tình duyên, sự nghiệp, thách thức và năng lượng ngày mới với đa dạng phong cách diễn giải.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">Tarot</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/5">Thông điệp ngày mới</span>
                </div>
              </div>
              
              <Link 
                href="/tarot" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]"
              >
                <span>Trải bài Tarot trực tuyến</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Product 3: Thần Số Học */}
          <div className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-cyan-500/30 to-transparent hover:from-cyan-500/50 transition-all duration-300 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-[#0c0d1e] z-0 rounded-[23px]" />
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Compass className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Thần Số Học</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                  Hệ thống phân tích nhân số học chuyên sâu giúp giải mã Bản đồ cuộc đời thông qua Ngày sinh và Tên khai sinh. Khám phá các con số Đường đời, Sứ mệnh, Thái độ và dự đoán đỉnh cao tương lai.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Nhân số học</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/5">Biểu đồ đỉnh cao</span>
                </div>
              </div>
              
              <Link 
                href="/than-so-hoc" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              >
                <span>Khám phá Thần số học</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Product 4: 12 Chòm Sao */}
          <div className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-amber-500/30 to-transparent hover:from-amber-500/50 transition-all duration-300 shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-[#0c0d1e] z-0 rounded-[23px]" />
            <div className="relative z-10 p-8 flex flex-col h-full justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">12 Chòm Sao & Độ Tương Hợp</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light">
                  Phân tích tính cách đặc trưng của 12 cung hoàng đạo, tử vi ngày mới chi tiết cho từng chòm sao. Đặc biệt có chức năng so sánh độ tương hợp tình yêu và tình bạn giữa các cung hoàng đạo cực chuẩn.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">Chiêm tinh</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 text-slate-300 border border-white/5">Độ tương hợp</span>
                </div>
              </div>
              
              <Link 
                href="/cung-hoang-dao" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              >
                <span>Xem bói 12 chòm sao</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* CORE IDEAL / TECH STACK */}
      <section className="relative z-10 py-20 bg-black/40 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Code className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 uppercase tracking-wider font-serif">Sứ mệnh của chúng tôi</h2>
          <p className="text-slate-300 font-light leading-relaxed mb-8 text-sm md:text-base">
            Family Love Studio không chỉ xây dựng các trang web, chúng tôi kiến tạo các không gian cảm xúc. Bằng sự kết hợp giữa thuật toán hiện đại và tri thức tâm linh lâu đời, chúng tôi mong muốn mang đến những trải nghiệm mượt mà, đầy cảm hứng, giúp bạn thấu hiểu bản thân sâu sắc và kết nối chặt chẽ hơn với những người thương yêu.
          </p>
          <div className="flex items-center justify-center gap-6 text-slate-500 text-xs tracking-wider">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Tối ưu trải nghiệm</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1.5"><Infinity className="w-4 h-4 text-purple-500" /> Đa dạng phong cách</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-cyan-500" /> Tôn trọng quyền riêng tư</span>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="relative z-10 py-24 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Bắt đầu hành trình giải mã năng lượng
        </h2>
        <p className="text-slate-400 mb-10 max-w-lg mx-auto text-sm leading-relaxed">
          Truy cập ngay hệ sinh thái Góc Vũ Trụ để khám phá các thông điệp dẫn lối dành riêng cho bạn hôm nay.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl hover:scale-105 shadow-[0_0_30px_rgba(168,85,247,0.3)] text-xs uppercase tracking-widest"
          >
            <span>Vào Trang Chủ GVT</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <a 
            href="mailto:devprojectlabvn@gmail.com" 
            className="inline-flex items-center justify-center px-8 py-4 font-bold text-slate-300 hover:text-white transition-all duration-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs uppercase tracking-widest"
          >
            Liên hệ hợp tác
          </a>
        </div>
      </section>

    </div>
  );
}
