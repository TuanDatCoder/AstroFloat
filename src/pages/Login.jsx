import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserCircle, LogIn, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await authService.login(formData.email, formData.password);

      if (data?.user) {
        // Đăng nhập thành công, chuyển hướng về trang chủ
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError("Email hoặc mật khẩu không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-20 px-4 relative z-10 w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        {/* Background Hào quang góc */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-[50px] pointer-events-none" />

        <div className="text-center mb-10 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)] border border-white/5">
            <UserCircle className="w-10 h-10 text-cyan-300 drop-shadow-md" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
            Đăng Nhập
          </h1>
          <p className="text-gray-400 font-light text-sm">
            Kết nối với hồ sơ năng lượng vũ trụ của bạn
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-200 text-sm text-center animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="relative z-10 flex flex-col gap-5">
          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-2 block ml-2">Email Đăng Nhập</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] pl-12 pr-4 py-4 text-white focus:outline-none focus:border-cyan-500/60 shadow-inner transition-all hover:bg-black/60 focus:bg-black/80" 
                placeholder="Ví dụ: tuandatcoder@email.com" 
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-bold tracking-widest text-purple-400 mb-2 block ml-2">Mật khẩu</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none group-focus-within:text-purple-400 transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                required 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] pl-12 pr-12 py-4 text-white focus:outline-none focus:border-purple-500/60 shadow-inner transition-all hover:bg-black/60 focus:bg-black/80" 
                placeholder="Nhập mật khẩu..." 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end px-2 mt-[-5px]">
            <a href="#" className="text-xs text-gray-500 hover:text-cyan-300 transition-colors">Quên mật khẩu?</a>
          </div>

          <div className="flex flex-col items-center gap-4 mt-8">
            <button 
              type="submit" 
              disabled={loading}
              className="group relative w-full py-4 bg-gradient-to-r from-cyan-600/80 to-purple-600/80 hover:from-cyan-500 hover:to-purple-500 rounded-[1.5rem] font-bold text-white tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 transition-all flex items-center justify-center gap-3 text-lg border border-white/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
              {loading ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 
              ) : (
                <>
                  <LogIn className="w-5 h-5 relative z-10" /> <span className="relative z-10">MỞ KHOÁ</span>
                </>
              )}
            </button>

            <p className="text-sm text-gray-400 mt-2">
              Chưa có hồ sơ? <Link to="/register" className="text-cyan-400 font-bold hover:text-cyan-300 hover:underline transition-colors underline-offset-4">Đăng ký ngay</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
