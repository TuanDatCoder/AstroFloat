import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { zodiacService } from '../../../services/zodiacService';
import { FIELD_ZODIAC_SIGNS } from '../../../constants';

export default function AdminZodiacForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  
  const [formData, setFormData] = useState({
    [FIELD_ZODIAC_SIGNS.NAME]: '',
    [FIELD_ZODIAC_SIGNS.ENGLISH_NAME]: '',
    [FIELD_ZODIAC_SIGNS.DATE_RANGE]: '',
    [FIELD_ZODIAC_SIGNS.ELEMENT]: 'Chọn nguyên tố',
    [FIELD_ZODIAC_SIGNS.MODALITY]: 'Chọn tính chất',
    [FIELD_ZODIAC_SIGNS.RULING_PLANET]: '',
    [FIELD_ZODIAC_SIGNS.LUCKY_COLORS]: '',
    [FIELD_ZODIAC_SIGNS.DESCRIPTION]: '',
    [FIELD_ZODIAC_SIGNS.IMAGE_URL]: '',
    [FIELD_ZODIAC_SIGNS.START_MONTH]: '',
    [FIELD_ZODIAC_SIGNS.START_DAY]: '',
    [FIELD_ZODIAC_SIGNS.END_MONTH]: '',
    [FIELD_ZODIAC_SIGNS.END_DAY]: '',
  });

  useEffect(() => {
    if (id) {
      fetchZodiac();
    }
  }, [id]);

  const fetchZodiac = async () => {
    try {
      const data = await zodiacService.getZodiacById(id);
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error("Error fetching zodiac:", error);
      alert("Không tìm thấy thông tin cung hoàng đạo.");
      navigate('/admin/zodiac');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name.includes('month') || name.includes('day')) ? parseInt(value) || '' : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await zodiacService.updateZodiac(id, formData);
      } else {
        await zodiacService.createZodiac(formData);
      }
      navigate('/admin/zodiac');
    } catch (error) {
      console.error("Save error:", error);
      alert("Lỗi khi lưu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link to="/admin/zodiac" className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-black text-white">
          {id ? `Chỉnh sửa: ${formData.name}` : 'Thêm Cung Hoàng Đạo Mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Phần 1: Thông tin cơ bản */}
        <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-400 border-b border-white/5 pb-4">
            1. Thông tin định danh
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Tên tiếng Việt</label>
              <input 
                type="text" name={FIELD_ZODIAC_SIGNS.NAME} required
                value={formData[FIELD_ZODIAC_SIGNS.NAME]} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none transition-colors"
                placeholder="VD: Bạch Dương"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Tên tiếng Anh</label>
              <input 
                type="text" name={FIELD_ZODIAC_SIGNS.ENGLISH_NAME} required
                value={formData[FIELD_ZODIAC_SIGNS.ENGLISH_NAME]} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none transition-colors"
                placeholder="VD: Aries"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Khoảng ngày (Display)</label>
            <input 
              type="text" name={FIELD_ZODIAC_SIGNS.DATE_RANGE} required
              value={formData[FIELD_ZODIAC_SIGNS.DATE_RANGE]} onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none transition-colors"
              placeholder="VD: 21/3 - 19/4"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Nguyên tố</label>
              <select 
                name={FIELD_ZODIAC_SIGNS.ELEMENT} value={formData[FIELD_ZODIAC_SIGNS.ELEMENT]} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none transition-colors"
              >
                <option value="Chọn nguyên tố">Chọn nguyên tố</option>
                <option value="Lửa">Lửa</option>
                <option value="Đất">Đất</option>
                <option value="Khí">Khí</option>
                <option value="Nước">Nước</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Tính chất (Modality)</label>
              <select 
                name={FIELD_ZODIAC_SIGNS.MODALITY} value={formData[FIELD_ZODIAC_SIGNS.MODALITY]} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none transition-colors"
              >
                <option value="Chọn tính chất">Chọn tính chất</option>
                <option value="Tiên phong (Cardinal)">Tiên phong (Cardinal)</option>
                <option value="Kiên định (Fixed)">Kiên định (Fixed)</option>
                <option value="Biến đổi (Mutable)">Biến đổi (Mutable)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Hành tinh chủ quản</label>
              <input 
                type="text" name={FIELD_ZODIAC_SIGNS.RULING_PLANET} required
                value={formData[FIELD_ZODIAC_SIGNS.RULING_PLANET]} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none transition-colors"
                placeholder="VD: Sao Hỏa"
              />
            </div>
          </div>
        </div>

        {/* Phần 2: Cấu hình ngày để tính toán */}
        <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 border-b border-white/5 pb-4">
            2. Cấu hình tính toán (Logic)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Tháng Bắt đầu</label>
              <input 
                type="number" min="1" max="12" name={FIELD_ZODIAC_SIGNS.START_MONTH} required
                value={formData[FIELD_ZODIAC_SIGNS.START_MONTH]} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Ngày Bắt đầu</label>
              <input 
                type="number" min="1" max="31" name={FIELD_ZODIAC_SIGNS.START_DAY} required
                value={formData[FIELD_ZODIAC_SIGNS.START_DAY]} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Tháng Kết thúc</label>
              <input 
                type="number" min="1" max="12" name={FIELD_ZODIAC_SIGNS.END_MONTH} required
                value={formData[FIELD_ZODIAC_SIGNS.END_MONTH]} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Ngày Kết thúc</label>
              <input 
                type="number" min="1" max="31" name={FIELD_ZODIAC_SIGNS.END_DAY} required
                value={formData[FIELD_ZODIAC_SIGNS.END_DAY]} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Phần 3: Media & Mô tả */}
        <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400 border-b border-white/5 pb-4">
            3. Media và Nội dung
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">URL Hình ảnh</label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" name={FIELD_ZODIAC_SIGNS.IMAGE_URL}
                  value={formData[FIELD_ZODIAC_SIGNS.IMAGE_URL]} onChange={handleChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none transition-colors"
                  placeholder="https://example.com/image.png"
                />
              </div>
              {formData[FIELD_ZODIAC_SIGNS.IMAGE_URL] && (
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10">
                  <img src={formData[FIELD_ZODIAC_SIGNS.IMAGE_URL]} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">Mô tả tóm tắt</label>
            <textarea 
              name={FIELD_ZODIAC_SIGNS.DESCRIPTION} required
              value={formData[FIELD_ZODIAC_SIGNS.DESCRIPTION]} onChange={handleChange}
              rows={4}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-white focus:border-indigo-500/50 focus:outline-none transition-colors resize-none"
              placeholder="Nhập mô tả ngắn gọn về tính cách đặc trưng của cung này..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button 
            type="button" onClick={() => navigate('/admin/zodiac')}
            className="px-8 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl font-bold transition-all"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" disabled={loading}
            className="flex items-center gap-2 px-10 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {id ? 'Cập nhật' : 'Tạo mới'}
          </button>
        </div>
      </form>
    </div>
  );
}
