import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Info, ExternalLink } from 'lucide-react';
import { zodiacService } from '../../../services/zodiacService';
import { FIELD_ZODIAC_SIGNS } from '../../../constants';

export default function AdminZodiacList() {
  const [zodiacs, setZodiacs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchZodiacs();
  }, []);

  const fetchZodiacs = async () => {
    try {
      setLoading(true);
      const data = await zodiacService.getAllZodiacs();
      setZodiacs(data || []);
    } catch (error) {
      console.error("Error fetching zodiacs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa cung hoàng đạo này không? Việc này sẽ xóa toàn bộ chi tiết liên quan.")) return;
    try {
      await zodiacService.deleteZodiac(id);
      setZodiacs(zodiacs.filter(z => z.id === id));
      fetchZodiacs();
    } catch (error) {
      alert("Lỗi khi xóa: " + error.message);
    }
  };

  const filteredZodiacs = zodiacs.filter(z => 
    z[FIELD_ZODIAC_SIGNS.NAME]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    z[FIELD_ZODIAC_SIGNS.ENGLISH_NAME]?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Quản Lý Cung Hoàng Đạo</h1>
          <p className="text-gray-400 text-sm">Danh sách 12 cung hoàng đạo và thông tin cơ bản.</p>
        </div>
        <Link 
          to="/admin/zodiac/new" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-5 h-5" /> Thêm Cung Mới
        </Link>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden p-4">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Tìm kiếm cung hoàng đạo..." 
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-widest font-bold">
                  <th className="px-4 py-3">Hình ảnh</th>
                  <th className="px-4 py-3">Tên / English</th>
                  <th className="px-4 py-3">Nguyên Tố</th>
                  <th className="px-4 py-3">Hành Tinh Thống Trị</th>
                  <th className="px-4 py-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredZodiacs.map((z) => (
                  <tr key={z.id} className="bg-white/5 hover:bg-white/10 transition-colors group">
                    <td className="px-4 py-3 rounded-l-xl">
                      <div className="w-12 h-12 rounded-lg bg-slate-800 border border-white/5 overflow-hidden">
                        {z[FIELD_ZODIAC_SIGNS.IMAGE_URL] ? (
                          <img src={z[FIELD_ZODIAC_SIGNS.IMAGE_URL]} alt={z.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-700">?</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-white">{z[FIELD_ZODIAC_SIGNS.NAME]}</p>
                      <p className="text-xs text-gray-500 uppercase">{z[FIELD_ZODIAC_SIGNS.ENGLISH_NAME]}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        z[FIELD_ZODIAC_SIGNS.ELEMENT] === 'Lửa' ? 'bg-orange-500/20 text-orange-400' :
                        z[FIELD_ZODIAC_SIGNS.ELEMENT] === 'Đất' ? 'bg-emerald-500/20 text-emerald-400' :
                        z[FIELD_ZODIAC_SIGNS.ELEMENT] === 'Khí' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {z[FIELD_ZODIAC_SIGNS.ELEMENT]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-300">{z[FIELD_ZODIAC_SIGNS.RULING_PLANET]}</p>
                    </td>
                    <td className="px-4 py-3 text-right rounded-r-xl">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/admin/zodiac/${z.id}/details`} 
                          className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                          title="Quản lý chi tiết bài viết"
                        >
                          <Info className="w-4 h-4" />
                        </Link>
                        <Link 
                          to={`/admin/zodiac/edit/${z.id}`} 
                          className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                          title="Sửa thông tin cơ bản"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(z.id)}
                          className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredZodiacs.length === 0 && (
              <div className="text-center py-20 text-gray-500 italic">
                Không tìm thấy cung hoàng đạo nào.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
