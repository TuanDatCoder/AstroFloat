import React, { useEffect, useState } from 'react';
import { Search, Shield, User, Crown, Mail, Calendar, X, ShieldCheck, ShieldOff, ChevronDown, Check, Loader2, AlertTriangle } from 'lucide-react';
import { authService } from '../../../services/authService';

// ────────────────────────────────────────
// Role Grant Modal
// ────────────────────────────────────────
function RoleModal({ user, onClose, onConfirm, loading }) {
  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-slate-950 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
        {/* Close */}
        <button onClick={onClose} className="absolute top-5 right-5 p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-14 h-14 rounded-2xl object-cover border border-white/10" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-600/30 flex items-center justify-center border border-white/10">
              <User className="w-7 h-7 text-indigo-300" />
            </div>
          )}
          <div>
            <p className="font-black text-white text-lg">{user.nickname || 'Người dùng'}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Current role badge */}
        <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-black">Vai trò hiện tại</span>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest ${
            isAdmin ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-gray-400 border border-white/10'
          }`}>
            <Shield className="w-3 h-3" /> {user.role || 'USER'}
          </span>
        </div>

        {/* Warning / Confirm section */}
        {isAdmin ? (
          <div className="mb-8 p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-rose-400">Thu hồi quyền Admin?</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Người dùng này sẽ mất toàn bộ quyền truy cập vào trang quản trị và không thể thực hiện thao tác Admin nữa.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-indigo-400">Cấp quyền Admin?</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Người dùng này sẽ có toàn quyền truy cập vào trang quản trị, chỉnh sửa nội dung và quản lý thành viên khác.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => onConfirm(user.id, user.role)}
            disabled={loading}
            className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              isAdmin
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
            } disabled:opacity-50`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isAdmin ? (
              <><ShieldOff className="w-4 h-4" /> Thu hồi quyền</>
            ) : (
              <><ShieldCheck className="w-4 h-4" /> Cấp quyền Admin</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────
// Main Component
// ────────────────────────────────────────
export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await authService.getAllProfiles();
      setUsers(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleConfirm = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    setModalLoading(true);
    try {
      await authService.updateRole(userId, newRole);
      await fetchUsers();
      setSelectedUser(null);
    } catch (e) {
      alert("Lỗi: " + e.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleTierToggle = async (userId, currentTier) => {
    const newTier = currentTier === 'PREMIUM' ? 'FREE' : 'PREMIUM';
    try {
      await authService.toggleTier(userId, newTier);
      fetchUsers();
    } catch (e) {
      alert("Lỗi: " + e.message);
    }
  };

  const filteredUsers = users
    .filter(u =>
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.nickname?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(u => filterRole === 'ALL' || u.role === filterRole);

  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const premiumCount = users.filter(u => u.tier === 'PREMIUM').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Quản Lý Thành Viên</h1>
          <p className="text-gray-500 text-sm mt-1">Xem danh sách và cấp / thu hồi quyền quản trị.</p>
        </div>
        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl text-center">
            <p className="text-lg font-black text-white">{users.length}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Tổng</p>
          </div>
          <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center">
            <p className="text-lg font-black text-indigo-400">{adminCount}</p>
            <p className="text-[10px] text-indigo-500 uppercase tracking-widest">Admin</p>
          </div>
          <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-center">
            <p className="text-lg font-black text-amber-400">{premiumCount}</p>
            <p className="text-[10px] text-amber-500 uppercase tracking-widest">Premium</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm theo email hoặc nickname..."
            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500/50 placeholder:text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-1 bg-white/5 border border-white/5 rounded-2xl">
          {['ALL', 'ADMIN', 'USER'].map(r => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filterRole === r ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {r === 'ALL' ? 'Tất cả' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden p-4">
        {loading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 text-gray-600 italic text-sm">Không tìm thấy thành viên nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-600 text-[10px] uppercase tracking-[0.2em] font-black">
                  <th className="px-6 py-3">Thành viên</th>
                  <th className="px-6 py-3 hidden md:table-cell">Email</th>
                  <th className="px-6 py-3">Vai trò</th>
                  <th className="px-6 py-3 hidden sm:table-cell">Gói</th>
                  <th className="px-6 py-3 text-right">Phân quyền</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="group bg-white/[0.03] hover:bg-white/[0.06] transition-all">
                    <td className="px-6 py-4 rounded-l-2xl">
                      <div className="flex items-center gap-3">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt="" className="w-10 h-10 rounded-xl object-cover border border-white/10 shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-white/10 shrink-0">
                            <span className="text-sm font-black text-gray-400">
                              {(u.nickname || u.email || '?')[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-bold text-white text-sm truncate">{u.nickname || '—'}</p>
                          <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-2.5 h-2.5" />
                            {new Date(u.created_at).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden md:table-cell">
                      <p className="text-xs text-gray-400 truncate max-w-[200px]">{u.email}</p>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest border ${
                        u.role === 'ADMIN'
                          ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                          : 'bg-white/5 text-gray-500 border-white/10'
                      }`}>
                        <Shield className="w-2.5 h-2.5" />
                        {u.role || 'USER'}
                      </span>
                    </td>

                    <td className="px-6 py-4 hidden sm:table-cell">
                      <button
                        onClick={() => handleTierToggle(u.id, u.tier)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black tracking-widest border transition-all ${
                          u.tier === 'PREMIUM'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                            : 'bg-white/5 text-gray-600 border-white/10 hover:text-gray-400'
                        }`}
                      >
                        <Crown className="w-2.5 h-2.5" />
                        {u.tier || 'FREE'}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-right rounded-r-2xl">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className={`flex items-center gap-2 ml-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          u.role === 'ADMIN'
                            ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/20'
                            : 'text-gray-500 bg-white/5 border-white/10 hover:text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/20'
                        }`}
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {u.role === 'ADMIN' ? 'Quản lý quyền' : 'Cấp Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Modal */}
      {selectedUser && (
        <RoleModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onConfirm={handleRoleConfirm}
          loading={modalLoading}
        />
      )}
    </div>
  );
}
