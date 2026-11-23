'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Wrench,
  LayoutDashboard,
  CalendarCheck,
  CreditCard,
  PlusCircle,
  Briefcase,
  Inbox,
  Users,
  ShieldCheck,
  Receipt,
  User as UserIcon,
  Home,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication & Role-Based Access Control Guards
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Check role mismatch
      if (pathname.startsWith('/dashboard/customer') && user.role !== 'customer') {
        router.push(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/technician');
      } else if (pathname.startsWith('/dashboard/technician') && user.role !== 'technician') {
        router.push(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer');
      } else if (pathname.startsWith('/dashboard/admin') && user.role !== 'admin') {
        router.push(user.role === 'technician' ? '/dashboard/technician' : '/dashboard/customer');
      }
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white animate-spin">
            <Wrench className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            Loading FixMate Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  // Sidebar navigation menu per role
  const getNavLinks = () => {
    if (user.role === 'customer') {
      return [
        { label: 'Overview', href: '/dashboard/customer', icon: LayoutDashboard },
        { label: 'My Bookings', href: '/dashboard/customer/bookings', icon: CalendarCheck },
        { label: 'Payment History', href: '/dashboard/customer/payments', icon: CreditCard },
      ];
    }
    if (user.role === 'technician') {
      return [
        { label: 'Overview', href: '/dashboard/technician', icon: LayoutDashboard },
        { label: 'Add Service', href: '/dashboard/technician/add-service', icon: PlusCircle },
        { label: 'My Services', href: '/dashboard/technician/my-services', icon: Briefcase },
        { label: 'Manage Requests', href: '/dashboard/technician/requests', icon: Inbox },
      ];
    }
    if (user.role === 'admin') {
      return [
        { label: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
        { label: 'Manage Users', href: '/dashboard/admin/users', icon: Users },
        { label: 'Service Approval', href: '/dashboard/admin/services', icon: ShieldCheck },
        { label: 'All Bookings', href: '/dashboard/admin/bookings', icon: CalendarCheck },
        { label: 'Transactions', href: '/dashboard/admin/transactions', icon: Receipt },
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Fix<span className="text-blue-600 dark:text-blue-400">Mate</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card inside Sidebar */}
        <div className="p-4 mx-4 mt-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <img
              src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {user.name}
              </p>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {user.role} Menu
          </p>

          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
              </Link>
            );
          })}

          <div className="pt-6">
            <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Settings & Account
            </p>
            <Link
              href="/dashboard/profile"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === '/dashboard/profile'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Update Profile</span>
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Home className="w-4 h-4 text-blue-500" />
            <span>Back to Public Site</span>
          </Link>
          <button
            onClick={() => {
              logout();
              router.push('/');
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white capitalize">
              {user.role} Dashboard
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Home className="w-3.5 h-3.5" />
              Home
            </Link>

            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={user.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              <div className="hidden md:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user.name}
                </p>
                <p className="text-[11px] text-slate-400 leading-tight">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
