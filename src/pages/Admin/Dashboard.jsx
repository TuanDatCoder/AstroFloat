import React from 'react';
import { Users, Star, Database, Activity } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { name: 'Tổng Users', value: '124', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { name: 'Cung Hoàng Đạo', value: '12', icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { name: 'Chỉ số Thần Số', value: '45', icon: Database, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { name: 'Tương tác', value: '89%', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
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
              {stat.value}
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
