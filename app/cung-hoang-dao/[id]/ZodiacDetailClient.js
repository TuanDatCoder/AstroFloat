'use client';

import React from 'react';
import { m } from 'framer-motion';
import { ArrowLeft, BookOpen, Moon, Briefcase, Heart, Sparkles, LayoutGrid, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';


const getTopicIcon = (topic, className) => {
  const t = topic.toLowerCase();
  if (t.includes('truyền thuyết') || t.includes('nguồn gốc')) return <BookOpen className={className} />;
  if (t.includes('góc tối') || t.includes('mặt trái')) return <Moon className={className} />;
  if (t.includes('sự nghiệp') || t.includes('công việc')) return <Briefcase className={className} />;
  if (t.includes('tình yêu') || t.includes('tình duyên')) return <Heart className={className} />;
  return <Sparkles className={className} />;
};

export default function ZodiacDetailClient({ id, initialZodiac, initialDetails }) {
  const router = useRouter();

  React.useEffect(() => {
    if (initialZodiac?.english_name && initialZodiac?.name) {
      window.dispatchEvent(new CustomEvent('astro-bot-zodiac-info', {
        detail: { 
          zodiac: initialZodiac.english_name.toLowerCase(),
          vietnameseName: initialZodiac.name
        }
      }));
    }
  }, [initialZodiac]);

  if (!initialZodiac) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center pt-32">
        <p className="text-red-400 mb-8 bg-red-950/40 px-6 py-3 rounded-xl border border-red-500/20">Không tìm thấy chòm sao này</p>
        <button onClick={() => router.back()} className="text-cyan-300 flex items-center gap-2 uppercase text-xs font-bold tracking-widest"><ArrowLeft className="w-4 h-4" /> Quay lại</button>
      </div>
    );
  }

  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="flex flex-col items-center pt-32 pb-20 px-6 relative z-10 w-full max-w-5xl mx-auto">
      <div className="w-full mb-10 flex justify-start">
        <button onClick={() => router.back()}>
          <div className="flex items-center gap-2 text-gray-400 hover:text-cyan-300 hover:-translate-x-1 transition-all duration-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4" /> <span className="text-sm font-medium">Trở về</span>
          </div>
        </button>
      </div>

      <div className="w-full bg-gradient-to-b from-cyan-900/40 to-slate-900/60 border border-cyan-500/20 rounded-[3rem] p-8 md:p-16 mb-16 relative overflow-hidden shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] select-none">
           <span className="text-[100px] md:text-[200px] font-black uppercase tracking-tighter whitespace-nowrap">{initialZodiac.english_name || initialZodiac.name}</span>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-[2.5rem] flex items-center justify-center border-4 border-cyan-500/30 shadow-xl overflow-hidden relative">
            {initialZodiac.image_url ? (
              <Image 
                src={initialZodiac.image_url} 
                alt={initialZodiac.name} 
                fill
                sizes="(max-width: 768px) 128px, 160px"
                className="object-cover" 
                priority
              />
            ) : <Sun className="w-16 h-16 text-cyan-200" />}
          </div>
          <div className="text-center md:text-left flex-1">
            <span className="inline-block py-1.5 px-4 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold tracking-widest mb-4 uppercase">{initialZodiac.english_name}</span>
            <div className="flex flex-col md:flex-row items-center md:items-baseline gap-4 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-0">{initialZodiac.name}</h1>
              {initialZodiac.date_range ? (
                <span className="text-cyan-400/80 font-medium text-lg">({initialZodiac.date_range})</span>
              ) : (initialZodiac.start_day && initialZodiac.start_month) ? (
                <span className="text-cyan-400/80 font-medium text-lg">({initialZodiac.start_day}/{initialZodiac.start_month} - {initialZodiac.end_day}/{initialZodiac.end_month})</span>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
              {initialZodiac.element && <span className="px-3 py-1 bg-cyan-900/70 text-cyan-200 text-sm rounded-lg border border-cyan-500/20">Nguyên tố: {initialZodiac.element}</span>}
              {initialZodiac.modality && <span className="px-3 py-1 bg-indigo-900/70 text-indigo-200 text-sm rounded-lg border border-indigo-500/20">Tính chất: {initialZodiac.modality}</span>}
              {initialZodiac.ruling_planet && <span className="px-3 py-1 bg-blue-900/40 text-blue-200 text-sm rounded-lg border border-blue-500/20">Hành tinh: {initialZodiac.ruling_planet}</span>}
            </div>
            <div className="text-cyan-100/80 text-lg leading-relaxed font-light prose prose-invert prose-cyan max-w-none prose-p:leading-relaxed prose-p:mb-4">
              <ReactMarkdown>{initialZodiac.description}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>



      <div className="w-full">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3"><LayoutGrid className="w-6 h-6 text-cyan-400" /> Giải mã chi tiết</h2>
        {initialDetails.length === 0 ? (
          <div className="text-center p-10 bg-white/5 rounded-2xl border border-white/10 flex flex-col items-center">
            <BookOpen className="w-12 h-12 text-cyan-400 mb-4 opacity-70" />
            <p className="text-gray-400">Chưa có bài phân tích chi tiết nào về {initialZodiac.name} trong hệ thống.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {initialDetails.map((detail, index) => (
              <div key={index} className="bg-slate-900/80 border border-cyan-500/10 rounded-3xl p-8 relative overflow-hidden group hover:border-cyan-500/30 transition-colors duration-300">
                {detail.is_premium && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg z-10">
                    PREMIUM
                  </div>
                )}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">{getTopicIcon(detail.topic, "w-6 h-6 text-cyan-400")}</div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold block mb-1">{detail.topic}</span>
                    <h3 className="text-xl font-bold text-white pr-6">{detail.title}</h3>
                  </div>
                </div>
                <div className="text-slate-300 leading-relaxed font-light prose prose-invert prose-cyan max-w-none 
                  prose-p:leading-loose prose-p:mb-6
                  prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-cyan-400
                  prose-strong:text-cyan-300 prose-strong:font-bold
                  prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8 prose-ul:space-y-3
                  prose-li:marker:text-cyan-500 prose-li:pl-2
                  prose-blockquote:border-l-4 prose-blockquote:border-cyan-500 prose-blockquote:bg-cyan-500/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:italic">
                  {detail.is_premium ? (
                    <span className="filter blur-[4px] select-none block opacity-70">
                      Đây là nội dung premium. Nó đang bị ẩn đi để chờ người dùng nâng cấp gói xem nội dung đầy đủ. Vui lòng làm một ly cafe rồi quay lại sau nhé. Chòm sao này có những đặc điểm cực kỳ độc đáo và thu hút...
                    </span>
                  ) : (
                    <ReactMarkdown>{detail.content}</ReactMarkdown>
                  )}
                </div>
                {detail.is_premium && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer backdrop-blur-[2px]">
                    <button className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2 text-black transition-all transform hover:scale-105">
                      <Sparkles className="w-4 h-4" /> Mở khóa ngay
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </m.div>
  );
}
