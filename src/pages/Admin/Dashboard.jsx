import React, { useState, useEffect } from 'react';
import { Users, Star, Database, Activity, Heart } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { TABLES } from '../../constants';

export default function Dashboard() {
  const [statsData, setStatsData] = useState({
    users: 0,
    zodiacs: 0,
    numerologies: 0,
    matches: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        // Fetch counts in parallel
        const [
          { count: usersCount },
          { count: zodiacsCount },
          { count: numerologiesCount },
          { count: matchesCount }
        ] = await Promise.all([
          supabase.from(TABLES.PROFILES).select('id', { count: 'exact', head: true }),
          supabase.from(TABLES.ZODIAC_SIGNS).select('id', { count: 'exact', head: true }),
          supabase.from(TABLES.NUMEROLOGIES).select('number', { count: 'exact', head: true }),
          supabase.from(TABLES.ZODIAC_MATCHES).select('id', { count: 'exact', head: true })
        ]);

        setStatsData({
          users: usersCount || 0,
          zodiacs: zodiacsCount || 0,
          numerologies: numerologiesCount || 0,
          matches: matchesCount || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const stats = [
    { name: 'Tổng Users', value: statsData.users, icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { name: 'Cung Hoàng Đạo', value: statsData.zodiacs, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'Chỉ số Thần Số', value: statsData.numerologies, icon: Database, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { name: 'Cặp Tương Hợp', value: statsData.matches, icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-2">Tổng Quan Hệ Thống</h1>
        <p className="text-gray-400">Chào mừng trở lại bảng điều khiển quản trị Góc Vũ Trụ.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-semibold mb-1">{stat.name}</h3>
            <p className="text-3xl font-black text-white group-hover:scale-105 origin-left transition-transform">
              {loading ? (
                <span className="text-gray-500 text-xl font-medium animate-pulse">Đang tải...</span>
              ) : (
                stat.value
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900/50 p-8 rounded-[2rem] border border-white/5">
        <h2 className="text-xl font-bold text-white mb-4">Hoạt động gần đây</h2>
        <div className="flex items-center justify-center p-12 text-gray-500 italic">
          Khu vực biểu đồ hoặc danh sách lịch sử truy cập sẽ hiển thị ở đây
        </div>
      </div>
    </div>
  );
}
