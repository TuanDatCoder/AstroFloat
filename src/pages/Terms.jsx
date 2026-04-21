import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Users, AlertCircle, RefreshCw, Mail, ChevronRight } from 'lucide-react';

const sections = [
  {
    icon: FileText,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    title: '1. Chấp Thuận Điều Khoản',
    content: `Bằng việc truy cập và sử dụng AstroFloat ("Dịch vụ"), bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý bị ràng buộc bởi các Điều khoản Dịch vụ này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng Dịch vụ của chúng tôi.

Các điều khoản này áp dụng cho tất cả người dùng, bao gồm khách vãng lai, thành viên đã đăng ký và người dùng cao cấp. Chúng tôi có quyền cập nhật các điều khoản này bất kỳ lúc nào mà không cần thông báo trước.`,
  },
  {
    icon: Users,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    title: '2. Tài Khoản Người Dùng',
    content: `Khi tạo tài khoản tại AstroFloat, bạn có trách nhiệm:

• Cung cấp thông tin chính xác và đầy đủ.
• Bảo mật thông tin đăng nhập của bạn.
• Thông báo ngay cho chúng tôi nếu phát hiện bất kỳ sự truy cập trái phép nào vào tài khoản của bạn.
• Chịu trách nhiệm cho tất cả các hoạt động diễn ra dưới tài khoản của bạn.

Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn nếu phát hiện vi phạm điều khoản sử dụng.`,
  },
  {
    icon: Shield,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    title: '3. Sử Dụng Hợp Lệ',
    content: `AstroFloat được cung cấp chỉ cho mục đích giải trí và tham khảo. Bạn đồng ý không sử dụng dịch vụ để:

• Phân phối nội dung bất hợp pháp, có hại hoặc xúc phạm.
• Can thiệp hoặc gây gián đoạn cho cơ sở hạ tầng của dịch vụ.
• Thu thập dữ liệu người dùng khác mà không có sự đồng ý.
• Sao chép, phân phối hoặc bán nội dung của chúng tôi.
• Sử dụng các công cụ tự động để truy cập dịch vụ mà không có sự cho phép.`,
  },
  {
    icon: AlertCircle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    title: '4. Giới Hạn Trách Nhiệm',
    content: `Nội dung về chiêm tinh học và thần số học trên AstroFloat chỉ mang tính giải trí và tham khảo. Chúng tôi không đảm bảo tính chính xác tuyệt đối của bất kỳ phân tích hay dự đoán nào.

AstroFloat và các đối tác của chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp, ngẫu nhiên hoặc do hậu quả nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ của chúng tôi.`,
  },
  {
    icon: RefreshCw,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    title: '5. Thay Đổi Dịch Vụ',
    content: `Chúng tôi bảo lưu quyền sửa đổi hoặc ngừng cung cấp dịch vụ (hoặc bất kỳ phần nào của dịch vụ) bất kỳ lúc nào, có hoặc không có thông báo.

Chúng tôi sẽ không chịu trách nhiệm với bạn hoặc bất kỳ bên thứ ba nào về bất kỳ sự thay đổi, đình chỉ hoặc ngừng cung cấp dịch vụ nào.

Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi về điều khoản đồng nghĩa với việc bạn chấp nhận các điều khoản mới.`,
  },
  {
    icon: Mail,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    title: '6. Liên Hệ',
    content: `Nếu bạn có bất kỳ câu hỏi nào về Điều khoản Dịch vụ này, vui lòng liên hệ với chúng tôi:

📧 Email: contact@astrofloat.app
🌐 Website: astrofloat.app

Chúng tôi cam kết phản hồi trong vòng 72 giờ làm việc.`,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

export default function Terms() {
  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6 pt-20 pb-24">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-black tracking-[0.25em] mb-6 uppercase">
          <Shield className="w-3 h-3" /> Pháp Lý
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
          Điều Khoản{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400">
            Dịch Vụ
          </span>
        </h1>
        <p className="text-gray-500 font-light max-w-xl mx-auto text-sm leading-relaxed">
          Vui lòng đọc kỹ các điều khoản này trước khi sử dụng AstroFloat. Bằng cách sử dụng dịch vụ, bạn đồng ý với các điều khoản sau.
        </p>
        <p className="text-gray-600 text-xs mt-4 font-medium">Cập nhật lần cuối: Tháng 4, 2026</p>
      </motion.div>

      {/* Sections */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className={`relative overflow-hidden rounded-3xl border ${section.border} bg-slate-900/60 p-8`}
            >
              {/* Background glow */}
              <div className={`absolute top-0 right-0 w-40 h-40 ${section.bg} rounded-full blur-3xl opacity-40 pointer-events-none`} />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-11 h-11 rounded-2xl ${section.bg} border ${section.border} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-5 h-5 ${section.color}`} />
                  </div>
                  <h2 className={`text-lg font-black text-white`}>{section.title}</h2>
                </div>
                <p className="text-gray-400 text-sm font-light leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Bottom note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-purple-500/5 to-cyan-500/5 border border-white/5 text-center"
      >
        <p className="text-gray-500 text-sm font-light">
          Bằng việc sử dụng{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-bold">AstroFloat</span>
          , bạn xác nhận đã đọc và đồng ý với toàn bộ điều khoản trên.
        </p>
      </motion.div>

    </div>
  );
}
