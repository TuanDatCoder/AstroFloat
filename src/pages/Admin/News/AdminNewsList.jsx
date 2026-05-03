import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Search, Edit2, Trash2, Eye, 
  ChevronLeft, ChevronRight, Filter,
  Calendar, Newspaper, CheckCircle, Clock
} from 'lucide-react';
import { newsService } from '../../../services/newsService';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminNewsList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      setLoading(true);
      const data = await newsService.adminGetArticles();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching admin articles:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await newsService.deleteArticle(id);
        setArticles(articles.filter(a => a.id !== id));
      } catch (error) {
        alert('Lỗi khi xóa bài viết: ' + error.message);
      }
    }
  }

  const filteredArticles = articles.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Quản Lý Tin Tức</h1>
          <p className="text-gray-400">Xem, tạo mới và chỉnh sửa các bài viết trên hệ thống.</p>
        </div>
        <Link 
          to="/admin/news/new"
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 w-fit"
        >
          <Plus className="w-5 h-5" />
          Viết Bài Mới
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm theo tiêu đề hoặc slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
        <div className="flex gap-4">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Bản nháp</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-900/50 rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-500">Bài viết</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-500">Danh mục</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-500">Trạng thái</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-500">Ngày tạo</th>
                <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-gray-500 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500 italic">
                      Đang tải danh sách bài viết...
                    </td>
                  </tr>
                ) : filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-gray-500 italic">
                      Không tìm thấy bài viết nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <motion.tr 
                      key={article.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 border border-white/5">
                            <img 
                              src={article.thumbnail_url || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=100&auto=format&fit=crop'} 
                              alt="" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate max-w-[250px]">{article.title}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{article.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-block whitespace-nowrap px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                          {article.news_article_categories?.[0]?.news_categories?.name || 'Chưa phân loại'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {article.status === 'published' ? (
                          <div className="flex items-center gap-1.5 text-emerald-400">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Công khai</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Bản nháp</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-5 text-gray-400 text-sm">
                        {new Date(article.published_at || article.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to={`/tin-tuc/${article.slug}`}
                            target="_blank"
                            className="p-2 text-gray-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all"
                            title="Xem thử"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link 
                            to={`/admin/news/edit/${article.id}`}
                            className="p-2 text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                            title="Chỉnh sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(article.id)}
                            className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
