'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, Database, Share2, Cookie, ShieldCheck, Mail } from 'lucide-react';

const sections = [
  { icon: Eye, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', title: '1. Thông Tin Thu Thập', content: `Chúng tôi thu thập email, họ tên, ngày sinh và ảnh đại diện để tính toán kết quả thần số học và cá nhân hóa trải nghiệm của bạn.` },
  { icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', title: '2. Cách Sử Dụng', content: `Dữ liệu dùng để hiển thị các bản giải mã, xác thực tài khoản và cải thiện dịch vụ. Chúng tôi không bao giờ bán dữ liệu của bạn.` },
  { icon: Lock, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', title: '3. Bảo Mật', content: `Mọi dữ liệu được mã hóa qua HTTPS/TLS. Mật khẩu được băm bảo mật. Cơ sở dữ liệu được bảo vệ bởi các tiêu chuẩn cao nhất từ Supabase.` },
  { icon: ShieldCheck, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', title: '4. Quyền Của Bạn', content: `Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa bỏ toàn bộ dữ liệu cá nhân bất cứ lúc nào.` },
  { icon: Mail, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', title: '5. Liên Hệ', content: `📧 Email: contact@astrofloat.app\nChúng tôi cam kết bảo vệ sự riêng tư của cư dân Góc Vũ Trụ.` },
];

export default function PrivacyPage() {
  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-32 pb-24 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <span className="inline-block py-1.5 px-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-black tracking-widest mb-6 uppercase">Bảo Mật</span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">Chính Sách <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400">Bảo Mật</span></h1>
        <p className="text-gray-500 mt-4 text-sm font-light">Cập nhật lần cuối: Tháng 4, 2026</p>
      </motion.div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className={`p-8 rounded-3xl border ${section.border} bg-slate-900/60`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-10 h-10 rounded-xl ${section.bg} flex items-center justify-center`}><section.icon className={`w-5 h-5 ${section.color}`} /></div>
              <h2 className="text-lg font-black text-white">{section.title}</h2>
            </div>
            <p className="text-gray-400 text-sm font-light leading-relaxed whitespace-pre-line">{section.content}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
