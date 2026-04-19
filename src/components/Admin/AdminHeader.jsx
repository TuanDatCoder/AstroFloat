import React, { useState, useEffect } from 'react';
import { LogOut, Menu, UserCircle, Sparkles, Bell, Shield, Home } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../services/supabase';
import { authService } from '../../services/authService';

const breadcrumbMap = {
  '/admin': 'Dashboard',
  '/admin/users': 'Thành viên',
  '/admin/zodiac': 'Zodiac Signs',
  '/admin/zodiac/new': 'Thêm Cung Mới',
  '/admin/zodiac-matches': 'Zodiac Matches',
  '/admin/zodiac-matches/new': 'Thêm Cặp Tương Hợp',
  '/admin/numerology': 'Thần Số Học',
  '/admin/numerology/new': 'Thêm Số Mới',
  '/admin/name-numerology': 'Thần Số Học Tên',
  '/admin/name-numerology/new': 'Thêm Sứ Mệnh Mới',
  '/admin/name-advanced-metrics': 'Chỉ Số Mở Rộng',
  '/admin/pinnacles': '4 Đỉnh Cao',
  '/admin/pinnacles/new': 'Thêm Đỉnh Cao Mới',
};

export default function AdminHeader({ toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const userProfile = await authService.getUserProfile(session.user.id);
          setProfile(userProfile);
        } catch (e) {
          console.error("Failed to load admin profile", e);
        }
      }
    });
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  // Build breadcrumb
  const path = location.pathname;
  const isEditPage = path.includes('/edit/');
  const isDetailPage = path.includes('/details');
  let breadcrumb = breadcrumbMap[path] || '';
  if (isEditPage) breadcrumb = 'Chỉnh Sửa';
  if (isDetailPage) breadcrumb = 'Quản Lý Chi Tiết';

  return (
    <header className="h-16 sticky top-0 z-40">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl border-b border-white/5" />
      {/* Glowing accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      <div className="relative h-full flex items-center justify-between px-4 lg:px-6">
        {/* LEFT: Hamburger + Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all active:scale-95"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="hidden sm:flex items-center gap-2.5 text-[11px] tracking-widest">
            {/* Brand */}
            <div className="flex items-center gap-1.5 text-gray-500">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-black uppercase text-indigo-400">AstroAdmin</span>
            </div>

            {/* Separator + Breadcrumb */}
            {breadcrumb && (
              <>
                <span className="text-white/10 font-black">/</span>
                <span className="font-black uppercase text-white/70">{breadcrumb}</span>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Actions + Profile */}
        <div className="flex items-center gap-2">
          {/* Visit Site */}
          <Link
            to="/"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Xem trang</span>
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10 hidden sm:block" />

          {/* Profile Chip */}
          <div className="flex items-center gap-2.5 pl-2">
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-white leading-none">{profile?.nickname || 'Administrator'}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <Shield className="w-2.5 h-2.5 text-indigo-400" />
                <p className="text-[9px] uppercase tracking-widest text-indigo-400 font-black">Admin</p>
              </div>
            </div>

            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Admin Avatar"
                className="w-8 h-8 rounded-xl object-cover border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.3)]"
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.3)]">
                <UserCircle className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
