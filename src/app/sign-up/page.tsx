'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import {
  Wrench,
  User,
  Mail,
  Lock,
  Check,
  AlertCircle,
  Briefcase,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'technician'>('customer');
  const [phone, setPhone] = useState('');
  const [area, setArea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Password Validation Requirements:
  // - at least 6 characters
  // - at least one uppercase letter
  // - at least one lowercase letter
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Please ensure your password meets all complexity requirements.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetchAPI<{
        success: boolean;
        message: string;
        token: string;
        user: any;
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
          phone: phone.trim(),
          area: area.trim(),
        }),
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        toast.success(res.message || 'Account created successfully!');
        if (res.user.role === 'technician') {
          router.push('/dashboard/technician');
        } else {
          router.push('/dashboard/customer');
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
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
              Create FixMate Account
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Join Bangladesh’s trusted repair service network
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection Cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                I want to register as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'customer'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-semibold">Customer</span>
                  <span className="text-[10px] text-slate-400">Book repairs</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('technician')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'technician'
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  <span className="text-xs font-semibold">Technician</span>
                  <span className="text-[10px] text-slate-400">Offer services</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Arman Hossain"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address <span className="text-rose-500">*</span>
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

            {/* Optional Phone & Area */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+880 1XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Area / City (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mirpur, Dhaka"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password <span className="text-rose-500">*</span>
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

              {/* Live Password Validation Requirements */}
              <div className="mt-2 space-y-1 text-[11px] p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className={hasMinLength ? 'text-emerald-500 font-bold' : 'text-slate-400'}>
                    {hasMinLength ? '✓' : '○'} At least 6 characters
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={hasUppercase ? 'text-emerald-500 font-bold' : 'text-slate-400'}>
                    {hasUppercase ? '✓' : '○'} At least one uppercase letter (A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={hasLowercase ? 'text-emerald-500 font-bold' : 'text-slate-400'}>
                    {hasLowercase ? '✓' : '○'} At least one lowercase letter (a-z)
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isPasswordValid}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up as ' + (role === 'customer' ? 'Customer' : 'Technician')}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
