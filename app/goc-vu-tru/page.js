import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Compass, Star, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { ROUTES } from '@/constants';
import TarotIcon from '@/components/TarotIcon';

export const metadata = {
  title: 'Góc Vũ Trụ (gocvutru) - Câu chuyện thương hiệu & Hệ sinh thái giải mã vận mệnh',
  description: 'Tìm hiểu câu chuyện về Góc Vũ Trụ (goc vu tru, gocvutru). Khám phá các công cụ tâm linh huyền bí: Tarot góc Vũ Trụ, Thần số học, 12 Chòm sao và hệ sinh thái Đếm ngày yêu.',
  keywords: ['gocvutru', 'goc vu tru', 'góc vũ trụ', 'tarot góc vũ trụ', 'tinhyeu.gocvutru', 'thần số học', 'cung hoàng đạo'],
};

export default function GocVuTruPage() {
  return (
    <div className="relative z-10 w-full min-h-screen pt-32 pb-24 px-6 md:px-12 flex flex-col items-center">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-900/10 blur-[150px] pointer-events-none" />

      {/* Hero Intro */}
      <div className="max-w-4xl w-full text-center mb-20">
        <div className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-slate-900 border border-white/10 text-white/80 text-[10px] font-black tracking-[0.4em] mb-8 uppercase shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          Giới Thiệu Thương Hiệu
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter leading-none mb-8">
          Góc Vũ Trụ <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400">
            gocvutru.com
          </span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
          Chào mừng bạn đến với <strong>Góc Vũ Trụ</strong> (hay còn gọi là <em>gocvutru</em>, <em>goc vu tru</em>). Đây là không gian huyền bí được tạo ra nhằm đồng hành cùng bạn trên hành trình giải mã bản thân, khám phá số phận và định hướng tương lai.
        </p>
      </div>

      {/* Brand Story Section */}
      <div className="max-w-4xl w-full mb-24">
        <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-md relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-purple-500/5 blur-[80px] pointer-events-none" />
          
          <h2 className="text-2xl md:text-3xl font-black text-white mb-6 flex items-center gap-3 uppercase tracking-tight">
            <Compass className="w-7 h-7 text-purple-400" />
            Tại sao lại đặt tên là "Góc Vũ Trụ"?
          </h2>
          
          <div className="space-y-6 text-slate-300 font-light leading-relaxed text-sm sm:text-base">
            <p>
              Triết lý cổ xưa đã chỉ ra rằng: <em>"Mỗi con người là một tiểu vũ trụ thu nhỏ"</em> (Microcosm). Bên trong bạn chứa đựng cả một hệ thống các vì sao, các tần số rung động và dòng chảy năng lượng vô hạn. Bản thân bạn chính là một vũ trụ kỳ vĩ đang chờ được khám phá.
            </p>
            <p>
              <strong>Góc Vũ Trụ</strong> (gocvutru / goc vu tru) được đặt tên với ý nghĩa là một góc nhỏ bình yên, nơi bạn có thể dừng chân sau những bộn bề của cuộc sống để nhìn sâu vào thế giới nội tâm của chính mình. 
            </p>
            <p>
              Tại đây, chúng tôi sử dụng ngôn ngữ của các con số (<strong>Thần số học</strong>), sự sắp đặt của các tinh tú (<strong>Chiêm tinh học</strong>) và các thông điệp tâm linh (<strong>Tarot</strong>) để giúp bạn kết nối lại với bản ngã thiêng liêng nhất, hiểu rõ tần số rung động của linh hồn mình.
            </p>
          </div>
        </div>
      </div>

      {/* What's on this website section */}
      <div className="max-w-5xl w-full mb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
            Tại web này có gì?
          </h2>
          <p className="text-gray-400 italic text-sm">Các công cụ giải mã bản đồ năng lượng cá nhân</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl hover:border-purple-500/30 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight group-hover:text-purple-400 transition-colors">Thần Số Học</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-light mb-6 flex-grow">
              Giải mã con số chủ đạo, các chỉ số ngày sinh và tên gọi để thấu hiểu năng lực cốt lõi, chu kỳ phát triển và sứ mệnh linh hồn của bạn.
            </p>
            <Link href={ROUTES.NUMEROLOGY} className="text-xs font-black text-purple-400 hover:text-purple-300 uppercase tracking-widest flex items-center gap-2 mt-auto">
              Xem ngay <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl hover:border-cyan-500/30 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6">
              <Star className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            </div>
            <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight group-hover:text-cyan-400 transition-colors">12 Chòm Sao</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-light mb-6 flex-grow">
              Khám phá tính cách, điểm mạnh, điểm yếu và mức độ tương hợp giữa bạn và người ấy dựa trên biểu đồ sao của 12 cung hoàng đạo.
            </p>
            <Link href={ROUTES.ZODIAC} className="text-xs font-black text-cyan-400 hover:text-cyan-300 uppercase tracking-widest flex items-center gap-2 mt-auto">
              Xem ngay <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>

          <div className="p-8 bg-slate-900 border border-white/5 rounded-3xl hover:border-fuchsia-500/30 transition-all flex flex-col group">
            <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-6">
              <TarotIcon className="w-6 h-6 text-fuchsia-400" />
            </div>
            <h3 className="text-lg font-black text-white mb-3 uppercase tracking-tight group-hover:text-fuchsia-400 transition-colors">Tarot Góc Vũ Trụ</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-light mb-6 flex-grow">
              Bốc bài Tarot hàng ngày hoặc theo chủ đề tình yêu, sự nghiệp, tài chính để đón nhận thông điệp, lời khuyên dẫn đường từ năng lượng vũ trụ.
            </p>
            <Link href={ROUTES.TAROT} className="text-xs font-black text-fuchsia-400 hover:text-fuchsia-300 uppercase tracking-widest flex items-center gap-2 mt-auto">
              Xem ngay <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Ecosystem Section */}
      <div className="max-w-4xl w-full mb-20 text-center">
        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
          Hệ sinh thái sản phẩm Góc Vũ Trụ
        </h2>
        <p className="text-slate-400 font-light leading-relaxed max-w-xl mx-auto mb-12">
          Các dự án và website bổ trợ nằm trong hệ sinh thái giải mã tâm linh và gắn kết tình yêu của Góc Vũ Trụ.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                <Heart className="w-5 h-5 text-rose-400" />
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">tinhyeu.gocvutru.com</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-light mb-6">
              Ứng dụng <strong>Đếm Ngày Yêu</strong> (Love Days Counter) giúp lưu giữ các kỷ niệm, đếm số ngày yêu nhau và chia sẻ hành trình ngọt ngào của bạn và nửa kia.
            </p>
            <a href="https://tinhyeu.gocvutru.com" target="_blank" rel="noopener noreferrer" className="text-xs font-black text-rose-400 hover:text-rose-300 uppercase tracking-widest flex items-center gap-2 w-fit">
              Truy cập trang <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20">
                <TarotIcon className="w-5 h-5 text-fuchsia-400" />
              </div>
              <h3 className="text-base font-black text-white uppercase tracking-wider">Tarot Góc Vũ Trụ</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-light mb-6">
              Phân hệ <strong>gocvutru tarot</strong> cung cấp các trải bài trực tuyến ứng dụng công nghệ kết nối cơ sở dữ liệu để đưa ra phân tích chính xác, mượt mà và cá nhân hóa.
            </p>
            <Link href={ROUTES.TAROT} className="text-xs font-black text-fuchsia-400 hover:text-fuchsia-300 uppercase tracking-widest flex items-center gap-2 w-fit">
              Trải nghiệm <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-2xl w-full text-center bg-gradient-to-r from-purple-500/5 to-cyan-500/5 border border-purple-500/20 rounded-[2rem] p-8 md:p-12 relative overflow-hidden">
        <h2 className="text-xl sm:text-2xl font-black text-white mb-6 uppercase tracking-wider">
          Bắt đầu hành trình giải mã của bạn
        </h2>
        <p className="text-slate-400 text-sm font-light mb-8 max-w-md mx-auto">
          Hãy để các tinh tú và những con số dẫn lối. Cung hoàng đạo và Thần số học của bạn đã sẵn sàng được khám phá.
        </p>
        <Link href={ROUTES.DISCOVER}>
          <button className="px-8 py-4 bg-white hover:bg-emerald-400 text-black font-black text-xs tracking-widest uppercase rounded-full shadow-lg transition-all active:scale-95">
            Bắt đầu giải mã
          </button>
        </Link>
      </div>
    </div>
  );
}
