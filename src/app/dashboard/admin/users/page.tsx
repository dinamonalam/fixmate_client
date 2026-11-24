'use client';

import React, { useEffect, useState } from 'react';
import { User, UserRole } from '@/types';
import { fetchAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Users, Shield, UserCheck, AlertTriangle } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Role Change Modal
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAPI<{ success: boolean; users: User[] }>('/admin/users');
      if (res.success && res.users) {
        setUsers(res.users);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openRoleModal = (u: User) => {
    if (u.email === currentAdmin?.email) {
      toast.error('Security policy: You cannot modify your own administrative role.');
      return;
    }
    setTargetUser(u);
    setSelectedRole(u.role);
  };

  const handleRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser) return;

    setIsUpdating(true);
    try {
      const res = await fetchAPI<{ success: boolean; message: string }>(
        `/admin/users/${targetUser._id}/role`,
        {
          method: 'PATCH',
          body: JSON.stringify({ role: selectedRole }),
        }
      );

      if (res.success) {
        toast.success(res.message);
        setTargetUser(null);
        loadUsers();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update role.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Manage Users & Roles
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          View all registered accounts and modify stakeholder privileges. Administrators cannot alter their own role.
        </p>
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.map((u) => {
                  const isSelf = u.email === currentAdmin?.email;

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <UserAvatar name={u.name} image={u.image} size="sm" />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">
                              {u.name} {isSelf && <span className="text-[10px] text-blue-500 font-semibold">(You)</span>}
                            </p>
                            <span className="text-[10px] text-slate-400">{u.phone || 'No phone'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">
                        {u.email}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                              : u.role === 'technician'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="p-4 text-slate-500">
                        {u.area || 'Not specified'}
                      </td>

                      <td className="p-4 text-slate-500 whitespace-nowrap">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => openRoleModal(u)}
                          disabled={isSelf}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          Change Role
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Change Role for {targetUser.name}
            </h3>

            <form onSubmit={handleRoleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Stakeholder Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                >
                  <option value="customer">Customer</option>
                  <option value="technician">Technician</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTargetUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Update Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
