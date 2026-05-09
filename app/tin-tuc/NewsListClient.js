'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Newspaper, Star, Moon, ArrowRight, Clock, Tag, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/constants';

export default function NewsListClient({ initialArticles, initialCategories }) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const tag = searchParams.get('tag');
    if (tag) {
      setSearchQuery(tag);
      setActiveCategory('Tất cả');
    }
  }, [searchParams]);

  const filteredNews = initialArticles.filter(news => {
    const matchCategory = activeCategory === 'Tất cả' || news.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchCategory;
    const cleanQuery = query.startsWith('#') ? query.slice(1) : query;
    const matchSearch = news.title.toLowerCase().includes(query) || 
                        (news.summary && news.summary.toLowerCase().includes(query)) ||
                        news.tags.some(tag => tag.toLowerCase().includes(cleanQuery));
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-[10px] font-black tracking-[0.4em] text-gray-500 uppercase mb-4 block">
            Archive & Knowledge
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Góc Nhìn Vũ Trụ
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xl mx-auto">
            Nơi lưu trữ những tri thức về chiêm tinh, thần số học và hành trình khám phá bản thân qua các vì sao.
          </p>
        </motion.div>

        <div className="relative mb-20 px-4 transform-gpu">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-8 bg-white/[0.01] backdrop-blur-xl border border-white/5 p-2 rounded-full shadow-2xl translate-z-0">
            
            <div className="flex items-center gap-1 overflow-x-auto w-full xl:w-auto scrollbar-hide p-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
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
                      <motion.div
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
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
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
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="TÌM KIẾM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.01] backdrop-blur-xl border border-white/5 rounded-full py-4 pl-12 pr-6 text-xs text-white placeholder:text-gray-600 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 transform-gpu">
          <AnimatePresence mode="popLayout">
            {filteredNews.length > 0 ? (
              filteredNews.map((news, index) => (
                <Link 
                  key={news.id} 
                  href={ROUTES.NEWS_DETAIL(news.slug)} 
                  className="block group relative h-full transform-gpu"
                >
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ 
                      duration: 0.4,
                      delay: index * 0.03
                    }}
                    className="h-full bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 flex flex-col will-change-transform translate-z-0"
                  >
                    <div className="relative h-64 overflow-hidden transform-gpu">
                      <img 
                        src={news.imageUrl} 
                        alt={news.title} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-80 group-hover:opacity-100 will-change-transform" 
                      />
                      <div className="absolute top-6 left-6 z-20">
                        <span className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase bg-black/60 text-white border border-white/10 backdrop-blur-md tracking-widest">
                          {news.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
                        <span>{news.date}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-800" />
                        <span>{news.readTime} ĐỌC</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-gray-300 transition-colors leading-snug">
                        {news.title}
                      </h3>
                      
                      <p className="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed flex-1">
                        {news.summary}
                      </p>
                      
                      <div className="pt-2 flex justify-between items-center mt-auto">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                          <span>CHI TIẾT</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-32 text-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                  <BookOpen className="w-10 h-10 text-gray-600" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 italic">Vũ trụ đang im lặng</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Chúng tôi không tìm thấy bài viết nào khớp với tìm kiếm của bạn. Hãy thử từ khóa khác nhé.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
