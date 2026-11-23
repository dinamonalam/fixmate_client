'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { Service } from '@/types';
import { fetchAPI } from '@/lib/api';
import {
  Wrench,
  Search,
  ShieldCheck,
  CheckCircle,
  Clock,
  CreditCard,
  Smartphone,
  Laptop,
  Wind,
  Tv,
  Zap,
  ArrowRight,
  Star,
  Users,
  Award,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetchAPI<{ success: boolean; services: Service[] }>('/services/featured');
        if (res.success && res.services) {
          setFeaturedServices(res.services);
        }
      } catch (err) {
        console.warn('Could not fetch live featured services, will display fallback defaults:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      router.push(`/services?search=${encodeURIComponent(searchKeyword.trim())}`);
    } else {
      router.push('/services');
    }
  };

  const categories = [
    { name: 'Smartphone', icon: Smartphone, count: '120+ Repairs', color: 'from-blue-500 to-indigo-600' },
    { name: 'Laptop & PC', icon: Laptop, count: '85+ Repairs', color: 'from-indigo-500 to-purple-600' },
    { name: 'AC', icon: Wind, count: '140+ Repairs', color: 'from-cyan-500 to-blue-600' },
    { name: 'Refrigerator', icon: Wrench, count: '90+ Repairs', color: 'from-teal-500 to-emerald-600' },
    { name: 'TV', icon: Tv, count: '65+ Repairs', color: 'from-amber-500 to-orange-600' },
    { name: 'Washing Machine', icon: Wrench, count: '75+ Repairs', color: 'from-purple-500 to-pink-600' },
    { name: 'Electrical', icon: Zap, count: '110+ Repairs', color: 'from-yellow-500 to-amber-600' },
  ];

  const steps = [
    {
      step: '01',
      title: 'Find a Service',
      desc: 'Browse verified technicians by category, device problem, price, and customer reviews.',
      icon: Search,
    },
    {
      step: '02',
      title: 'Send a Request',
      desc: 'Submit your repair details, address, and preferred time with zero upfront payment.',
      icon: Clock,
    },
    {
      step: '03',
      title: 'Technician Fixes It',
      desc: 'Your technician accepts the job and repairs your device via Home Visit or Shop Drop-off.',
      icon: Wrench,
    },
    {
      step: '04',
      title: 'Pay After Completion',
      desc: 'Inspect your fixed device, approve the final bill, and pay securely via Stripe online.',
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero / Banner Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 py-16 sm:py-24 border-b border-slate-200/60 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Headline */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Verified Technicians • 100% Pay-After-Service Guarantee
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                  Broken Device? <br className="hidden sm:inline" />
                  Get It Fixed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Verified Technicians</span>.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  FixMate is Bangladesh’s premier on-demand repair ecosystem for smartphones, laptops, ACs, refrigerators, TVs, and home appliances. Track every step in real-time and pay only when the job is done right.
                </p>

                {/* Search Bar Lead */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="max-w-xl mx-auto lg:mx-0 flex items-center p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl shadow-blue-500/5 focus-within:border-blue-500"
                >
                  <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="Search iPhone screen, AC gas refill, MacBook..."
                    className="w-full px-3 py-2 text-sm bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all shrink-0"
                  >
                    Search
                  </button>
                </form>

                {/* Trust Badges */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Vetted Background Checked
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Zero Upfront Fee
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Stripe Secure Checkout
                  </span>
                </div>
              </div>

              {/* Right Hero Image Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop"
                      alt="Certified technician fixing motherboard"
                      className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Floating Floating Stat Badge */}
                  <div className="absolute -bottom-6 -left-6 sm:bottom-6 sm:-left-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-extrabold text-xl">
                      99%
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Successful Fix Rate</p>
                      <p className="text-[11px] text-slate-500">Over 5,000+ completed repairs</p>
                    </div>
                  </div>

                  <div className="absolute -top-6 -right-6 sm:top-6 sm:-right-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3">
                    <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">4.9 / 5.0 Rating</p>
                      <p className="text-[11px] text-slate-500">From verified customers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Featured Services Section */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Verified Listings
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Featured Repair Services
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-lg">
                Explore popular on-demand repair listings from our top-rated technicians with transparent pricing.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all shadow-sm"
            >
              Browse All Services
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
                />
              ))}
            </div>
          ) : featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <Wrench className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Services Available Yet</h3>
              <p className="text-sm text-slate-500 mt-1">Please run the seed script or check back soon.</p>
            </div>
          )}
        </section>

        {/* Extra Section 1: How FixMate Works (4-Step Flow) */}
        <section className="py-16 sm:py-20 bg-slate-100/60 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Simple & Transparent
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                How FixMate Works
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                A seamless 4-step pipeline designed to safeguard customers and empower skilled technicians.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((st) => {
                const Icon = st.icon;
                return (
                  <div
                    key={st.step}
                    className="relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-3xl font-black text-slate-200 dark:text-slate-700">
                          {st.step}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {st.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Extra Section 2: Popular Categories & Why Choose Us */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Categories Grid */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Explore Categories
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Popular Repair Categories
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Select a category to view specialized technicians and available packages.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.name}
                    href={`/services?category=${encodeURIComponent(cat.name)}`}
                    className="flex flex-col items-center text-center p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-lg hover:border-blue-500 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all mb-3">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate w-full">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] text-slate-400 mt-0.5">
                      {cat.count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Why Choose Us & Trust Metrics */}
          <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Trust & Reliability
                </span>
                <h3 className="text-3xl font-extrabold tracking-tight">
                  Why Thousands Trust FixMate in Bangladesh
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We eliminated repair anxiety. No hidden fees, no unauthorized parts replacement, and you never hand over payment until you have tested your repaired device in person.
                </p>
                <div className="pt-2">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all"
                  >
                    Find a Technician Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <Users className="w-8 h-8 text-blue-400 mb-2" />
                  <p className="text-2xl font-black text-white">500+</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Verified Technicians</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <Award className="w-8 h-8 text-amber-400 mb-2" />
                  <p className="text-2xl font-black text-white">30 Days</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Service Warranty</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <CreditCard className="w-8 h-8 text-emerald-400 mb-2" />
                  <p className="text-2xl font-black text-white">$0 Deposit</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Pay After Completion</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <Clock className="w-8 h-8 text-cyan-400 mb-2" />
                  <p className="text-2xl font-black text-white">2 Hours</p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">Average Response Time</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
