import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
 User, Mail, Calendar, Star, LogOut, Edit3, Shield,
 Sparkles, Hash, Heart, Brain, Scale, TrendingUp, Sun,
 ChevronRight, Lock, Zap
} from 'lucide-react';
import { supabase } from '../../services/supabase';
import { authService } from '../../services/authService';
import { numerologyService } from '../../services/numerologyService';
import { zodiacService } from '../../services/zodiacService';
import { ROUTES, TABLES } from '../../constants';

// ─── Hiển thị 1 chỉ số thần số học ────────────────────────────
function NumerologyCard({ label, value, icon: Icon, color, description }) {
 if (!value) return null;
 return (
 <motion.div
 initial={{ opacity: 0, y: 16 }}
 animate={{ opacity: 1, y: 0 }}
 className="relative bg-black/60 border border-white/8 rounded-2xl p-4 flex items-start gap-4 hover:bg-white/5 transition-colors group"
 >
 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
 <Icon className="w-5 h-5 text-white" />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-0.5">{label}</p>
 <p className="text-2xl font-black text-white leading-none">{value}</p>
 {description && <p className="text-xs text-gray-500 mt-1 leading-snug">{description}</p>}
 </div>
 </motion.div>
 );
}

// ─── Tier Badge ────────────────────────────────────────────────
function TierBadge({ tier }) {
 const config = {
 FREE: { label: 'Free', bg: 'bg-gray-500/20 border-gray-500/30 text-gray-300' },
 PREMIUM: { label: 'Premium', bg: 'bg-amber-500/20 border-amber-500/30 text-amber-300' },
 VIP: { label: 'VIP ✦', bg: 'bg-purple-500/20 border-purple-500/30 text-purple-300' },
 }[tier] || { label: tier, bg: 'bg-gray-500/20 border-gray-500/30 text-gray-300' };
 return (
 <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-bold tracking-wider ${config.bg}`}>
 {config.label}
 </span>
 );
}

export default function Profile() {
 const navigate = useNavigate();
 const [profile, setProfile] = useState(null);
 const [zodiacSign, setZodiacSign] = useState(null);
 const [pinnacles, setPinnacles] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 async function load() {
 try {
 setLoading(true);
 const user = await authService.getCurrentUser();
 if (!user) { navigate(ROUTES.LOGIN); return; }

 const p = await authService.getUserProfile(user.id);
 if (!p) { console.warn("Không tìm thấy profile cho user:", user.id); return; }
 
 console.log("Profile loaded:", p);
 setProfile(p);

 // Load zodiac sign name
 const birthDateStr = p.birth_date;
 if (p.sun_sign_id || birthDateStr) {
 let zid = p.sun_sign_id;
 if (!zid && birthDateStr) {
 zid = await zodiacService.getZodiacIdByDate(birthDateStr);
 }

 if (zid) {
 console.log("Loading zodiac for ID:", zid);
        const { data, error: zError } = await supabase
        .from(TABLES.ZODIAC_SIGNS)
        .select('*')
        .eq('id', zid)
        .maybeSingle();
 
 if (data) setZodiacSign(data);
 else if (zError) console.error("Lỗi fetch zodiac:", zError);
 }
 }

 // Load Pinnacles
 if (birthDateStr) {
 console.log("Calculating pinnacles for birthdate:", birthDateStr);
 const pData = await numerologyService.getPinnaclesForUser(user.id, birthDateStr);
 console.log("Pinnacles data result:", pData);
 setPinnacles(pData);
 }
 } catch (err) {
 console.error("Lỗi trong quá trình load profile:", err);
 } finally {
 setLoading(false);
 }
 }
 load();
 }, [navigate]);

 const handleLogout = async () => {
 await authService.logout();
 navigate(ROUTES.LOGIN);
 };

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[80vh]">
 <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
 </div>
 );
 }

 if (!profile) return null;

 const initials = (profile.nickname || profile.email || '?').slice(0, 2).toUpperCase();
 const birthDate = profile.birth_date
 ? new Date(profile.birth_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
 : null;

 return (
 <div className="min-h-screen py-16 px-4 relative z-10">
 <div className="max-w-5xl mx-auto space-y-6">

 {/* ── HERO CARD ─────────────────────────────────────── */}
 <motion.div
 initial={{ opacity: 0, y: 24 }}
 animate={{ opacity: 1, y: 0 }}
 className="relative bg-slate-900/80 border border-white/10 rounded-[2.5rem] overflow-hidden"
 >
 {/* Gradient nền trang trí */}
 <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

 <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8">
 {/* Avatar */}
 <div className="relative shrink-0">
 <div className="w-28 h-28 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-[0_0_30px_rgba(34,211,238,0.4)]">
 {profile.avatar_url
 ? <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
 : initials}
 </div>
 <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-slate-900">
 <div className="w-2.5 h-2.5 bg-white rounded-full" />
 </div>
 </div>

 {/* Info */}
 <div className="flex-1 text-center md:text-left">
 <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
 <h1 className="text-3xl font-black text-white">
 {profile.nickname || 'Người Dùng Góc Vũ Trụ'}
 </h1>
 <TierBadge tier={profile.tier} />
 </div>

 <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-400 mb-5">
 <span className="flex items-center gap-2 justify-center md:justify-start">
 <Mail className="w-4 h-4 text-cyan-400/60" /> {profile.email}
 </span>
 {birthDate && (
 <span className="flex items-center gap-2 justify-center md:justify-start">
 <Calendar className="w-4 h-4 text-purple-400/60" /> {birthDate}
 </span>
 )}
 {zodiacSign && (
 <span className="flex items-center gap-2 justify-center md:justify-start">
 <Star className="w-4 h-4 text-amber-400/60" /> {zodiacSign.name}
 </span>
 )}
 </div>
  <div className="flex items-center justify-center md:justify-start gap-3">
  <Link to={ROUTES.PROFILE_EDIT} className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-semibold text-white transition-all">
  <Edit3 className="w-4 h-4" /> Chỉnh sửa
  </Link>
 <button
 onClick={handleLogout}
 className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-full text-sm font-semibold text-red-300 transition-all"
 >
 <LogOut className="w-4 h-4" /> Đăng xuất
 </button>
 </div>
 </div>

 {/* Role badge */}
 {profile.role === 'ADMIN' && (
 <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-300 text-xs font-bold">
 <Shield className="w-3.5 h-3.5" /> ADMIN
 </div>
 )}
 </div>
 </motion.div>

 {/* ── BODY 2 CỘT ────────────────────────────────────── */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

 {/* CỘT TRÁI: Thần Số Học */}
 <motion.div
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.15 }}
 className="bg-slate-900/80 border border-white/8 rounded-[2rem] p-6 space-y-4"
 >
 <div className="flex items-center gap-3 mb-2">
 <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center">
 <Sparkles className="w-4 h-4 text-purple-400" />
 </div>
 <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Bản Đồ Thần Số Học</h2>
 </div>

 {(!profile.life_path_number && !profile.destiny_number) ? (
 <div className="text-center py-8 text-gray-600 text-sm">
 <Hash className="w-8 h-8 mx-auto mb-3 opacity-30" />
 <p>Chưa có dữ liệu. Cập nhật ngày sinh để tính toán.</p>
 </div>
 ) : (
 <div className="space-y-3">
 <NumerologyCard label="Số Chủ Đạo" value={profile.life_path_number} icon={Hash} color="bg-cyan-500/20" description="Con số định hướng cuộc đời" />
 <NumerologyCard label="Số Sứ Mệnh" value={profile.destiny_number} icon={Star} color="bg-amber-500/20" description="Mục tiêu linh hồn cần đạt được" />
 <NumerologyCard label="Số Linh Hồn" value={profile.soul_urge_number} icon={Heart} color="bg-rose-500/20" description="Khao khát sâu thẳm bên trong" />
 <NumerologyCard label="Số Nhân Cách" value={profile.personality_number} icon={Brain} color="bg-indigo-500/20" description="Hình ảnh bạn chiếu ra thế giới" />
 <NumerologyCard label="Số Cân Bằng" value={profile.balance_number} icon={Scale} color="bg-teal-500/20" description="Điểm tựa khi cuộc sống bão giông" />
 <NumerologyCard label="Số Trưởng Thành" value={profile.maturity_number} icon={TrendingUp} color="bg-emerald-500/20" description="Bản ngã đỉnh cao ở tuổi trưởng thành" />
 </div>
 )}
 </motion.div>

 {/* CỘT PHẢI */}
 <div className="space-y-5">
 {/* 4 Đỉnh Cao (Pinnacles) */}
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.18 }}
 className="bg-slate-900/80 border border-white/8 rounded-[2rem] p-6"
 >
 <div className="flex items-center justify-between mb-5">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
 <Zap className="w-4 h-4 text-indigo-400" />
 </div>
 <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">4 Đỉnh Cao</h2>
 </div>
 {pinnacles && (
 <Link 
 to={`${ROUTES.PINNACLE_ANALYSIS}?dob=${profile.birth_date}`}
 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
 >
 Xem chi tiết
 </Link>
 )}
 </div>

 {pinnacles ? (
 <div className="grid grid-cols-2 gap-4">
 {pinnacles.map((p, idx) => (
 <Link
 key={idx}
 to={ROUTES.PINNACLE_DETAIL(p.value)}
 className="bg-black/40 border border-white/5 p-4 rounded-2xl group hover:border-indigo-500/30 transition-all text-left"
 >
 <div className="flex justify-between items-start mb-2">
 <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">Đỉnh {idx + 1}</span>
 <span className="text-[10px] font-bold text-indigo-400 group-hover:scale-110 transition-transform">{p.age}t</span>
 </div>
 <div className="text-2xl font-black text-white group-hover:text-indigo-300 transition-colors">
 {p.value}
 </div>
 </Link>
 ))}
 </div>
 ) : (
 <div className="text-center py-6 text-gray-600 text-sm">
 <Zap className="w-8 h-8 mx-auto mb-3 opacity-30" />
 <p>Cập nhật ngày sinh để xem 4 đỉnh cao cuộc đời.</p>
 </div>
 )}
 </motion.div>

 {/* Cung Hoàng Đạo */}
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.22 }}
 className="bg-slate-900/80 border border-white/8 rounded-[2rem] p-6"
 >
 <div className="flex items-center gap-3 mb-5">
 <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
 <Sun className="w-4 h-4 text-amber-400" />
 </div>
 <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Cung Hoàng Đạo</h2>
 </div>
 {zodiacSign ? (
 <div className="flex flex-col gap-3">
 <Link to={ROUTES.ZODIAC_DETAIL(profile.sun_sign_id || zodiacSign.id)} className="flex items-center justify-between group bg-black/40 border border-white/5 p-5 rounded-[2rem] hover:border-amber-500/30 transition-all">
 <div className="flex-1">
 <div className="flex items-center gap-2 mb-1">
 <p className="text-2xl font-black text-white group-hover:text-amber-300 transition-colors">{zodiacSign.name}</p>
 <span className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest">{zodiacSign.english_name}</span>
 </div>
 <div className="flex items-center gap-3 mt-1">
 <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-200/70 uppercase">Mặt Trời</span>
 <span className="text-[10px] text-gray-500 font-medium italic">Nguyên tố: {zodiacSign.element}</span>
 </div>
 </div>
 <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/5 to-amber-500/20 border border-amber-500/20 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:scale-105 transition-all">
 {zodiacSign.image_url ? (
 <img src={zodiacSign.image_url} alt={zodiacSign.name} className="w-full h-full object-cover filter brightness-110" />
 ) : (
 <span className="text-3xl">⭐</span>
 )}
 </div>
 </Link>
 <Link 
 to={`${ROUTES.ZODIAC_ALL_MATCHES}?sign=${profile.sun_sign_id || zodiacSign.id}`} 
 className="flex justify-between items-center w-full px-5 py-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-2xl text-indigo-400 hover:text-indigo-300 font-bold tracking-widest text-xs uppercase transition-all group"
 >
 <span>Xem Bảng Xếp Hạng Mối Quan Hệ</span>
 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </Link>
 </div>
 ) : (
 <div className="text-center py-6 text-gray-600 text-sm">
 <Sun className="w-8 h-8 mx-auto mb-3 opacity-30" />
 <p>Cập nhật ngày sinh để xem cung chiêm tinh.</p>
 </div>
 )}
 </motion.div>

 {/* Thông tin cá nhân */}
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.25 }}
 className="bg-slate-900/80 border border-white/8 rounded-[2rem] p-6"
 >
 <div className="flex items-center gap-3 mb-5">
 <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center">
 <User className="w-4 h-4 text-cyan-400" />
 </div>
 <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Thông Tin Cá Nhân</h2>
 </div>
 <div className="space-y-3 text-sm">
 {[
 { label: 'Giới tính', value: profile.gender },
 { label: 'Số điện thoại', value: profile.phone },
 { label: 'Họ và tên đầy đủ', value: profile.birth_name },
 { label: 'Ngày sinh', value: birthDate },
 ].map(({ label, value }) => value ? (
 <div key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
 <span className="text-gray-500">{label}</span>
 <span className="text-white font-medium">{value}</span>
 </div>
 ) : null)}
 </div>
 </motion.div>

 {/* Bảo mật */}
 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 transition={{ delay: 0.3 }}
 className="bg-slate-900/80 border border-white/8 rounded-[2rem] p-6"
 >
 <div className="flex items-center gap-3 mb-4">
 <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center">
 <Lock className="w-4 h-4 text-rose-400" />
 </div>
 <h2 className="text-sm font-bold uppercase tracking-widest text-white/60">Bảo Mật</h2>
 </div>
 <Link 
 to={ROUTES.CHANGE_PASSWORD}
 className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-white/5 transition-colors text-sm text-gray-400 hover:text-white group"
 >
 <span>Đổi mật khẩu</span>
 <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </Link>
 </motion.div>
 </div>
 </div>
 </div>
 </div>
 );
}
