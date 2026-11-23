'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Users,
  Award,
  ArrowRight,
  HeartHandshake,
  Target,
} from 'lucide-react';

export default function AboutPage() {
  const steps = [
    {
      num: '01',
      title: 'Certified Technician Onboarding',
      desc: 'Technicians submit identity documents, trade certificates, and service portfolios. Platform admins moderate and approve every single service listing before public visibility.',
    },
    {
      num: '02',
      title: 'Customer Problem Submission',
      desc: 'Customers submit a repair request describing the device issue with preferred date and address. Zero upfront payment is required.',
    },
    {
      num: '03',
      title: 'Transparent Repair Pipeline',
      desc: 'Jobs move step by step: Requested ➔ Accepted ➔ In Progress ➔ Completed. Both parties can see the live milestone tracker at every step.',
    },
    {
      num: '04',
      title: 'Post-Delivery Stripe Settlement',
      desc: 'Only after the customer verifies their device is functioning does the "Pay Now" button activate for secure card payment via Stripe.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 py-14 sm:py-20 space-y-20">
        {/* Mission Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <HeartHandshake className="w-4 h-4 text-blue-600" />
            Our Mission & Story
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-3xl mx-auto leading-tight">
            Fixing the Broken Trust in the Device Repair Industry
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            In Bangladesh and across the globe, customers struggle to find reputable technicians, fear unauthorized component swaps, and are pressured to pay before work is delivered. FixMate was engineered to establish radical transparency.
          </p>
        </section>

        {/* 4-Step Detailed Architecture */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Operational Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              How the System Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {steps.map((st) => (
              <div
                key={st.num}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <span className="text-4xl font-black text-blue-600/20 dark:text-blue-400/20 mb-3 block">
                    {st.num}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {st.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Pillars */}
        <section className="bg-slate-100/70 dark:bg-slate-900/60 border-y border-slate-200 dark:border-slate-800 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Moderation</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every service added or edited by a technician returns to pending status until verified by our compliance team.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pay-After-Service Gate</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Stripe Checkout sessions can only be spawned once the job status reaches completed, verified by cryptographic checks.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Transparent Reviews</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Only customers with paid, completed bookings are authorized to leave ratings and feedback for technicians.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Ready to experience effortless device repair?
          </h2>
          <div className="flex justify-center gap-4">
            <Link
              href="/services"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-lg shadow-blue-500/20"
            >
              Browse Services
            </Link>
            <Link
              href="/sign-up"
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Join as Technician
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
