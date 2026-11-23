'use client';

import React, { useEffect, useState } from 'react';
import { PaymentRecord } from '@/types';
import { fetchAPI } from '@/lib/api';
import { Receipt, DollarSign, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await fetchAPI<{
          success: boolean;
          payments: PaymentRecord[];
          totalRevenue: number;
        }>('/admin/payments');

        if (res.success) {
          setPayments(res.payments || []);
          setTotalRevenue(res.totalRevenue || 0);
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to load transaction history.');
      } finally {
        setIsLoading(false);
      }
    }
    loadTransactions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Platform Transactions
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete audit trail of all Stripe payments processed through the FixMate platform.
          </p>
        </div>

        {/* Total Platform Revenue Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-100">Total Stripe Revenue</span>
            <p className="text-2xl font-black">${totalRevenue}.00 USD</p>
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
                  <th className="p-4">Customer</th>
                  <th className="p-4">Technician</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Stripe Transaction ID</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      {p.customerName}
                    </td>
                    <td className="p-4 text-slate-700 dark:text-slate-300">
                      {p.technicianName}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[180px]">
                      {p.serviceTitle}
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
            Once repair jobs are paid with Stripe, live transaction audit rows will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
