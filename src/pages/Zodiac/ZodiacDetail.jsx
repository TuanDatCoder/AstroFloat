import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Moon, Briefcase, Heart, Sparkles, LayoutGrid, Sun } from 'lucide-react';
import { zodiacService } from '../../services/zodiacService';
import { zodiacDetailService } from '../../services/zodiacDetailService';

// Helper component chọn icon dựa theo chủ đề (topic) do bảng zodiac_details không có icon_name
const getTopicIcon = (topic, className) => {
  const t = topic.toLowerCase();
  if (t.includes('truyền thuyết') || t.includes('nguồn gốc')) return <BookOpen className={className} />;
  if (t.includes('góc tối') || t.includes('mặt trái')) return <Moon className={className} />;
  if (t.includes('sự nghiệp') || t.includes('công việc')) return <Briefcase className={className} />;
  if (t.includes('tình yêu') || t.includes('tình duyên')) return <Heart className={className} />;
  return <Sparkles className={className} />;
};

export default function ZodiacDetail() {
  const { id } = useParams();
  const [zodiac, setZodiac] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetailData = async () => {
      setLoading(true);
      try {
        // Lấy thông tin tổng quát của cung hoàng đạo
        const zodiacData = await zodiacService.getZodiacById(id);
        setZodiac(zodiacData);

        // Lấy các bài viết chi tiết
        const detailsData = await zodiacDetailService.getDetailsByZodiacId(id);
        setDetails(detailsData || []);

      } catch (err) {
        console.error("Lỗi lấy dữ liệu chi tiết Zodiac:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] z-10 relative">
        <div className="w-12 h-12 border-t-2 border-r-2 border-cyan-400 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
        <p className="text-cyan-200/60 font-light tracking-wide text-lg">Đang kết nối với Cung Hoàng Đạo...</p>
      </div>
    );
  }

  if (error || !zodiac) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] z-10 relative px-6">
        <p className="text-red-400 mb-8 bg-red-950/40 px-6 py-3 rounded-xl border border-red-500/20 ">
          {error ? `Lỗi: ${error}` : `Không tìm thấy chòm sao này`}
        </p>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Trở về trang trước
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-8 pb-20 px-6 relative z-10 w-full max-w-5xl mx-auto">
      <div className="w-full mb-10 flex justify-start">
        <button onClick={() => navigate(-1)} className="cursor-pointer">
          <motion.div
            whileHover={{ x: -5 }}
            className="flex items-center gap-2 text-gray-400 hover:text-cyan-300 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 "
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Trở về</span>
          </motion.div>
        </button>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full bg-gradient-to-b from-cyan-900/40 to-slate-900/60 border border-cyan-500/20 rounded-[3rem] p-8 md:p-16 mb-16 relative overflow-hidden shadow-2xl shadow-cyan-900/20"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <span className="text-[120px] md:text-[250px] font-black leading-none uppercase text-white/5 opacity-50 tracking-tighter">
            {zodiac.english_name || zodiac.name}
          </span>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center border-4 border-cyan-500/30 shadow-[0_0_30px_rgba(34,211,238,0.3)] overflow-hidden">
            {zodiac.image_url ? (
              <img src={zodiac.image_url} alt={zodiac.name} className="w-full h-full object-cover" />
            ) : (
              <Sun className="w-16 h-16 md:w-20 md:h-20 text-cyan-200 drop-shadow-md" />
            )}
          </div>

          <div className="text-center md:text-left flex-1">
            <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-[0.25em] mb-4 uppercase">
              {zodiac.english_name || 'ZODIAC SIGN'}
            </span>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-wide">
                {zodiac.name}
              </h1>
              {zodiac.date_range ? (
                <span className="text-cyan-400/80 font-medium text-lg">({zodiac.date_range})</span>
              ) : (zodiac.start_day && zodiac.start_month) ? (
                <span className="text-cyan-400/80 font-medium text-lg">({zodiac.start_day}/{zodiac.start_month} - {zodiac.end_day}/{zodiac.end_month})</span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
              {zodiac.element && <span className="px-3 py-1 bg-cyan-900/70 text-cyan-200 text-sm rounded-lg border border-cyan-500/20">Nguyên tố: {zodiac.element}</span>}
              {zodiac.modality && <span className="px-3 py-1 bg-indigo-900/70 text-indigo-200 text-sm rounded-lg border border-indigo-500/20">Tính chất: {zodiac.modality}</span>}
              {zodiac.ruling_planet && <span className="px-3 py-1 bg-blue-900/40 text-blue-200 text-sm rounded-lg border border-blue-500/20">Hành tinh: {zodiac.ruling_planet}</span>}
            </div>

            <p className="text-cyan-100/80 text-base md:text-lg leading-relaxed font-light">
              {zodiac.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Details Sections */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <LayoutGrid className="w-6 h-6 text-cyan-400" />
          Giải mã chi tiết
        </h2>

        {details.length === 0 ? (
          <div className="text-center p-10 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
            <BookOpen className="w-12 h-12 text-cyan-400 mb-4 opacity-70" />
            <p className="text-gray-400">Chưa có bài phân tích chi tiết nào về {zodiac.name} trong hệ thống.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {details.map((detail, index) => (
              <motion.div
                key={detail.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-slate-900/80 border border-cyan-500/10 rounded-3xl p-8 hover:bg-slate-900/80 transition-colors relative overflow-hidden"
              >
                {detail.is_premium && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg">
                    PREMIUM
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                    {getTopicIcon(detail.topic, "w-6 h-6 text-cyan-400")}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold block mb-1">
                      {detail.topic}
                    </span>
                    <h3 className="text-xl font-bold text-white pr-6">{detail.title}</h3>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed font-light">
                  {detail.is_premium ? (
                    <span className="filter blur-[3px] select-none block">
                      Đây là nội dung premium. Nó đang bị ẩn đi để chờ người dùng nâng cấp gói xem nội dung đầy đủ. Vui lòng làm một ly cafe rồi quay lại sau nhé. Bạch Dương có xu hướng hành động trước...
                    </span>
                  ) : detail.content}
                </p>

                {detail.is_premium && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 -[1px] opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                    <button className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full font-bold text-sm shadow-xl flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Mở khóa ngay
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
