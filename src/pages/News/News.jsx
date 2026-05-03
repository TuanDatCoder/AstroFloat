import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, Newspaper, Star, Moon, ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { newsService } from '../../services/newsService';
import { ROUTES } from '../../constants';

export default function News() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('tag') || '');
  
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(['Tất cả']);
  const [loading, setLoading] = useState(true);

  // Cập nhật searchQuery khi URL params thay đổi (ví dụ bấm tag từ trang detail)
  useEffect(() => {
    const tag = searchParams.get('tag');
    if (tag) {
      setSearchQuery(tag);
      setActiveCategory('Tất cả');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch categories and articles from Supabase
        const [catsData, artsData] = await Promise.all([
          newsService.getCategories(),
          newsService.getArticles()
        ]);

        if (catsData) {
          setCategories(['Tất cả', ...catsData.map(c => c.name)]);
        }

        if (artsData) {
          const formatted = artsData.map(a => {
            // Lấy danh mục đầu tiên (nếu có)
            const catName = a.news_article_categories?.[0]?.news_categories?.name || 'Chưa phân loại';
            
            // Lấy danh sách tags
            const tags = a.news_article_tags?.map(t => t.news_tags?.name).filter(Boolean) || [];

            return {
              id: a.id,
              title: a.title,
              slug: a.slug,
              summary: a.summary,
              category: catName,
              imageUrl: a.thumbnail_url || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000&auto=format&fit=crop',
              date: new Date(a.published_at || a.created_at).toLocaleDateString('vi-VN'),
              readTime: '5 phút', // Có thể tính dựa trên độ dài content sau
              tags: tags
            };
          });
          setArticles(formatted);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredNews = articles.filter(news => {
    const matchCategory = activeCategory === 'Tất cả' || news.category === activeCategory;
    
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchCategory;

    // Xử lý tìm kiếm (bao gồm cả hashtag #)
    const cleanQuery = query.startsWith('#') ? query.slice(1) : query;
    
    const matchSearch = news.title.toLowerCase().includes(query) || 
                        (news.summary && news.summary.toLowerCase().includes(query)) ||
                        news.tags.some(tag => {
                          const t = tag.toLowerCase();
                          return t.includes(query) || t.includes(cleanQuery);
                        });
                        
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[30%] w-[20%] h-[20%] bg-blue-900/20 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-sm font-semibold tracking-wider mb-6">
            <Newspaper className="w-4 h-4" />
            <span>TIN TỨC & BÀI VIẾT</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-300 to-amber-300">
            Khám Phá Tri Thức <br /> Vũ Trụ
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Cập nhật những tin tức mới nhất về Thần Số Học, Chiêm Tinh và các bài viết luận giải chuyên sâu từ các chuyên gia Góc Vũ Trụ.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12">
          {/* Categories */}
          <div className="w-full lg:w-auto overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-2 sm:gap-3 min-w-max">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-widest transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(34,211,238,0.4)] border border-transparent'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80 group shrink-0">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-[#111827] border border-white/10 rounded-full flex items-center px-4 py-3 focus-within:border-cyan-400/50 transition-colors">
              <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value.trim() !== '') {
                    setActiveCategory('Tất cả');
                  }
                }}
                className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredNews.length > 0 ? (
                filteredNews.map((news, index) => (
                  <Link
                    key={news.id}
                    to={ROUTES.NEWS_DETAIL(news.slug)}
                    className="block group relative bg-[#111827]/80 rounded-[2rem] border border-white/5 overflow-hidden hover:border-white/20 transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                  >
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                    {/* Image Container */}
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent z-10" />
                      <img 
                        src={news.imageUrl} 
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                      />
                      <div className="absolute top-4 left-4 z-20 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 ${
                          news.category === 'Thần số học' 
                            ? 'bg-purple-500/30 text-purple-200' 
                            : 'bg-cyan-500/30 text-cyan-200'
                        }`}>
                          {news.category === 'Thần số học' ? <Star className="w-3 h-3 inline mr-1" /> : <Moon className="w-3 h-3 inline mr-1" />}
                          {news.category}
                        </span>
                      </div>
                    </div>

                    {/* Content Container */}
                    <div className="p-6 relative z-20">
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{news.readTime} đọc</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                        <span>{news.date}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {news.summary}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {news.tags.map(tag => (
                          <span key={tag} className="flex items-center gap-1 text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded border border-white/5">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer / Read More Action */}
                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <button className="flex items-center gap-2 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 group-hover:from-cyan-300 group-hover:to-purple-300 transition-all">
                          Đọc tiếp
                          <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 pointer-events-none rounded-[2rem] border-2 border-transparent group-hover:border-white/10 transition-colors" />
                    <div className="absolute -inset-px bg-gradient-to-b from-transparent via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-20 text-center">
                  <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Không tìm thấy bài viết</h3>
                  <p className="text-gray-400">Vui lòng thử lại với từ khóa khác.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
