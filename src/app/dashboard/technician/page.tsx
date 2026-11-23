'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import { Service, Booking } from '@/types';
import { fetchAPI } from '@/lib/api';
import {
  Briefcase,
  ShieldCheck,
  Inbox,
  Clock,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function TechnicianOverviewPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, bookingsRes] = await Promise.all([
          fetchAPI<{ success: boolean; services: Service[] }>('/services/technician/my-services'),
          fetchAPI<{ success: boolean; bookings: Booking[] }>('/bookings/technician'),
        ]);

        if (servicesRes.success) setServices(servicesRes.services || []);
        if (bookingsRes.success) setBookings(bookingsRes.bookings || []);
      } catch (err) {
        console.warn('Error loading technician dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const totalServices = services.length;
  const approvedServices = services.filter((s) => s.approvalStatus === 'approved').length;
  const pendingRequests = bookings.filter((b) => b.status === 'requested').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Technician Command Center 🔧
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-xl">
            Manage your repair listings, track customer job pipelines, update milestones, and specify final job invoices.
          </p>
        </div>

        <Link
          href="/dashboard/technician/add-service"
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Service</span>
        </Link>
      </div>

      {/* Stats Cards (Total Services, Approved Services, Pending Requests) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          title="Total Services"
          value={totalServices}
          subtitle="Repair services listed"
          icon={Briefcase}
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400"
        />
        <StatsCard
          title="Approved Services"
          value={approvedServices}
          subtitle="Live on public directory"
          icon={ShieldCheck}
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400"
        />
        <StatsCard
          title="Pending Requests"
          value={pendingRequests}
          subtitle="Awaiting your acceptance"
          icon={Inbox}
          colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400"
        />
      </div>

      {/* Recent Incoming Requests */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Repair Requests
          </h2>
          <Link
            href="/dashboard/technician/requests"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>Manage All Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Service</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {b.customerName}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      {b.serviceTitle}
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(b.preferredDate).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href="/dashboard/technician/requests"
                        className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            No incoming customer repair requests yet.
          </div>
        )}
      </div>
    </div>
  );
}
