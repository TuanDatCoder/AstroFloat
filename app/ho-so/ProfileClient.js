'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  User, Mail, Calendar, Star, LogOut, Edit3, Shield, Sparkles,
  Hash, Heart, Sun, Zap, Fingerprint, Crown, Compass, Waves,
  ArrowRight, ChevronRight, Scale, TrendingUp, Lock, Palette
} from 'lucide-react';
import { supabase } from '@/services/supabase';
import { authService } from '@/services/authService';
import { numerologyService } from '@/services/numerologyService';
import { zodiacService } from '@/services/zodiacService';
import { ROUTES, TABLES } from '@/constants';

const METRICS = [
  { key: 'life_path_number', label: 'Số Chủ Đạo', sub: 'Life Path', icon: Compass, from: 'from-cyan-500', to: 'to-blue-600', glow: 'rgba(34,211,238,0.3)', desc: 'Định hướng cốt lõi của kiếp sống' },
  { key: 'destiny_number', label: 'Số Sứ Mệnh', sub: 'Expression', icon: Star, from: 'from-amber-400', to: 'to-orange-500', glow: 'rgba(251,191,36,0.3)', desc: 'Mục tiêu linh hồn tối thượng' },
  { key: 'soul_urge_number', label: 'Số Linh Hồn', sub: 'Soul Urge', icon: Heart, from: 'from-rose-500', to: 'to-pink-600', glow: 'rgba(244,63,94,0.3)', desc: 'Khao khát sâu thẳm tâm thức' },
  { key: 'personality_number', label: 'Số Nhân Cách', sub: 'Personality', icon: User, from: 'from-violet-500', to: 'to-purple-600', glow: 'rgba(139,92,246,0.3)', desc: 'Vẻ ngoài trước thế giới' },
  { key: 'balance_number', label: 'Số Cân Bằng', sub: 'Balance', icon: Scale, from: 'from-teal-500', to: 'to-emerald-600', glow: 'rgba(20,184,166,0.3)', desc: 'Điểm tựa khi cuộc sống bão giông' },
  { key: 'maturity_number', label: 'Số Trưởng Thành', sub: 'Maturity', icon: TrendingUp, from: 'from-emerald-500', to: 'to-green-600', glow: 'rgba(16,185,129,0.3)', desc: 'Bản ngã đỉnh cao tuổi xế chiều' },
];

