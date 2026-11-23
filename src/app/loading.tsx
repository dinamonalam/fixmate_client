import React from 'react';
import { Wrench } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 animate-bounce">
          <Wrench className="w-7 h-7" />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-blue-400/30 animate-ping -z-10" />
      </div>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wide">
        Loading FixMate...
      </p>
    </div>
  );
}
