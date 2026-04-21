import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AdBanner from './AdBanner';

// Tạo dữ liệu sao 1 lần duy nhất ngoài component — không tính lại mỗi lần render
const STAR_DATA = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  width: Math.random() * 2 + 0.5,
  left: Math.random() * 100,
  top: Math.random() * 100,
  duration: Math.random() * 10 + 10,
  delay: Math.random() * -20,
  moveX: (Math.random() - 0.5) * 30,
}));

export default function Layout() {
 // useMemo đảm bảo DOM nodes chỉ tính 1 lần, không bao giờ gây re-render
 const stars = useMemo(() =>
 STAR_DATA.map((s) => (
 <div
 key={s.id}
 className="star-particle"
 style={{
 width: s.width,
 height: s.width,
 left: `${s.left}%`,
 top: `${s.top}%`,
 '--dur': `${s.duration}s`,
 '--delay': `${s.delay}s`,
 '--move-x': `${s.moveX}px`,
 }}
 />
 )),
 []);

 return (
 <div className="min-h-screen bg-[#0B0F19] text-white overflow-x-hidden relative font-sans flex flex-col">
 
 {/* Hiệu ứng các vì sao bay lơ lửng background - Pure CSS, không block JS */}
 <div className="fixed inset-0 z-0 pointer-events-none">
 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0B0F19] to-[#0B0F19]"></div>
 {stars}
 </div>

 {/* Header tách riêng */}
 <Header />

 {/* Vùng chứa nội dung trang con (Outlet) */}
 <main className="relative z-10 flex-grow">
 <Outlet />
 </main>

 {/* Global Ad Placement before Footer */}
 <AdBanner className="mt-20 -mb-10" />

 {/* Footer tách riêng */}
 <Footer />
 
 </div>
 );
}
