'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Service, User } from '@/types';
import { fetchAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  Wrench,
  Clock,
  MapPin,
  Home,
  Store,
  ShieldCheck,
  Calendar,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  User as UserIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import UserAvatar from '@/components/UserAvatar';

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const serviceId = params?.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [technician, setTechnician] = useState<Partial<User> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Booking Form State
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccessId, setBookingSuccessId] = useState<string | null>(null);

  // Auto-fill phone and area if user has them saved
  useEffect(() => {
    if (user) {
      if (user.phone) setCustomerPhone(user.phone);
      if (user.area) setAddress(user.area);
    }
  }, [user]);

  // Set default minimum date to today
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function loadService() {
      setIsLoading(true);
      try {
        const res = await fetchAPI<{
          success: boolean;
          service: Service;
          technician: Partial<User>;
        }>(`/services/${serviceId}`);

        if (res.success && res.service) {
          setService(res.service);
          setTechnician(res.technician || null);
        }
      } catch (err: any) {
        console.warn('Error fetching service:', err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  const handleRequestClick = () => {
    if (!user) {
      router.push(`/sign-in?redirect=${encodeURIComponent(`/services/${serviceId}`)}`);
      return;
    }
    if (user.role !== 'customer') {
      toast.error('Only registered customers can request repair services.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerPhone.trim() || !address.trim() || !preferredDate || !problemDescription.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    if (problemDescription.trim().length < 20) {
      toast.error('Problem description must be at least 20 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetchAPI<{ success: boolean; message: string; booking: any }>('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          serviceId: service?._id,
          customerPhone: customerPhone.trim(),
          address: address.trim(),
          preferredDate,
          problemDescription: problemDescription.trim(),
        }),
      });

      if (res.success) {
        toast.success(res.message || 'Repair request submitted successfully!');
        setBookingSuccessId(res.booking?._id);
        setIsModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit repair request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Service Not Found</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
            This service listing does not exist, has been removed, or is currently pending administrator approval.
          </p>
          <button
            onClick={() => router.push('/services')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold"
          >
            Browse Other Services
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Success Banner if just booked */}
          {bookingSuccessId && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                  Your repair request was submitted successfully! The technician has been notified.
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard/customer/bookings')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0"
              >
                View in My Bookings
              </button>
            </div>
          )}

          {/* Main Service Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Image & Description */}
            <div className="lg:col-span-8 space-y-6">
              {/* Large Image Banner */}
              <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800">
                <img
                  src={service.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800'}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
                    {service.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-sm">
                    {service.serviceMode}
                  </span>
                </div>
              </div>

              {/* Title & Specs */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    {service.title}
                  </h1>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-500" />
                      Duration: <strong className="text-slate-800 dark:text-slate-200">{service.estimatedDuration}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      Coverage: <strong className="text-slate-800 dark:text-slate-200">{service.serviceArea}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      {service.serviceMode === 'Home Visit' ? (
                        <>
                          <Home className="w-4 h-4 text-emerald-500" />
                          <strong className="text-slate-800 dark:text-slate-200">Doorstep Home Visit</strong>
                        </>
                      ) : (
                        <>
                          <Store className="w-4 h-4 text-amber-500" />
                          <strong className="text-slate-800 dark:text-slate-200">Shop Drop-off</strong>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                    Service Overview & What’s Included
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {service.description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                    <strong>FixMate Guarantee:</strong> You will not be billed today. Your technician will inspect your device, confirm the repair estimate, and work on it. Once completed, you test the device and pay securely with Stripe.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Booking Action & Technician Profile */}
            <div className="lg:col-span-4 space-y-6">
              {/* Pricing & Booking Action Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Starting Diagnostic Base Price
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                      ${service.basePrice}
                    </span>
                    <span className="text-xs text-slate-500">USD</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Final price may be adjusted if hardware parts are required (confirmed prior to replacement).
                  </p>
                </div>

                <div className="pt-2">
                  {user && user.role !== 'customer' ? (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Logged in as <strong className="capitalize">{user.role}</strong>. Only customers can book repair requests.
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handleRequestClick}
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Request Repair</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Pay only after service completion</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Free cancellation while in requested status</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Step-by-step real-time pipeline tracking</span>
                  </div>
                </div>
              </div>

              {/* Technician Summary Card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Specialist
                </span>

                <div className="flex items-center gap-3.5">
                  <UserAvatar
                    name={service.technicianName}
                    image={technician?.image}
                    size="lg"
                    className="rounded-2xl"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {service.technicianName}
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      Verified FixMate Technician
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {technician?.area || service.serviceArea}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {technician?.bio ||
                    'Certified electronics hardware and appliance repair professional with proven industry track record.'}
                </p>

                <div className="space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{service.technicianEmail}</span>
                  </div>
                  {technician?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{technician.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Repair Request Modal (Customer Only) */}
      {isModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Send Repair Request
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Service: <strong className="text-slate-700 dark:text-slate-300">{service.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              {/* Read-Only Customer Info from Session */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Customer Name (From Session)
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Customer Email (From Session)
                  </label>
                  <input
                    type="text"
                    value={user.email}
                    readOnly
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+880 1XXXXXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Service / Pickup Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Service / Pickup Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. House 14, Road 5, Mirpur 10, Dhaka"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Preferred Date (today or future) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Service Date (Today or Future) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Problem Description (min 20 chars) */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Problem Description <span className="text-rose-500">*</span>
                  </label>
                  <span
                    className={`text-[11px] ${
                      problemDescription.trim().length >= 20 ? 'text-emerald-500 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {problemDescription.trim().length}/20 chars min
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe what is wrong with your device, error symptoms, or physical damage..."
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || problemDescription.trim().length < 20}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Request...' : 'Confirm Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
