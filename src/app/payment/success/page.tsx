'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { fetchAPI } from '@/lib/api';
import { PaymentRecord } from '@/types';
import { CheckCircle2, ArrowRight, Printer, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setError('No payment session identifier found.');
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetchAPI<{
          success: boolean;
          message: string;
          payment: PaymentRecord;
        }>(`/payments/verify?session_id=${encodeURIComponent(sessionId)}`);

        if (res.success && res.payment) {
          setPayment(res.payment);
          // Trigger celebratory confetti
          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch (e) {
            // Ignore confetti error
          }
        }
      } catch (err: any) {
        setError(err.message || 'Payment verification encountered an error.');
      } finally {
        setIsLoading(false);
      }
    }

    verifyPayment();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
          {isLoading ? (
            <div className="py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Verifying Stripe checkout session...
              </p>
            </div>
          ) : error ? (
            <div className="py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Verification Issue
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{error}</p>
              <button
                onClick={() => router.push('/dashboard/customer/bookings')}
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm"
              >
                Go to My Bookings
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in-95">
              <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20 ring-8 ring-emerald-50 dark:ring-emerald-950/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Transaction Confirmed
                </span>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                  Payment Successful!
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Thank you! Your payment has been deposited and the repair job is now marked paid.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Service:</span>
                  <strong className="text-slate-900 dark:text-white truncate max-w-[200px]">
                    {payment?.serviceTitle}
                  </strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Technician:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">
                    {payment?.technicianName}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px] truncate max-w-[180px]">
                    {payment?.transactionId}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 text-sm">
                  <span className="font-semibold text-slate-600 dark:text-slate-400">Amount Paid:</span>
                  <strong className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                    ${payment?.amount}.00 USD
                  </strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => router.push('/dashboard/customer/bookings')}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Go to My Bookings</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
