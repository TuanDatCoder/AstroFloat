import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, Database, Share2, Cookie, ShieldCheck, Mail } from 'lucide-react';

const sections = [
  {
    icon: Eye,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    title: '1. Thông Tin Chúng Tôi Thu Thập',
    content: `Khi bạn sử dụng Góc Vũ Trụ, chúng tôi có thể thu thập các loại thông tin sau:

Thông tin bạn cung cấp trực tiếp:
• Họ tên, địa chỉ email khi đăng ký tài khoản.
• Ngày sinh, tên khai sinh để tính toán thần số học.
• Ảnh đại diện bạn tự tải lên.
• Nội dung bạn gửi cho chúng tôi qua email hỗ trợ.

Thông tin tự động:
• Địa chỉ IP, loại trình duyệt, hệ điều hành.
• Các trang bạn truy cập và thời gian sử dụng.
• Cookie và dữ liệu phiên đăng nhập.`,
  },
  {
    icon: Database,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    title: '2. Cách Chúng Tôi Sử Dụng Thông Tin',
    content: `Chúng tôi sử dụng thông tin thu thập được để:

• Cung cấp, duy trì và cải thiện dịch vụ Góc Vũ Trụ.
• Tính toán và hiển thị kết quả thần số học, chiêm tinh học cá nhân hóa.
• Xác thực danh tính và bảo vệ tài khoản của bạn.
• Gửi thông báo quan trọng về tài khoản (không phải spam).
• Phân tích cách người dùng tương tác với dịch vụ để cải thiện trải nghiệm.
• Tuân thủ các nghĩa vụ pháp lý.`,
  },
  {
    icon: Lock,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    title: '3. Bảo Mật Dữ Liệu',
    content: `Chúng tôi coi trọng việc bảo vệ thông tin của bạn. Các biện pháp bảo mật chúng tôi áp dụng:

• Mã hóa dữ liệu truyền tải bằng giao thức HTTPS/TLS.
• Mật khẩu được băm (hashed) và không bao giờ lưu dạng plain text.
• Hệ thống xác thực hai yếu tố (2FA) tùy chọn.
• Cơ sở dữ liệu được bảo vệ bởi Supabase với các tiêu chuẩn bảo mật cao.
• Kiểm tra bảo mật định kỳ.

Mặc dù vậy, không có hệ thống nào hoàn toàn an toàn. Chúng tôi không thể đảm bảo 100% an toàn tuyệt đối cho thông tin của bạn.`,
  },
  {
    icon: Share2,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    title: '4. Chia Sẻ Thông Tin',
    content: `Chúng tôi không bán, trao đổi hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba vì mục đích thương mại.

Chúng tôi có thể chia sẻ thông tin trong các trường hợp:

• Nhà cung cấp dịch vụ tin cậy giúp vận hành Góc Vũ Trụ (ví dụ: Supabase để lưu trữ dữ liệu, Google AdSense để hiển thị quảng cáo phù hợp).
• Khi được yêu cầu bởi luật pháp hoặc lệnh tòa án.
• Để bảo vệ quyền lợi, tài sản và sự an toàn của Góc Vũ Trụ và người dùng.`,
  },
  {
    icon: Cookie,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    title: '5. Cookie và Công Nghệ Theo Dõi',
    content: `Góc Vũ Trụ sử dụng cookie và các công nghệ tương tự để:

• Duy trì phiên đăng nhập của bạn.
• Ghi nhớ sở thích và ngày sinh đã nhập.
• Phân tích lưu lượng truy cập (Google Analytics).
• Hiển thị quảng cáo liên quan (Google AdSense).

Bạn có thể kiểm soát cookie qua cài đặt trình duyệt. Tuy nhiên, việc tắt cookie có thể ảnh hưởng đến một số tính năng của dịch vụ.`,
  },
  {
    icon: ShieldCheck,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    title: '6. Quyền Của Bạn',
    content: `Bạn có các quyền sau đối với dữ liệu cá nhân của mình:

• Quyền truy cập: Yêu cầu xem dữ liệu chúng tôi đang lưu về bạn.
• Quyền chỉnh sửa: Cập nhật thông tin không chính xác hoặc lỗi thời.
• Quyền xóa: Yêu cầu xóa tài khoản và toàn bộ dữ liệu liên quan.
• Quyền từ chối: Không nhận email marketing (luôn có nút unsubscribe).
• Quyền di chuyển dữ liệu: Yêu cầu xuất dữ liệu của bạn.

Để thực hiện các quyền này, vui lòng liên hệ contact@astrofloat.app.`,
  },
  {
    icon: Mail,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    title: '7. Liên Hệ',
    content: `Nếu bạn có bất kỳ câu hỏi nào về Chính sách Bảo mật này hoặc muốn thực hiện quyền của mình, vui lòng liên hệ:

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

export default function Privacy() {
  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-6 pt-20 pb-24">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 py-1.5 px-5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-black tracking-[0.25em] mb-6 uppercase">
          <Lock className="w-3 h-3" /> Bảo Mật
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
          Chính Sách{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400">
            Bảo Mật
          </span>
        </h1>
        <p className="text-gray-500 font-light max-w-xl mx-auto text-sm leading-relaxed">
          Bảo vệ thông tin cá nhân của bạn là ưu tiên hàng đầu của Góc Vũ Trụ. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
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
                  <h2 className="text-lg font-black text-white">{section.title}</h2>
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
        className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-cyan-500/5 to-purple-500/5 border border-white/5 text-center"
      >
        <p className="text-gray-500 text-sm font-light">
          Chúng tôi cam kết bảo vệ quyền riêng tư của bạn.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-bold">Góc Vũ Trụ</span>
          {' '}không bao giờ bán dữ liệu của bạn.
        </p>
      </motion.div>

    </div>
  );
}
