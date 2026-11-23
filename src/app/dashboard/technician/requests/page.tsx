'use client';

import React, { useEffect, useState } from 'react';
import StatusBadge from '@/components/StatusBadge';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Booking } from '@/types';
import { fetchAPI } from '@/lib/api';
import {
  Inbox,
  Check,
  X,
  Play,
  CheckCircle2,
  DollarSign,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mark Completed Modal State (with finalAmount input)
  const [completingTarget, setCompletingTarget] = useState<Booking | null>(null);
  const [finalAmount, setFinalAmount] = useState('');
  const [completionNote, setCompletionNote] = useState('');
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false);

  // Reject Confirmation State
  const [rejectTarget, setRejectTarget] = useState<Booking | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const url = statusFilter !== 'all' ? `/bookings/technician?status=${statusFilter}` : '/bookings/technician';
      const res = await fetchAPI<{ success: boolean; bookings: Booking[] }>(url);
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load requests.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  // Update status helper
  const handleUpdateStatus = async (
    bookingId: string,
    nextStatus: string,
    extra: { finalAmount?: number; note?: string } = {}
  ) => {
    try {
      const res = await fetchAPI<{ success: boolean; message: string }>(
        `/bookings/${bookingId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ nextStatus, ...extra }),
        }
      );

      if (res.success) {
        toast.success(res.message);
        loadRequests();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update job status.');
    }
  };

  const handleOpenCompleteModal = (booking: Booking) => {
    setCompletingTarget(booking);
    setFinalAmount((booking.finalAmount || booking.basePrice).toString());
    setCompletionNote('Diagnostics complete, hardware repaired and tested.');
  };

  const handleConfirmCompletion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingTarget) return;

    const amountNum = Number(finalAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid final amount greater than 0.');
      return;
    }

    setIsSubmittingCompletion(true);
    try {
      await handleUpdateStatus(completingTarget._id, 'completed', {
        finalAmount: amountNum,
        note: completionNote.trim(),
      });
      setCompletingTarget(null);
    } finally {
      setIsSubmittingCompletion(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectTarget) return;
    setIsRejecting(true);
    try {
      await handleUpdateStatus(rejectTarget._id, 'rejected', {
        note: 'Technician unavailable or parts unavailable for this model.',
      });
      setRejectTarget(null);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Manage Incoming Requests
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enforces strict pipeline transitions: Requested ➔ Accepted ➔ In Progress ➔ Completed.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          {['all', 'requested', 'accepted', 'in-progress', 'completed'].map((st) => (
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
                  <th className="p-4">Customer & Service</th>
                  <th className="p-4">Contact & Location</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Problem</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Pipeline Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 dark:text-white">{b.customerName}</p>
                      <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold truncate max-w-[180px]">
                        {b.serviceTitle}
                      </p>
                    </td>

                    <td className="p-4 space-y-0.5">
                      <p className="text-slate-700 dark:text-slate-300 font-medium">{b.customerPhone}</p>
                      <p className="text-slate-400 text-[11px] truncate max-w-[160px]">{b.address}</p>
                    </td>

                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(b.preferredDate).toLocaleDateString()}
                    </td>

                    <td className="p-4 max-w-[200px]">
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] line-clamp-2">
                        {b.problemDescription}
                      </p>
                    </td>

                    <td className="p-4">
                      <StatusBadge status={b.status} />
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      {/* Step 1: requested -> Accept / Reject */}
                      {b.status === 'requested' && (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateStatus(b._id, 'accepted')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Accept
                          </button>
                          <button
                            onClick={() => setRejectTarget(b)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 font-bold"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </div>
                      )}

                      {/* Step 2: accepted -> Start Work (in-progress) */}
                      {b.status === 'accepted' && (
                        <button
                          onClick={() => handleUpdateStatus(b._id, 'in-progress')}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-sm"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Start Work
                        </button>
                      )}

                      {/* Step 3: in-progress -> Mark Completed */}
                      {b.status === 'in-progress' && (
                        <button
                          onClick={() => handleOpenCompleteModal(b)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mark Completed
                        </button>
                      )}

                      {/* Step 4: completed -> Show Payment Badge */}
                      {b.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
                          {b.paymentStatus === 'paid' ? '★ Paid ($' + b.finalAmount + ')' : '○ Unpaid ($' + b.finalAmount + ')'}
                        </span>
                      )}

                      {(b.status === 'rejected' || b.status === 'cancelled') && (
                        <span className="text-[11px] text-slate-400 capitalize">
                          {b.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <Inbox className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Requests Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are currently no repair requests matching the active filter.
          </p>
        </div>
      )}

      {/* Mark Completed Modal */}
      {completingTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Complete Job & Set Final Amount
                </h3>
                <p className="text-xs text-slate-500">
                  Customer: <strong>{completingTarget.customerName}</strong>
                </p>
              </div>
              <button
                onClick={() => setCompletingTarget(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmCompletion} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Final Amount to Bill Customer ($ USD) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={finalAmount}
                    onChange={(e) => setFinalAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Original Base Estimate: ${completingTarget.basePrice}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technician Notes / Repair Summary
                </label>
                <textarea
                  rows={2}
                  value={completionNote}
                  onChange={(e) => setCompletionNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCompletingTarget(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCompletion}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {isSubmittingCompletion ? 'Completing...' : 'Mark Completed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(rejectTarget)}
        title="Reject Repair Request?"
        message={`Are you sure you want to decline this request from ${rejectTarget?.customerName}? This will end the request.`}
        confirmText="Yes, Reject"
        confirmVariant="danger"
        isLoading={isRejecting}
        onConfirm={handleConfirmReject}
        onClose={() => setRejectTarget(null)}
      />
    </div>
  );
}
