import React, { useEffect, useState, useRef } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { authService } from '../services/authService';

export default function ProtectedRoute({ requireAdmin = false }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const initRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function checkUser(session) {
      if (!session?.user || !mounted) return;
      
      setUser(session.user);
      
      if (requireAdmin) {
        try {
          // Lấy profile bằng chính session hiện tại để đảm bảo token mới nhất
          const profile = await authService.getUserProfile(session.user.id);
          if (mounted) {
            setIsAdmin(profile?.role === 'ADMIN');
          }
        } catch (err) {
          console.error("Profile check error:", err);
          // Retry một lần nếu lỗi 401 (có thể do token chưa kịp cập nhật)
          if (err.status === 401 || err.code === 'PGRST301') {
            await new Promise(r => setTimeout(r, 1000));
            try {
              const retryProfile = await authService.getUserProfile(session.user.id);
              if (mounted) setIsAdmin(retryProfile?.role === 'ADMIN');
            } catch (e) {
              if (mounted) setIsAdmin(false);
            }
          } else {
            if (mounted) setIsAdmin(false);
          }
        }
      }
      if (mounted) setLoading(false);
    }

    // Khởi tạo lần đầu
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (!session) {
        setLoading(false);
        return;
      }
      checkUser(session);
    });

    // Lắng nghe thay đổi
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      console.log(`Auth Guard Event: ${event}`);

      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      } else {
        checkUser(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [requireAdmin]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-cyan-500/10 border-b-cyan-400 rounded-full animate-spin-slow" />
          </div>
        </div>
        <div className="mt-8 space-y-2 text-center">
          <p className="text-white font-black tracking-[0.3em] uppercase text-[10px] animate-pulse">Xác thực Token...</p>
          <p className="text-gray-600 text-[9px] italic font-light">Nếu quá lâu, hãy thử đăng nhập lại</p>
        </div>
      </div>
    );
  }

  // Redirect logic
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.warn("Access denied: Not an Admin profile.");
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
