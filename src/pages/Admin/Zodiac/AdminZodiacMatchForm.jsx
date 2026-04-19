import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Heart, Users, Sparkles } from 'lucide-react';
import { zodiacMatchesService } from '../../../services/zodiacMatchesService';
import { zodiacService } from '../../../services/zodiacService';
import { FIELD_ZODIAC_MATCHES } from '../../../constants';

export default function AdminZodiacMatchForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [zodiacs, setZodiacs] = useState([]);
  
  const [formData, setFormData] = useState({
    [FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_1_ID]: '',
    [FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_2_ID]: '',
    [FIELD_ZODIAC_MATCHES.MATCH_SCORE]: 80,
    [FIELD_ZODIAC_MATCHES.LOVE_ANALYSIS]: '',
    [FIELD_ZODIAC_MATCHES.FRIENDSHIP_ANALYSIS]: '',
  });

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setFetching(true);
      const allZodiacs = await zodiacService.getAllZodiacs();
      setZodiacs(allZodiacs || []);

      if (id) {
        const matches = await zodiacMatchesService.getAllMatches();
        const match = matches.find(m => m.id === parseInt(id));
        if (match) {
          setFormData({
            [FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_1_ID]: match[FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_1_ID],
            [FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_2_ID]: match[FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_2_ID],
            [FIELD_ZODIAC_MATCHES.MATCH_SCORE]: match[FIELD_ZODIAC_MATCHES.MATCH_SCORE],
            [FIELD_ZODIAC_MATCHES.LOVE_ANALYSIS]: match[FIELD_ZODIAC_MATCHES.LOVE_ANALYSIS],
            [FIELD_ZODIAC_MATCHES.FRIENDSHIP_ANALYSIS]: match[FIELD_ZODIAC_MATCHES.FRIENDSHIP_ANALYSIS],
          });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? parseInt(value) || 0 : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData[FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_1_ID] === formData[FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_2_ID]) {
      alert("Hai cung hoàng đạo phải khác nhau.");
      return;
    }

    setLoading(true);
    try {
      if (id) {
        await zodiacMatchesService.updateMatch(id, formData);
      } else {
        await zodiacMatchesService.createMatch(formData);
      }
      navigate('/admin/zodiac-matches');
    } catch (error) {
      console.error("Save error:", error);
      alert("Lỗi khi lưu: " + (error.message || "Cặp này có thể đã tồn tại trong Database."));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link to="/admin/zodiac-matches" className="p-2 hover:bg-white/5 rounded-lg text-gray-400">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-black text-white">
          {id ? 'Chỉnh sửa Tương hợp' : 'Thiết lập Tương hợp Mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Lựa chọn cặp cung */}
        <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
             <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <Heart className="w-4 h-4 text-pink-400" />
             </div>
             <h2 className="text-sm font-black uppercase tracking-widest text-pink-400">Thiết lập cặp cung & Điểm số</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Cung hoàng đạo 1</label>
              <select 
                name={FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_1_ID} required
                value={formData[FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_1_ID]} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-pink-500/50 focus:outline-none transition-all"
              >
                <option value="">-- Chọn cung --</option>
                {zodiacs.map(z => <option key={z.id} value={z.id}>{z.name} ({z.english_name})</option>)}
              </select>
            </div>
            
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Cung hoàng đạo 2</label>
              <select 
                name={FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_2_ID} required
                value={formData[FIELD_ZODIAC_MATCHES.ZODIAC_SIGN_2_ID]} onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-pink-500/50 focus:outline-none transition-all"
              >
                <option value="">-- Chọn cung --</option>
                {zodiacs.map(z => <option key={z.id} value={z.id}>{z.name} ({z.english_name})</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Điểm tương hợp tổng thể: <span className="text-pink-400 text-lg ml-2">{formData[FIELD_ZODIAC_MATCHES.MATCH_SCORE]}%</span></label>
            </div>
            <input 
              type="range" min="0" max="100" 
              name={FIELD_ZODIAC_MATCHES.MATCH_SCORE}
              value={formData[FIELD_ZODIAC_MATCHES.MATCH_SCORE]} onChange={handleChange}
              className="w-full h-2 bg-black/60 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
          </div>
        </div>

        {/* Phân tích chi tiết */}
        <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] space-y-8">
           <div className="flex items-center gap-3 border-b border-white/5 pb-4">
             <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-indigo-400" />
             </div>
             <h2 className="text-sm font-black uppercase tracking-widest text-indigo-400">Phân tích chuyên sâu</h2>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
              <Heart className="w-3 h-3 text-pink-400" /> Phân tích Tình Yêu & Hôn Nhân
            </label>
            <textarea 
              name={FIELD_ZODIAC_MATCHES.LOVE_ANALYSIS} required
              value={formData[FIELD_ZODIAC_MATCHES.LOVE_ANALYSIS]} onChange={handleChange}
              rows={6}
              className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-6 py-5 text-white focus:border-pink-500/50 focus:outline-none transition-all resize-none leading-relaxed"
              placeholder="Mối quan hệ giữa hai cung này sẽ như thế nào trong tình yêu?..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Phân tích Tình Bạn & Xã Hội
            </label>
            <textarea 
              name={FIELD_ZODIAC_MATCHES.FRIENDSHIP_ANALYSIS} required
              value={formData[FIELD_ZODIAC_MATCHES.FRIENDSHIP_ANALYSIS]} onChange={handleChange}
              rows={6}
              className="w-full bg-black/40 border border-white/10 rounded-[2rem] px-6 py-5 text-white focus:border-cyan-500/50 focus:outline-none transition-all resize-none leading-relaxed"
              placeholder="Khả năng làm bạn và hợp tác công việc?..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <button 
            type="button" onClick={() => navigate('/admin/zodiac-matches')}
            className="px-10 py-4 bg-white/5 hover:bg-white/10 text-gray-400 rounded-2xl font-bold transition-all uppercase tracking-widest text-xs"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" disabled={loading}
            className="flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-2xl font-black transition-all shadow-xl shadow-pink-500/20 uppercase tracking-widest text-xs"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {id ? 'Cập nhật dữ liệu' : 'Lưu cặp tương hợp'}
          </button>
        </div>
      </form>
    </div>
  );
}
