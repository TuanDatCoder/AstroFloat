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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-semibold mb-6 uppercase tracking-widest">
            <Newspaper className="w-4 h-4" /> <span>TIN TỨC & BÀI VIẾT</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-300 to-amber-300">
            Khám Phá Tri Thức Vũ Trụ
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">Cập nhật những tin tức mới nhất về Thần Số Học, Chiêm Tinh và các bài viết luận giải chuyên sâu.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {initialCategories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-widest transition-all ${activeCategory === cat ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Tìm kiếm bài viết..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#111827] border border-white/10 rounded-full pl-12 pr-4 py-3 focus:border-cyan-400/50 outline-none text-white text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredNews.length > 0 ? (
              filteredNews.map((news, index) => (
                <Link key={news.id} href={ROUTES.NEWS_DETAIL(news.slug)} className="block group relative bg-[#111827]/80 rounded-[2rem] border border-white/5 overflow-hidden hover:border-white/20 transition-all hover:-translate-y-2">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <div className="relative h-56 overflow-hidden">
                      <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 z-20"><span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-purple-500/30 text-purple-200 border border-white/20 backdrop-blur-md">{news.category}</span></div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4"><span>{news.date}</span><div className="w-1 h-1 rounded-full bg-gray-600" /><span>{news.readTime} đọc</span></div>
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors">{news.title}</h3>
                      <p className="text-gray-400 text-sm mb-6 line-clamp-3">{news.summary}</p>
                      <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                        <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Đọc tiếp</span>
                        <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500"><BookOpen className="w-16 h-16 mx-auto mb-4" /><h3 className="text-2xl font-bold">Không tìm thấy bài viết</h3></div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
