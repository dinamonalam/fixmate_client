'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StatsCard from '@/components/StatsCard';
import StatusBadge from '@/components/StatusBadge';
import { Booking } from '@/types';
import { fetchAPI } from '@/lib/api';
import {
  Inbox,
  Clock,
  CheckCircle2,
  CalendarCheck,
  CreditCard,
  ArrowRight,
  Wrench,
} from 'lucide-react';

export default function CustomerOverviewPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchAPI<{ success: boolean; bookings: Booking[] }>('/bookings/my');
        if (res.success && res.bookings) {
          setBookings(res.bookings);
        }
      } catch (err) {
        console.warn('Error loading customer bookings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const totalRequests = bookings.length;
  const activeJobs = bookings.filter((b) => ['requested', 'accepted', 'in-progress'].includes(b.status)).length;
  const completedJobs = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/10">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Customer Portal 🛠️
        </h1>
        <p className="text-sm text-blue-100 mt-2 max-w-xl">
          Track active repairs in real time, view technician diagnostics, and securely pay with Stripe once your device is completely serviced.
        </p>
      </div>

      {/* Stats Cards (Total Requests, Active Jobs, Completed Jobs) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard
          title="Total Requests"
          value={totalRequests}
          subtitle="All-time repair requests"
          icon={Inbox}
          colorClass="bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-400"
        />
        <StatsCard
          title="Active Jobs"
          value={activeJobs}
          subtitle="Requested, Accepted or In-Progress"
          icon={Clock}
          colorClass="bg-amber-50 text-amber-600 dark:bg-amber-950/70 dark:text-amber-400"
        />
        <StatsCard
          title="Completed Jobs"
          value={completedJobs}
          subtitle="Successfully delivered repairs"
          icon={CheckCircle2}
          colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/70 dark:text-emerald-400"
        />
      </div>

      {/* Recent Bookings Section */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Repair Bookings
          </h2>
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <span>View All</span>
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
                  <th className="pb-3">Service</th>
                  <th className="pb-3">Technician</th>
                  <th className="pb-3">Preferred Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.slice(0, 5).map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-semibold text-slate-900 dark:text-white">
                      {b.serviceTitle}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      {b.technicianName}
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(b.preferredDate).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-3">
                      <StatusBadge status={b.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            <p>You haven&apos;t placed any repair requests yet.</p>
            <Link
              href="/services"
              className="inline-block mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold"
            >
              Browse Services
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
