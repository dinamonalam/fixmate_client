'use client';

import React from 'react';
import Link from 'next/link';
import { Wrench, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center space-y-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xl mx-auto">
          <Wrench className="w-12 h-12 rotate-45" />
        </div>
        <span className="absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white shadow">
          404
        </span>
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Device Diagnostic: Page Not Found!
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The requested repair URL or resource seems to be detached or undergoing system maintenance.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Search className="w-4 h-4" />
          Browse Services
        </Link>
      </div>
    </div>
  );
}
