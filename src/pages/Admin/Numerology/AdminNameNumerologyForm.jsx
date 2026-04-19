import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Hash, Sparkles, BookOpen, Heart } from 'lucide-react';
import { nameNumerologyService } from '../../../services/nameNumerologyService';
import { FIELD_NAME_NUMEROLOGY } from '../../../constants';

export default function AdminNameNumerologyForm() {
  const { number } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!number);
  
  const [formData, setFormData] = useState({
    [FIELD_NAME_NUMEROLOGY.NUMBER]: '',
    [FIELD_NAME_NUMEROLOGY.TITLE]: '',
    [FIELD_NAME_NUMEROLOGY.TRAITS]: '',
    [FIELD_NAME_NUMEROLOGY.STRENGTHS]: '',
    [FIELD_NAME_NUMEROLOGY.WEAKNESSES]: '',
    [FIELD_NAME_NUMEROLOGY.CAREER_PATHS]: '',
    [FIELD_NAME_NUMEROLOGY.LOVE_STYLE]: '',
    [FIELD_NAME_NUMEROLOGY.ADVICE]: '',
  });

  useEffect(() => {
    if (number) {
      fetchData();
    }
  }, [number]);

  const fetchData = async () => {
    try {
      const data = await nameNumerologyService.getNameNumerology(number);
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
      [name]: name === FIELD_NAME_NUMEROLOGY.NUMBER ? parseInt(value) || '' : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (number) {
        await nameNumerologyService.updateNameNumerology(number, formData);
      } else {
        await nameNumerologyService.createNameNumerology(formData);
      }
      navigate('/admin/name-numerology');
    } catch (error) {
      alert("Lỗi khi lưu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-emerald-500" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link to="/admin/name-numerology" className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-black text-white px-2">
          {number ? `Chỉnh sửa Sứ mệnh: Số ${number}` : 'Thêm Chỉ số Sứ mệnh Mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Con số</label>
                <input 
                  type="number" name={FIELD_NAME_NUMEROLOGY.NUMBER} required 
                  readOnly={!!number}
                  value={formData[FIELD_NAME_NUMEROLOGY.NUMBER]} onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 focus:outline-none read-only:opacity-50"
                  placeholder="VD: 1, 2..."
                />
              </div>
              <div className="md:col-span-3 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Tiêu đề sứ mệnh</label>
                <input 
                  type="text" name={FIELD_NAME_NUMEROLOGY.TITLE} required
                  value={formData[FIELD_NAME_NUMEROLOGY.TITLE]} onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500/50 focus:outline-none"
                  placeholder="VD: Con số của sự lãnh đạo..."
                />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Đặc điểm nhận dạng (Traits)</label>
              <textarea 
                name={FIELD_NAME_NUMEROLOGY.TRAITS} required
                value={formData[FIELD_NAME_NUMEROLOGY.TRAITS]} onChange={handleChange}
                rows={3}
                className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-5 py-4 text-white focus:border-emerald-500/50 focus:outline-none"
                placeholder="Tóm tắt ngắn về rung động của con số này..."
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-emerald-400 uppercase tracking-widest pl-1">Ưu điểm nổi bật</label>
                <textarea 
                  name={FIELD_NAME_NUMEROLOGY.STRENGTHS} required
                  value={formData[FIELD_NAME_NUMEROLOGY.STRENGTHS]} onChange={handleChange}
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-5 py-4 text-white focus:border-emerald-500/50 focus:outline-none"
                  placeholder="Gạch đầu dòng các thế mạnh..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-rose-400 uppercase tracking-widest pl-1">Hạn chế cần khắc phục</label>
                <textarea 
                  name={FIELD_NAME_NUMEROLOGY.WEAKNESSES} required
                  value={formData[FIELD_NAME_NUMEROLOGY.WEAKNESSES]} onChange={handleChange}
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-5 py-4 text-white focus:border-rose-500/50 focus:outline-none"
                  placeholder="Các rào cản năng lượng..."
                />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-indigo-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                  <BookOpen className="w-3 h-3" /> Định hướng Sự nghiệp
                </label>
                <textarea 
                  name={FIELD_NAME_NUMEROLOGY.CAREER_PATHS} required
                  value={formData[FIELD_NAME_NUMEROLOGY.CAREER_PATHS]} onChange={handleChange}
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-5 py-4 text-white focus:border-indigo-500/50 focus:outline-none"
                  placeholder="Lĩnh vực nào họ sẽ thành công nhất?..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-pink-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                  <Heart className="w-3 h-3" /> Phong cách Tình yêu
                </label>
                <textarea 
                  name={FIELD_NAME_NUMEROLOGY.LOVE_STYLE} required
                  value={formData[FIELD_NAME_NUMEROLOGY.LOVE_STYLE]} onChange={handleChange}
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-5 py-4 text-white focus:border-pink-500/50 focus:outline-none"
                  placeholder="Họ là người như thế nào trong tình cảm?..."
                />
              </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-black text-amber-400 uppercase tracking-widest pl-1">Lời khuyên phát triển Sứ mệnh</label>
              <textarea 
                name={FIELD_NAME_NUMEROLOGY.ADVICE} required
                value={formData[FIELD_NAME_NUMEROLOGY.ADVICE]} onChange={handleChange}
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-5 py-4 text-white focus:border-amber-500/50 focus:outline-none"
                placeholder="Bài học cuộc đời dành cho con số này..."
              />
           </div>
        </div>

        <div className="flex justify-end gap-3 px-2">
          <button 
            type="button" onClick={() => navigate('/admin/name-numerology')}
            className="px-10 py-4 bg-white/5 text-gray-400 rounded-2xl font-bold transition-all uppercase tracking-widest text-[10px]"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" disabled={loading}
            className="flex items-center gap-3 px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-emerald-500/30 uppercase tracking-widest text-[10px]"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {number ? 'Cập nhật' : 'Lưu dữ liệu'}
          </button>
        </div>
      </form>
    </div>
  );
}
