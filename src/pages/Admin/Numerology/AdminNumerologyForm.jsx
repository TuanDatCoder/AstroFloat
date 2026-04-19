import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Hash, Sparkles, BookOpen, Eye } from 'lucide-react';
import { numerologyService } from '../../../services/numerologyService';
import { FIELD_NUMEROLOGIES, ROUTES } from '../../../constants';

export default function AdminNumerologyForm() {
  const { number } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!number);
  
  const [formData, setFormData] = useState({
    [FIELD_NUMEROLOGIES.NUMBER]: '',
    [FIELD_NUMEROLOGIES.TITLE]: '',
    [FIELD_NUMEROLOGIES.TRAITS]: '',
    [FIELD_NUMEROLOGIES.STRENGTHS]: '',
    [FIELD_NUMEROLOGIES.WEAKNESSES]: '',
    [FIELD_NUMEROLOGIES.CAREER_PATHS]: '',
    [FIELD_NUMEROLOGIES.ADVICE]: '',
  });

  useEffect(() => {
    if (number) {
      fetchData();
    }
  }, [number]);

  const fetchData = async () => {
    try {
      const data = await numerologyService.getNumerologyByNumber(number);
      if (data) setFormData(data);
    } catch (error) {
      alert("Lỗi khi tải dữ liệu.");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === FIELD_NUMEROLOGIES.NUMBER ? parseInt(value) || '' : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (number) {
        await numerologyService.updateNumerology(number, formData);
      } else {
        await numerologyService.createNumerology(formData);
      }
      navigate('/admin/numerology');
    } catch (error) {
      alert("Lỗi khi lưu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-purple-500" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/numerology" className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-black text-white">
            {number ? `Chỉnh sửa: Số ${number}` : 'Thêm Con Số Mới'}
          </h1>
        </div>
        {number && (
          <Link
            to={ROUTES.NUMEROLOGY_DETAIL(number)}
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold transition-all border border-white/5"
          >
            <Eye className="w-4 h-4 text-purple-400" /> Xem Trước
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                  <Hash className="w-3 h-3 text-purple-400" /> Con số
                </label>
                <input 
                  type="number" name={FIELD_NUMEROLOGIES.NUMBER} required 
                  readOnly={!!number}
                  value={formData[FIELD_NUMEROLOGIES.NUMBER]} onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500/50 focus:outline-none read-only:opacity-50"
                  placeholder="VD: 1, 2, 11..."
                />
              </div>
              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Tiêu đề bài viết</label>
                <input 
                  type="text" name={FIELD_NUMEROLOGIES.TITLE} required
                  value={formData[FIELD_NUMEROLOGIES.TITLE]} onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-purple-500/50 focus:outline-none"
                  placeholder="VD: Người dẫn đầu đầy tham vọng"
                />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Đặc điểm chính (Traits)</label>
              <textarea 
                name={FIELD_NUMEROLOGIES.TRAITS} required
                value={formData[FIELD_NUMEROLOGIES.TRAITS]} onChange={handleChange}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-5 py-4 text-white focus:border-purple-500/50 focus:outline-none"
                placeholder="Ngắn gọn về các tính cách tiêu biểu..."
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-emerald-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Điểm mạnh
                </label>
                <textarea 
                  name={FIELD_NUMEROLOGIES.STRENGTHS} required
                  value={formData[FIELD_NUMEROLOGIES.STRENGTHS]} onChange={handleChange}
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-5 py-4 text-white focus:border-emerald-500/50 focus:outline-none placeholder:text-gray-700"
                  placeholder="VD: Kiên trì, Sáng tạo, Độc lập..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-rose-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                  <Sparkles className="w-3 h-3" /> Điểm yếu
                </label>
                <textarea 
                  name={FIELD_NUMEROLOGIES.WEAKNESSES} required
                  value={formData[FIELD_NUMEROLOGIES.WEAKNESSES]} onChange={handleChange}
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-5 py-4 text-white focus:border-rose-500/50 focus:outline-none placeholder:text-gray-700"
                  placeholder="VD: Bảo thủ, Khô khan, Ích kỷ..."
                />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black text-indigo-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> Nghề nghiệp phù hợp
              </label>
              <textarea 
                name={FIELD_NUMEROLOGIES.CAREER_PATHS} required
                value={formData[FIELD_NUMEROLOGIES.CAREER_PATHS]} onChange={handleChange}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-5 py-4 text-white focus:border-indigo-500/50 focus:outline-none"
                placeholder="VD: Quản lý, Kỹ sư, Nghệ sĩ..."
              />
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black text-amber-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                Lời khuyên phát triển
              </label>
              <textarea 
                name={FIELD_NUMEROLOGIES.ADVICE} required
                value={formData[FIELD_NUMEROLOGIES.ADVICE]} onChange={handleChange}
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-5 py-4 text-white focus:border-amber-500/50 focus:outline-none"
                placeholder="Lời khuyên để con số này phát huy tiềm năng tốt nhất..."
              />
           </div>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="button" onClick={() => navigate('/admin/numerology')}
            className="px-8 py-4 bg-white/5 text-gray-400 rounded-2xl font-bold transition-all uppercase tracking-widest text-xs"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" disabled={loading}
            className="flex items-center gap-3 px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-purple-500/30 uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {number ? 'Lưu thay đổi' : 'Tạo mới'}
          </button>
        </div>
      </form>
    </div>
  );
}
