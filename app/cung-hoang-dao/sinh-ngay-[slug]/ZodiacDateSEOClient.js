'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Star, Sparkles, ArrowRight, Moon } from 'lucide-react';
import { zodiacService } from '@/services/zodiacService';
import { zodiacDetailService } from '@/services/zodiacDetailService';

// Fallback map (copy từ bản cũ)
export const ZODIAC_MAP = {
  'bach-duong':  { name: 'Bạch Dương', english: 'Aries',       range: '21/3 – 19/4',   element: 'Lửa',  planet: 'Sao Hỏa',  emoji: '♈' },
  'kim-nguu':    { name: 'Kim Ngưu',   english: 'Taurus',      range: '20/4 – 20/5',   element: 'Đất',  planet: 'Sao Kim',  emoji: '♉' },
  'song-tu':     { name: 'Song Tử',    english: 'Gemini',      range: '21/5 – 20/6',   element: 'Khí',  planet: 'Sao Thủy', emoji: '♊' },
  'cu-giai':     { name: 'Cự Giải',    english: 'Cancer',      range: '21/6 – 22/7',   element: 'Nước', planet: 'Mặt Trăng', emoji: '♋' },
  'su-tu':       { name: 'Sư Tử',      english: 'Leo',         range: '23/7 – 22/8',   element: 'Lửa',  planet: 'Mặt Trời', emoji: '♌' },
  'xu-nu':       { name: 'Xử Nữ',      english: 'Virgo',       range: '23/8 – 22/9',   element: 'Đất',  planet: 'Sao Thủy', emoji: '♍' },
  'thien-binh':  { name: 'Thiên Bình', english: 'Libra',       range: '23/9 – 22/10',  element: 'Khí',  planet: 'Sao Kim',  emoji: '♎' },
  'thien-yet':   { name: 'Thiên Yết',  english: 'Scorpio',     range: '23/10 – 21/11', element: 'Nước', planet: 'Sao Diêm Vương', emoji: '♏' },
  'nhan-ma':     { name: 'Nhân Mã',    english: 'Sagittarius', range: '22/11 – 21/12', element: 'Lửa',  planet: 'Sao Mộc',  emoji: '♐' },
  'ma-ket':      { name: 'Ma Kết',     english: 'Capricorn',   range: '22/12 – 19/1',  element: 'Đất',  planet: 'Sao Thổ',  emoji: '♑' },
  'bao-binh':    { name: 'Bảo Bình',   english: 'Aquarius',    range: '20/1 – 18/2',   element: 'Khí',  planet: 'Sao Thiên Vương', emoji: '♒' },
  'song-ngu':    { name: 'Song Ngư',   english: 'Pisces',      range: '19/2 – 20/3',   element: 'Nước', planet: 'Sao Hải Vương', emoji: '♓' },
};

