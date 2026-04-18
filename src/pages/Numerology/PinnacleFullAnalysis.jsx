import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Zap, Sparkles, Star, Calendar, Clock, Crown, Target } from 'lucide-react';
import { numerologyService } from '../../services/numerologyService';
import { supabase } from '../../services/supabase';

export default function PinnacleFullAnalysis() {
  const [searchParams] = useSearchParams();
  const dob = searchParams.get('dob');
  const [pinnacles, setPinnacles] = useState([]);
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!dob) return;
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const calculatedPinnacles = await numerologyService.getPinnaclesForUser(session?.user?.id, dob);
        setPinnacles(calculatedPinnacles);

        // Fetch details for all 4 pinnacle numbers
        const uniqueNumbers = [...new Set(calculatedPinnacles.map(p => p.value))];
        const detailPromises = uniqueNumbers.map(n => numerologyService.getPinnacleByNumber(n));
        const detailsData = await Promise.all(detailPromises);
        
        const detailsMap = {};
        detailsData.forEach(d => {
          if (d) detailsMap[d.number] = d;
        });
        setDetails(detailsMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dob]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
        <p className="text-indigo-300 font-black tracking-widest animate-pulse uppercase text-xs">Đang phác thảo lộ trình cuộc đời...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center pt-24 pb-32 px-6 relative z-10 w-full max-w-5xl mx-auto min-h-screen">
      
      <Link to="/discover" className="self-start mb-12 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-black uppercase tracking-widest group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> HỒ SƠ CỦA BẠN
      </Link>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-[10px] font-black tracking-[0.3em] mb-4 shadow-xl uppercase">
          Chu kỳ vĩnh cửu
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight italic">
          Hành Trình <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">4 Đỉnh Cao</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
          Cuộc đời con người được chia thành các chu kỳ 9 năm năng lượng. 
          Hãy khám phá những cột mốc rực rỡ nhất mà vũ trụ đã dành sẵn cho bạn.
        </p>
      </motion.div>

      {/* Timeline Journey */}
      <div className="w-full relative">
        {/* Central Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-transparent -translate-x-1/2 hidden md:block" />

        <div className="space-y-24">
          {pinnacles.map((p, index) => {
            const detail = details[p.value];
            const isEven = index % 2 === 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 md:gap-0`}
              >
                {/* Connector Node */}
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-950 border-4 border-indigo-500/30 flex items-center justify-center z-20 hidden md:flex">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[45%] ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                  <div className="bg-slate-900/60 backdrop-blur-3xl p-8 rounded-[3rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 group shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Crown className="w-20 h-20 text-indigo-400" />
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-3xl font-black text-indigo-300 shadow-inner group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            {p.value}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">
                                <Clock className="w-3 h-3" /> Giai đoạn {index + 1}
                            </div>
                            <h3 className="text-white font-bold text-lg uppercase tracking-tight">{index === 3 ? `${p.age} tuổi trở đi` : `${p.age} tuổi`}</h3>
                        </div>
                    </div>

                    <h4 className="text-xl font-black text-indigo-100 mb-4 italic leading-tight">
                        {detail?.title || `Năng lượng đỉnh cao số ${p.value}`}
                    </h4>

                    <p className="text-gray-400 text-sm font-light leading-relaxed mb-6 line-clamp-4 group-hover:line-clamp-none transition-all duration-500">
                        {detail?.content || "Dữ liệu đang được kết nối với tần số vũ trụ..."}
                    </p>

                    {detail?.advice && (
                        <div className="pt-6 border-t border-white/5 flex gap-3 text-indigo-300/60 italic text-xs">
                            <Zap className="w-4 h-4 flex-shrink-0 text-amber-400" />
                            <p>{detail.advice}</p>
                        </div>
                    )}

                    <div className="mt-8">
                        <Link to={`/pinnacle/${p.value}`} className="inline-flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                            CHI TIẾT CON SỐ <ArrowLeft className="w-3 h-3 rotate-180" />
                        </Link>
                    </div>
                  </div>
                </div>

                {/* Empty spacer for grid */}
                <div className="hidden md:block w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Summary Insight */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="mt-32 p-12 bg-indigo-500/5 rounded-[4rem] border border-indigo-500/10 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-24 h-24 text-indigo-400" />
        </div>
        <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-wider italic">Vũ trụ không bao giờ nhầm lẫn</h3>
        <p className="text-gray-400 max-w-xl mx-auto font-light leading-relaxed italic">
            "Mỗi đỉnh cao không chỉ là một cột mốc thành công, mà là một bài học linh hồn cần phải hoàn thành. 
            Hãy đón nhận năng lượng của từng giai đoạn với tâm thế cởi mở và biết ơn."
        </p>
      </motion.div>

    </div>
  );
}
