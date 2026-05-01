 import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Star, ArrowLeft, Database, 
  Heart, ALargeSmall, Mountain, Sparkles, LogOut, ShieldCheck 
} from 'lucide-react';
import { ROUTES } from '../../constants';

// Helper icon for BookOpen
const BookOpenIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);

const navGroups = [
  {
    label: 'Hệ thống',
    items: [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Quản lý Users', path: '/admin/users', icon: Users },
    ]
  },
  {
    label: 'Cung Hoàng Đạo',
    items: [
      { name: 'Zodiac Signs', path: '/admin/zodiac', icon: Star },
      { name: 'Zodiac Matches', path: '/admin/zodiac-matches', icon: Heart },
    ]
  },
  {
    label: 'Thần Số Học',
    items: [
      { name: 'Thần số học Số', path: '/admin/numerology', icon: Database },
      { name: 'Thần số học Tên', path: '/admin/name-numerology', icon: ALargeSmall },
    ]
  },
  {
    label: '4 Đỉnh Cao',
    items: [
      { name: 'Đỉnh Cao (Gốc)', path: '/admin/pinnacles', icon: Mountain },
      { name: 'Bài viết Chi tiết', path: '/admin/pinnacle-details', icon: BookOpenIcon },
      { name: 'User Pinnacles', path: '/admin/user-pinnacles', icon: Sparkles },
    ]
  }
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 bg-[#0F172A] border-r border-white/5 
        flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="h-20 shrink-0 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-black text-white tracking-tight">
              Astro<span className="text-indigo-400">Admin</span>
            </span>
          </div>
        </div>

        {/* Navigation Section - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500/70">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => { if(window.innerWidth < 1024) setIsOpen(false); }}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
                      ${isActive 
                        ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10' 
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent'}
                    `}
                    end={item.path === '/admin'}
                  >
                    <item.icon className="w-4.5 h-4.5 transition-transform group-hover:scale-110" />
                    <span className="text-sm font-semibold tracking-wide">{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section - FIXED AT BOTTOM */}
        <div className="p-4 border-t border-white/5 bg-[#0F172A]">
          <NavLink 
            to={ROUTES.HOME}
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all duration-200 group border border-transparent hover:border-emerald-500/10"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-bold text-[11px] uppercase tracking-widest">Về trang chủ</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}
