'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, Save, Image as ImageIcon, 
  CheckCircle, Clock, AlertCircle, Sparkles,
  Bold, Italic, List, Quote, Type, Link as LinkIcon, 
  Minus, Code, Eye, Edit2
} from 'lucide-react';
import { newsService } from '@/services/newsService';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

export default function AdminNewsFormClient({ id }) {
  const router = useRouter();
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
        const allArticles = await newsService.adminGetArticles();
        const article = allArticles.find(a => a.id === parseInt(id));
        
        if (article) {
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

      router.push('/admin/news');
    } catch (error) {
      alert('Lỗi khi lưu bài viết: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const [editMode, setEditMode] = useState('edit'); // 'edit', 'preview', 'split'

  // Sync scroll refs
  const editorRef = useRef(null);
  const previewRef = useRef(null);
  const isSyncingRef = useRef(false);

  const handleScroll = (source) => {
    if (editMode !== 'split' || isSyncingRef.current) return;
    
    const editor = editorRef.current;
    const preview = previewRef.current;
    if (!editor || !preview) return;

    isSyncingRef.current = true;
    if (source === 'editor') {
      const percentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
      preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
    } else {
      const percentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
      editor.scrollTop = percentage * (editor.scrollHeight - editor.clientHeight);
    }
    
    setTimeout(() => { isSyncingRef.current = false; }, 50);
  };

  const insertMarkdown = (tag, type = 'prefix') => {
    const textarea = document.getElementsByName('content')[0];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const selectedText = text.substring(start, end);
    
    let newText;
    if (type === 'prefix') {
      newText = text.substring(0, start) + tag + selectedText + text.substring(end);
    } else if (type === 'wrap') {
      newText = text.substring(0, start) + tag + selectedText + tag + text.substring(end);
    }
    
    setFormData(prev => ({ ...prev, content: newText }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, end + tag.length);
    }, 10);
  };

  const toggleHeading = (action) => {
    const textarea = document.getElementsByName('content')[0];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = formData.content;
    
    // Find the start and end of the current line
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = text.indexOf('\n', start);
    const line = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
    
    // Check current heading level
    const match = line.match(/^(#+)\s/);
    const currentLevel = match ? match[1].length : 0;
    
    let nextLevel = currentLevel;
    if (action === 'increase') {
      // Larger size = Fewer hashes (H3 -> H2 -> H1)
      if (currentLevel === 0) nextLevel = 3;
      else if (currentLevel > 1) nextLevel = currentLevel - 1;
    } else {
      // Smaller size = More hashes (H1 -> H2 -> H3 -> text)
      if (currentLevel === 0) nextLevel = 3;
      else if (currentLevel < 4) nextLevel = currentLevel + 1;
      else nextLevel = 0;
    }

    let newLine = line.replace(/^(#+)\s/, '');
    if (nextLevel > 0) {
      newLine = '#'.repeat(nextLevel) + ' ' + newLine;
    }

    const newText = text.substring(0, lineStart) + newLine + text.substring(lineEnd === -1 ? text.length : lineEnd);
    setFormData(prev => ({ ...prev, content: newText }));
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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/news"
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">
              {isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
            </h1>
            <p className="text-sm text-gray-400">Tối ưu nội dung với trình soạn thảo Pro.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => router.push('/admin/news')}
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

      <form onSubmit={handleSubmit} className={`grid grid-cols-1 ${editMode === 'split' ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
        <div className={`${editMode === 'split' ? 'col-span-1' : 'lg:col-span-2'} space-y-6`}>
          <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 space-y-6 shadow-xl">
            {editMode !== 'split' && (
              <>
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

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">Tóm tắt ngắn</label>
                  <textarea 
                    name="summary"
                    rows="2"
                    value={formData.summary}
                    onChange={handleInputChange}
                    placeholder="Mô tả ngắn gọn về bài viết để thu hút người đọc..."
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                  ></textarea>
                </div>
              </>
            )}

            <div className="space-y-8">
              <div className="relative flex items-center justify-center py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-white/5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
                <div className="relative flex items-center gap-4 bg-[#020617] px-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.3)]"></div>
                  <label className="text-[11px] font-black uppercase tracking-[0.4em] text-white/90">Nội dung chính</label>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.3)]"></div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                   {/* Mode Switcher */}
                   <div className="flex bg-slate-950/80 p-1 rounded-xl border border-white/10">
                      <button 
                        type="button"
                        onClick={() => setEditMode('edit')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${editMode === 'edit' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <Edit2 className="w-3 h-3" /> SOẠN THẢO
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditMode('split')}
                        className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${editMode === 'split' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <Sparkles className="w-3 h-3" /> SONG SONG
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditMode('preview')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${editMode === 'preview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <Eye className="w-3 h-3" /> XEM TRƯỚC
                      </button>
                   </div>

                   {editMode !== 'preview' && (
                      <div className="flex items-center gap-1 bg-slate-950/50 p-1 rounded-xl border border-white/5">
                        <button type="button" onClick={() => toggleHeading('increase')} title="Tăng cấp Tiêu đề" className="px-2 py-1 hover:bg-white/10 rounded-lg text-cyan-400 text-[10px] font-black border border-cyan-500/20">H+</button>
                        <button type="button" onClick={() => toggleHeading('decrease')} title="Giảm cấp Tiêu đề" className="px-2 py-1 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white text-[10px] font-black border border-white/10">H-</button>
                        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                        <button type="button" onClick={() => insertMarkdown('**', 'wrap')} title="Bold" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"><Bold className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertMarkdown('_', 'wrap')} title="Italic" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"><Italic className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertMarkdown('- ', 'prefix')} title="List" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"><List className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertMarkdown('> ', 'prefix')} title="Quote" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"><Quote className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertMarkdown('[Tên link](https://...)', 'prefix')} title="Link" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"><LinkIcon className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertMarkdown('---', 'prefix')} title="Divider" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"><Minus className="w-4 h-4" /></button>
                        <button type="button" onClick={() => insertMarkdown('```\n\n```', 'prefix')} title="Code block" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"><Code className="w-4 h-4" /></button>
                      </div>
                   )}
                </div>

              <div className={`grid grid-cols-1 ${editMode === 'split' ? 'md:grid-cols-2' : ''} gap-6`}>
                {(editMode === 'edit' || editMode === 'split') && (
                  <div className="space-y-2">
                    <textarea 
                      ref={editorRef}
                      onScroll={() => handleScroll('editor')}
                      name="content"
                      required
                      rows={editMode === 'split' ? '25' : '15'}
                      value={formData.content}
                      onChange={handleInputChange}
                      placeholder="Bắt đầu viết nội dung tuyệt vời của bạn ở đây..."
                      className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 px-6 text-white text-base leading-loose focus:outline-none focus:border-indigo-500/50 transition-all min-h-[500px] font-mono text-sm"
                    ></textarea>
                    {editMode === 'edit' && (
                      <div className="flex items-center gap-2 mt-2 ml-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Trình soạn thảo Pro đã sẵn sàng</span>
                      </div>
                    )}
                  </div>
                )}

                {(editMode === 'preview' || editMode === 'split') && (
                  <div 
                    ref={previewRef}
                    onScroll={() => handleScroll('preview')}
                    className={`w-full bg-slate-950/30 border border-white/10 rounded-2xl pt-32 pb-12 px-10 min-h-[500px] max-h-[800px] overflow-y-auto ${editMode === 'split' ? 'max-h-[700px]' : ''}`}
                  >
                    <div className="prose prose-invert prose-cyan max-w-none prose-p:leading-loose prose-headings:text-white prose-strong:text-cyan-400 [&>*:first-child]:!mt-10 prose-h1:!mt-20 prose-h2:!mt-16 prose-h3:!mt-12 prose-hr:!mt-16 prose-hr:!mb-16 [&_hr+*]:!mt-20">
                      <ReactMarkdown>{formData.content || "*Chưa có nội dung để xem trước...*"}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {editMode !== 'split' && (
          <div className="space-y-6">
            {/* ... Right Sidebar Settings ... */}
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
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-[2rem] border border-white/5 space-y-4 shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Ảnh bìa (Thumbnail)
            </h3>
            
            <div className="space-y-4">
              <div className="aspect-video bg-slate-950/50 rounded-2xl border-2 border-dashed border-white/10 overflow-hidden relative group">
                {formData.thumbnail_url ? (
                  <Image 
                    src={formData.thumbnail_url} 
                    alt="Preview" 
                    fill sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
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
                    newsService.deleteArticle(id).then(() => router.push('/admin/news'));
                  }
                }}
                className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl text-xs font-bold transition-all border border-rose-500/20"
              >
                Xóa bài viết này
              </button>
            </div>
          )}
        </div>
        )}
      </form>
    </div>
  );
}
