'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Search, User, Mail, Shield, 
  Trash2, Filter, ChevronLeft, ChevronRight, Loader2,
  Mountain
} from 'lucide-react';
import { userPinnacleService } from '@/services/userPinnacleService';

export default function AdminUserPinnacleList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await userPinnacleService.getAllUserPinnacles();
      setData(result || []);
    } catch (err) {
      console.error("Error fetching user pinnacles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bản ghi này?")) return;
    try {
      await userPinnacleService.deleteUserPinnacle(id);
      fetchData();
    } catch (err) {
      alert("Lỗi khi xóa: " + err.message);
    }
  };

  const filteredData = data.filter(item => {
    const user = item.profiles || {};
    return (
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pinnacle_number?.toString() === searchTerm
    );
  });

  // Group data by user
  const groupedData = filteredData.reduce((acc, curr) => {
    const userId = curr.profile_id;
    if (!acc[userId]) {
      acc[userId] = {
        profile: curr.profiles || { nickname: 'Ẩn danh', email: 'N/A' },
        pinnacles: []
      };
    }
    acc[userId].pinnacles.push(curr);
    return acc;
  }, {});

  const usersList = Object.values(groupedData);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-400" /> User Pinnacles
          </h1>
          <p className="text-gray-400">Xem và quản lý các chặng đỉnh cao đã được tính toán của người dùng.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          type="text" 
          placeholder="Tìm theo email, tên hoặc số đỉnh cao..."
          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : usersList.length === 0 ? (
          <div className="p-20 bg-slate-900/40 rounded-[3rem] border border-dashed border-white/10 text-center text-gray-500 italic">
             Không tìm thấy dữ liệu người dùng nào.
          </div>
        ) : (
          usersList.map((userGroup, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-slate-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl"
            >
              {/* User Header */}
              <div className="px-8 py-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <User className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-white">{userGroup.profile.nickname}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Mail className="w-3.5 h-3.5" />
                      {userGroup.profile.email}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                     {userGroup.pinnacles.length} Pinnacles
                   </span>
                </div>
              </div>

              {/* Pinnacles Grid */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {userGroup.pinnacles.map((p, pIdx) => (
                  <div key={p.id} className="relative group bg-black/20 border border-white/5 p-6 rounded-3xl hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Đỉnh {p.pinnacle_level}</span>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-500/10 text-rose-500 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                       <span className="text-4xl font-black text-white">{p.pinnacle_number}</span>
                       <span className="text-[10px] font-bold text-gray-500 uppercase">Số đỉnh</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-gray-400 font-medium">
                        Tuổi: <span className="text-white font-bold">{p.start_age} - {p.end_age || '∞'}</span>
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Năm: {p.start_year} - {p.end_year || 'về sau'}
                      </p>
                    </div>
                    
                    {/* Background number glow */}
                    <div className="absolute -right-2 -bottom-2 text-6xl font-black text-white/[0.02] pointer-events-none select-none">
                      {p.pinnacle_level}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
