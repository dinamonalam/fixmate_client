'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Wrench, Menu, X, Sun, Moon, User as UserIcon, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/sign-in';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'technician') return '/dashboard/technician';
    return '/dashboard/customer';
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'How It Works / About', href: '/about' },
  ];

  const handleSignOut = () => {
    logout();
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5 transition-transform group-hover:rotate-12" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Fix<span className="text-blue-600 dark:text-blue-400">Mate</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase text-slate-500 dark:text-slate-400 font-semibold -mt-1">
              Repair Network
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Theme Toggle + Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          {user ? (
            /* Logged-In User Dropdown */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all bg-white dark:bg-slate-800"
              >
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                  {user.name}
                </span>
                <UserAvatar name={user.name} image={user.image} size="sm" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 py-2 animate-in fade-in zoom-in-95 z-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold capitalize bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      Role: {user.role}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-blue-600" />
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      Update Profile
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged-Out State */
            <div className="flex items-center gap-2">
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 transition-all hover:shadow"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  pathname === link.href
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-950 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <UserAvatar name={user.name} image={user.image} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 capitalize font-medium">
                      {user.role}
                    </span>
                  </div>
                </div>
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Go to Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Update Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
