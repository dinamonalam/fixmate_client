'use client';

import React, { useEffect, useState } from 'react';
import StatusBadge from '@/components/StatusBadge';
import { Service } from '@/types';
import { fetchAPI } from '@/lib/api';
import { ShieldCheck, Check, X, Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminServicesApprovalPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const url = statusFilter !== 'all' ? `/admin/services?status=${statusFilter}` : '/admin/services';
      const res = await fetchAPI<{ success: boolean; services: Service[] }>(url);
      if (res.success && res.services) {
        setServices(res.services);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load services.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [statusFilter]);

  const handleApproval = async (id: string, approvalStatus: 'approved' | 'rejected') => {
    try {
      const res = await fetchAPI<{ success: boolean; message: string }>(
        `/admin/services/${id}/approval`,
        {
          method: 'PATCH',
          body: JSON.stringify({ approvalStatus }),
        }
      );

      if (res.success) {
        toast.success(res.message);
        loadServices();
      }
    } catch (err: any) {
      toast.error(err.message || 'Approval update failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Service Approval & Moderation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review technician listings. Only approved services appear publicly in search and directory.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
          {['all', 'pending', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : services.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Service Details</th>
                  <th className="p-4">Technician</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {services.map((svc) => (
                  <tr key={svc._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={svc.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100'}
                          alt={svc.title}
                          className="w-10 h-10 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white max-w-[200px] truncate">
                            {svc.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                            {svc.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                      {svc.technicianName}
                    </td>

                    <td className="p-4 text-slate-600 dark:text-slate-400">
                      {svc.category}
                    </td>

                    <td className="p-4 font-extrabold text-blue-600 dark:text-blue-400">
                      ${svc.basePrice}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={svc.approvalStatus} />
                    </td>

                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      {svc.approvalStatus !== 'approved' && (
                        <button
                          onClick={() => handleApproval(svc._id, 'approved')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}
                      {svc.approvalStatus !== 'rejected' && (
                        <button
                          onClick={() => handleApproval(svc._id, 'rejected')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 font-bold"
                        >
                          <X className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Services Found
          </h3>
          <p className="text-xs text-slate-500">
            There are no services in this queue right now.
          </p>
        </div>
      )}
    </div>
  );
}
