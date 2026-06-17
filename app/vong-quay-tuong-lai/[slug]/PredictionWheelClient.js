'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Dices, RefreshCw, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@/constants';

const CustomSelect = ({ label, placeholder, options, value, onChange, labelColor, highlightColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 relative">
      <label className={`text-[10px] uppercase font-bold tracking-widest px-2 ${labelColor}`}>{label}</label>
      <div 
        className="relative w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white cursor-pointer hover:border-white/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span className={value ? "text-white" : "text-gray-500"}>
            {value ? options.find(o => o.value === value)?.label : placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-[calc(100%+8px)] left-0 right-0 bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50 shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-h-64 overflow-y-auto custom-scrollbar"
            >
              {options.map(opt => (
                <div 
                  key={opt.value}
                  className={`px-4 py-3 cursor-pointer transition-colors text-sm font-medium ${
                    value === opt.value 
                      ? `bg-white/10 ${highlightColor}` 
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function PredictionWheelClient({ category, predictions, rules, zodiacs }) {
  const [selectedZodiac, setSelectedZodiac] = useState('');
  const [selectedLifePath, setSelectedLifePath] = useState('');
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDisplayPrediction, setCurrentDisplayPrediction] = useState(null);
  const [finalResult, setFinalResult] = useState(null);

  // Mảng số chủ đạo (1->9, 11, 22)
  const lifePaths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '22', '33'];

  // Weighted Random Algorithm
  const calculateResult = () => {
    // 1. Calculate weights
    const weightedPredictions = predictions.map(pred => {
      let finalWeight = pred.base_weight || 10;
      
      // Lọc các rules của prediction này
      const predRules = rules.filter(r => r.prediction_id === pred.id);
      
      predRules.forEach(rule => {
        if (rule.rule_type === 'zodiac' && rule.rule_value === selectedZodiac) {
          finalWeight += rule.score;
        }
        if (rule.rule_type === 'life_path' && rule.rule_value === selectedLifePath) {
          finalWeight += rule.score;
        }
      });
      
      return { ...pred, finalWeight };
    });

    // 2. Quay số ngẫu nhiên theo trọng số
    const totalWeight = weightedPredictions.reduce((acc, curr) => acc + curr.finalWeight, 0);
    let randomNum = Math.random() * totalWeight;
    
    let selectedPred = weightedPredictions[0];
    for (let i = 0; i < weightedPredictions.length; i++) {
      if (randomNum < weightedPredictions[i].finalWeight) {
        selectedPred = weightedPredictions[i];
        break;
      }
      randomNum -= weightedPredictions[i].finalWeight;
    }
    
    return selectedPred;
  };

  const handleSpin = () => {
    if (!selectedZodiac || !selectedLifePath) return;
    
    setIsSpinning(true);
    setFinalResult(null);

    // Tính toán kết quả trước
    const result = calculateResult();

    // Hiệu ứng slot machine (chạy lướt qua các kết quả)
    let spinCount = 0;
    const maxSpins = 35; // Số lần chạy vừa phải
    let speed = 25; // Tốc độ ban đầu nhanh hơn

    const spin = () => {
      spinCount++;
      // Chọn đại 1 cái để show hiệu ứng
      const randomIndex = Math.floor(Math.random() * predictions.length);
      setCurrentDisplayPrediction(predictions[randomIndex]);

      if (spinCount < maxSpins) {
        // Càng về cuối càng chậm dần nhưng vẫn giữ nhịp độ nhanh hơn
        speed += Math.floor(spinCount / 2.5);
        setTimeout(spin, speed);
      } else {
        // Kết thúc
        setIsSpinning(false);
        setCurrentDisplayPrediction(null);
        setFinalResult(result);
      }
    };

    spin();
  };

  return (
    <div className="flex flex-col items-center pt-32 pb-20 px-4 sm:px-6 relative w-full max-w-5xl mx-auto min-h-[80vh]">
      
      <div className="w-full mb-8">
        <Link href={ROUTES.PREDICTIONS} className="inline-flex items-center text-sm font-semibold tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold tracking-[0.25em] mb-4 uppercase">
          VÒNG QUAY SỐ MỆNH
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-fuchsia-400 to-indigo-400 pb-2">
          {category?.title}
        </h1>
        <p className="mt-4 text-gray-400 max-w-xl mx-auto text-sm md:text-base font-light">
          {category?.description}
        </p>
      </motion.div>

      {!finalResult && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-md p-6 md:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative z-10"
        >
          {isSpinning ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 min-h-[400px] md:min-h-[480px] relative overflow-hidden rounded-3xl bg-slate-950/80 border border-white/5 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]">
              
              {/* Vòng tròn ma thuật xoay bên dưới */}
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-[800px] h-[800px] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(99,102,241,0)_40%,rgba(99,102,241,0.1)_70%,rgba(168,85,247,0.15)_100%)] opacity-35 blur-3xl rounded-full pointer-events-none"
              />
              <motion.div 
                animate={{ rotate: -360 }} 
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute w-[600px] h-[600px] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(168,85,247,0)_40%,rgba(168,85,247,0.08)_70%,rgba(59,130,246,0.12)_100%)] opacity-35 blur-2xl rounded-full pointer-events-none"
              />

              {/* Lưới không gian */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_60%)]" />

              {/* Icon trung tâm */}
              <div className="relative z-10 mb-12">
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full animate-pulse" />
                
                {/* Orbital rings */}
                <motion.div
                  animate={{ rotate: 180 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] border border-dashed border-indigo-400/20 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -180 }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[180px] border border-violet-400/15 rounded-full"
                />

                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.08, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-slate-900 border border-indigo-500/30 p-6 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.25)] relative z-10"
                >
                  <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.4)]" />
                </motion.div>
              </div>
              
              {/* Chữ chạy slot machine */}
              <div className="relative z-10 h-32 md:h-40 w-full flex items-center justify-center px-4 md:px-12">
                <AnimatePresence mode="popLayout">
                  <motion.div 
                    key={currentDisplayPrediction?.id || 'loading'}
                    initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                    className="absolute text-xl md:text-3xl lg:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-100 via-white to-purple-200 text-center tracking-wide leading-relaxed drop-shadow-[0_0_20px_rgba(165,180,252,0.4)] max-w-3xl"
                  >
                    {currentDisplayPrediction?.title || "Đang kết nối vũ trụ..."}
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Dấu chấm loading */}
              <div className="mt-8 relative z-10">
                <div className="flex gap-3">
                  {[0, 1, 2].map((i) => (
                    <motion.div 
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.9)]"
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomSelect
                  label="Cung Hoàng Đạo"
                  placeholder="-- Chọn Cung của bạn --"
                  options={zodiacs.map(z => ({ value: z.name, label: z.name }))}
                  value={selectedZodiac}
                  onChange={setSelectedZodiac}
                  labelColor="text-indigo-400"
                  highlightColor="text-indigo-400"
                />

                <CustomSelect
                  label="Số Chủ Đạo"
                  placeholder="-- Chọn Số của bạn --"
                  options={lifePaths.map(num => ({ value: num, label: `Số ${num}` }))}
                  value={selectedLifePath}
                  onChange={setSelectedLifePath}
                  labelColor="text-rose-400"
                  highlightColor="text-rose-400"
                />
              </div>

              <button 
                onClick={handleSpin}
                disabled={!selectedZodiac || !selectedLifePath}
                className="w-full mt-4 px-8 py-4 bg-gradient-to-r from-rose-600 via-fuchsia-600 to-indigo-600 hover:from-rose-500 hover:via-fuchsia-500 hover:to-indigo-500 rounded-xl font-black text-white tracking-[0.2em] shadow-[0_0_20px_rgba(244,63,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase flex items-center justify-center gap-3"
              >
                <Dices className="w-5 h-5" />
                Bắt đầu giải mã
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* FINAL RESULT */}
      <AnimatePresence>
        {finalResult && !isSpinning && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full max-w-4xl relative z-10"
          >
            <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(244,63,94,0.15)]">
              <div className="grid grid-cols-1 md:grid-cols-2">
                
                {/* Image Section */}
                <div className="relative h-64 md:h-auto w-full">
                  {finalResult.image_url ? (
                    <Image 
                      src={finalResult.image_url} 
                      alt={finalResult.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-indigo-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-l" />
                </div>

                {/* Content Section */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-rose-300 text-[10px] font-bold tracking-[0.2em] mb-4 uppercase w-max">
                    Kết Quả Của Bạn
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                    {finalResult.title}
                  </h2>
                  
                  <p className="text-slate-300 leading-relaxed text-lg font-light mb-10">
                    {finalResult.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    <button 
                      onClick={() => setFinalResult(null)}
                      className="flex-1 py-3 px-6 rounded-xl border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" /> Thử lại
                    </button>
                    {finalResult.share_text && (
                      <button className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest text-xs transition-colors shadow-lg">
                        Chia sẻ ngay
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEO CONTENT SECTION - HIỂN THỊ DANH SÁCH DỰ ĐOÁN ĐỂ GOOGLE INDEX */}
      <section className="w-full mt-32 border-t border-white/10 pt-16 text-left relative z-10">
        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Khám phá các dự đoán về {category?.title}
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
            Vũ trụ luôn ẩn chứa vô vàn khả năng. Dưới đây là những kịch bản tương lai có thể xảy ra dựa trên sự kết hợp giữa Cung Hoàng Đạo và Thần Số Học của bạn.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {predictions.map((pred) => (
            <div key={pred.id} className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:bg-white/5 transition-all duration-300 group">
              <h3 className="text-lg font-bold text-rose-300 mb-3 group-hover:text-rose-400 transition-colors">
                {pred.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all">
                {pred.description}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
