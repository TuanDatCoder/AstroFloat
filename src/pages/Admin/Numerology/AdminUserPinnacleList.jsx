import React, { useEffect, useState } from 'react';
import { Search, User, Mountain, Trash2, Edit3, Loader2, Calendar, Hash } from 'lucide-react';
import { userPinnacleService } from '../../../services/userPinnacleService';
import { FIELD_PROFILE_PINNACLES } from '../../../constants';

export default function AdminUserPinnacleList() {
  const [pinnacles, setPinnacles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await userPinnacleService.getAllUserPinnacles();
      setPinnacles(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa bản ghi đỉnh cao này của User?")) return;
    try {
      await userPinnacleService.deleteUserPinnacle(id);
      fetchData();
    } catch (e) {
      alert("Lỗi: " + e.message);
    }
  };

  const filtered = pinnacles.filter(p => 
    p.profiles?.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Đỉnh Cao Theo User</h1>
          <p className="text-gray-400 text-sm">Quản lý giai đoạn đỉnh cao thực tế của từng thành viên.</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 overflow-hidden">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Tìm theo nickname hoặc email user..." 
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-[10px] uppercase tracking-widest font-black">
                  <th className="px-6 py-4">Thành viên</th>
                  <th className="px-6 py-4">Giai đoạn (Level)</th>
                  <th className="px-6 py-4">Độ tuổi (Age)</th>
                  <th className="px-6 py-4">Thời gian (Year)</th>
                  <th className="px-6 py-4">Số Đỉnh</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="bg-white/5 hover:bg-white/10 transition-colors group">
                    <td className="px-6 py-4 rounded-l-2xl">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="text-sm font-bold text-white">{item.profiles?.nickname || 'Unknown'}</p>
                          <p className="text-[10px] text-gray-500">{item.profiles?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded uppercase">
                        Đỉnh {item[FIELD_PROFILE_PINNACLES.PINNACLE_LEVEL]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className="text-xs text-gray-300 font-bold">
                        {item[FIELD_PROFILE_PINNACLES.START_AGE]} - {item[FIELD_PROFILE_PINNACLES.END_AGE] || '∞'}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-[10px] text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {item[FIELD_PROFILE_PINNACLES.START_YEAR]} - {item[FIELD_PROFILE_PINNACLES.END_YEAR] || '∞'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-500/20">
                         {item[FIELD_PROFILE_PINNACLES.PINNACLE_NUMBER]}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right rounded-r-2xl">
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-600 italic">Không tìm thấy dữ liệu.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
