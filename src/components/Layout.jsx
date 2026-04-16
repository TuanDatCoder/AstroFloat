import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-hidden relative font-sans flex flex-col">
      
      {/* Hiệu ứng các vì sao bay lơ lửng background (Anti-gravity) - Dùng chung */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#0B0F19] to-[#0B0F19]"></div>
        
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-cyan-100 rounded-full opacity-30"
            style={{ 
              width: Math.random() * 3 + 1, 
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
            animate={{ 
              y: [0, -120, 0], 
              x: [0, (Math.random() - 0.5) * 50, 0],
              opacity: [0.1, 0.7, 0.1] 
            }}
            transition={{ 
              duration: Math.random() * 12 + 8, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Header tách riêng */}
      <Header />

      {/* Vùng chứa nội dung trang con (Outlet) */}
      <main className="relative z-10 flex-grow">
        <Outlet />
      </main>

      {/* Footer tách riêng */}
      <Footer />
      
    </div>
  );
}
