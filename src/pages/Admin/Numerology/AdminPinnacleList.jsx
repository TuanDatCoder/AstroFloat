import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Mountain, Sparkles, Loader2, BookOpen } from 'lucide-react';
import { numerologyService } from '../../../services/numerologyService';
import { FIELD_PINNACLE_NUMEROLOGY } from '../../../constants';

export default function AdminPinnacleList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await numerologyService.getAllPinnacles();
      setItems(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (num) => {
    if (!window.confirm("Xóa ý nghĩa đỉnh cao này?")) return;
    try {
      await numerologyService.deletePinnacle(num);
      fetchData();
    } catch (e) {
      alert("Lỗi: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
              <Mountain className="w-6 h-6 text-indigo-400" />
           </div>
           <div>
              <h1 className="text-2xl font-black text-white">4 Đỉnh Cao Cuộc Đời</h1>
              <p className="text-gray-400 text-sm italic">Quản lý ý nghĩa của các con số xuất hiện tại các đỉnh kim tự tháp.</p>
           </div>
        </div>
        <Link 
          to="/admin/pinnacles/new" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" /> Thêm Ý Nghĩa Mới
        </Link>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] p-4">
        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.number} className="group bg-white/5 border border-white/5 hover:border-indigo-500/30 p-8 rounded-[2rem] transition-all relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all" />
                
                <div className="flex justify-between items-start mb-6">
                   <div className="w-14 h-14 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center text-2xl font-black text-indigo-400">
                     {item[FIELD_PINNACLE_NUMEROLOGY.NUMBER]}
                   </div>
                    <div className="flex gap-2">
                       <Link 
                         to={`/admin/pinnacles/${item.number}/details`} 
                         className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                         title="Quản lý bài viết chuyên sâu"
                       >
                         <BookOpen className="w-4 h-4" />
                       </Link>
                       <Link to={`/admin/pinnacles/edit/${item.number}`} className="p-2 text-gray-500 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></Link>
                       <button onClick={() => handleDelete(item.number)} className="p-2 text-gray-500 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-lg font-bold text-white flex items-center gap-2">
                     <Sparkles className="w-4 h-4 text-amber-400" />
                     {item[FIELD_PINNACLE_NUMEROLOGY.TITLE]}
                   </h3>
                   <p className="text-sm text-gray-400 line-clamp-4 leading-relaxed font-light italic">
                     {item[FIELD_PINNACLE_NUMEROLOGY.CONTENT]}
                   </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
