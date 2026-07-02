import React from 'react';
import Link from 'next/link';
import { Sparkles, Moon, Sun, Star, BookOpen, Compass, Heart, ArrowRight, Layers, CreditCard, Activity } from 'lucide-react';

export const metadata = {
  title: 'Tarot Góc Vũ Trụ - Khám Phá Thông Điệp & Năng Lượng | Góc Vũ Trụ',
  description: 'Tìm hiểu Tarot là gì, các hình thức trải bài phổ biến và sự kết nối kỳ diệu của bài Tarot với hệ sinh thái tâm linh (Thần số học, Chiêm tinh) tại Góc Vũ Trụ.',
  alternates: {
    canonical: '/tarot-goc-vu-tru',
  },
};

export default function TarotGocVuTruPage() {
  return (
    <div className="w-full min-h-screen bg-[#070913] text-white overflow-hidden selection:bg-fuchsia-500/30">
      
      {/* Background Decorative Orbs */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-fuchsia-950/20 via-purple-950/5 to-transparent z-0 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 blur-[130px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-indigo-600/10 blur-[120px] rounded-full z-0 pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative z-10 pt-36 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
          <Moon className="w-4 h-4 text-fuchsia-400" />
          Giải Mã Năng Lượng
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
          Bản Đồ Linh Hồn <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-indigo-300">
            Tarot Góc Vũ Trụ
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-3xl font-light leading-relaxed">
          Không chỉ là bói toán, Tarot là tấm gương phản chiếu nội tâm, giúp bạn kết nối với năng lượng vũ trụ và tìm ra hướng đi sáng suốt nhất.
        </p>

        <Link 
          href="/tarot" 
          className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-2xl hover:scale-105 shadow-[0_0_40px_rgba(192,38,211,0.4)]"
        >
          <span className="tracking-widest uppercase text-sm">Trải Bài Ngay</span>
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* WHAT IS TAROT? SECTION */}
      <section className="relative z-10 py-20 bg-black/40 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-fuchsia-500/10 blur-3xl rounded-full" />
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-8">
                {/* Abstract Cards Representation */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute w-32 h-48 md:w-40 md:h-56 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 rounded-xl -rotate-12 transform origin-bottom-left backdrop-blur-md shadow-2xl flex items-center justify-center">
                    <Star className="w-8 h-8 text-indigo-300 opacity-50" />
                  </div>
                  <div className="absolute w-32 h-48 md:w-40 md:h-56 bg-gradient-to-br from-purple-500/30 to-fuchsia-500/30 border border-white/30 rounded-xl rotate-0 z-10 backdrop-blur-md shadow-2xl flex items-center justify-center">
                    <Sun className="w-10 h-10 text-fuchsia-300 opacity-80" />
                  </div>
                  <div className="absolute w-32 h-48 md:w-40 md:h-56 bg-gradient-to-br from-fuchsia-500/20 to-rose-500/20 border border-white/20 rounded-xl rotate-12 transform origin-bottom-right backdrop-blur-md shadow-2xl flex items-center justify-center">
                    <Moon className="w-8 h-8 text-rose-300 opacity-50" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-serif">Tarot Là Gì?</h2>
              <p className="text-slate-300 leading-relaxed mb-6 font-light text-lg">
                Tarot là một bộ bài gồm 78 lá, chứa đựng những biểu tượng, cổ mẫu và câu chuyện về hành trình của đời người. Được chia thành hai phần chính: <strong>Bộ Ẩn Chính (Major Arcana)</strong> gồm 22 lá mang ý nghĩa về những bài học lớn, nghiệp quả; và <strong>Bộ Ẩn Phụ (Minor Arcana)</strong> gồm 56 lá phản ánh những sự kiện thường nhật.
              </p>
              <p className="text-slate-300 leading-relaxed font-light text-lg">
                Đến với Tarot Góc Vũ Trụ, mỗi lần rút bài là một khoảnh khắc bạn giao tiếp với tiềm thức của chính mình. Các lá bài không bắt buộc tương lai của bạn phải như thế nào, mà chúng đưa ra ánh sáng những gì đang bị che khuất, giúp bạn đưa ra những quyết định tuyệt vời nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SPREAD FORMATS SECTION */}
      <section className="relative z-10 py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Sparkles className="w-10 h-10 text-fuchsia-400 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">Các Hình Thức Trải Bài Phổ Biến</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Tùy vào vấn đề bạn đang gặp phải, việc chọn đúng hình thức trải bài sẽ giúp thông điệp được giải mã một cách sắc bén và thấu đáo nhất.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Format 1 */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-fuchsia-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mb-6 group-hover:scale-110 transition-transform">
              <Sun className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Trải Bài 1 Lá (Daily Tarot)</h3>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-4">Thông điệp ngày mới</div>
            <p className="text-slate-400 leading-relaxed font-light text-sm">
              Rút một lá duy nhất để nhận lời khuyên tổng quan, dự báo năng lượng cho ngày mới hoặc trả lời nhanh một câu hỏi Có/Không đơn giản.
            </p>
          </div>

          {/* Format 2 */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-pink-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center border border-pink-500/20 mb-6 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Trải Bài 3 Lá</h3>
            <div className="text-xs font-bold text-pink-300 uppercase tracking-widest mb-4">Quá Khứ - Hiện Tại - Tương Lai</div>
            <p className="text-slate-400 leading-relaxed font-light text-sm">
              Hình thức kinh điển nhất. Thường áp dụng để giải quyết vấn đề tình cảm, xem sự phát triển của một mối quan hệ theo dòng thời gian.
            </p>
          </div>

          {/* Format 3 */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 hover:border-emerald-500/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-6 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Trải Bài 4 Lá Trở Lên</h3>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-4">Phân tích chuyên sâu</div>
            <p className="text-slate-400 leading-relaxed font-light text-sm">
              Các mô hình như Celtic Cross (10 lá) hay trải bài sự nghiệp (4-5 lá) cung cấp cái nhìn cực kỳ chi tiết về nguyên nhân, trở ngại, và kết quả.
            </p>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM CONNECTION */}
      <section className="relative z-10 py-24 bg-gradient-to-b from-purple-950/20 to-transparent border-t border-purple-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <Layers className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 font-serif tracking-wide">
              Tarot Trong Hệ Sinh Thái Góc Vũ Trụ
            </h2>
            <p className="text-slate-300 max-w-3xl mx-auto text-lg font-light leading-relaxed">
              Vũ trụ không vận hành một cách rời rạc. Tại Góc Vũ Trụ, Tarot được liên kết chặt chẽ với các bộ môn huyền học khác để mang đến cho bạn góc nhìn toàn diện nhất về Bản đồ vận mệnh của mình.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Connection 1: Numerology */}
            <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-cyan-500/10 hover:border-cyan-500/30 transition-colors">
              <Compass className="w-10 h-10 text-cyan-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Tương Hỗ Với Thần Số Học</h3>
              <p className="text-slate-400 font-light leading-relaxed mb-6">
                22 lá Ẩn Chính của Tarot hoàn toàn đồng điệu với các con số đường đời trong Thần Số Học (Numerology). Ví dụ, bạn có Đường đời số 1 (Người tiên phong), năng lượng của bạn cộng hưởng mạnh mẽ với lá bài The Magician (Số I). Việc kết hợp cả hai giúp bạn thấu hiểu điểm mạnh và điểm yếu cốt lõi của mình.
              </p>
              <Link href="/than-so-hoc" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm font-bold tracking-widest uppercase">
                Khám Phá Thần Số Học <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>

            {/* Connection 2: Zodiac */}
            <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-amber-500/10 hover:border-amber-500/30 transition-colors">
              <Star className="w-10 h-10 text-amber-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Gắn Kết Với 12 Chòm Sao</h3>
              <p className="text-slate-400 font-light leading-relaxed mb-6">
                4 bộ Ẩn Phụ (Gậy, Cốc, Kiếm, Tiền) đại diện trực tiếp cho 4 nguyên tố trong Chiêm Tinh Học (Lửa, Nước, Khí, Đất). Tính cách cung hoàng đạo của bạn phản ánh cách bạn phản ứng với các thông điệp của Tarot. Nước (Cự Giải, Bọ Cạp) cực nhạy cảm với bộ Cốc, trong khi Đất (Kim Ngưu, Xử Nữ) gắn liền với bộ Tiền.
              </p>
              <Link href="/cung-hoang-dao" className="inline-flex items-center text-amber-400 hover:text-amber-300 text-sm font-bold tracking-widest uppercase">
                Giải Mã Cung Hoàng Đạo <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-32 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
          Vũ Trụ Đang Có Lời Muốn Nói Với Bạn
        </h2>
        <p className="text-slate-400 text-lg mb-10 font-light">
          Hãy nhắm mắt lại, hít một hơi thật sâu, nghĩ về vấn đề bạn đang vướng mắc và để hệ thống Tarot AI của Góc Vũ Trụ giúp bạn mở khóa câu trả lời.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/tarot" 
            className="inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full hover:scale-105 shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          >
            <span className="tracking-widest uppercase text-sm">Bắt Đầu Trải Bài Tarot Ngay</span>
            <ArrowRight className="w-5 h-5 ml-3" />
          </Link>
          <Link 
            href="/tarot/thu-vien" 
            className="inline-flex items-center justify-center px-10 py-5 font-bold text-purple-200 transition-all duration-300 bg-purple-900/30 border border-purple-500/30 rounded-full hover:bg-purple-800/40 hover:scale-105"
          >
            <BookOpen className="w-5 h-5 mr-3" />
            <span className="tracking-widest uppercase text-sm">Xem Thư Viện 78 Lá Bài</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
