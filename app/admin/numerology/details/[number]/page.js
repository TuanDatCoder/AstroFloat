'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Edit3, X, Sparkles, Eye, Edit2, Type, Bold, Italic, List, Quote, Link as LinkIcon, Minus, Code } from 'lucide-react';
import { numerologyService } from '@/services/numerologyService';
import { numerologyDetailService } from '@/services/numerologyDetailService';
import { FIELD_NUMEROLOGY_DETAILS } from '@/constants';
import ReactMarkdown from 'react-markdown';

export default function AdminNumerologyDetailManager({ params }) {
  const { number } = params;
  const [numerology, setNumerology] = useState(null);
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
    [FIELD_NUMEROLOGY_DETAILS.TOPIC]: '',
    [FIELD_NUMEROLOGY_DETAILS.TITLE]: '',
    [FIELD_NUMEROLOGY_DETAILS.CONTENT]: '',
    [FIELD_NUMEROLOGY_DETAILS.ICON_NAME]: '',
    [FIELD_NUMEROLOGY_DETAILS.NUMBER]: parseInt(number)
  });

  const insertMarkdown = (tag, type = 'prefix') => {
    const textarea = document.getElementById('num-detail-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData[FIELD_NUMEROLOGY_DETAILS.CONTENT];
    const selectedText = text.substring(start, end);
    
    let newText;
    if (type === 'prefix') {
      newText = text.substring(0, start) + tag + selectedText + text.substring(end);
    } else if (type === 'wrap') {
      newText = text.substring(0, start) + tag + selectedText + tag + text.substring(end);
    }
    
    setFormData(prev => ({ ...prev, [FIELD_NUMEROLOGY_DETAILS.CONTENT]: newText }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, end + tag.length);
    }, 10);
  };

  const toggleHeading = (action) => {
    const textarea = document.getElementById('num-detail-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const text = formData[FIELD_NUMEROLOGY_DETAILS.CONTENT];
    
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
    setFormData(prev => ({ ...prev, [FIELD_NUMEROLOGY_DETAILS.CONTENT]: newText }));
  };

  useEffect(() => {
    fetchData();
  }, [number]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [numData, detailData] = await Promise.all([
        numerologyService.getNumerologyByNumber(number),
        numerologyDetailService.getDetailsByNumber(number)
      ]);
      setNumerology(numData);
      setDetails(detailData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa nội dung này?")) return;
    try {
      await numerologyDetailService.deleteDetail(id);
      fetchData();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await numerologyDetailService.updateDetail(editingId, formData);
      } else {
        await numerologyDetailService.createDetail(formData);
      }
      setEditingId(null);
      setIsAdding(false);
      setFormData({
        [FIELD_NUMEROLOGY_DETAILS.TOPIC]: '',
        [FIELD_NUMEROLOGY_DETAILS.TITLE]: '',
        [FIELD_NUMEROLOGY_DETAILS.CONTENT]: '',
        [FIELD_NUMEROLOGY_DETAILS.ICON_NAME]: '',
        [FIELD_NUMEROLOGY_DETAILS.NUMBER]: parseInt(number)
      });
      fetchData();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" /></div>;

  return (
    <div className={`mx-auto space-y-8 pb-32 transition-all duration-500 ${editMode === 'split' ? 'max-w-[95%]' : 'max-w-5xl'}`}>
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/numerology" className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider">Mở rộng bài viết</span>
               <h1 className="text-2xl font-black text-white">Số chủ đạo {number}</h1>
            </div>
            <p className="text-gray-400 text-sm italic">{numerology?.[FIELD_NUMEROLOGY_DETAILS.TITLE] || 'Đang cập nhật...'}</p>
          </div>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); setEditMode('edit'); }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" /> Thêm Bài Viết Phụ
        </button>
      </div>

       {(isAdding || editingId) && (
        <div className="bg-slate-900 border border-purple-500/30 p-8 rounded-[2.5rem] shadow-2xl relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              {editingId ? 'Chỉnh sửa nội dung' : 'Thêm nội dung mới'}
            </h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-2 hover:bg-white/5 rounded-full text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Chủ đề (Topic)</label>
                <input 
                  type="text" required placeholder="VD: Tình yêu, Sự nghiệp, Thách thức..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500/50 focus:outline-none"
                  value={formData[FIELD_NUMEROLOGY_DETAILS.TOPIC]}
                  onChange={e => setFormData({...formData, [FIELD_NUMEROLOGY_DETAILS.TOPIC]: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Icon Name (Lucide-react)</label>
                <input 
                  type="text" placeholder="VD: Heart, Briefcase, Zap..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500/50 focus:outline-none"
                  value={formData[FIELD_NUMEROLOGY_DETAILS.ICON_NAME]}
                  onChange={e => setFormData({...formData, [FIELD_NUMEROLOGY_DETAILS.ICON_NAME]: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Tiêu đề bài viết</label>
                <input 
                  type="text" required placeholder="VD: Thần số 1 trong công việc..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500/50 focus:outline-none"
                  value={formData[FIELD_NUMEROLOGY_DETAILS.TITLE]}
                  onChange={e => setFormData({...formData, [FIELD_NUMEROLOGY_DETAILS.TITLE]: e.target.value})}
                />
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
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${editMode === 'edit' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <Edit2 className="w-3 h-3" /> SOẠN THẢO
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditMode('split')}
                        className={`hidden md:flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${editMode === 'split' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <Sparkles className="w-3 h-3" /> SONG SONG
                      </button>
                      <button 
                        type="button"
                        onClick={() => setEditMode('preview')}
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${editMode === 'preview' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        <Eye className="w-3 h-3" /> XEM TRƯỚC
                      </button>
                   </div>

                   {editMode !== 'preview' && (
                      <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                        <button type="button" onClick={() => toggleHeading('increase')} title="Tăng cấp Tiêu đề" className="px-2 py-1 hover:bg-white/10 rounded-lg text-fuchsia-400 text-[10px] font-black border border-fuchsia-500/20">H+</button>
                        <button type="button" onClick={() => toggleHeading('decrease')} title="Giảm cấp Tiêu đề" className="px-2 py-1 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white text-[10px] font-black border border-white/10">H-</button>
                        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>
                        <button type="button" onClick={() => insertMarkdown('**', 'wrap')} title="Bold" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-fuchsia-400"><Bold className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => insertMarkdown('_', 'wrap')} title="Italic" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-fuchsia-400"><Italic className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => insertMarkdown('- ', 'prefix')} title="List" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-fuchsia-400"><List className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => insertMarkdown('> ', 'prefix')} title="Quote" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-fuchsia-400"><Quote className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => insertMarkdown('[Link](https://...)', 'prefix')} title="Link" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-fuchsia-400"><LinkIcon className="w-3.5 h-3.5" /></button>
                        <button type="button" onClick={() => insertMarkdown('---', 'prefix')} title="Divider" className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-fuchsia-400"><Minus className="w-3.5 h-3.5" /></button>
                      </div>
                   )}
                 </div>
               </div>

               <div className={`grid grid-cols-1 ${editMode === 'split' ? 'md:grid-cols-2' : ''} gap-6`}>
                {(editMode === 'edit' || editMode === 'split') && (
                  <textarea 
                    id="num-detail-textarea"
                    ref={editorRef}
                    onScroll={() => handleScroll('editor')}
                    required rows={15} placeholder="Soạn thảo nội dung chuyên sâu tại đây (Hỗ trợ Markdown)..."
                    className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-6 py-5 text-white focus:border-purple-500/50 focus:outline-none resize-none leading-relaxed font-mono text-sm"
                    value={formData[FIELD_NUMEROLOGY_DETAILS.CONTENT]}
                    onChange={e => setFormData({...formData, [FIELD_NUMEROLOGY_DETAILS.CONTENT]: e.target.value})}
                  />
                )}

                {(editMode === 'preview' || editMode === 'split') && (
                  <div 
                    ref={previewRef}
                    onScroll={() => handleScroll('preview')}
                    className="w-full bg-black/20 border border-white/10 rounded-3xl pt-32 pb-12 px-10 min-h-[400px] max-h-[600px] overflow-y-auto"
                  >
                    <div className="prose prose-invert prose-fuchsia max-w-none prose-p:leading-loose prose-headings:text-white prose-strong:text-fuchsia-400 [&>*:first-child]:!mt-10 prose-h1:!mt-20 prose-h2:!mt-16 prose-h3:!mt-12 prose-hr:!mt-16 prose-hr:!mb-16 [&_hr+*]:!mt-20">
                      <ReactMarkdown>{formData[FIELD_NUMEROLOGY_DETAILS.CONTENT] || "*Chưa có nội dung để xem trước...*"}</ReactMarkdown>
                    </div>
                  </div>
                )}
               </div>


            <div className="flex justify-end pt-4 border-t border-white/5">
              <button 
                type="submit"
                className="px-12 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black transition-all shadow-xl uppercase tracking-widest text-xs"
              >
                Lưu Bài Viết
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {details.map((detail) => (
          <div key={detail.id} className="group relative bg-slate-900/50 border border-white/5 hover:border-white/10 p-8 rounded-[2.5rem] transition-all">
             <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black tracking-widest text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded">
                      {detail[FIELD_NUMEROLOGY_DETAILS.TOPIC]}
                    </span>
                    {detail.icon_name && (
                      <span className="text-[10px] text-gray-600 lowercase bg-white/5 px-2 py-0.5 rounded italic">icon: {detail.icon_name}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white">{detail[FIELD_NUMEROLOGY_DETAILS.TITLE]}</h3>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(detail)} className="p-3 bg-white/5 hover:bg-white/10 text-indigo-400 rounded-xl transition-all border border-white/5"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(detail.id)} className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all border border-rose-500/10"><Trash2 className="w-4 h-4" /></button>
                </div>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-light">{detail[FIELD_NUMEROLOGY_DETAILS.CONTENT]}</p>
          </div>
        ))}

        {details.length === 0 && !isAdding && (
          <div className="p-20 bg-slate-900/40 rounded-[3rem] border border-dashed border-white/10 text-center text-gray-600 italic">
             Chưa có bài viết phụ nào cho con số này.
          </div>
        )}
      </div>
    </div>
  );
}
