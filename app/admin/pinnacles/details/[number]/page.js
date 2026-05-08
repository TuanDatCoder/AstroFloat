'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Edit3, X, Sparkles, Shield, Star } from 'lucide-react';
import { numerologyService } from '@/services/numerologyService';
import { pinnacleDetailService } from '@/services/pinnacleDetailService';
import { FIELD_PINNACLE_DETAILS } from '@/constants';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPinnacleDetailManager({ params }) {
  const { number } = params;
  const [pinnacle, setPinnacle] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    [FIELD_PINNACLE_DETAILS.TOPIC]: '',
    [FIELD_PINNACLE_DETAILS.TITLE]: '',
    [FIELD_PINNACLE_DETAILS.CONTENT]: '',
    [FIELD_PINNACLE_DETAILS.IS_PREMIUM]: false,
    [FIELD_PINNACLE_DETAILS.PINNACLE_NUMBER]: parseInt(number)
  });

  useEffect(() => {
    fetchData();
  }, [number]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pinData, detailData] = await Promise.all([
        numerologyService.getPinnacleByNumber(number),
        pinnacleDetailService.getDetailsByPinnacleNumber(number)
      ]);
      setPinnacle(pinData);
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa nội dung chuyên sâu này?")) return;
    try {
      await pinnacleDetailService.deleteDetail(id);
      fetchData();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await pinnacleDetailService.updateDetail(editingId, formData);
      } else {
        await pinnacleDetailService.createDetail(formData);
      }
      setEditingId(null);
      setIsAdding(false);
      setFormData({
        [FIELD_PINNACLE_DETAILS.TOPIC]: '',
        [FIELD_PINNACLE_DETAILS.TITLE]: '',
        [FIELD_PINNACLE_DETAILS.CONTENT]: '',
        [FIELD_PINNACLE_DETAILS.IS_PREMIUM]: false,
        [FIELD_PINNACLE_DETAILS.PINNACLE_NUMBER]: parseInt(number)
      });
      fetchData();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  if (loading) return <div className="flex justify-center p-20"><div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/pinnacles" className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Mở rộng đỉnh cao</span>
               <h1 className="text-2xl font-black text-white">Số đỉnh cao {number}</h1>
            </div>
            <p className="text-gray-400 text-sm italic">{pinnacle?.title || 'Đang cập nhật...'}</p>
          </div>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" /> Thêm Bài Viết Chuyên Sâu
        </button>
      </div>

       {(isAdding || editingId) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-indigo-500/30 p-8 rounded-[2.5rem] shadow-2xl relative z-10"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              {editingId ? 'Chỉnh sửa nội dung' : 'Thêm nội dung chuyên sâu'}
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
                  type="text" required placeholder="VD: Ý nghĩa chung, Lời khuyên, Thách thức..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-indigo-500/50 focus:outline-none"
                  value={formData[FIELD_PINNACLE_DETAILS.TOPIC]}
                  onChange={e => setFormData({...formData, [FIELD_PINNACLE_DETAILS.TOPIC]: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Phân loại</label>
                <div className="flex items-center gap-4 h-[58px]">
                   <button
                    type="button"
                    onClick={() => setFormData({...formData, [FIELD_PINNACLE_DETAILS.IS_PREMIUM]: !formData[FIELD_PINNACLE_DETAILS.IS_PREMIUM]})}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${formData[FIELD_PINNACLE_DETAILS.IS_PREMIUM] ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-white/5 border-white/10 text-gray-500'}`}
                   >
                     {formData[FIELD_PINNACLE_DETAILS.IS_PREMIUM] ? <Star className="w-4 h-4 fill-amber-400" /> : <Star className="w-4 h-4" />}
                     <span className="text-xs font-bold uppercase tracking-wider">Premium</span>
                   </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Tiêu đề bài viết</label>
                <input 
                  type="text" required placeholder="VD: Giai đoạn đỉnh cao số 1..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-indigo-500/50 focus:outline-none"
                  value={formData[FIELD_PINNACLE_DETAILS.TITLE]}
                  onChange={e => setFormData({...formData, [FIELD_PINNACLE_DETAILS.TITLE]: e.target.value})}
                />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Nội dung chi tiết</label>
              <textarea 
                required rows={10} placeholder="Soạn thảo nội dung chuyên sâu tại đây..."
                className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-6 py-5 text-white focus:border-indigo-500/50 focus:outline-none resize-none leading-relaxed"
                value={formData[FIELD_PINNACLE_DETAILS.CONTENT]}
                onChange={e => setFormData({...formData, [FIELD_PINNACLE_DETAILS.CONTENT]: e.target.value})}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button 
                type="submit"
                className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-xl uppercase tracking-widest text-xs"
              >
                Lưu Bài Viết
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-4">
        {details.map((detail) => (
          <div key={detail.id} className="group relative bg-slate-900/50 border border-white/5 hover:border-white/10 p-8 rounded-[2.5rem] transition-all">
             <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded">
                      {detail[FIELD_PINNACLE_DETAILS.TOPIC]}
                    </span>
                    {detail.is_premium && (
                      <span className="flex items-center gap-1 text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded">
                        <Star className="w-2.5 h-2.5 fill-amber-400" /> Premium
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white">{detail[FIELD_PINNACLE_DETAILS.TITLE]}</h3>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(detail)} className="p-3 bg-white/5 hover:bg-white/10 text-indigo-400 rounded-xl transition-all border border-white/5"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(detail.id)} className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all border border-rose-500/10"><Trash2 className="w-4 h-4" /></button>
                </div>
             </div>
             <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 font-light">{detail[FIELD_PINNACLE_DETAILS.CONTENT]}</p>
          </div>
        ))}

        {details.length === 0 && !isAdding && (
          <div className="p-20 bg-slate-900/40 rounded-[3rem] border border-dashed border-white/10 text-center text-gray-600 italic">
             Chưa có nội dung chuyên sâu nào cho con số này.
          </div>
        )}
      </div>
    </div>
  );
}
