'use client';

import React, { useEffect, useState } from 'react';
import StatusBadge from '@/components/StatusBadge';
import ConfirmationModal from '@/components/ConfirmationModal';
import JobTimelineModal from '@/components/JobTimelineModal';
import ReviewModal from '@/components/ReviewModal';
import InvoiceModal from '@/components/InvoiceModal';
import { Booking } from '@/types';
import { fetchAPI } from '@/lib/api';
import {
  CreditCard,
  Ban,
  Clock,
  Star,
  FileText,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [timelineTarget, setTimelineTarget] = useState<Booking | null>(null);
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [invoiceTarget, setInvoiceTarget] = useState<Booking | null>(null);
  const [isPayingId, setIsPayingId] = useState<string | null>(null);

  const loadBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAPI<{ success: boolean; bookings: Booking[] }>('/bookings/my');
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load bookings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    try {
      const res = await fetchAPI<{ success: boolean; message: string }>(
        `/bookings/${cancelTarget._id}/cancel`,
        { method: 'PATCH' }
      );
      if (res.success) {
        toast.success(res.message || 'Booking cancelled successfully.');
        setCancelTarget(null);
        loadBookings();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel booking.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Stripe Checkout Session Trigger
  const handlePayNow = async (booking: Booking) => {
    setIsPayingId(booking._id);
    try {
      const res = await fetchAPI<{
        success: boolean;
        sessionId: string;
        url: string;
        isMock?: boolean;
      }>('/payments/create-checkout-session', {
        method: 'POST',
        body: JSON.stringify({ bookingId: booking._id }),
      });

      if (res.success && res.url) {
        toast.info('Redirecting to Stripe secure checkout...');
        window.location.href = res.url;
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not initiate Stripe payment.');
      setIsPayingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            My Repair Bookings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Track job statuses, cancel active requests, and pay online only after service delivery.
          </p>
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
                  <th className="p-4">Service Details</th>
                  <th className="p-4">Technician</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map((booking) => {
                  const isRequested = booking.status === 'requested';
                  const isCompleted = booking.status === 'completed';
                  const isPaid = booking.paymentStatus === 'paid';

                  return (
                    <tr key={booking._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      {/* Service Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={booking.serviceImage || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100'}
                            alt={booking.serviceTitle}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                              {booking.serviceTitle}
                            </p>
                            <span className="text-[11px] text-slate-400">{booking.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Technician */}
                      <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                        {booking.technicianName}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-slate-500 whitespace-nowrap">
                        {new Date(booking.preferredDate).toLocaleDateString()}
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-extrabold text-blue-600 dark:text-blue-400">
                        ${booking.finalAmount || booking.basePrice}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <StatusBadge status={booking.status} />
                      </td>

                      {/* Payment Badge */}
                      <td className="p-4">
                        <StatusBadge status={booking.paymentStatus} />
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        {/* Timeline Tracker Button */}
                        <button
                          onClick={() => setTimelineTarget(booking)}
                          title="View Progress Pipeline"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Clock className="w-3.5 h-3.5" />
                        </button>

                        {/* Cancel Button only when status === 'requested' */}
                        {isRequested && (
                          <button
                            onClick={() => setCancelTarget(booking)}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-semibold border border-rose-200 dark:border-rose-900 hover:bg-rose-600 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        )}

                        {/* Pay Now Button only when status === 'completed' and paymentStatus === 'unpaid' */}
                        {isCompleted && !isPaid && (
                          <button
                            onClick={() => handlePayNow(booking)}
                            disabled={isPayingId === booking._id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm shadow-emerald-500/20 disabled:opacity-50"
                          >
                            {isPayingId === booking._id ? 'Connecting...' : 'Pay Now'}
                          </button>
                        )}

                        {/* Paid Extras: Invoice & Review */}
                        {isPaid && (
                          <>
                            <button
                              onClick={() => setInvoiceTarget(booking)}
                              title="Print / Save Receipt"
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setReviewTarget(booking)}
                              title="Rate Service"
                              className="px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 font-semibold inline-flex items-center gap-1"
                            >
                              <Star className="w-3 h-3 fill-current" />
                              {booking.rating ? `${booking.rating}★` : 'Review'}
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Bookings Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You currently have no repair service requests. Browse our catalog to book a certified technician.
          </p>
        </div>
      )}

      {/* Confirmation Modal for Booking Cancellation */}
      <ConfirmationModal
        isOpen={Boolean(cancelTarget)}
        title="Cancel Repair Booking?"
        message={`Are you sure you want to cancel your request for "${cancelTarget?.serviceTitle}"? This will terminate the repair request.`}
        confirmText="Yes, Cancel Booking"
        confirmVariant="danger"
        isLoading={isCancelling}
        onConfirm={handleCancelConfirm}
        onClose={() => setCancelTarget(null)}
      />

      {/* Progress Timeline Modal */}
      <JobTimelineModal
        isOpen={Boolean(timelineTarget)}
        booking={timelineTarget}
        onClose={() => setTimelineTarget(null)}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={Boolean(reviewTarget)}
        booking={reviewTarget}
        onSuccess={loadBookings}
        onClose={() => setReviewTarget(null)}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={Boolean(invoiceTarget)}
        booking={invoiceTarget}
        onClose={() => setInvoiceTarget(null)}
      />
    </div>
  );
}
