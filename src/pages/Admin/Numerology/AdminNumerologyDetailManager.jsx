import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit3, Save, X, Sparkles, Hash } from 'lucide-react';
import { numerologyService } from '../../../services/numerologyService';
import { numerologyDetailService } from '../../../services/numerologyDetailService';
import { FIELD_NUMEROLOGY_DETAILS } from '../../../constants';

export default function AdminNumerologyDetailManager() {
  const { number } = useParams();
  const [numerology, setNumerology] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    [FIELD_NUMEROLOGY_DETAILS.TOPIC]: '',
    [FIELD_NUMEROLOGY_DETAILS.TITLE]: '',
    [FIELD_NUMEROLOGY_DETAILS.CONTENT]: '',
    [FIELD_NUMEROLOGY_DETAILS.ICON_NAME]: '',
    [FIELD_NUMEROLOGY_DETAILS.NUMBER]: parseInt(number)
  });

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
    <div className="max-w-5xl mx-auto space-y-8 pb-32">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/numerology" className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
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
          onClick={() => { setIsAdding(true); setEditingId(null); }}
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

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Nội dung chi tiết</label>
              <textarea 
                required rows={10} placeholder="Soạn thảo nội dung chuyên sâu tại đây..."
                className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-6 py-5 text-white focus:border-purple-500/50 focus:outline-none resize-none leading-relaxed"
                value={formData[FIELD_NUMEROLOGY_DETAILS.CONTENT]}
                onChange={e => setFormData({...formData, [FIELD_NUMEROLOGY_DETAILS.CONTENT]: e.target.value})}
              />
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
