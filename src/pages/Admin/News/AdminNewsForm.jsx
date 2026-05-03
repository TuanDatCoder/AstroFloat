import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, Save, Trash2, Image as ImageIcon, 
  Eye, CheckCircle, Clock, AlertCircle, Sparkles
} from 'lucide-react';
import { newsService } from '../../../services/newsService';
import { motion } from 'framer-motion';
import { useRef } from 'react';

export default function AdminNewsForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    thumbnail_url: '',
    status: 'draft',
    is_featured: false,
    published_at: null,
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  async function fetchInitialData() {
    try {
      const cats = await newsService.getCategories();
      setCategories(cats || []);

      if (isEdit) {
        // Lấy tất cả bài viết rồi lọc (vì service chưa có getById, chỉ có getBySlug, 
        // nhưng admin edit dùng ID cho chuẩn. Mình sẽ dùng getArticles rồi lọc tạm 
        // hoặc gọi thẳng Supabase ở đây)
        const allArticles = await newsService.getArticles();
        const article = allArticles.find(a => a.id === parseInt(id));
        
        if (article) {
          // Lấy thêm chi tiết đầy đủ (content) bằng slug
          const fullData = await newsService.getArticleBySlug(article.slug);
          setFormData({
            title: fullData.title,
            slug: fullData.slug,
            summary: fullData.summary || '',
            content: fullData.content || '',
            thumbnail_url: fullData.thumbnail_url || '',
            status: fullData.status || 'draft',
            is_featured: fullData.is_featured || false,
            published_at: fullData.published_at,
          });
          
          if (fullData.news_article_categories?.[0]?.news_categories?.id) {
            setSelectedCategoryId(fullData.news_article_categories[0].news_categories.id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching form data:", error);
    } finally {
      setFetching(false);
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Auto-generate slug from title if empty
    if (name === 'title' && !isEdit && !formData.slug) {
      const generatedSlug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const publicUrl = await newsService.uploadImage(file);
      setFormData(prev => ({ ...prev, thumbnail_url: publicUrl }));
    } catch (error) {
      alert('Lỗi khi tải ảnh lên: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        published_at: formData.status === 'published' && !formData.published_at ? new Date().toISOString() : formData.published_at
      };

      if (isEdit) {
        await newsService.updateArticle(id, payload);
      } else {
        await newsService.createArticle(payload);
      }

      // Lưu thành công
      navigate('/admin/news');
    } catch (error) {
      alert('Lỗi khi lưu bài viết: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium">Đang tải dữ liệu bài viết...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/news"
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">
              {isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
            </h1>
            <p className="text-sm text-gray-400">Tạo nội dung hấp dẫn cho cộng đồng của bạn.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => navigate('/admin/news')}
            className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isEdit ? 'Cập Nhật' : 'Đăng Bài'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 space-y-6 shadow-xl">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">Tiêu đề bài viết</label>
              <input 
                type="text" 
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ví dụ: Ý nghĩa số chủ đạo 1 trong Thần số học"
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg font-bold focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-gray-700"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1 flex items-center gap-2">
                Đường dẫn tĩnh (Slug)
                <Sparkles className="w-3 h-3 text-amber-400" />
              </label>
              <input 
                type="text" 
                name="slug"
                required
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="y-nghia-so-chu-dao-1"
                className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-gray-300 text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">Tóm tắt ngắn</label>
              <textarea 
                name="summary"
                rows="3"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Mô tả ngắn gọn về bài viết để thu hút người đọc..."
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
              ></textarea>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 ml-1">Nội dung chính</label>
              <textarea 
                name="content"
                required
                rows="15"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Bắt đầu viết nội dung tuyệt vời của bạn ở đây..."
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-white text-base leading-loose focus:outline-none focus:border-indigo-500/50 transition-all min-h-[400px]"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          {/* Status & Visibility */}
          <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              Thiết lập bài viết
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Trạng thái</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, status: 'draft' }))}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-xs ${
                      formData.status === 'draft' 
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' 
                        : 'bg-slate-950/50 border-white/5 text-gray-500 hover:text-white'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    Bản nháp
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, status: 'published' }))}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-xs ${
                      formData.status === 'published' 
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' 
                        : 'bg-slate-950/50 border-white/5 text-gray-500 hover:text-white'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Công khai
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-bold text-gray-300">Nổi bật?</span>
                </div>
                <input 
                  type="checkbox" 
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Danh mục</label>
                <select 
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="">Chọn danh mục...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-600 italic">Lưu ý: Tính năng gán danh mục sẽ được cập nhật đầy đủ ở bản sau.</p>
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Ảnh bìa (Thumbnail)
            </h3>
            
            <div className="space-y-4">
              <div className="aspect-video bg-slate-950/50 rounded-2xl border-2 border-dashed border-white/10 overflow-hidden relative group">
                {formData.thumbnail_url ? (
                  <img 
                    src={formData.thumbnail_url} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-2">
                    <ImageIcon className="w-8 h-8 opacity-20" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Chưa có ảnh</span>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] text-white font-bold">Đang tải...</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleInputChange}
                  placeholder="Dán link hoặc tải lên"
                  className="flex-1 bg-slate-950/50 border border-white/10 rounded-xl py-3 px-4 text-xs text-gray-300 focus:outline-none focus:border-indigo-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
                  title="Tải ảnh lên"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*"
                />
              </div>
            </div>
          </div>

          {isEdit && (
            <div className="bg-rose-500/5 p-6 rounded-[2rem] border border-rose-500/10 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Vùng nguy hiểm
              </h3>
              <button
                type="button"
                onClick={() => {
                  if(window.confirm('Xóa vĩnh viễn bài viết này?')) {
                    newsService.deleteArticle(id).then(() => navigate('/admin/news'));
                  }
                }}
                className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl text-xs font-bold transition-all border border-rose-500/20"
              >
                Xóa bài viết này
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
