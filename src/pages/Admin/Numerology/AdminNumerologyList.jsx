import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Info, Hash } from 'lucide-react';
import { numerologyService } from '../../../services/numerologyService';
import { FIELD_NUMEROLOGIES } from '../../../constants';

export default function AdminNumerologyList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await numerologyService.getAllNumerologies();
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching numerology:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (number) => {
    if (!window.confirm(`Xóa con số chủ đạo ${number}?`)) return;
    try {
      await numerologyService.deleteNumerology(number);
      fetchData();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const filteredItems = items.filter(item => 
    item[FIELD_NUMEROLOGIES.NUMBER]?.toString().includes(searchTerm) ||
    item[FIELD_NUMEROLOGIES.TITLE]?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Quản Lý Thần Số Học</h1>
          <p className="text-gray-400 text-sm">Quản lý các con số chủ đạo (Life Path Numbers).</p>
        </div>
        <Link 
          to="/admin/numerology/new" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-5 h-5" /> Thêm Số Mới
        </Link>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden p-4">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm số hoặc tiêu đề..." 
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-purple-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-4">Số</th>
                  <th className="px-6 py-4">Tiêu đề bài viết</th>
                  <th className="px-6 py-4">Điểm mạnh / Yếu</th>
                  <th className="px-6 py-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.number} className="bg-white/5 hover:bg-white/10 transition-colors group">
                    <td className="px-6 py-4 rounded-l-2xl">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 text-purple-400 font-black">
                        {item[FIELD_NUMEROLOGIES.NUMBER]}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{item[FIELD_NUMEROLOGIES.TITLE]}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-emerald-400 line-clamp-1 mb-1">{item[FIELD_NUMEROLOGIES.STRENGTHS]}</p>
                      <p className="text-xs text-rose-400 line-clamp-1">{item[FIELD_NUMEROLOGIES.WEAKNESSES]}</p>
                    </td>
                    <td className="px-6 py-4 text-right rounded-r-2xl">
                      <div className="flex items-center justify-end gap-2 text-indigo-400">
                        <Link 
                          to={`/admin/numerology/${item.number}/details`}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                          title="Quản lý chi tiết topic"
                        >
                          <Info className="w-4 h-4" />
                        </Link>
                        <Link 
                          to={`/admin/numerology/edit/${item.number}`}
                          className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.number)}
                          className="p-2 hover:bg-rose-500/10 text-rose-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
