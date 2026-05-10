'use client';

import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, Newspaper, Star, Moon, ArrowRight, Clock, Tag, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/constants';

export default function NewsListClient({ initialArticles, initialCategories }) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const tag = searchParams.get('tag');
    if (tag) {
      setSearchQuery(tag);
      setActiveCategory('Tất cả');
    }
  }, [searchParams]);

  // Reset về trang 1 khi đổi category hoặc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  // 1. FILTER
  const filtered = initialArticles.filter(news => {
    const matchCategory = activeCategory === 'Tất cả' || news.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchCategory;
    const cleanQuery = query.startsWith('#') ? query.slice(1) : query;
    const matchSearch = news.title.toLowerCase().includes(query) || 
                        (news.summary && news.summary.toLowerCase().includes(query)) ||
                        news.tags.some(tag => tag.toLowerCase().includes(cleanQuery));
    return matchCategory && matchSearch;
  });

  // 2. SORT
  const sortedNews = [...filtered].sort((a, b) => {
    const dateA = new Date(a.rawDate);
    const dateB = new Date(b.rawDate);
    const today = new Date();
    
    const isToday = (d) => 
      d.getDate() === today.getDate() && 
      d.getMonth() === today.getMonth() && 
      d.getFullYear() === today.getFullYear();

    // Priority score: Today = 2, Featured = 1, Normal = 0
    const scoreA = isToday(dateA) ? 2 : (a.is_featured ? 1 : 0);
    const scoreB = isToday(dateB) ? 2 : (b.is_featured ? 1 : 0);

    if (scoreA !== scoreB) {
      return scoreB - scoreA;
    }
    // Nếu cùng priority thì xếp theo ngày mới nhất
    return dateB - dateA;
  });

  // 3. PAGINATION
  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);
  const displayedNews = sortedNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <m.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase mb-4 block">
            Archive & Knowledge
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Góc Nhìn Vũ Trụ
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xl mx-auto">
            Nơi lưu trữ những tri thức về chiêm tinh, thần số học và hành trình khám phá bản thân qua các vì sao.
          </p>
        </m.div>

        <div className="relative mb-20 px-4 transform-gpu">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-8 bg-white/[0.01] backdrop-blur-xl border border-white/5 p-2 rounded-full shadow-2xl translate-z-0">
            
            <div className="flex items-center gap-1 overflow-x-auto w-full xl:w-auto no-scrollbar p-1">
              {initialCategories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`relative px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 whitespace-nowrap ${
                      isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {isActive && (
                      <m.div
                        layoutId="activeNewsCategory"
                        className="absolute inset-0 bg-white/[0.05] backdrop-blur-md border border-white/10 rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full xl:w-80 group hidden md:block mr-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="TÌM KIẾM BÀI VIẾT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border border-white/5 rounded-full py-3 pl-11 pr-6 text-[10px] font-bold tracking-widest text-white placeholder:text-gray-600 focus:bg-white/[0.03] focus:outline-none transition-all"
              />
            </div>
          </div>
          
          {/* Mobile Search */}
          <div className="md:hidden mt-4 relative w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="TÌM KIẾM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.01] backdrop-blur-xl border border-white/5 rounded-full py-4 pl-12 pr-6 text-xs text-white placeholder:text-gray-600 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 transform-gpu mb-16">
          <AnimatePresence mode="popLayout">
            {displayedNews.length > 0 ? (
              displayedNews.map((news, index) => (
                <Link 
                  key={news.id} 
                  href={ROUTES.NEWS_DETAIL(news.slug)} 
                  className="block group relative h-full transform-gpu"
                >
                  <m.div 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ 
                      duration: 0.4,
                      delay: index * 0.03
                    }}
                    className={`h-full bg-white/[0.02] border rounded-3xl overflow-hidden transition-all duration-500 flex flex-col will-change-transform translate-z-0 ${
                      news.is_featured 
                        ? 'border-amber-500/30 hover:border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.05)]' 
                        : 'border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="relative h-64 overflow-hidden transform-gpu">
                      <Image 
                        src={news.imageUrl} 
                        alt={news.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80 group-hover:opacity-100 will-change-transform" 
                      />
                      <div className="absolute top-6 left-6 z-20 flex gap-2">
                        <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase bg-black/60 text-white border border-white/10 backdrop-blur-md tracking-widest">
                          {news.category}
                        </span>
                        {news.is_featured && (
                          <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-md tracking-widest flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-amber-400" /> NỔI BẬT
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">
                        <span>{news.date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-800" />
                        <span>{news.readTime} ĐỌC</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors leading-snug">
                        {news.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-8 line-clamp-3 leading-relaxed flex-1">
                        {news.summary}
                      </p>
                      
                      <div className="pt-2 flex justify-between items-center mt-auto">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                          <span>CHI TIẾT</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </m.div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-32 text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                  <BookOpen className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 italic">Vũ trụ đang im lặng</h3>
                <p className="text-gray-400 max-w-sm mx-auto">Chúng tôi không tìm thấy bài viết nào khớp với tìm kiếm của bạn. Hãy thử từ khóa khác nhé.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${
                    currentPage === i + 1 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-white/5 text-gray-500 hover:text-white border border-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