export default function ProfileClient() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [zodiacSign, setZodiacSign] = useState(null);
  const [pinnacles, setPinnacles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const user = await authService.getCurrentUser();
        if (!user) { router.push(ROUTES.LOGIN); return; }
        const p = await authService.getUserProfile(user.id);
        if (p) {
          setProfile(p);
          const zid = p.sun_sign_id || (p.birth_date ? await zodiacService.getZodiacIdByDate(p.birth_date) : null);
          if (zid) {
            const { data } = await supabase.from(TABLES.ZODIAC_SIGNS).select('*').eq('id', zid).maybeSingle();
            if (data) setZodiacSign(data);
          }
          if (p.birth_date) setPinnacles(await numerologyService.getPinnaclesForUser(user.id, p.birth_date));
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [router]);

  const handleLogout = async () => { await authService.logout(); router.push(ROUTES.LOGIN); };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-cyan-500/10 border-t-cyan-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-purple-500/10 border-b-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">Đang kết nối vũ trụ...</p>
    </div>
  );

  if (!profile) return null;

  const initials = profile.nickname?.slice(0, 2).toUpperCase() || 'U';
  const birthDateFormatted = profile.birth_date
    ? new Date(profile.birth_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : null;

  return (
    <div className="min-h-screen pt-28 pb-32 px-4 relative z-10">
      {/* Static background orbs */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(34,211,238,0.04)_0%,transparent_70%)] transform-gpu" />
        <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(168,85,247,0.04)_0%,transparent_70%)] transform-gpu" />
      </div>

      <div className="max-w-5xl mx-auto space-y-12">

        {/* ── HERO CARD ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[3rem] bg-slate-900 border border-white/8 shadow-2xl"
        >
          {/* Decorative top gradient band */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500" />

          {/* Big ghost fingerprint */}
          <div className="absolute -bottom-8 -right-8 opacity-[0.02] select-none pointer-events-none">
            <Fingerprint className="w-72 h-72 text-white" />
          </div>

          <div className="relative z-10 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-10">

              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-[2px] shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                  <div className="w-full h-full rounded-[1.9rem] bg-slate-950 flex items-center justify-center overflow-hidden relative">
                    {profile.avatar_url
                      ? <Image src={profile.avatar_url} fill sizes="128px" className="object-cover" alt="Avatar" />
                      : <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-purple-300">{initials}</span>
                    }
                  </div>
                </div>
                {/* Badge */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-slate-900 border border-purple-500/30 rounded-full px-3 py-1 shadow-xl whitespace-nowrap">
                  <Shield className="w-3 h-3 text-purple-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-purple-300">{profile.tier || 'Free'}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3 leading-none"
                >
                  {profile.nickname || 'Khách bộ hành'}
                </motion.h1>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-center md:items-start text-sm text-gray-500 font-medium mb-8 mt-4">
                  <span className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-cyan-500/50" />
                    {profile.email}
                  </span>
                  {profile.birth_date && (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-purple-500/50" />
                      {birthDateFormatted}
                    </span>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link
                    href="/ho-so/chinh-sua"
                    className="group relative overflow-hidden inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black text-white uppercase tracking-[0.15em] hover:bg-white/10 hover:border-white/20 transition-all shadow-lg"
                  >
                    <Edit3 className="w-4 h-4" />
                    Cập nhật hồ sơ
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-red-500/5 border border-red-500/10 text-[11px] font-black text-red-400 uppercase tracking-[0.15em] hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── NUMEROLOGY MAP ────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Bản Đồ Năng Lượng</span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/8 to-transparent" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {METRICS.map((m, i) => {
              const val = profile[m.key];
              if (!val) return null;
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.3 }}
                  className="group relative overflow-hidden bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 flex flex-col hover:border-white/15 hover:-translate-y-1 transition-all duration-500 shadow-xl cursor-default"
                >
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl" style={{ background: `radial-gradient(circle, ${m.glow} 0%, transparent 70%)` }} />
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${m.from} ${m.to} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className={`text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br ${m.from} ${m.to} leading-none`}>
                      {val}
                    </div>
                  </div>

                  <p className="text-white font-black text-xl mb-1">{m.label}</p>
                  <p className="text-gray-600 text-[10px] font-medium uppercase tracking-widest mb-6">{m.sub}</p>
                  <div className="mt-auto pt-4 border-t border-white/5">
                    <p className="text-gray-600 text-[11px] font-medium leading-relaxed group-hover:text-gray-400 transition-colors">{m.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── BOTTOM ROW: Zodiac + Pinnacles ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Zodiac Card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl">
            <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <Sun className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Cung Hoàng Đạo</span>
            </div>
            {zodiacSign ? (
              <>
                <Link href={ROUTES.ZODIAC_DETAIL(zodiacSign.id)} className="group block mb-10">
                  <div className="flex flex-col items-center gap-10">
                    {/* Zodiac Image Section */}
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-amber-500/20 blur-[60px] rounded-full group-hover:bg-amber-500/30 transition-all duration-700" />
                      <div className="relative w-44 h-44 rounded-[3rem] overflow-hidden border border-white/10 bg-slate-950 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                        {zodiacSign.image_url && (
                          <Image src={zodiacSign.image_url} fill sizes="176px" className="object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt={zodiacSign.name} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Zodiac Info Section */}
                    <div className="flex-1 w-full text-center">
                      <div className="flex flex-col items-center gap-3 mb-4">
                        <h3 className="text-5xl md:text-6xl font-black text-white group-hover:text-amber-400 transition-colors duration-300 tracking-tighter">{zodiacSign.name}</h3>
                        <span className="text-sm font-black text-amber-500/40 uppercase tracking-[0.3em]">{zodiacSign.english_name}</span>
                      </div>
                      <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
                        {zodiacSign.description}
                      </p>

                      {/* Attributes Grid - Centered */}
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {[
                          { label: 'Nguyên tố', value: zodiacSign.element, icon: Waves, color: 'text-blue-400' },
                          { label: 'Hành tinh', value: zodiacSign.ruling_planet, icon: Sun, color: 'text-amber-400' },
                          { label: 'Phẩm chất', value: zodiacSign.modality, icon: Sparkles, color: 'text-purple-400' },
                          { label: 'Màu sắc', value: zodiacSign.lucky_colors, icon: Palette, color: 'text-rose-400' },
                        ].map((attr, idx) => (
                          <div key={idx} className="bg-white/[0.04] border border-white/5 p-4 rounded-2xl flex flex-col items-center hover:bg-white/[0.06] hover:border-white/15 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <attr.icon className={`w-3.5 h-3.5 ${attr.color}`} />
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{attr.label}</span>
                            </div>
                            <p className="text-white text-sm font-bold">{attr.value || '—'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link 
                  href={`${ROUTES.ZODIAC_ALL_MATCHES}?sign=${zodiacSign.id}`}
                  className="flex justify-between items-center w-full px-8 py-5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/30 rounded-3xl text-indigo-300 hover:text-white font-black tracking-[0.2em] text-[11px] uppercase transition-all group shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="flex items-center gap-3 relative z-10">
                    <Zap className="w-4 h-4 fill-indigo-400 animate-pulse" />
                    <span>Xem Bảng Xếp Hạng Mối Quan Hệ</span>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
                </Link>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Sun className="w-10 h-10 text-gray-700 mb-4" />
                <p className="text-gray-600 text-sm font-medium italic">Cập nhật ngày sinh để khám phá cung mệnh.</p>
                <Link href="/ho-so/chinh-sua" className="mt-4 text-[10px] font-black text-amber-500/50 uppercase tracking-widest hover:text-amber-400 transition-colors">Cập nhật ngay →</Link>
              </div>
            )}
          </motion.div>

          {/* Pinnacles Card */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden shadow-xl">
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl" />
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                  <Crown className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">4 Đỉnh Cao</span>
              </div>
              <Link href={`${ROUTES.PINNACLE_ANALYSIS}?dob=${profile.birth_date || ''}`} className="text-[9px] font-black text-indigo-400/50 uppercase tracking-widest hover:text-indigo-300 transition-colors flex items-center gap-1">Xem chi tiết <ChevronRight className="w-3 h-3" /></Link>
            </div>
            {pinnacles ? (
              <div className="space-y-4">
                {pinnacles.map((p, i) => {
                  const gradients = ['from-cyan-500 to-blue-600', 'from-violet-500 to-purple-600', 'from-rose-500 to-pink-600', 'from-amber-400 to-orange-500'];
                  return (
                    <div key={i} className="group flex items-center gap-5 bg-white/[0.02] border border-white/5 p-5 rounded-3xl hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform duration-500`}>{p.value}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Đỉnh cao {i + 1}</span>
                          <span className="text-[9px] font-bold text-gray-600">Sau {p.age} tuổi</span>
                        </div>
                        <div className="mt-1.5 h-1 rounded-full bg-white/5 overflow-hidden">
                          <div className={`h-full rounded-full bg-gradient-to-r ${gradients[i]} opacity-60`} style={{ width: `${Math.min((p.value / 9) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Crown className="w-10 h-10 text-gray-700 mb-4" />
                <p className="text-gray-600 text-sm font-medium italic">Cập nhật ngày sinh để xem 4 đỉnh cao.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── ADDITIONAL INFO SECTIONS ────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                  <User className="w-5 h-5 text-cyan-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Thông Tin Cá Nhân</span>
             </div>
             <div className="space-y-4">
                {[
                  { label: 'Giới tính', value: profile.gender },
                  { label: 'Số điện thoại', value: profile.phone },
                  { label: 'Họ và tên khai sinh', value: profile.birth_name },
                  { label: 'Ngày sinh nhật', value: birthDateFormatted },
                ].map((item, idx) => item.value ? (
                  <div key={idx} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                    <span className="text-gray-500 text-xs font-medium">{item.label}</span>
                    <span className="text-white text-sm font-bold">{item.value}</span>
                  </div>
                ) : null)}
             </div>
          </motion.div>

          {/* Security & Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <Lock className="w-5 h-5 text-rose-400" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">Bảo Mật & Thiết Lập</span>
             </div>
             <div className="space-y-4">
                <Link href="/doi-mat-khau" className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all group">
                   <div className="flex items-center gap-3">
                      <Fingerprint className="w-5 h-5 text-gray-600 group-hover:text-rose-400 transition-colors" />
                      <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">Đổi mật khẩu</span>
                   </div>
                   <ChevronRight className="w-4 h-4 text-gray-700 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-gray-600 leading-relaxed italic">
                   "Dữ liệu tâm linh của bạn được mã hóa và bảo mật tuyệt đối tại Góc Vũ Trụ."
                </div>
             </div>
          </motion.div>
        </div>

        {/* Footer Decoration */}
        <div className="flex items-center justify-center gap-4 pt-12 opacity-20">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-white/20" />
          <Waves className="w-5 h-5 text-cyan-400" />
          <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.5em]">Tâm Thức Đã Được Khai Mở</span>
          <Waves className="w-5 h-5 text-purple-400" />
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-white/20" />
        </div>
      </div>
    </div>
  );
}

