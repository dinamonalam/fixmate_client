'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import { Wrench, Mail, Lock, LogIn } from 'lucide-react';
import { toast } from 'sonner';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error('Email and password are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetchAPI<{
        success: boolean;
        message: string;
        token: string;
        user: any;
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        toast.success(res.message || 'Signed in successfully!');

        if (redirectPath) {
          router.push(redirectPath);
        } else if (res.user.role === 'admin') {
          router.push('/dashboard/admin');
        } else if (res.user.role === 'technician') {
          router.push('/dashboard/technician');
        } else {
          router.push('/dashboard/customer');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
              <Wrench className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Welcome Back to FixMate
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in to manage bookings, services, and payments
            </p>
          </div>



          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
