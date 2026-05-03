import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Tag, ChevronLeft, Calendar, User, Eye } from 'lucide-react';
import { newsService } from '../../services/newsService';

export default function NewsDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    console.log("NewsDetail mounted with slug:", slug);
    const fetchArticle = async () => {
      try {
        setLoading(true);
        console.log("Fetching article for slug:", slug);
        const data = await newsService.getArticleBySlug(slug);
        console.log("Fetched data:", data);
        if (data) {
          setArticle(data);
          // Tăng lượt xem
          newsService.incrementViewCount(data.id, data.view_count);
        } else {
          setErrorMsg("Không tìm thấy dữ liệu bài viết (data is null).");
        }
      } catch (error) {
        console.error("Error fetching article details:", error);
        setErrorMsg(`Lỗi fetch: ${error.message || JSON.stringify(error)}`);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchArticle();
    }
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] pt-24 flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white pt-24 pb-20 flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4 text-xl font-bold">LỖI CHI TIẾT:</div>
        <div className="bg-red-500/10 p-4 border border-red-500 rounded-lg max-w-2xl text-center">
          {errorMsg}
          <br /><br />
          Slug hiện tại: <strong>{slug}</strong>
        </div>
      </div>
    );
  }

  if (!article) return null;

  const categoryName = article.news_article_categories?.[0]?.news_categories?.name || 'Tin Tức';
  const tags = article.news_article_tags?.map(t => t.news_tags?.name).filter(Boolean) || [];
  const publishedDate = new Date(article.published_at || article.created_at).toLocaleDateString('vi-VN', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white pt-24 pb-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-4xl">
        {/* Back Link */}
        <Link 
          to="/tin-tuc" 
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium mb-8 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Quay lại tin tức
        </Link>

        {/* Article Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-6">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              {categoryName}
            </span>
            {tags.length > 0 && (
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
                {tags[0]}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{publishedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{article.view_count || 0} lượt xem</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Góc Vũ Trụ</span>
            </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        {article.thumbnail_url && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <img 
              src={article.thumbnail_url} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Summary */}
        {article.summary && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10 text-lg md:text-xl text-gray-300 italic mb-10 leading-relaxed border-l-4 border-l-cyan-500"
          >
            {article.summary}
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="prose prose-invert prose-lg max-w-none text-gray-300 leading-loose"
        >
          {article.content ? (
            article.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-6">{paragraph}</p>
            ))
          ) : (
            <p className="text-gray-500 italic">Nội dung đang được cập nhật...</p>
          )}
        </motion.div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-gray-400" />
              <span className="font-semibold text-gray-300">Từ khóa:</span>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Link 
                    key={tag} 
                    to={`/tin-tuc?tag=${encodeURIComponent(tag)}`}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
