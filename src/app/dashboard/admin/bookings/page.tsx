'use client';

import React, { useEffect, useState } from 'react';
import StatusBadge from '@/components/StatusBadge';
import { Booking } from '@/types';
import { fetchAPI } from '@/lib/api';
import { CalendarCheck, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      setIsLoading(true);
      try {
        const url = statusFilter !== 'all' ? `/admin/bookings?status=${statusFilter}` : '/admin/bookings';
        const res = await fetchAPI<{ success: boolean; bookings: Booking[] }>(url);
        if (res.success && res.bookings) {
          setBookings(res.bookings);
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to load bookings.');
      } finally {
        setIsLoading(false);
      }
    }
    loadBookings();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Platform Repair Bookings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Read-only surveillance of all customer bookings, technician assignments, and job pipelines.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          {['all', 'requested', 'accepted', 'in-progress', 'completed', 'cancelled', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : bookings.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Service</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Technician</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Job Status</th>
                  <th className="p-4">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {b.serviceTitle}
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      {b.customerName}
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      {b.technicianName}
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(b.preferredDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-extrabold text-blue-600 dark:text-blue-400">
                      ${b.finalAmount || b.basePrice}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={b.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <CalendarCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Bookings Found
          </h3>
          <p className="text-xs text-slate-500">
            No bookings found under this status filter.
          </p>
        </div>
      )}
    </div>
  );
}
