'use client';

import React from 'react';
import { Booking } from '@/types';
import { Wrench, Printer, X, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
}

export default function InvoiceModal({
  isOpen,
  booking,
  onClose,
}: InvoiceModalProps) {
  if (!isOpen || !booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 space-y-6">
        {/* Top Controls */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Official FixMate Receipt
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="invoice-content" className="p-4 sm:p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Fix<span className="text-blue-600">Mate</span>
              </span>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5" /> PAID IN FULL
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Invoice ID: #{booking._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>

          {/* Customer & Technician Info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-semibold uppercase tracking-wider text-slate-400">Billed To (Customer)</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{booking.customerName}</p>
              <p className="text-slate-500">{booking.customerEmail}</p>
              <p className="text-slate-500">{booking.customerPhone}</p>
              <p className="text-slate-500 mt-0.5">{booking.address}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold uppercase tracking-wider text-slate-400">Service Provider (Technician)</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-1">{booking.technicianName}</p>
              <p className="text-slate-500">{booking.technicianEmail}</p>
              <p className="text-slate-500">Service Category: {booking.category}</p>
              <p className="text-slate-500">Date: {new Date(booking.preferredDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Line Item */}
          <div className="border-t border-b border-slate-200 dark:border-slate-800 py-3">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left pb-2">Description</th>
                  <th className="text-right pb-2">Qty</th>
                  <th className="text-right pb-2">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="py-2.5">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{booking.serviceTitle}</p>
                    <p className="text-[11px] text-slate-400">{booking.problemDescription.slice(0, 60)}...</p>
                  </td>
                  <td className="text-right py-2.5 text-slate-500">1</td>
                  <td className="text-right py-2.5 font-bold text-slate-900 dark:text-white">
                    ${booking.finalAmount || booking.basePrice}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center text-sm pt-1">
            <span className="font-semibold text-slate-600 dark:text-slate-400">Total Settled via Stripe Checkout</span>
            <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
              ${booking.finalAmount || booking.basePrice}.00 USD
            </span>
          </div>
        </div>

        <div className="pt-2 text-right print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
