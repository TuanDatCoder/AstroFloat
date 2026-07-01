'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, History, Trash2, Calendar, LayoutGrid, ChevronDown, Sparkles, BookOpen } from 'lucide-react';
import { tarotService } from '@/services/tarotService';

export default function TarotHistory() {
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    // Tải lịch sử từ LocalStorage
    const localHistory = tarotService.getReadingHistoryFromLocal();
    setHistory(localHistory);
  }, []);

  const handleClearHistory = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử trải bài trên trình duyệt này? Hành động này không thể khôi phục.')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('astrofloat_tarot_history');
        setHistory([]);
      }
    }
  };

  const getStyleLabel = (styleId) => {
    const s = parseInt(styleId, 10);
    if (s === 1) return 'Gen Z';
    if (s === 2) return 'Chữa Lành';
    if (s === 3) return 'Sâu Sắc';
    if (s === 4) return 'Toxic';
    return 'Chữa Lành';
  };

  const getTopicLabel = (topicId) => {
    const t = parseInt(topicId, 10);
    if (t === 1) return 'Thông Điệp Ngày Mới';
    if (t === 2) return 'Trải Bài Tình Yêu';
    if (t === 3) return 'Trải Bài Sự Nghiệp';
    if (t === 4) return 'Trải Bài Tài Chính';
    return 'Trải Bài Tarot';
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 text-left">
      {/* Back link */}
      <div className="mb-10">
        <Link href="/tarot" className="text-xs uppercase tracking-widest text-[#ebdcb9]/60 hover:text-amber-200 flex items-center gap-1.5 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Về Trang chủ Tarot
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8 border-b border-amber-950/20 pb-6">
        <div className="flex items-center gap-3">
          <History className="w-6 h-6 text-amber-500" />
          <h1 className="font-serif text-2xl sm:text-3xl font-black tracking-widest text-white">
            LỊCH SỬ TRẢI BÀI
          </h1>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="text-xs tracking-wider font-semibold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 border border-red-950/40 rounded-full px-4 py-2 bg-red-950/10 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" /> XÓA LỊCH SỬ
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="tarot-glass border-amber-950/20 rounded-3xl p-12 text-center my-12 max-w-xl mx-auto">
          <BookOpen className="w-12 h-12 text-amber-500/40 mx-auto mb-4" />
          <h3 className="font-serif text-lg font-bold text-white mb-2">
            Sách Mệnh Đang Để Trống
          </h3>
          <p className="text-xs sm:text-sm text-[#ebdcb9]/60 leading-relaxed mb-6">
            Bạn chưa thực hiện lượt trải bài nào trên thiết bị này. Hãy bắt đầu kết nối với vũ trụ ngay bây giờ để lưu lại thông điệp của bạn.
          </p>
          <Link href="/tarot" className="bg-amber-600 hover:bg-amber-500 text-black text-xs font-serif font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all inline-block active:scale-95 shadow-lg shadow-amber-600/10">
            TRẢI BÀI NGAY
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {history.map((record, index) => {
            const isExpanded = expandedId === (record.reading_id || index);
            const key = record.reading_id || index;
            return (
              <div 
                key={key}
                className={`tarot-glass border-amber-950/20 rounded-2xl overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'ring-1 ring-amber-500/30 bg-[#0f0b1e]/60' : 'bg-[#0f0b1a]/30'
                }`}
              >
                {/* Header summary panel */}
                <div 
                  onClick={() => toggleExpand(key)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.01] transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="text-[10px] tracking-wider text-[#ebdcb9]/40 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      {formatDate(record.created_at)}
                    </span>
                    
                    <span className="font-serif text-xs uppercase tracking-wider text-amber-300 font-bold bg-amber-950/30 px-3 py-1 rounded-full border border-amber-900/30">
                      {getTopicLabel(record.topic_id)}
                    </span>

                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#ebdcb9]/50 border border-amber-950/40 rounded-full px-2.5 py-0.5 bg-black/10">
                      {getStyleLabel(record.style_id)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-1 hidden sm:flex">
                      {record.cards && Array.isArray(record.cards) && record.cards.map((c, i) => (
                        <div 
                          key={i} 
                          className="w-5 h-8 rounded-sm bg-amber-950/20 border border-amber-500/20 flex items-center justify-center text-[7px] text-amber-400 font-serif font-black"
                          title={c.card_name}
                        >
                          T
                        </div>
                      ))}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded detail section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-amber-950/20"
                    >
                      <div className="p-6 md:p-8 bg-[#040207]/40">
                        {/* Reading Quote */}
                        <div className="text-sm sm:text-base leading-relaxed text-[#ebdcb9] font-medium italic border-l-2 border-amber-500/40 pl-4 py-1.5 mb-8 bg-amber-500/[0.02]">
                          &ldquo;{record.full_text}&rdquo;
                        </div>

                        {/* Cards summary breakdown */}
                        <h4 className="font-serif text-xs text-amber-400 tracking-widest uppercase font-bold mb-4">
                          CÁC LÁ BÀI ĐÃ BỐC:
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {record.cards && Array.isArray(record.cards) && record.cards.map((c, idx) => (
                            <div 
                              key={idx}
                              className="tarot-glass border-amber-950/30 p-4 rounded-xl flex items-start gap-4"
                            >
                              {/* Mini Card Graphics */}
                              <div className="shrink-0 w-12 h-20 bg-gradient-to-b from-[#1b152d] to-[#0b071a] border border-amber-500/40 rounded-lg flex flex-col items-center justify-between p-1 shadow-inner relative overflow-hidden">
                                {c.image_url ? (
                                  <img
                                    src={c.image_url}
                                    alt={c.card_name}
                                    className={`w-full h-full object-cover transition-transform duration-300 ${
                                      c.orientation === 'reversed' ? 'rotate-180' : ''
                                    }`}
                                  />
                                ) : (
                                  <>
                                    <span className="text-[6px] tracking-wider text-amber-500/40 font-mono select-none">
                                      {c.orientation === 'reversed' ? 'REV' : 'UPR'}
                                    </span>
                                    <Sparkles className="w-4 h-4 text-amber-500/30" />
                                    <span className="text-[6px] tracking-wider text-amber-200 font-serif font-bold text-center uppercase leading-none select-none truncate w-full px-0.5">
                                      {c.card_name}
                                    </span>
                                  </>
                                )}
                              </div>

                              <div className="flex-grow text-left">
                                <span className="text-[8px] font-bold tracking-widest uppercase text-amber-500 block mb-1">
                                  Vị trí {c.position || (idx + 1)}: {c.position_name}
                                </span>
                                <h5 className="font-serif font-black text-sm text-white uppercase tracking-wider mb-1">
                                  {c.card_name} ({c.orientation === 'reversed' ? 'Ngược' : 'Xuôi'})
                                </h5>
                                <p className="text-xs text-[#ebdcb9]/70 leading-relaxed font-medium">
                                  {c.short_meaning}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
