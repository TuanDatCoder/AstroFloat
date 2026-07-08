import React from 'react';
import Link from 'next/link';
import { Heart, CalendarHeart, Sparkles, ArrowRight, Activity, BookHeart, ShieldCheck } from 'lucide-react';

import FloatingButton from './FloatingButton';
import LoveDaysIcon from '@/components/LoveDaysIcon';

export const metadata = {
  title: 'ForeverDays - Ứng dụng Đếm ngày yêu | Góc Vũ Trụ',
  description: 'Ghi dấu tình yêu từng ngày. Lưu giữ mọi khoảnh khắc ngọt ngào của hai bạn với ForeverDays.',
  alternates: {
    canonical: '/dem-ngay-yeu',
  },
}

export default function DemNgayYeuPage() {
  return (
    <div className="w-full min-h-screen bg-[#0B0F19] text-white overflow-hidden selection:bg-rose-500/30">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-rose-900/20 via-pink-900/5 to-transparent z-0 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-600/10 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full z-0 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative z-10 pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold tracking-widest uppercase mb-8">
          <Heart className="w-4 h-4 fill-rose-400" />
          Dự án mới từ Góc Vũ Trụ
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-rose-300">ForeverDays</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-3xl font-light">
          Ghi dấu tình yêu từng ngày. Nơi lưu giữ thanh xuân và mọi khoảnh khắc ngọt ngào của hai bạn.
        </p>

        <p className="text-slate-400 mb-12 max-w-2xl text-sm md:text-base leading-relaxed">
          Không chỉ là đếm ngày, ForeverDays mang đến một không gian riêng tư tuyệt đối để cặp đôi cùng nhau theo dõi cảm xúc, lên kế hoạch hẹn hò và đếm ngược đến những cột mốc quan trọng nhất.
        </p>

        <a 
          href="https://tinhyeu.gocvutru.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-rose-500 font-pj rounded-2xl hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-600 hover:-translate-y-1 shadow-[0_0_40px_rgba(244,63,94,0.4)]"
        >
          <span className="tracking-widest uppercase text-sm">Trải nghiệm ngay miễn phí</span>
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
        </a>
      </section>

      {/* MOCKUP / DASHBOARD PREVIEW */}
      <section className="relative z-10 px-6 pb-32 max-w-6xl mx-auto">
        <div className="relative rounded-[2.5rem] p-2 bg-gradient-to-b from-rose-500/20 to-white/5 border border-white/10 shadow-[0_0_50px_rgba(244,63,94,0.15)]">
          <div className="absolute inset-0 bg-rose-500/5 blur-2xl rounded-[2.5rem]" />
          <div className="relative rounded-[2rem] overflow-hidden bg-slate-900 border border-white/10 aspect-[16/10] md:aspect-[21/9] flex items-center justify-center">
            {/* Fake Dashboard UI */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-slate-950/80" />
            
            <div className="relative z-10 text-center flex flex-col items-center group cursor-pointer">
              <LoveDaysIcon className="w-20 h-20 md:w-32 md:h-32 drop-shadow-[0_0_40px_rgba(244,63,94,0.5)] group-hover:scale-110 transition-transform duration-700 ease-out" />
              <div className="mt-8 text-4xl md:text-6xl font-black text-white drop-shadow-lg flex items-center gap-2">
                ∞ <span className="text-3xl md:text-5xl">Mãi Mãi</span>
              </div>
              <div className="text-rose-200 mt-2 text-sm md:text-lg uppercase tracking-widest font-bold">Hành trình không có điểm dừng</div>
            </div>
          </div>
        </div>
      </section>

      {/* TÍNH NĂNG NỔI BẬT */}
      <section className="relative z-10 py-24 bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Tính năng nổi bật</h2>
            <p className="text-slate-400">Những công cụ tuyệt vời giúp tình yêu của bạn luôn thăng hoa</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-[2rem] bg-slate-900/50 border border-white/5 hover:border-rose-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 group-hover:bg-rose-500/20 transition-colors">
                <LoveDaysIcon className="w-9 h-9 drop-shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cột Mốc Kỷ Niệm</h3>
              <p className="text-slate-400 leading-relaxed">
                Đếm ngược đến các sự kiện quan trọng như 1000 ngày yêu, sinh nhật, ngày cưới. Đừng bao giờ quên những ngày đặc biệt.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-[2rem] bg-slate-900/50 border border-white/5 hover:border-pink-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6">
                <Activity className="w-7 h-7 text-pink-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Nhật Ký Cảm Xúc</h3>
              <p className="text-slate-400 leading-relaxed">
                Ghi lại tâm trạng mỗi ngày của cả hai. Hiểu nhau hơn qua những dòng trạng thái vui buồn được chia sẻ riêng tư.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-[2rem] bg-slate-900/50 border border-white/5 hover:border-purple-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                <BookHeart className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lời Chúc Ngọt Ngào</h3>
              <p className="text-slate-400 leading-relaxed">
                Mỗi ngày mở app là một câu châm ngôn tình yêu, lời chúc ngọt ngào giúp tiếp thêm năng lượng tích cực cho mối quan hệ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-32 px-6 text-center max-w-4xl mx-auto pb-48">
        <Sparkles className="w-12 h-12 text-rose-400 mx-auto mb-6" />
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Sẵn sàng bắt đầu hành trình của hai bạn?
        </h2>
        <p className="text-slate-400 text-lg mb-10">
          Giao diện riêng tư, bảo mật, thiết kế kẹo ngọt siêu đáng yêu. Hoàn toàn miễn phí.
        </p>
        <a 
          href="https://tinhyeu.gocvutru.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl hover:scale-105 shadow-[0_0_30px_rgba(244,63,94,0.3)]"
        >
          <span className="tracking-widest uppercase text-sm">ĐI ĐẾN FOREVER DAYS</span>
          <ArrowRight className="w-5 h-5 ml-3" />
        </a>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
          <ShieldCheck className="w-4 h-4" />
          <span>Bảo mật 100% dữ liệu riêng tư của cặp đôi</span>
        </div>
      </section>

      <FloatingButton />
    </div>
  );
}
