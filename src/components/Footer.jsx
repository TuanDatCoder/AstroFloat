import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Globe, Send, Mail, MapPin, ChevronRight, ArrowUp } from 'lucide-react';
import { ROUTES } from '../constants';

export default function Footer() {
 const scrollToTop = () => {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 return (
 <footer className="relative z-20 w-full border-t border-white/5 bg-[#0B0F19]/80 pt-20 pb-10 px-6 lg:px-12 mt-20 overflow-hidden">
 {/* Decorative Glows */}
 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent shadow-[0_0_20px_rgba(34,211,238,0.3)]" />
 <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
 <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none" />

 <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16 relative z-10">
 
 {/* Column 1: Brand & Social */}
 <div className="flex flex-col items-start space-y-6">
 <div className="flex items-center gap-3 text-2xl font-black tracking-tighter">
 <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.8 }}>
 <Sparkles className="w-7 h-7 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
 </motion.div>
 <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-300 to-emerald-400">
 AstroFloat
 </span>
 </div>
 
 <p className="text-gray-400 text-sm font-light leading-relaxed max-w-xs text-left">
 Khám phá hành trình tâm linh qua nhịp đập của những con số và sự sắp đặt của tinh tú. Cùng bạn kết nối với bản ngã thực sự.
 </p>

 <div className="flex items-center gap-4">
 {[
 { Icon: Globe, color: 'hover:text-blue-400', glow: 'hover:border-blue-400/50' },
 { Icon: Mail, color: 'hover:text-pink-400', glow: 'hover:border-pink-400/50' },
 { Icon: Send, color: 'hover:text-red-400', glow: 'hover:border-red-400/50' }
 ].map(({ Icon, color, glow }, i) => (
 <motion.a
 key={i}
 href="#"
 whileHover={{ y: -5, scale: 1.1 }}
 className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 transition-all ${color} ${glow} shadow-lg`}
 >
 <Icon className="w-5 h-5" />
 </motion.a>
 ))}
 </div>
 </div>

 {/* Column 2: Quick Links */}
 <div className="flex flex-col items-start">
 <h3 className="text-white font-black text-xs tracking-[0.3em] uppercase mb-8 opacity-70">Công Cụ</h3>
 <ul className="space-y-4 w-full flex flex-col items-start">
 {[
 { to: ROUTES.DISCOVER, label: 'Giải Mã Vận Mệnh' },
 { to: ROUTES.ZODIAC, label: '12 Chòm Sao' },
 { to: ROUTES.ZODIAC_MATCH, label: 'Tương Hợp Cung' },
 { to: ROUTES.NUMEROLOGY, label: 'Thần Số Học' },
 { to: ROUTES.NAME_NUMEROLOGY, label: 'Thần Số Tên' }
 ].map((link) => (
 <li key={link.to}>
 <Link to={link.to} className="group flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-sm font-medium">
 <ChevronRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-cyan-400" />
 {link.label}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 {/* Column 3: Contact */}
 <div className="flex flex-col items-start text-left">
 <h3 className="text-white font-black text-xs tracking-[0.3em] uppercase mb-8 opacity-70">Liên Hệ</h3>
 <div className="space-y-6">
 <div className="flex items-center gap-4 text-sm text-gray-400">
 <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group shrink-0">
 <Mail className="w-4 h-4" />
 </div>
 <span className="hover:text-cyan-300 transition-colors cursor-pointer">contact@astrofloat.app</span>
 </div>
 <div className="flex items-center gap-4 text-sm text-gray-400">
 <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
 <MapPin className="w-4 h-4" />
 </div>
 <span>Ho Chi Minh City, Vietnam</span>
 </div>
 </div>
 </div>

 {/* Column 4: Newsletter */}
 <div className="flex flex-col items-start">
 <h3 className="text-white font-black text-xs tracking-[0.3em] uppercase mb-8 opacity-70">Bản Tin</h3>
 <p className="text-gray-400 text-sm font-light mb-6 text-left">
 Nhận thông điệp vũ trụ và ưu đãi VIP mỗi tuần.
 </p>
 <div className="relative w-full max-w-sm">
 <input 
 type="email" 
 placeholder="Email của bạn..."
 className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm text-white placeholder:text-gray-600 focus:border-cyan-500/50 outline-none transition-all shadow-inner"
 />
 <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center text-white hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] active:scale-95 transition-all">
 <Send className="w-4 h-4" />
 </button>
 </div>
 </div>

 </div>

 {/* Bottom Row */}
 <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] font-bold tracking-widest uppercase">
 <p className="text-gray-500 text-center md:text-left">
 &copy; {new Date().getFullYear()} <span className="text-gray-400">AstroFloat</span>. Crafted with <Sparkles className="w-3 h-3 inline text-purple-400 mx-1" /> by TuanDatCoder
 </p>
 <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-gray-500">
 <a href="#" className="hover:text-cyan-400 transition-colors">Điều khoản</a>
 <a href="#" className="hover:text-cyan-400 transition-colors">Bảo mật</a>
 <button 
 onClick={scrollToTop}
 className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors group"
 >
 Lên đầu trang <ArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
 </button>
 </div>
 </div>
 </footer>
 );
}
