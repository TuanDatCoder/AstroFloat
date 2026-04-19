import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit3, Loader2, Sparkles, BookOpen, Crown } from 'lucide-react';
import { supabase } from '../../../services/supabase';
import { pinnacleDetailService } from '../../../services/pinnacleDetailService';
import { TABLES, FIELD_PINNACLE_DETAILS } from '../../../constants';

export default function AdminPinnacleDetailList() {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(TABLES.PINNACLE_DETAILS)
        .select('*')
        .order(FIELD_PINNACLE_DETAILS.PINNACLE_NUMBER, { ascending: true })
        .order(FIELD_PINNACLE_DETAILS.TOPIC, { ascending: true });
        
      if (error) throw error;
      setDetails(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa bài viết chi tiết này?")) return;
    try {
      await pinnacleDetailService.deleteDetail(id);
      fetchData();
    } catch (e) {
      alert("Lỗi: " + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Bài Viết Chi Tiết Đỉnh Cao</h1>
          <p className="text-gray-400 text-sm italic">Quản lý toàn bộ luận giải chuyên sâu (Premium) của các con số Đỉnh cao.</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
        {loading ? (
          <div className="flex justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.map((item) => (
              <div key={item.id} className="group bg-white/5 border border-white/5 hover:border-indigo-500/20 p-6 rounded-3xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 font-black text-lg">
                      {item[FIELD_PINNACLE_DETAILS.PINNACLE_NUMBER]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase text-indigo-500/60 tracking-wider font-mono">
                           {item[FIELD_PINNACLE_DETAILS.TOPIC]}
                        </span>
                        {item[FIELD_PINNACLE_DETAILS.IS_PREMIUM] && <Crown className="w-3 h-3 text-amber-500" />}
                      </div>
                      <h3 className="text-xs font-bold text-white truncate max-w-[150px]">{item[FIELD_PINNACLE_DETAILS.TITLE]}</h3>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to={`/admin/pinnacles/${item[FIELD_PINNACLE_DETAILS.PINNACLE_NUMBER]}/details`} className="p-2 text-gray-500 hover:text-indigo-400 rounded-lg"><Edit3 className="w-4 h-4" /></Link>
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed font-light italic">
                  {item[FIELD_PINNACLE_DETAILS.CONTENT]}
                </p>
              </div>
            ))}
            {details.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-600 italic">Chưa có bài viết chuyên sâu nào được tạo.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
