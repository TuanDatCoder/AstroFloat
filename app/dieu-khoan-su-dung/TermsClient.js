'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Users, AlertCircle, RefreshCw, Mail } from 'lucide-react';

const sections = [
  { icon: FileText, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', title: '1. Chấp Thuận Điều Khoản', content: `Bằng việc truy cập và sử dụng Góc Vũ Trụ ("Dịch vụ"), bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản Dịch vụ này.` },
  { icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', title: '2. Tài Khoản Người Dùng', content: `Khi tạo tài khoản, bạn có trách nhiệm bảo mật thông tin đăng nhập và chịu trách nhiệm cho mọi hoạt động diễn ra dưới tài khoản của bạn.` },
  { icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', title: '3. Sử Dụng Hợp Lệ', content: `Góc Vũ Trụ được cung cấp chỉ cho mục đích giải trí và tham khảo. Không sử dụng cho các hành vi bất hợp pháp hoặc can thiệp hệ thống.` },
  { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', title: '4. Giới Hạn Trách Nhiệm', content: `Nội dung chiêm tinh và thần số học chỉ mang tính giải trí. Chúng tôi không đảm bảo tính chính xác tuyệt đối của các phân tích.` },
  { icon: Mail, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', title: '5. Liên Hệ', content: `📧 Email: devprojectlabvn@gmail.com\nChúng tôi cam kết phản hồi trong vòng 72 giờ làm việc.` },
];

export default function TermsClient() {
  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-32 pb-24 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <span className="inline-block py-1.5 px-5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-black tracking-widest mb-6 uppercase">Pháp Lý</span>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">Điều Khoản <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">Dịch Vụ</span></h1>
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
