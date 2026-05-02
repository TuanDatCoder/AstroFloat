import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Clock, Calendar, Sparkles, UserCircle, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';
import { ROUTES } from '../../constants';

export default function Register() {
 const navigate = useNavigate();
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState(null);
 const [success, setSuccess] = useState(false);
 const [showPassword, setShowPassword] = useState(false);

 const [formData, setFormData] = useState({
 email: '',
 password: '',
 nickname: '', // Tên hiển thị trên app (Nick name)
 phone: '',
 gender: 'Khác',
 birthName: '', // Tên khai sinh để tính thần số học
 birthDate: '',
 });

 const handleChange = (e) => {
 setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const handleRegister = async (e) => {
 e.preventDefault();
 setLoading(true);
 setError(null);

 try {
 await authService.register(formData);

 setSuccess(true);
 setTimeout(() => {
 navigate(ROUTES.LOGIN);
 }, 3000);

 } catch (err) {
 console.error(err);
 setError(err.message || 'Có lỗi xảy ra trong quá trình đăng ký.');
 } finally {
 setLoading(false);
 }
 };

 if (success) {
 return (
 <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 relative z-10">
 <motion.div
 initial={{ scale: 0.9, opacity: 0 }}
 animate={{ scale: 1, opacity: 1 }}
 className="bg-emerald-950/40 border border-emerald-500/30 p-10 rounded-3xl text-center max-w-lg"
 >
 <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
 <Sparkles className="w-10 h-10 text-emerald-400" />
 </div>
 <h2 className="text-3xl font-bold text-white mb-4">Đăng Ký Thành Công!</h2>
 <p className="text-emerald-100/80 mb-6">
 Hồ sơ năng lượng của bạn đã được lưu trữ vào vũ trụ Góc Vũ Trụ. Đang chuyển hướng...
 </p>
 </motion.div>
 </div>
 );
 }

 return (
 <div className="flex flex-col items-center justify-center min-h-[90vh] py-20 px-4 relative z-10 w-full overflow-hidden">
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.6 }}
 className="w-full max-w-4xl bg-slate-900/80 border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
 >
 <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
 <UserCircle className="w-64 h-64" />
 </div>

 <div className="text-center mb-10 relative z-10">
 <span className="inline-block py-1 px-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold tracking-[0.2em] mb-4">
 BƯỚC VÀO VŨ TRỤ
 </span>
 <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
 Thiết Lập Hồ Sơ Số Học
 </h1>
 <p className="text-gray-400 max-w-xl mx-auto font-light">
 Cung cấp thông tin <span className="text-white font-medium">chính xác nhất</span> để Góc Vũ Trụ tính toán Bản đồ Thần Số Học và Cung Hoàng Đạo của bạn.
 </p>
 </div>

 {error && (
 <div className="mb-8 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-200 text-sm text-center">
 {error}
 </div>
 )}

 <form onSubmit={handleRegister} className="relative z-10">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

 {/* CỘT 1: Tài khoản */}
 <div className="space-y-5">
 <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest border-b border-white/10 pb-2">
 1. Tài Khoản
 </h3>

 <div>
 <label className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-2 flex items-center gap-1 ml-1">
 Email <span className="text-red-400">*</span>
 </label>
 <div className="relative">
 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
 <input type="email" name="email" required value={formData.email} onChange={handleChange}
 className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
 placeholder="email@cuaban.com" />
 </div>
 </div>

 <div>
 <label className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-2 flex items-center gap-1 ml-1">
 Mật khẩu <span className="text-red-400">*</span>
 </label>
 <div className="relative group">
 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
 <input type={showPassword ? "text" : "password"} name="password" required minLength={6} value={formData.password} onChange={handleChange}
 className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
 placeholder="Tối thiểu 6 ký tự" />
 <button
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
 tabIndex="-1"
 >
 {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
 </button>
 </div>
 </div>

 <div>
 <label className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-2 flex items-center gap-1 ml-1">
 Nickname <span className="text-red-400">*</span>
 </label>
 <div className="relative">
 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
 <input type="text" name="nickname" required value={formData.nickname} onChange={handleChange}
 className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
 placeholder="Ví dụ: Anna, Mặt Trời Bé..." />
 </div>
 </div>

 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-2 block ml-1">SĐT</label>
 <div className="relative">
 <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
 <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
 className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-3 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors text-sm"
 placeholder="Không bắt buộc" />
 </div>
 </div>
 <div>
 <label className="text-xs uppercase font-bold tracking-widest text-cyan-400 mb-2 block ml-1">Giới tính</label>
 <select name="gender" value={formData.gender} onChange={handleChange}
 className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors text-sm cursor-pointer">
 <option value="Nam">Nam</option>
 <option value="Nữ">Nữ</option>
 <option value="Khác">Khác</option>
 </select>
 </div>
 </div>
 </div>

 {/* CỘT 2: Dữ liệu khai sinh */}
 <div className="space-y-5">
 <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest border-b border-white/10 pb-2">
 2. Thông Tin Gốc
 </h3>

 <div>
 <label className="text-xs uppercase font-bold tracking-widest text-purple-400 mb-2 flex items-center gap-1 ml-1">
 Họ và Tên Đầy Đủ <span className="text-red-400">*</span>
 </label>
 <div className="relative">
 <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/60" />
 <input type="text" name="birthName" required value={formData.birthName} onChange={handleChange}
 className="w-full bg-black/40 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-purple-400 transition-colors"
 placeholder="Nhập tên đầy đủ" />
 </div>
 <p className="text-[10px] text-gray-500 mt-1 ml-2">Dùng để tính Số Sứ Mệnh, Linh Hồn, Nhân Cách...</p>
 </div>

 <div>
 <label className="text-xs uppercase font-bold tracking-widest text-purple-400 mb-2 flex items-center gap-1 ml-1">
 Ngày sinh <span className="text-red-400">*</span>
 </label>
 <div className="relative">
 <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
 <input type="date" name="birthDate" required value={formData.birthDate} onChange={handleChange}
 className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
 </div>
 <p className="text-[10px] text-gray-500 mt-1 ml-2">Dùng để tính Số Chủ Đạo và Cung Hoàng Đạo.</p>
 </div>
 </div>
 </div>

 <div className="flex flex-col items-center gap-4 mt-6">
 <p className="text-xs text-gray-600">Các trường đánh dấu <span className="text-red-400 font-bold">*</span> là bắt buộc</p>
 <button
 type="submit"
 disabled={loading}
 className="w-full md:w-auto px-16 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-full font-bold text-white tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-3 text-lg"
 >
 {loading
 ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Đang xử lý...</span></>
 : 'GHI NHẬN HỒ SƠ'}
 </button>
 <p className="text-sm text-gray-400">
 Đã có hồ sơ?{' '}
 <Link to={ROUTES.LOGIN} className="text-cyan-400 font-bold hover:underline">Hãy kết nối</Link>
 </p>
 </div>
 </form>
 </motion.div>
 </div>
 );
}
