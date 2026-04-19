import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit3, X, Sparkles, Filter, Hash, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../services/supabase';
import { nameNumerologyService } from '../../../services/nameNumerologyService';
import { FIELD_NAME_ADVANCED_METRICS, TABLES } from '../../../constants';

export default function AdminNameAdvancedMetricsManager() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  const [formData, setFormData] = useState({
    [FIELD_NAME_ADVANCED_METRICS.METRIC_TYPE]: 'LINH_HON',
    [FIELD_NAME_ADVANCED_METRICS.NUMBER]: 1,
    [FIELD_NAME_ADVANCED_METRICS.TITLE]: '',
    [FIELD_NAME_ADVANCED_METRICS.CONTENT]: '',
    [FIELD_NAME_ADVANCED_METRICS.ADVICE]: ''
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(TABLES.NAME_ADVANCED_METRICS)
        .select('*')
        .order(FIELD_NAME_ADVANCED_METRICS.METRIC_TYPE, { ascending: true })
        .order(FIELD_NAME_ADVANCED_METRICS.NUMBER, { ascending: true });
      
      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (m) => {
    setEditingId(m.id);
    setFormData(m);
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa chỉ số này?")) return;
    try {
      await nameNumerologyService.deleteAdvancedMetric(id);
      fetchMetrics();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await nameNumerologyService.updateAdvancedMetric(editingId, formData);
      } else {
        await nameNumerologyService.createAdvancedMetric(formData);
      }
      setEditingId(null);
      setIsAdding(false);
      fetchMetrics();
    } catch (error) {
           alert("Lỗi: " + error.message);
    }
  };

  const filteredMetrics = filterType === 'ALL' ? metrics : metrics.filter(m => m[FIELD_NAME_ADVANCED_METRICS.METRIC_TYPE] === filterType);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-32">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin/name-numerology" className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">Chỉ Số Mở Rộng</h1>
            <p className="text-gray-400 text-sm italic">Quản lý Linh hồn, Nhân cách, Cân bằng và Chỉ số thiếu.</p>
          </div>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> Thêm Phân Tích Mới
        </button>
      </div>

      {/* Form */}
      {(isAdding || editingId) && (
        <div className="bg-slate-900 border border-cyan-500/30 p-8 rounded-[2.5rem] shadow-2xl relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              {editingId ? 'Cập nhật phân tích' : 'Thiết lập phân tích mới'}
            </h2>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-2 hover:bg-white/5 rounded-full text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Loại chỉ số</label>
                <select 
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-cyan-500/50 focus:outline-none"
                  value={formData[FIELD_NAME_ADVANCED_METRICS.METRIC_TYPE]}
                  onChange={e => setFormData({...formData, [FIELD_NAME_ADVANCED_METRICS.METRIC_TYPE]: e.target.value})}
                >
                  <option value="LINH_HON">Linh Hồn</option>
                  <option value="NHAN_CACH">Nhân Cách</option>
                  <option value="CAN_BANG">Cân Bằng</option>
                  <option value="CHI_SO_THIEU">Chỉ Số Thiếu (Karmic)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Con số</label>
                <input 
                  type="number" required
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-cyan-500/50 focus:outline-none"
                  value={formData[FIELD_NAME_ADVANCED_METRICS.NUMBER]}
                  onChange={e => setFormData({...formData, [FIELD_NAME_ADVANCED_METRICS.NUMBER]: parseInt(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Tiêu đề bài viết</label>
                <input 
                  type="text" required placeholder="VD: Khát khao dẫn đầu..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-cyan-500/50 focus:outline-none"
                  value={formData[FIELD_NAME_ADVANCED_METRICS.TITLE]}
                  onChange={e => setFormData({...formData, [FIELD_NAME_ADVANCED_METRICS.TITLE]: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Nội dung phân tích</label>
              <textarea 
                required rows={5}
                className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-6 py-5 text-white focus:border-cyan-500/50 focus:outline-none resize-none leading-relaxed"
                value={formData[FIELD_NAME_ADVANCED_METRICS.CONTENT]}
                onChange={e => setFormData({...formData, [FIELD_NAME_ADVANCED_METRICS.CONTENT]: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Lời khuyên (Advice)</label>
              <textarea 
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-6 py-5 text-white focus:border-cyan-500/50 focus:outline-none resize-none leading-relaxed"
                value={formData[FIELD_NAME_ADVANCED_METRICS.ADVICE]}
                onChange={e => setFormData({...formData, [FIELD_NAME_ADVANCED_METRICS.ADVICE]: e.target.value})}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-white/5">
              <button 
                type="submit"
                className="flex items-center gap-2 px-12 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all shadow-xl uppercase tracking-widest text-xs"
              >
                <Save className="w-4 h-4" /> Lưu Chỉ Số
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and List */}
      <div className="space-y-6">
        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit border border-white/5">
          {['ALL', 'LINH_HON', 'NHAN_CACH', 'CAN_BANG', 'CHI_SO_THIEU'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === type ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {type === 'ALL' ? 'Tất cả' : type.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMetrics.map((m) => (
            <div key={m.id} className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-white/10 transition-all group">
               <div className="flex justify-between items-start mb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded">
                        {m[FIELD_NAME_ADVANCED_METRICS.METRIC_TYPE].replace('_', ' ')}
                       </span>
                       <span className="text-xs font-bold text-white"># {m[FIELD_NAME_ADVANCED_METRICS.NUMBER]}</span>
                    </div>
                    <h3 className="font-bold text-white text-sm">{m[FIELD_NAME_ADVANCED_METRICS.TITLE]}</h3>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => handleEdit(m)} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                     <button onClick={() => handleDelete(m.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
               </div>
               <p className="text-xs text-gray-500 line-clamp-2 italic font-light leading-relaxed">{m[FIELD_NAME_ADVANCED_METRICS.CONTENT]}</p>
            </div>
          ))}
        </div>
         {filteredMetrics.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-600 italic">Chưa có dữ liệu cho mục này.</div>
        )}
      </div>
    </div>
  );
}
