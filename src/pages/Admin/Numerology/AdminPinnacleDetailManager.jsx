import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit3, X, Save, Sparkles, Loader2, BookOpen, Crown } from 'lucide-react';
import { pinnacleDetailService } from '../../../services/pinnacleDetailService';
import { FIELD_PINNACLE_DETAILS } from '../../../constants';

export default function AdminPinnacleDetailManager() {
  const { number } = useParams();
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    [FIELD_PINNACLE_DETAILS.PINNACLE_NUMBER]: parseInt(number),
    [FIELD_PINNACLE_DETAILS.TOPIC]: '',
    [FIELD_PINNACLE_DETAILS.TITLE]: '',
    [FIELD_PINNACLE_DETAILS.CONTENT]: '',
    [FIELD_PINNACLE_DETAILS.IS_PREMIUM]: false,
  });

  useEffect(() => {
    fetchDetails();
  }, [number]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await pinnacleDetailService.getDetailsByPinnacleNumber(number);
      setDetails(data || []);
    } catch (error) {
      console.error("Error fetching pinnacle details:", error);
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
    if (!window.confirm("Xóa nội dung chi tiết này?")) return;
    try {
      await pinnacleDetailService.deleteDetail(id);
      fetchDetails();
    } catch (error) {
      alert("Lỗi khi xóa: " + error.message);
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
        [FIELD_PINNACLE_DETAILS.PINNACLE_NUMBER]: parseInt(number),
        [FIELD_PINNACLE_DETAILS.TOPIC]: '',
        [FIELD_PINNACLE_DETAILS.TITLE]: '',
        [FIELD_PINNACLE_DETAILS.CONTENT]: '',
        [FIELD_PINNACLE_DETAILS.IS_PREMIUM]: false,
      });
      fetchDetails();
    } catch (error) {
      alert("Lỗi khi lưu: " + error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
      <div className="flex items-center justify-between border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/pinnacles" className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">Chi tiết Đỉnh cao: Số {number}</h1>
            <p className="text-gray-400 text-sm italic">Quản lý các chủ đề chuyên sâu cho con số này.</p>
          </div>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> Thêm Bài Viết
        </button>
      </div>

      {/* Form Editor */}
      {(isAdding || editingId) && (
        <div className="bg-slate-900 border border-indigo-500/30 p-8 rounded-[2.5rem] shadow-2xl relative z-10 transition-all">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              {editingId ? 'Chỉnh sửa bài viết' : 'Thêm bài viết chi tiết mới'}
            </h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-2 hover:bg-white/5 rounded-full text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Chủ đề (VD: Tài chính, Tình cảm...)</label>
                <input 
                  type="text" required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-indigo-500/50 focus:outline-none"
                  value={formData[FIELD_PINNACLE_DETAILS.TOPIC]}
                  onChange={e => setFormData({...formData, [FIELD_PINNACLE_DETAILS.TOPIC]: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Tiêu đề bài viết</label>
                <input 
                  type="text" required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-indigo-500/50 focus:outline-none"
                  value={formData[FIELD_PINNACLE_DETAILS.TITLE]}
                  onChange={e => setFormData({...formData, [FIELD_PINNACLE_DETAILS.TITLE]: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Nội dung chi tiết</label>
              <textarea 
                required rows={8}
                className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-6 py-5 text-white focus:border-indigo-500/50 focus:outline-none leading-relaxed"
                value={formData[FIELD_PINNACLE_DETAILS.CONTENT]}
                onChange={e => setFormData({...formData, [FIELD_PINNACLE_DETAILS.CONTENT]: e.target.value})}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" className="sr-only"
                    checked={formData[FIELD_PINNACLE_DETAILS.IS_PREMIUM]}
                    onChange={e => setFormData({...formData, [FIELD_PINNACLE_DETAILS.IS_PREMIUM]: e.target.checked})}
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${formData[FIELD_PINNACLE_DETAILS.IS_PREMIUM] ? 'bg-amber-500' : 'bg-white/10'}`} />
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData[FIELD_PINNACLE_DETAILS.IS_PREMIUM] ? 'translate-x-6' : ''}`} />
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors flex items-center gap-1.5">
                  <Crown className={`w-3.5 h-3.5 ${formData[FIELD_PINNACLE_DETAILS.IS_PREMIUM] ? 'text-amber-500' : 'text-gray-600'}`} />
                  Nội dung Premium (Chỉ VIP mới xem được)
                </span>
              </label>

              <button 
                type="submit"
                className="flex items-center gap-2 px-12 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-xl uppercase tracking-widest text-xs"
              >
                <Save className="w-4 h-4" /> Lưu Bài Viết
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>
        ) : details.length === 0 ? (
          <div className="text-center py-20 text-gray-600 italic">Chưa có bài viết chi tiết nào cho con số này.</div>
        ) : (
          details.map((detail) => (
            <div key={detail.id} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded">
                        {detail[FIELD_PINNACLE_DETAILS.TOPIC]}
                      </span>
                      {detail[FIELD_PINNACLE_DETAILS.IS_PREMIUM] && (
                        <span className="flex items-center gap-1 text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                          <Crown className="w-2.5 h-2.5" /> Premium
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-white mt-1">{detail[FIELD_PINNACLE_DETAILS.TITLE]}</h3>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(detail)} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(detail.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 italic font-light leading-relaxed pl-16">
                {detail[FIELD_PINNACLE_DETAILS.CONTENT]}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
