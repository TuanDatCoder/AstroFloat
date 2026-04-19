import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit3, Save, X, Sparkles, Shield, Tag, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { zodiacService } from '../../../services/zodiacService';
import { zodiacDetailService } from '../../../services/zodiacDetailService';
import { FIELD_ZODIAC_SIGNS, FIELD_ZODIAC_DETAILS, ROUTES } from '../../../constants';

export default function AdminZodiacDetailManager() {
  const { id } = useParams();
  const [zodiac, setZodiac] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    [FIELD_ZODIAC_DETAILS.TOPIC]: '',
    [FIELD_ZODIAC_DETAILS.TITLE]: '',
    [FIELD_ZODIAC_DETAILS.CONTENT]: '',
    [FIELD_ZODIAC_DETAILS.IS_PREMIUM]: false,
    [FIELD_ZODIAC_DETAILS.ZODIAC_ID]: parseInt(id)
  });

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
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/zodiac" className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">Chi tiết bài viết</span>
               <h1 className="text-2xl font-black text-white">{zodiac?.[FIELD_ZODIAC_SIGNS.NAME]}</h1>
            </div>
            <p className="text-gray-400 text-sm italic">Quản lý các chủ đề chuyên sâu: Truyền thuyết, Tính cách, Sự nghiệp...</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.ZODIAC_DETAIL(id)}
            target="_blank"
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold transition-all border border-white/5"
          >
            <Eye className="w-5 h-5 text-indigo-400" /> Xem Trước
          </Link>
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); }}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-5 h-5" /> Thêm Bài Viết
          </button>
        </div>
      </div>

      {/* Editor Form (Modal-like or Inline) */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Nội dung chi tiết</label>
              <textarea 
                required rows={8}
                placeholder="Nhập nội dung bài viết..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none resize-none"
                value={formData[FIELD_ZODIAC_DETAILS.CONTENT]}
                onChange={e => setFormData({...formData, [FIELD_ZODIAC_DETAILS.CONTENT]: e.target.value})}
              />
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

      {/* List of Details */}
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
