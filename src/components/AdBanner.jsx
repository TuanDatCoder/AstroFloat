import React from 'react';
import { motion } from 'framer-motion';

const AdBanner = ({ className = "", slot = "horizontal" }) => {
 // Styles based on slot type
 const styles = {
 horizontal: "w-full max-w-5xl h-[90px] md:h-[120px]",
 vertical: "w-[160px] h-[600px]",
 rectangle: "w-full max-w-[336px] h-[280px]",
 };

 return (
 <div className={`flex flex-col items-center justify-center my-12 px-4 ${className}`}>
 <div 
 className={`${styles[slot] || styles.horizontal} relative rounded-2xl border border-white/5 bg-slate-900/30 flex flex-col items-center justify-center overflow-hidden group`}
 >
 {/* Decorative background for the placeholder */}
 <div className="absolute inset-0 z-0 opacity-10">
 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
 </div>
 
 {/* Content */}
 <div className="relative z-10 flex flex-col items-center gap-2">
 <span className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">
 Quảng cáo / Advertisement
 </span>
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
 <div className="w-4 h-4 rounded-full bg-indigo-500/20 animate-pulse"></div>
 </div>
 <p className="text-white/30 font-light text-sm italic">
 Google Ads Placement
 </p>
 </div>
 </div>

 {/* Hover highlight */}
 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
 </div>
 </div>
 );
};

export default AdBanner;
