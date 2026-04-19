import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, BookOpen, Layers } from 'lucide-react';
import { nameNumerologyService } from '../../../services/nameNumerologyService';
import { FIELD_NAME_NUMEROLOGY } from '../../../constants';

export default function AdminNameNumerologyList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await nameNumerologyService.getAllNameNumerologies();
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching name numerology:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (number) => {
    if (!window.confirm(`Xóa chỉ số Sứ mệnh ${number}?`)) return;
    try {
      await nameNumerologyService.deleteNameNumerology(number);
      fetchData();
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };

  const filteredItems = items.filter(item => 
    item[FIELD_NAME_NUMEROLOGY.NUMBER]?.toString().includes(searchTerm) ||
    item[FIELD_NAME_NUMEROLOGY.TITLE]?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.number - b.number);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Thần Số Học Tên</h1>
          <p className="text-gray-400 text-sm">Quản lý các chỉ số Sứ mệnh (Expression Numbers).</p>
        </div>
        <div className="flex gap-2">
          <Link 
            to="/admin/name-advanced-metrics" 
            className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all border border-white/10"
          >
            <Layers className="w-4 h-4 text-cyan-400" /> Quản lý Chỉ số Phụ
          </Link>
          <Link 
            to="/admin/name-numerology/new" 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-5 h-5" /> Thêm Số Mới
          </Link>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden p-4">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm số hoặc tiêu đề..." 
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-4">Số</th>
                  <th className="px-6 py-4">Tiêu đề sứ mệnh</th>
                  <th className="px-6 py-4">Sơ lược</th>
                  <th className="px-6 py-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.number} className="bg-white/5 hover:bg-white/10 transition-colors group">
                    <td className="px-6 py-4 rounded-l-2xl">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400 font-black text-xs">
                        {item[FIELD_NAME_NUMEROLOGY.NUMBER]}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-sm">{item[FIELD_NAME_NUMEROLOGY.TITLE]}</p>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                       <p className="text-xs text-gray-400 line-clamp-1 italic font-light">
                        {item[FIELD_NAME_NUMEROLOGY.TRAITS]}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right rounded-r-2xl">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/admin/name-numerology/edit/${item.number}`}
                          className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(item.number)}
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
          </div>
        )}
      </div>
    </div>
  );
}
