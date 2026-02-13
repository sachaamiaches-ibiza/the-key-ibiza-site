
import React, { useState, useEffect } from 'react';
import { vipAuth, VipUser } from '../services/vipAuth';

interface VipUserManagementProps {
  onClose: () => void;
}

const VipUserManagement: React.FC<VipUserManagementProps> = ({ onClose }) => {
  const [users, setUsers] = useState<VipUser[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [changingPasswordFor, setChangingPasswordFor] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'user' as 'admin' | 'user' });
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = () => {
    const allUsers = vipAuth.getAllUsers();
    if (allUsers) {
      setUsers(allUsers);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '', role: 'user' });
    setNewPassword('');
    setError('');
    setSuccess('');
    setShowCreateForm(false);
    setEditingUser(null);
    setChangingPasswordFor(null);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password || !formData.name) {
      setError('All fields are required');
      return;
    }

    const result = vipAuth.createUser(formData.email, formData.password, formData.name, formData.role);
    if (result.success) {
      setSuccess('User created successfully');
      loadUsers();
      setTimeout(resetForm, 1500);
    } else {
      setError(result.error || 'Failed to create user');
    }
  };

  const handleUpdateUser = (e: React.FormEvent, userId: string) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const result = vipAuth.updateUser(userId, {
      email: formData.email,
      name: formData.name,
      role: formData.role,
    });

    if (result.success) {
      setSuccess('User updated successfully');
      loadUsers();
      setTimeout(resetForm, 1500);
    } else {
      setError(result.error || 'Failed to update user');
    }
  };

  const handleChangePassword = (e: React.FormEvent, userId: string) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || newPassword.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    const result = vipAuth.changePassword(userId, newPassword);
    if (result.success) {
      setSuccess('Password changed successfully');
      setTimeout(resetForm, 1500);
    } else {
      setError(result.error || 'Failed to change password');
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete "${userName}"?`)) {
      return;
    }

    const result = vipAuth.deleteUser(userId);
    if (result.success) {
      setSuccess('User deleted');
      loadUsers();
    } else {
      setError(result.error || 'Failed to delete user');
    }
  };

  const startEdit = (user: VipUser) => {
    setFormData({ email: user.email, password: '', name: user.name, role: user.role });
    setEditingUser(user.id);
    setShowCreateForm(false);
    setChangingPasswordFor(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-[#0B1C26] border border-white/10 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 border-b border-white/10 bg-[#0B1C26] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-serif text-white">VIP User Management</h2>
            <p className="text-white/50 text-sm mt-1">Manage VIP access accounts</p>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white p-2 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Create New User Button */}
          {!showCreateForm && !editingUser && !changingPasswordFor && (
            <button
              onClick={() => { resetForm(); setShowCreateForm(true); }}
              className="mb-6 px-5 py-2.5 rounded-full border border-luxury-gold/50 text-luxury-gold text-xs uppercase tracking-wider hover:bg-luxury-gold hover:text-luxury-blue transition-all"
            >
              + Add New VIP User
            </button>
          )}

          {/* Create User Form */}
          {showCreateForm && (
            <form onSubmit={handleCreateUser} className="mb-6 p-5 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-white text-sm font-medium mb-4">Create New VIP User</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-luxury-gold"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-luxury-gold"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-luxury-gold"
                />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold appearance-none"
                >
                  <option value="user" className="bg-[#0B1C26]">Regular VIP</option>
                  <option value="admin" className="bg-[#0B1C26]">Administrator</option>
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-luxury-gold text-luxury-blue text-xs uppercase tracking-wider font-medium border border-luxury-gold hover:bg-luxury-blue hover:text-luxury-gold transition-all"
                >
                  Create User
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2 rounded-lg border border-white/20 text-white/60 text-xs uppercase tracking-wider hover:border-white/40 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Edit User Form */}
          {editingUser && (
            <form onSubmit={(e) => handleUpdateUser(e, editingUser)} className="mb-6 p-5 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-white text-sm font-medium mb-4">Edit User</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-luxury-gold"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-luxury-gold"
                />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'user' })}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-luxury-gold appearance-none md:col-span-2"
                >
                  <option value="user" className="bg-[#0B1C26]">Regular VIP</option>
                  <option value="admin" className="bg-[#0B1C26]">Administrator</option>
                </select>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-luxury-gold text-luxury-blue text-xs uppercase tracking-wider font-medium border border-luxury-gold hover:bg-luxury-blue hover:text-luxury-gold transition-all"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2 rounded-lg border border-white/20 text-white/60 text-xs uppercase tracking-wider hover:border-white/40 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Change Password Form */}
          {changingPasswordFor && (
            <form onSubmit={(e) => handleChangePassword(e, changingPasswordFor)} className="mb-6 p-5 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-white text-sm font-medium mb-4">Change Password</h3>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/40 focus:outline-none focus:border-luxury-gold mb-4"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-luxury-gold text-luxury-blue text-xs uppercase tracking-wider font-medium border border-luxury-gold hover:bg-luxury-blue hover:text-luxury-gold transition-all"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2 rounded-lg border border-white/20 text-white/60 text-xs uppercase tracking-wider hover:border-white/40 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Users List */}
          <div className="space-y-3">
            <h3 className="text-white/60 text-xs uppercase tracking-wider mb-4">VIP Users ({users.length})</h3>
            {users.map((user) => (
              <div
                key={user.id}
                className="p-4 bg-white/5 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{user.name}</span>
                    {user.role === 'admin' && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-luxury-gold/20 text-luxury-gold uppercase tracking-wider">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-white/50 text-sm">{user.email}</p>
                  <p className="text-white/30 text-xs mt-1">Created: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => startEdit(user)}
                    className="px-3 py-1.5 rounded-lg border border-white/20 text-white/60 text-[10px] uppercase tracking-wider hover:border-luxury-gold hover:text-luxury-gold transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => { resetForm(); setChangingPasswordFor(user.id); }}
                    className="px-3 py-1.5 rounded-lg border border-white/20 text-white/60 text-[10px] uppercase tracking-wider hover:border-luxury-gold hover:text-luxury-gold transition-all"
                  >
                    Password
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id, user.name)}
                    className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400/70 text-[10px] uppercase tracking-wider hover:border-red-500 hover:text-red-400 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VipUserManagement;
