'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BookOpen, Plus, Search, Filter, 
  Trash2, Edit3, Loader2, Star, Mountain,
  ChevronRight
} from 'lucide-react';
import { pinnacleDetailService } from '@/services/pinnacleDetailService';
import { FIELD_PINNACLE_DETAILS } from '@/constants';

export default function AdminPinnacleDetailsList() {
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllDetails();
  }, []);

  const fetchAllDetails = async () => {
    try {
      setLoading(true);
      const data = await pinnacleDetailService.getAllDetails();
      setDetails(data || []);
    } catch (err) {
      console.error("Lỗi fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDetails();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa bài viết này?")) return;
    try {
      await pinnacleDetailService.deleteDetail(id);
      setDetails(details.filter(d => d.id !== id));
    } catch (err) {
      alert("Lỗi: " + err.message);
    }
  };

  const filteredDetails = details.filter(d => 
    d.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.pinnacle_number?.toString() === searchTerm
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-400" /> Tất cả bài viết chi tiết
          </h1>
          <p className="text-gray-400">Quản lý toàn bộ nội dung phân tích chuyên sâu của các đỉnh cao.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          type="text" 
          placeholder="Tìm theo tiêu đề, chủ đề hoặc số đỉnh cao..."
          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>
        ) : filteredDetails.length === 0 ? (
          <div className="p-20 bg-slate-900/40 rounded-[3rem] border border-dashed border-white/10 text-center text-gray-600 italic">
             Không tìm thấy bài viết nào.
          </div>
        ) : (
          filteredDetails.map((detail, idx) => (
            <motion.div 
              key={detail.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              className="group bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 p-6 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center gap-6 transition-all"
            >
              <div className="w-16 h-16 shrink-0 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex flex-col items-center justify-center">
                 <span className="text-[10px] font-black text-indigo-500 uppercase">Số</span>
                 <span className="text-2xl font-black text-white leading-none">{detail.pinnacle_number}</span>
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {detail.topic}
                  </span>
                  {detail.is_premium && (
                    <span className="flex items-center gap-1 text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-2 py-0.5 rounded border border-amber-500/20">
                      <Star className="w-2.5 h-2.5 fill-amber-400" /> Premium
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{detail.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-1 font-light italic">{detail.content}</p>
              </div>

              <div className="flex items-center gap-2">
                <Link 
                  href={`/admin/pinnacles/details/${detail.pinnacle_number}`}
                  className="p-3 bg-white/5 hover:bg-white/10 text-indigo-400 rounded-xl transition-all border border-white/5"
                  title="Chỉnh sửa bài viết"
                >
                  <Edit3 className="w-4 h-4" />
                </Link>
                <button 
                  onClick={() => handleDelete(detail.id)}
                  className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl transition-all border border-rose-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <Link 
                  href={`/admin/pinnacles/details/${detail.pinnacle_number}`}
                  className="ml-2 p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
