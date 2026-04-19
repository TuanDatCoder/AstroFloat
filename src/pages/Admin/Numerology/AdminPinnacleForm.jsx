import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Mountain, Sparkles, Eye } from 'lucide-react';
import { numerologyService } from '../../../services/numerologyService';
import { FIELD_PINNACLE_NUMEROLOGY, ROUTES } from '../../../constants';

export default function AdminPinnacleForm() {
  const { number } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!number);
  
  const [formData, setFormData] = useState({
    [FIELD_PINNACLE_NUMEROLOGY.NUMBER]: '',
    [FIELD_PINNACLE_NUMEROLOGY.TITLE]: '',
    [FIELD_PINNACLE_NUMEROLOGY.CONTENT]: '',
  });

  useEffect(() => {
    if (number) {
      fetchData();
    }
  }, [number]);

  const fetchData = async () => {
    try {
      const data = await numerologyService.getPinnacleByNumber(number);
      if (data) setFormData(data);
    } catch (e) {
      alert("Lỗi khi tải dữ liệu.");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === FIELD_PINNACLE_NUMEROLOGY.NUMBER ? parseInt(value) || '' : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (number) {
        await numerologyService.updatePinnacle(number, formData);
      } else {
        await numerologyService.createPinnacle(formData);
      }
      navigate('/admin/pinnacles');
    } catch (e) {
      alert("Lỗi khi lưu: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/pinnacles" className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-black text-white">
            {number ? `Chỉnh sửa Số ${number}` : 'Thêm Ý Nghĩa Mới'}
          </h1>
        </div>
        {number && (
          <Link
            to={ROUTES.PINNACLE_DETAIL(number)}
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold transition-all border border-white/5"
          >
            <Eye className="w-4 h-4 text-indigo-400" /> Xem Trước
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900/50 border border-white/5 p-10 rounded-[3rem] space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Con số gieo mầm</label>
                <div className="relative">
                  <Mountain className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 opacity-50" />
                  <input 
                    type="number" name={FIELD_PINNACLE_NUMEROLOGY.NUMBER} required 
                    readOnly={!!number}
                    value={formData[FIELD_PINNACLE_NUMEROLOGY.NUMBER]} onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-5 py-5 text-white focus:border-indigo-500/50 focus:outline-none text-xl font-black read-only:opacity-50"
                    placeholder="VD: 1"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] pl-1">Tiêu đề Giai đoạn</label>
                <input 
                  type="text" name={FIELD_PINNACLE_NUMEROLOGY.TITLE} required
                  value={formData[FIELD_PINNACLE_NUMEROLOGY.TITLE]} onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-indigo-500/50 focus:outline-none font-bold"
                  placeholder="VD: Giai đoạn của sự bứt phá và độc lập"
                />
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] pl-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Luận giải chi tiết giai đoạn
              </label>
              <textarea 
                name={FIELD_PINNACLE_NUMEROLOGY.CONTENT} required
                value={formData[FIELD_PINNACLE_NUMEROLOGY.CONTENT]} onChange={handleChange}
                rows={12}
                className="w-full bg-black/40 border border-white/10 rounded-[2.5rem] px-8 py-7 text-white focus:border-indigo-500/50 focus:outline-none resize-none leading-relaxed text-sm font-light"
                placeholder="Phân tích chi tiết về những điều người này sẽ gặp phải khi có con số này tại đỉnh cao..."
              />
           </div>
        </div>

        <div className="flex justify-end gap-4">
           <button 
            type="button" onClick={() => navigate('/admin/pinnacles')}
            className="px-10 py-5 bg-white/5 text-gray-500 hover:text-white rounded-2xl font-black transition-all uppercase tracking-widest text-[10px]"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" disabled={loading}
            className="flex items-center gap-3 px-14 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-widest text-[10px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {number ? 'Lưu bài viết' : 'Đăng bài viết mới'}
          </button>
        </div>
      </form>
    </div>
  );
}
