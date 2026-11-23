'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import { AdminStats } from '@/types';
import { fetchAPI } from '@/lib/api';
import {
  Users,
  Briefcase,
  Clock,
  DollarSign,
  ShieldCheck,
  CalendarCheck,
  Receipt,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetchAPI<{ success: boolean; stats: AdminStats }>('/admin/stats');
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.warn('Error loading admin stats:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Command Center 🛡️
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl">
            Monitor platform-wide service listings, oversee technician approval queues, manage user roles, and track Stripe revenue.
          </p>
        </div>

        <Link
          href="/dashboard/admin/services"
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 shrink-0"
        >
          <Clock className="w-4 h-4" />
          <span>Review Pending Services ({stats?.pendingServices || 0})</span>
        </Link>
      </div>

      {/* Stats Cards (Total Users, Total Technicians, Pending Services, Total Revenue) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          subtitle="Customers & Technicians"
          icon={Users}
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400"
        />
        <StatsCard
          title="Total Technicians"
          value={stats?.totalTechnicians || 0}
          subtitle="Verified service providers"
          icon={Briefcase}
          colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/70 dark:text-indigo-400"
        />
        <StatsCard
          title="Pending Services"
          value={stats?.pendingServices || 0}
          subtitle="Awaiting moderation"
          icon={Clock}
          colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400"
        />
        <StatsCard
          title="Platform Revenue"
          value={`$${stats?.totalRevenue || 0}`}
          subtitle="Stripe settled payments"
          icon={DollarSign}
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400"
        />
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/admin/users"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Manage Users</h3>
          <p className="text-xs text-slate-500 mt-1">Review accounts and modify user roles</p>
        </Link>

        <Link
          href="/dashboard/admin/services"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Service Approval</h3>
          <p className="text-xs text-slate-500 mt-1">Approve or reject technician offerings</p>
        </Link>

        <Link
          href="/dashboard/admin/bookings"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">All Bookings</h3>
          <p className="text-xs text-slate-500 mt-1">Monitor repair pipelines across platform</p>
        </Link>

        <Link
          href="/dashboard/admin/transactions"
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Receipt className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Transactions</h3>
          <p className="text-xs text-slate-500 mt-1">Audit complete Stripe payment records</p>
        </Link>
      </div>
    </div>
  );
}
