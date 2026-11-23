'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Captured runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xl mx-auto">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Something went wrong!
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {error?.message || 'An unexpected error occurred while processing your request.'}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700"
        >
          <RefreshCcw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Home className="w-4 h-4" />
          Home
        </Link>
      </div>
    </div>
  );
}
