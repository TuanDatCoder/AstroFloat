import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Heart, Users } from 'lucide-react';
import { zodiacMatchesService } from '../../../services/zodiacMatchesService';
import { FIELD_ZODIAC_MATCHES } from '../../../constants';

export default function AdminZodiacMatchList() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await zodiacMatchesService.getAllMatches();
      setMatches(data || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa cặp tương hợp này?")) return;
    try {
      await zodiacMatchesService.deleteMatch(id);
      setMatches(matches.filter(m => m.id !== id));
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const filteredMatches = matches.filter(m => {
    const s1 = m.sign1?.name?.toLowerCase() || '';
    const s2 = m.sign2?.name?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return s1.includes(term) || s2.includes(term);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Quản Lý Tương Hợp</h1>
          <p className="text-gray-400 text-sm">Quản lý điểm số và phân tích tình duyên/bạn bè giữa các cung.</p>
        </div>
        <Link 
          to="/admin/zodiac-matches/new" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-pink-500/20"
        >
          <Plus className="w-5 h-5" /> Thêm Cặp Mới
        </Link>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden p-4">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm cung hoàng đạo trong cặp..." 
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-pink-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-6 py-4">Cung 1</th>
                  <th className="px-6 py-4">Cung 2</th>
                  <th className="px-6 py-4 text-center">Điểm số</th>
                  <th className="px-6 py-4">Phân tích nhanh</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.map((m) => (
                  <tr key={m.id} className="bg-white/5 hover:bg-white/10 transition-colors group">
                    <td className="px-6 py-4 rounded-l-2xl">
                      <div className="flex items-center gap-3">
                        <img src={m.sign1?.image_url} alt="" className="w-8 h-8 rounded-full bg-black/40 border border-white/10" />
                        <span className="font-bold text-white">{m.sign1?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={m.sign2?.image_url} alt="" className="w-8 h-8 rounded-full bg-black/40 border border-white/10" />
                        <span className="font-bold text-white">{m.sign2?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${
                          m[FIELD_ZODIAC_MATCHES.MATCH_SCORE] >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                          m[FIELD_ZODIAC_MATCHES.MATCH_SCORE] >= 50 ? 'bg-amber-500/20 text-amber-400' :
                          'bg-rose-500/20 text-rose-400'
                        }`}>
                          {m[FIELD_ZODIAC_MATCHES.MATCH_SCORE]}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <p className="text-xs text-gray-500 line-clamp-1 italic">
                        {m[FIELD_ZODIAC_MATCHES.LOVE_ANALYSIS]}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right rounded-r-2xl">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/admin/zodiac-matches/edit/${m.id}`}
                          className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(m.id)}
                          className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredMatches.length === 0 && (
              <div className="text-center py-20 text-gray-500 italic">
                {searchTerm ? 'Không tìm thấy cặp nào phù hợp.' : 'Chưa có dữ liệu tương hợp nào.'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
