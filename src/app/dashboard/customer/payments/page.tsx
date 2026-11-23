'use client';

import React, { useEffect, useState } from 'react';
import { PaymentRecord } from '@/types';
import { fetchAPI } from '@/lib/api';
import { CreditCard, Receipt, Calendar, User, ArrowUpRight } from 'lucide-react';

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await fetchAPI<{ success: boolean; payments: PaymentRecord[] }>('/payments/my');
        if (res.success && res.payments) {
          setPayments(res.payments);
        }
      } catch (err) {
        console.warn('Error loading payments:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPayments();
  }, []);

  const totalSpent = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Payment History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Detailed ledger of all completed Stripe transactions and service receipts.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Settled</span>
            <p className="text-xl font-black text-slate-900 dark:text-white">${totalSpent}.00 USD</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : payments.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Service Title</th>
                  <th className="p-4">Technician</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Stripe Transaction ID</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {p.serviceTitle}
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      {p.technicianName}
                    </td>
                    <td className="p-4 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      ${p.amount}.00
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-500">
                      {p.transactionId}
                    </td>
                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(p.paidAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <Receipt className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Transactions Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Once you complete and pay for a repair job, your official payment receipt and Stripe transaction ID will be stored here.
          </p>
        </div>
      )}
    </div>
  );
}
