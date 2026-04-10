import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Briefcase, AlertCircle, HelpCircle, Sparkles, LayoutGrid } from 'lucide-react';
import { numerologyService } from '../../services/numerologyService';
import { numerologyDetailService } from '../../services/numerologyDetailService';

// Helper component chuyển string icon_name thành icon thật
const DynamicIcon = ({ name, className }) => {
  switch(name) {
    case 'Heart': return <Heart className={className} />;
    case 'Briefcase': return <Briefcase className={className} />;
    case 'AlertCircle': return <AlertCircle className={className} />;
    default: return <Sparkles className={className} />;
  }
};

export default function NumerologyDetail() {
  const { number } = useParams();
  const [numerology, setNumerology] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetailData = async () => {
      setLoading(true);
      try {
        // Lấy thông tin tổng quát
        const numData = await numerologyService.getNumerologyByNumber(number);
        setNumerology(numData);

        // Lấy các bài viết chi tiết
        const detailsData = await numerologyDetailService.getDetailsByNumber(number);
        setDetails(detailsData || []);

      } catch (err) {
        console.error("Lỗi lấy dữ liệu chi tiết:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailData();
  }, [number]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] z-10 relative">
        <div className="w-12 h-12 border-t-2 border-r-2 border-purple-400 rounded-full animate-spin mb-4" />
        <p className="text-purple-200/60 font-light tracking-wide text-lg">Đang đọc thông điệp vũ trụ số {number}...</p>
      </div>
    );
  }

  if (error || !numerology) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] z-10 relative px-6">
        <p className="text-red-400 mb-8 bg-red-950/40 px-6 py-3 rounded-xl border border-red-500/20 backdrop-blur-md">
          {error ? `Lỗi: ${error}` : `Không tìm thấy tần số rung động cho số ${number}`}
        </p>
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-purple-300 hover:text-purple-200 transition-colors cursor-pointer">
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
            className="flex items-center gap-2 text-gray-400 hover:text-purple-300 transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
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
        className="w-full bg-gradient-to-b from-purple-900/40 to-slate-900/60 backdrop-blur-xl border border-purple-500/20 rounded-[3rem] p-10 md:p-16 mb-16 relative overflow-hidden shadow-2xl shadow-purple-900/20"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <span className="text-[200px] font-black leading-none">{numerology.number}</span>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="w-32 h-32 md:w-40 md:w-40 shrink-0 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-full flex items-center justify-center border-4 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
             <span className="text-6xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-purple-400 drop-shadow-md">
               {numerology.number}
             </span>
          </div>
          
          <div className="text-center md:text-left flex-1">
            <span className="inline-block py-1.5 px-4 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/30 text-fuchsia-300 text-xs font-semibold tracking-[0.25em] mb-4">
              THÔNG ĐIỆP CHÍNH
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">
              {numerology.title}
            </h1>
            <p className="text-purple-100/80 text-lg leading-relaxed font-light mb-6">
              <strong className="text-purple-300 font-medium">Đặc điểm:</strong> {numerology.traits}
            </p>
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
              <p className="text-gray-300 font-light italic">
                Lời khuyên: "{numerology.advice}"
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Details Sections */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <LayoutGrid className="w-6 h-6 text-fuchsia-400" />
          Giải mã chi tiết
        </h2>

        {details.length === 0 ? (
          <div className="text-center p-10 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-400">Chưa có bài phân tích chi tiết nào về số này trong hệ thống.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {details.map((detail, index) => (
              <motion.div
                key={detail.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="bg-slate-900/60 backdrop-blur-lg border border-purple-500/10 rounded-3xl p-8 hover:bg-slate-900/80 transition-colors"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                     <DynamicIcon name={detail.icon_name} className="w-6 h-6 text-fuchsia-400" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-purple-400 font-bold block mb-1">
                      {detail.topic}
                    </span>
                    <h3 className="text-xl font-bold text-white">{detail.title}</h3>
                  </div>
                </div>
                
                <p className="text-slate-300 leading-relaxed font-light">
                  {detail.content}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
