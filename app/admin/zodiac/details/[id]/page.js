'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Edit3, Save, X, Sparkles, Shield, Tag, Eye, Type, Bold, Italic, List, Quote, Link as LinkIcon, Minus, Code, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { zodiacService } from '@/services/zodiacService';
import { zodiacDetailService } from '@/services/zodiacDetailService';
import { FIELD_ZODIAC_SIGNS, FIELD_ZODIAC_DETAILS, ROUTES } from '@/constants';
import ReactMarkdown from 'react-markdown';

export default function AdminZodiacDetailManager({ params }) {
  const { id } = params;
  const [zodiac, setZodiac] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
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
      const percentage = editor.scrollTop / (editor.scrollHeight - editor.clientHeight || 1);
      preview.scrollTop = percentage * (preview.scrollHeight - preview.clientHeight);
    } else {
      const percentage = preview.scrollTop / (preview.scrollHeight - preview.clientHeight || 1);
      editor.scrollTop = percentage * (editor.scrollHeight - editor.clientHeight);
    }
    setTimeout(() => { isSyncingRef.current = false; }, 50);
  };

  const [formData, setFormData] = useState({
    [FIELD_ZODIAC_DETAILS.TOPIC]: '',
    [FIELD_ZODIAC_DETAILS.TITLE]: '',
    [FIELD_ZODIAC_DETAILS.CONTENT]: '',
    [FIELD_ZODIAC_DETAILS.IS_PREMIUM]: false,
    [FIELD_ZODIAC_DETAILS.ZODIAC_ID]: parseInt(id)
  });

  const insertMarkdown = (tag, type = 'prefix') => {
    const textarea = document.getElementById('detail-content-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData[FIELD_ZODIAC_DETAILS.CONTENT];
    const selectedText = text.substring(start, end);
    
    let newText;
    if (type === 'prefix') {
      newText = text.substring(0, start) + tag + selectedText + text.substring(end);
    } else if (type === 'wrap') {
      newText = text.substring(0, start) + tag + selectedText + tag + text.substring(end);
    }
    
    setFormData(prev => ({ ...prev, [FIELD_ZODIAC_DETAILS.CONTENT]: newText }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, end + tag.length);
    }, 10);
  };

  const toggleHeading = (action) => {
    const textarea = document.getElementById('detail-content-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = formData[FIELD_ZODIAC_DETAILS.CONTENT];
    
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = text.indexOf('\n', start);
    const line = text.substring(lineStart, lineEnd === -1 ? text.length : lineEnd);
    
    const match = line.match(/^(#+)\s/);
    const currentLevel = match ? match[1].length : 0;
    
    let nextLevel = currentLevel;
    if (action === 'increase') {
      if (currentLevel === 0) nextLevel = 3;
      else if (currentLevel > 1) nextLevel = currentLevel - 1;
    } else {
      if (currentLevel === 0) nextLevel = 3;
      else if (currentLevel < 4) nextLevel = currentLevel + 1;
      else nextLevel = 0;
    }

    let newLine = line.replace(/^(#+)\s/, '');
    if (nextLevel > 0) {
      newLine = '#'.repeat(nextLevel) + ' ' + newLine;
    }

    const newText = text.substring(0, lineStart) + newLine + text.substring(lineEnd === -1 ? text.length : lineEnd);
    setFormData(prev => ({ ...prev, [FIELD_ZODIAC_DETAILS.CONTENT]: newText }));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [zodiacData, detailData] = await Promise.all([
        zodiacService.getZodiacById(id),
        zodiacDetailService.getDetailsByZodiacId(id)
      ]);
      setZodiac(zodiacData);
      setDetails(detailData || []);
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (detail) => {
    setEditingId(detail.id);
    setFormData(detail);
    setIsAdding(false);
    setEditMode('edit');
  };

  const handleDelete = async (detailId) => {
    if (!window.confirm("Xóa nội dung này?")) return;
    try {
      await zodiacDetailService.deleteDetail(detailId);
      setDetails(details.filter(d => d.id !== detailId));
    } catch (error) {
      alert("Lỗi khi xóa: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await zodiacDetailService.updateDetail(editingId, formData);
      } else {
        await zodiacDetailService.createDetail(formData);
      }
      setEditingId(null);
      setIsAdding(false);
      setFormData({
        [FIELD_ZODIAC_DETAILS.TOPIC]: '',
        [FIELD_ZODIAC_DETAILS.TITLE]: '',
        [FIELD_ZODIAC_DETAILS.CONTENT]: '',
        [FIELD_ZODIAC_DETAILS.IS_PREMIUM]: false,
        [FIELD_ZODIAC_DETAILS.ZODIAC_ID]: parseInt(id)
      });
      fetchData();
    } catch (error) {
      alert("Lỗi khi lưu: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`mx-auto space-y-8 pb-32 transition-all duration-500 ${editMode === 'split' ? 'max-w-[95%]' : 'max-w-5xl'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/zodiac" className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Chi tiết bài viết</span>
               <h1 className="text-2xl font-black text-white">{zodiac?.[FIELD_ZODIAC_SIGNS.NAME]}</h1>
            </div>
            <p className="text-gray-400 text-sm italic">Quản lý các chủ đề chuyên sâu bằng trình soạn thảo Pro.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={ROUTES.ZODIAC_DETAIL(id)}
            target="_blank"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold transition-all border border-white/5"
          >
            <Eye className="w-5 h-5 text-indigo-400" /> Xem Trước
          </Link>
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); setEditMode('edit'); }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-5 h-5" /> Thêm Bài Viết
          </button>
        </div>
      </div>

      {(isAdding || editingId) && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-indigo-500/30 p-8 rounded-[2rem] shadow-2xl relative z-10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              {editingId ? 'Chỉnh sửa chủ đề' : 'Thêm chủ đề mới'}
            </h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-2 hover:bg-white/5 rounded-full text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className={`grid grid-cols-1 ${editMode === 'split' ? 'md:grid-cols-2' : 'md:grid-cols-2'} gap-6`}>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Topic (Chủ đề)</label>
                <input 
                  type="text" required
                  placeholder="VD: Truyền thuyết, Góc tối..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none"
                  value={formData[FIELD_ZODIAC_DETAILS.TOPIC]}
                  onChange={e => setFormData({...formData, [FIELD_ZODIAC_DETAILS.TOPIC]: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Tiêu đề bài viết</label>
                <input 
                  type="text" required
                  placeholder="VD: Sự ra đời của chòm sao..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none"
                  value={formData[FIELD_ZODIAC_DETAILS.TITLE]}
                  onChange={e => setFormData({...formData, [FIELD_ZODIAC_DETAILS.TITLE]: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-8">
              <div className="relative flex items-center justify-center py-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-white/5 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
                <div className="relative flex items-center gap-4 bg-[#020617] px-6">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.3)]"></div>
                  <label className="text-[11px] font-black uppercase tracking-[0.4em] text-white/90">Nội dung chi tiết</label>
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.3)]"></div>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                   {/* Mode Switcher */}
                   <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                      <button 
                        type="button"
                        onClick={() => setEditMode('edit')}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${editMode === 'edit' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <Edit2 className="w-3 h-3" /> SOẠN THẢO
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditMode('split')}
                        className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${editMode === 'split' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <Sparkles className="w-3 h-3" /> SONG SONG
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditMode('preview')}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${editMode === 'preview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <Eye className="w-3 h-3" /> XEM TRƯỚC
                      </button>
                   </div>

                   {editMode !== 'preview' && (
                      <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                        <button type="button" onClick={() => toggleHeading('increase')} title="Tăng cấp Tiêu đề" className="px-2 py-1 hover:bg-white/10 rounded-lg text-cyan-400 text-[10px] font-black border border-cyan-500/20">H+</button>
                        <button type="button" onClick={() => toggleHeading('decrease')} title="Giảm cấp Tiêu đề" className="px-2 py-1 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white text-[10px] font-black border border-white/10">H-</button>
                        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                        <button type="button" onClick={() => insertMarkdown('**', 'wrap')} title="Bold" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"><Bold className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => insertMarkdown('_', 'wrap')} title="Italic" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"><Italic className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => insertMarkdown('- ', 'prefix')} title="List" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"><List className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => insertMarkdown('> ', 'prefix')} title="Quote" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"><Quote className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => insertMarkdown('[Link](https://...)', 'prefix')} title="Link" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"><LinkIcon className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => insertMarkdown('---', 'prefix')} title="Divider" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"><Minus className="w-3.5 h-3.5" /></button>
                      </div>
                   )}
                 </div>
               </div>

               <div className={`grid grid-cols-1 ${editMode === 'split' ? 'md:grid-cols-2' : ''} gap-6`}>
                {(editMode === 'edit' || editMode === 'split') && (
                  <textarea 
                    id="detail-content-textarea"
                    ref={editorRef}
                    onScroll={() => handleScroll('editor')}
                    required rows={15}
                    placeholder="Nhập nội dung bài viết (Hỗ trợ Markdown)..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                    value={formData[FIELD_ZODIAC_DETAILS.CONTENT]}
                    onChange={e => setFormData({...formData, [FIELD_ZODIAC_DETAILS.CONTENT]: e.target.value})}
                  />
                )}

                {(editMode === 'preview' || editMode === 'split') && (
                  <div 
                    ref={previewRef}
                    onScroll={() => handleScroll('preview')}
                    className="w-full bg-black/20 border border-white/10 rounded-2xl pt-32 pb-12 px-10 min-h-[400px] max-h-[600px] overflow-y-auto"
                  >
                    <div className="prose prose-invert prose-cyan max-w-none prose-p:leading-loose prose-headings:text-white prose-strong:text-cyan-400 [&>*:first-child]:!mt-10 prose-h1:!mt-20 prose-h2:!mt-16 prose-h3:!mt-12 prose-hr:!mt-16 prose-hr:!mb-16 [&_hr+*]:!mt-20">
                      <ReactMarkdown>{formData[FIELD_ZODIAC_DETAILS.CONTENT] || "*Chưa có nội dung để xem trước...*"}</ReactMarkdown>
                    </div>
                  </div>
                )}
               </div>


            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-sm font-bold text-white">Nội dung Premium?</p>
                  <p className="text-[10px] text-gray-500">Chỉ dành cho tài khoản trả phí (sau này)</p>
                </div>
              </div>
              <input 
                type="checkbox"
                className="w-6 h-6 rounded-lg bg-black border-white/20 text-indigo-600 focus:ring-indigo-500"
                checked={formData[FIELD_ZODIAC_DETAILS.IS_PREMIUM]}
                onChange={e => setFormData({...formData, [FIELD_ZODIAC_DETAILS.IS_PREMIUM]: e.target.checked})}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button 
                type="submit"
                className="px-10 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg"
              >
                Lưu Thay Đổi
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {details.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center p-20 bg-slate-900/30 rounded-[3rem] border border-dashed border-white/10 text-gray-500 italic">
            <Tag className="w-12 h-12 mb-4 opacity-20" />
            Cung này chưa có bài viết chi tiết nào.
          </div>
        )}

        {details.map((detail) => (
          <div key={detail.id} className="group relative bg-slate-900/50 border border-white/5 hover:border-white/10 p-8 rounded-[2rem] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">
                    {detail[FIELD_ZODIAC_DETAILS.TOPIC]}
                  </span>
                  {detail[FIELD_ZODIAC_DETAILS.IS_PREMIUM] && (
                    <span className="text-[10px] uppercase font-black tracking-widest text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Premium
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">{detail[FIELD_ZODIAC_DETAILS.TITLE]}</h3>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(detail)}
                  className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl border border-white/5 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(detail.id)}
                  className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/10 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-light">
              {detail[FIELD_ZODIAC_DETAILS.CONTENT]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