const MONTH_NAMES = ['', 'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
  'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];

export function calculateZodiacByDate(day, month) {
    if (month === 3 && day >= 21) return 'bach-duong';
    if (month === 4 && day <= 19) return 'bach-duong';
    if (month === 4 && day >= 20) return 'kim-nguu';
    if (month === 5 && day <= 20) return 'kim-nguu';
    if (month === 5 && day >= 21) return 'song-tu';
    if (month === 6 && day <= 20) return 'song-tu';
    if (month === 6 && day >= 21) return 'cu-giai';
    if (month === 7 && day <= 22) return 'cu-giai';
    if (month === 7 && day >= 23) return 'su-tu';
    if (month === 8 && day <= 22) return 'su-tu';
    if (month === 8 && day >= 23) return 'xu-nu';
    if (month === 9 && day <= 22) return 'xu-nu';
    if (month === 9 && day >= 23) return 'thien-binh';
    if (month === 10 && day <= 22) return 'thien-binh';
    if (month === 10 && day >= 23) return 'thien-yet';
    if (month === 11 && day <= 21) return 'thien-yet';
    if (month === 11 && day >= 22) return 'nhan-ma';
    if (month === 12 && day <= 21) return 'nhan-ma';
    if (month === 12 && day >= 22) return 'ma-ket';
    if (month === 1 && day <= 19) return 'ma-ket';
    if (month === 1 && day >= 20) return 'bao-binh';
    if (month === 2 && day <= 18) return 'bao-binh';
    if (month === 2 && day >= 19) return 'song-ngu';
    if (month === 3 && day <= 20) return 'song-ngu';
    return null;
}

export default function ZodiacDateSEOClient({ slug }) {
  const [zodiacFromDB, setZodiacFromDB] = useState(null);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parse ngày tháng từ slug
  const match = slug.match(/^(\d+)-thang-(\d+)/);
  const day = match ? Number(match[1]) : 0;
  const month = match ? Number(match[2]) : 0;

  const isValidDate = day >= 1 && day <= 31 && month >= 1 && month <= 12;
  const zodiacSlug = isValidDate ? calculateZodiacByDate(day, month) : null;
  const zodiacBasic = zodiacSlug ? ZODIAC_MAP[zodiacSlug] : null;

  useEffect(() => {
    if (!zodiacSlug) { setLoading(false); return; }
    const fetchData = async () => {
      try {
        setLoading(true);
        const allZodiacs = await zodiacService.getAllZodiacs();
        const matched = allZodiacs.find(z =>
          z.name?.toLowerCase().includes(zodiacBasic.name.toLowerCase()) ||
          z.english_name?.toLowerCase() === zodiacBasic.english.toLowerCase()
        );
        if (matched) {
          setZodiacFromDB(matched);
          const dets = await zodiacDetailService.getDetailsByZodiacId(matched.id);
          setDetails(dets || []);
        }
      } catch (e) {
        console.error('Lỗi lấy dữ liệu cung:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [zodiacSlug]);

  const otherDaysInMonth = Array.from({ length: 28 }, (_, i) => i + 1)
    .filter(d => d !== day)
    .slice(0, 14);

  if (!isValidDate || !zodiacBasic) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-400 mb-4">Ngày không hợp lệ</p>
          <Link href="/cung-hoang-dao" className="text-cyan-400 hover:underline">← Xem tất cả cung hoàng đạo</Link>
        </div>
      </div>
    );
  }

  const elementColor = {
    'Lửa': 'from-orange-600/40 to-red-700/40 border-orange-500/30',
    'Đất': 'from-emerald-700/40 to-green-800/40 border-emerald-500/30',
    'Khí': 'from-cyan-600/40 to-blue-700/40 border-cyan-500/30',
    'Nước': 'from-blue-700/40 to-indigo-800/40 border-blue-500/30',
  }[zodiacBasic.element] || 'from-purple-700/40 to-indigo-800/40 border-purple-500/30';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white pt-24 pb-20 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-cyan-400 transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link href="/cung-hoang-dao" className="hover:text-cyan-400 transition-colors">Cung hoàng đạo</Link>
          <span>/</span>
          <span className="text-gray-300">Ngày {day}/{month} là cung gì?</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`bg-gradient-to-br ${elementColor} rounded-[3rem] p-8 md:p-14 mb-12 border relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[200px] font-black opacity-5 leading-none">{zodiacBasic.emoji}</span>
          </div>
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-sm font-semibold mb-6">
              <Calendar className="w-4 h-4" />
              Ngày {day} {MONTH_NAMES[month]}
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">Ngày {day}/{month} là cung gì?</h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              Người sinh ngày {day}/{month} thuộc cung <span className="text-cyan-300 font-bold">{zodiacBasic.name}</span> <span className="text-white/50">({zodiacBasic.english})</span>
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold">⏰ {zodiacBasic.range}</span>
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold">🌊 Nguyên tố {zodiacBasic.element}</span>
              <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold">🪐 {zodiacBasic.planet}</span>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Star className="w-6 h-6 text-cyan-400" /> Người sinh ngày {day}/{month} thuộc cung {zodiacBasic.name} – Bí mật từ vì sao</h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-6">{zodiacFromDB?.description}</p>
          <p className="text-gray-300 text-lg leading-relaxed">
            Sinh ngày {day} tháng {month} thuộc cung <strong>{zodiacBasic.name}</strong>. Cung này mang nguyên tố {zodiacBasic.element} và được bảo hộ bởi {zodiacBasic.planet}.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : details.length > 0 ? (
          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-bold flex items-center gap-3"><Sparkles className="w-6 h-6 text-amber-400" /> Giải mã chi tiết cung {zodiacBasic.name}</h2>
            {details.slice(0, 4).map((detail, i) => (
              <motion.div key={detail.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }} className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
                <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold block mb-2">{detail.topic}</span>
                <h3 className="text-lg font-bold text-white mb-3">{detail.title}</h3>
                <p className="text-gray-300 leading-relaxed">{detail.content}</p>
              </motion.div>
            ))}
          </div>
        ) : null}

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3"><Moon className="w-5 h-5 text-purple-400" /> Xem các ngày khác trong {MONTH_NAMES[month]}</h2>
          <div className="flex flex-wrap gap-3">
            {otherDaysInMonth.map(d => (
              <Link key={d} href={`/cung-hoang-dao/sinh-ngay-${d}-thang-${month}-la-cung-gi`} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all">
                {d}/{month}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
