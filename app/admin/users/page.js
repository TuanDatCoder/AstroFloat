'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Shield, ShieldCheck, Mail, Calendar, 
  MoreVertical, Edit, Trash2, Filter, ChevronLeft, ChevronRight, ChevronDown 
} from 'lucide-react';
import { authService } from '@/services/authService';
import { supabase } from '@/services/supabase';
import Image from 'next/image';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const user = await authService.getCurrentUser();
    if (user) setCurrentUserId(user.id);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await authService.getAllProfiles();
      setUsers(data || []);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const triggerRoleModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const confirmRoleUpdate = async () => {
    if (!selectedUser) return;
    
    setUpdating(true);
    const newRole = selectedUser.role === 'ADMIN' ? 'USER' : 'ADMIN';
    
    try {
      await authService.updateRole(selectedUser.id, newRole);
      await fetchUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      alert("Lỗi khi cập nhật vai trò: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Custom Role Update Modal Component - Redesigned for Premium Look
  const RoleUpdateModal = () => {
    if (!selectedUser) return null;
    const isPromoting = selectedUser.role === 'USER';
    const newRole = isPromoting ? 'ADMIN' : 'USER';

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop with heavy blur */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !updating && setIsModalOpen(false)}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        />
        
        {/* Modal Content - Premium Glassmorphism Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          className="relative w-full max-w-lg bg-slate-900/40 border border-white/10 rounded-[3rem] shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)] overflow-hidden"
        >
          {/* Top Decorative Glow */}
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent ${isPromoting ? 'via-indigo-500' : 'via-cyan-500'} to-transparent opacity-50`} />
          
          <div className="p-8 md:p-12 relative z-10">
            {/* Header with User Info */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative mb-6">
                <div className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${isPromoting ? 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30' : 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30'} border-2 p-1.5 shadow-2xl overflow-hidden`}>
                  {selectedUser.avatar_url ? (
                    <Image src={selectedUser.avatar_url} alt="" fill sizes="96px" className="object-cover rounded-2xl" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 rounded-2xl flex items-center justify-center">
                      <Users className="w-10 h-10 text-gray-600" />
                    </div>
                  )}
                </div>
                <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl ${isPromoting ? 'bg-indigo-600 shadow-indigo-500/40' : 'bg-cyan-600 shadow-cyan-500/40'} shadow-lg border-2 border-slate-900 flex items-center justify-center`}>
                   <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <h3 className="text-3xl font-black text-white text-center mb-2 tracking-tight">Xác nhận thay đổi</h3>
              <p className="text-gray-400 text-center text-sm font-medium">Bạn đang cập nhật quyền hạn cho tài khoản</p>
              <div className="mt-2 px-4 py-1.5 bg-white/5 border border-white/5 rounded-full">
                <span className="text-indigo-300 font-bold text-sm tracking-wide">{selectedUser.nickname || selectedUser.email}</span>
              </div>
            </div>

            {/* Role Transition Visual */}
            <div className="grid grid-cols-7 items-center gap-2 mb-12 relative px-4">
              {/* Current Role */}
              <div className="col-span-3 text-center space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Vai trò cũ</p>
                <div className="bg-slate-950/60 border border-white/5 py-4 px-2 rounded-2xl">
                  <span className="text-sm font-black text-gray-400 uppercase tracking-widest">{selectedUser.role}</span>
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className="col-span-1 flex flex-col items-center justify-center pt-6">
                <div className={`w-8 h-8 rounded-full ${isPromoting ? 'bg-indigo-500/20 text-indigo-400' : 'bg-cyan-500/20 text-cyan-400'} flex items-center justify-center`}>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>

              {/* Target Role */}
              <div className="col-span-3 text-center space-y-3">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isPromoting ? 'text-indigo-400' : 'text-cyan-400'}`}>Vai trò mới</p>
                <div className={`bg-gradient-to-br ${isPromoting ? 'from-indigo-600/20 to-purple-600/20 border-indigo-500/30' : 'from-cyan-600/20 to-blue-600/20 border-cyan-500/30'} border py-4 px-2 rounded-2xl shadow-inner`}>
                  <span className={`text-sm font-black ${isPromoting ? 'text-indigo-300' : 'text-cyan-300'} uppercase tracking-widest`}>{newRole}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsModalOpen(false)}
                disabled={updating}
                className="flex-1 py-5 rounded-[1.5rem] bg-white/5 border border-white/10 text-gray-400 font-black text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Hủy bỏ
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={confirmRoleUpdate}
                disabled={updating}
                className={`flex-[1.5] py-5 rounded-[1.5rem] bg-gradient-to-r ${isPromoting ? 'from-indigo-600 to-purple-600 shadow-indigo-500/25' : 'from-cyan-600 to-blue-600 shadow-cyan-500/25'} text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 disabled:opacity-50`}
              >
                {updating ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Xác nhận ngay</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
          
          {/* Background Decorative Circles */}
          <div className={`absolute top-0 right-0 w-64 h-64 ${isPromoting ? 'bg-indigo-500/5' : 'bg-cyan-500/5'} rounded-full blur-[80px] -mr-32 -mt-32`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 ${isPromoting ? 'bg-purple-500/5' : 'bg-blue-500/5'} rounded-full blur-[80px] -ml-32 -mb-32`} />
        </motion.div>
      </div>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.nickname?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">Quản lý Thành viên</h1>
          <p className="text-gray-400">Xem và quản lý tất cả người dùng trên hệ thống.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/50 px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-bold text-white">{users.length} Users</span>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Tìm theo email, tên..."
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="md:col-span-4 relative group">
          <div className="flex items-center gap-2 h-full">
            <Filter className="w-4 h-4 text-gray-500 ml-2" />
            <div className="relative flex-1">
               <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-3.5 px-6 text-sm text-white flex items-center justify-between group hover:border-indigo-500/50 transition-all outline-none"
               >
                 <span className="font-bold">{roleFilter === 'ALL' ? 'Tất cả vai trò' : roleFilter === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}</span>
                 <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
               </button>

               <AnimatePresence>
                 {isDropdownOpen && (
                   <>
                     {/* Backdrop for closing */}
                     <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                     
                     <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 5, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.95 }}
                       className="absolute top-full left-0 right-0 z-20 mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                     >
                        {[
                          { value: 'ALL', label: 'Tất cả vai trò' },
                          { value: 'USER', label: 'Người dùng' },
                          { value: 'ADMIN', label: 'Quản trị viên' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setRoleFilter(option.value);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-6 py-3.5 text-sm transition-colors hover:bg-indigo-600/10 ${roleFilter === option.value ? 'text-indigo-400 bg-indigo-600/5 font-bold' : 'text-gray-400'}`}
                          >
                            {option.label}
                          </button>
                        ))}
                     </motion.div>
                   </>
                 )}
               </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/50 rounded-[2rem] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/5">
                <th className="px-6 py-5">Người dùng</th>
                <th className="px-6 py-5">Thông tin</th>
                <th className="px-6 py-5">Vai trò</th>
                <th className="px-6 py-5">Ngày gia nhập</th>
                <th className="px-6 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-t-indigo-500 border-white/10 rounded-full animate-spin" />
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Đang tải danh sách...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-500 italic">
                    Không tìm thấy người dùng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isMe = user.id === currentUserId;
                  return (
                    <tr key={user.id} className={`transition-colors group ${isMe ? 'bg-indigo-500/10 border-l-2 border-indigo-500' : 'hover:bg-white/[0.02]'}`}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br border flex items-center justify-center overflow-hidden ${isMe ? 'from-indigo-500 to-purple-600 border-indigo-400 shadow-lg shadow-indigo-500/20' : 'from-slate-800 to-slate-900 border-white/10'}`}>
                            {user.avatar_url ? (
                              <Image src={user.avatar_url} alt="" fill sizes="40px" className="object-cover" />
                            ) : (
                              <Users className={`w-5 h-5 ${isMe ? 'text-white' : 'text-gray-600'}`} />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-black text-white">{user.nickname || 'Chưa đặt tên'}</p>
                              {isMe && (
                                <span className="px-1.5 py-0.5 rounded-md bg-indigo-500 text-[8px] font-black uppercase tracking-tighter text-white animate-pulse">Bạn</span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">UID: {user.id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-gray-400 text-xs">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500 text-[10px]">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>NS: {user.birth_date || 'Chưa cập nhật'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          user.role === 'ADMIN' 
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                            : 'bg-white/5 text-gray-400 border border-white/10'
                        }`}>
                          {user.role === 'ADMIN' ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                          {user.role}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs text-gray-400">{new Date(user.created_at).toLocaleDateString('vi-VN')}</p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => triggerRoleModal(user)}
                            disabled={isMe}
                            className={`p-2 rounded-lg bg-white/5 border border-white/5 transition-all ${isMe ? 'opacity-20 cursor-not-allowed text-gray-700' : 'text-gray-500 hover:text-indigo-400 hover:border-indigo-500/30'}`}
                            title={isMe ? "Bạn không thể tự đổi vai trò của mình" : "Đổi vai trò"}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            disabled={isMe}
                            className={`p-2 rounded-lg bg-white/5 border border-white/5 transition-all ${isMe ? 'opacity-20 cursor-not-allowed text-gray-700' : 'text-gray-500 hover:text-rose-400 hover:border-rose-500/30'}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="px-6 py-4 bg-white/5 flex items-center justify-between border-t border-white/5">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Hiển thị {filteredUsers.length} / {users.length} thành viên</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-black/20 border border-white/5 text-gray-600 cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-black/20 border border-white/5 text-gray-600 cursor-not-allowed">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && <RoleUpdateModal />}
      </AnimatePresence>
    </div>
  );
}
