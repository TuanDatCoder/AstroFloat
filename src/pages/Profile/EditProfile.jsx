import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Phone, Calendar, ArrowLeft, Save, Sparkles, UserCircle, Image as ImageIcon } from 'lucide-react';
import { authService } from '../../services/authService';

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    nickname: '',
    phone: '',
    gender: 'Khác',
    birthName: '',
    birthDate: '',
    avatar_url: '',
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Lấy data profile
  useEffect(() => {
    async function fetchProfile() {
      try {
        const user = await authService.getCurrentUser();
        if (!user) {
          navigate('/login');
          return;
        }
        setUserId(user.id);
        const profile = await authService.getUserProfile(user.id);
        if (profile) {
          setFormData({
            nickname: profile.nickname || '',
            phone: profile.phone || '',
            gender: profile.gender || 'Khác',
            birthName: profile.birth_name || '',
            birthDate: profile.birth_date || '',
            avatar_url: profile.avatar_url || '',
          });
          setAvatarPreview(profile.avatar_url || '');
        }
      } catch (err) {
        setError('Không thể tải thông tin hồ sơ.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      if (!userId) throw new Error('Không tìm thấy ID người dùng.');
      
      let finalFormData = { ...formData };
      
      // Nếu có chọn file mới -> Upload lên Supabase Storage
      if (avatarFile) {
        const uploadedUrl = await authService.uploadAvatar(userId, avatarFile);
        finalFormData.avatar_url = uploadedUrl;
      }

      await authService.updateProfile(userId, finalFormData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-10 h-10 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-24 px-4 relative z-10 w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <UserCircle className="w-64 h-64" />
        </div>

        <div className="flex items-center justify-between mb-10 relative z-10">
          <Link to="/profile" className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Cập Nhật Hồ Sơ
            </h1>
          </div>
          <div className="w-12 h-12" /> {/* Spacer for centering */}
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-8 p-4 bg-emerald-900/30 border border-emerald-500/30 rounded-xl text-emerald-200 text-sm text-center flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" /> Cập nhật thành công! Đang quay lại...
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10">
          
          <div className="flex flex-col items-center mb-8">
            <div className="relative group cursor-pointer w-28 h-28 rounded-full border-2 border-dashed border-white/30 overflow-hidden bg-white/5 flex items-center justify-center hover:border-cyan-400 transition-colors">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-8 h-8 text-white/30 group-hover:text-cyan-400 transition-colors" />
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold tracking-widest uppercase">
                Tải ảnh lên
              </div>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <span className="text-[10px] text-gray-500 mt-3 tracking-widest uppercase">Ảnh đại diện</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            
            {/* CỘT 1: Thông tin cơ bản */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-widest border-b border-white/10 pb-2">
                Thông tin cơ bản
              </h3>

              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-2 flex items-center gap-1 ml-1">
                  Nickname <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input type="text" name="nickname" required value={formData.nickname} onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-2 block ml-1">SĐT</label>
                   <div className="relative">
                     <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                     <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                       className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-3 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors text-sm"
                     />
                   </div>
                </div>
                <div>
                   <label className="text-xs uppercase font-bold tracking-widest text-gray-400 mb-2 block ml-1">Giới tính</label>
                   <select name="gender" value={formData.gender} onChange={handleChange}
                     className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-cyan-500/50 transition-colors text-sm cursor-pointer">
                     <option value="Nam">Nam</option>
                     <option value="Nữ">Nữ</option>
                     <option value="Khác">Khác</option>
                   </select>
                </div>
              </div>
            </div>

            {/* CỘT 2: Thông tin gốc tính toán */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest border-b border-white/10 pb-2">
                Thông tin gốc (Số học)
              </h3>
              <p className="text-xs text-gray-500">
                <span className="text-amber-400">Lưu ý:</span> Việc thay đổi thông tin khai sinh sẽ làm cập nhật lại toàn bộ báo cáo chiêm tinh và thần số học của bạn.
              </p>

              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-purple-400 mb-2 flex items-center gap-1 ml-1">
                  Họ và Tên Đầy Đủ
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/50" />
                  <input type="text" name="birthName" value={formData.birthName} onChange={handleChange}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase font-bold tracking-widest text-purple-400 mb-2 flex items-center gap-1 ml-1">
                  Ngày sinh
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/50 pointer-events-none" />
                  <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={saving}
              className="px-12 py-4 bg-cyan-600 hover:bg-cyan-500 rounded-full font-bold text-white tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.2)] disabled:opacity-50 transition-all flex items-center justify-center gap-3 uppercase"
            >
              {saving
                ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Đang lưu...</span></>
                : <><Save className="w-5 h-5" /> <span>Lưu Thay Đổi</span></>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
