'use client';

import React from 'react';
import { Booking } from '@/types';
import { X, CheckCircle, Clock, CheckCircle2, DollarSign, Ban } from 'lucide-react';

interface JobTimelineModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
}

export default function JobTimelineModal({
  isOpen,
  booking,
  onClose,
}: JobTimelineModalProps) {
  if (!isOpen || !booking) return null;

  const steps = [
    { key: 'requested', label: 'Requested', desc: 'Repair request submitted by customer' },
    { key: 'accepted', label: 'Accepted', desc: 'Technician approved & scheduled work' },
    { key: 'in-progress', label: 'In Progress', desc: 'Hardware repair & diagnostic underway' },
    { key: 'completed', label: 'Completed', desc: 'Work finished, ready for payment' },
    { key: 'paid', label: 'Paid', desc: 'Secure Stripe settlement confirmed' },
  ];

  // Helper to determine status index
  const getStepIndex = (status: string, paymentStatus: string) => {
    if (status === 'cancelled' || status === 'rejected') return -1;
    if (paymentStatus === 'paid') return 4;
    if (status === 'completed') return 3;
    if (status === 'in-progress') return 2;
    if (status === 'accepted') return 1;
    return 0;
  };

  const currentStepIdx = getStepIndex(booking.status, booking.paymentStatus);
  const isTerminated = booking.status === 'cancelled' || booking.status === 'rejected';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Job Status Pipeline Tracker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Service: <strong className="text-slate-700 dark:text-slate-300">{booking.serviceTitle}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isTerminated ? (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center">
            <Ban className="w-8 h-8 text-rose-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-rose-700 dark:text-rose-300 capitalize">
              Job Terminated ({booking.status})
            </h4>
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">
              This job was {booking.status} and cannot proceed further.
            </p>
          </div>
        ) : (
          /* Step Flow */
          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {steps.map((step, idx) => {
              const isPast = idx < currentStepIdx;
              const isCurrent = idx === currentStepIdx;
              const isFuture = idx > currentStepIdx;

              return (
                <div key={step.key} className="relative flex items-start gap-4">
                  {/* Step Dot */}
                  <div
                    className={`absolute -left-6 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isPast
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-500/20 animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isCurrent ? (
                      <Clock className="w-3.5 h-3.5" />
                    ) : (
                      idx + 1
                    )}
                  </div>

                  {/* Step Content */}
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        isCurrent
                          ? 'text-blue-600 dark:text-blue-400'
                          : isPast
                          ? 'text-slate-900 dark:text-slate-100'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed History Log */}
        {booking.statusHistory && booking.statusHistory.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Event Log
            </h5>
            <div className="max-h-36 overflow-y-auto space-y-2 text-xs">
              {booking.statusHistory.map((h, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">
                      {h.status}
                    </span>
                    {h.note && (
                      <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                        {h.note}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {new Date(h.changedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
