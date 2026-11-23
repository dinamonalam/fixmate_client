'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Service } from '@/types';
import { fetchAPI } from '@/lib/api';
import {
  Briefcase,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  PlusCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal State
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAPI<{ success: boolean; services: Service[] }>('/services/technician/my-services');
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
  }, []);

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setEditTitle(service.title);
    setEditPrice(service.basePrice.toString());
    setEditDesc(service.description);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setIsUpdating(true);
    try {
      const res = await fetchAPI<{ success: boolean; message: string }>(
        `/services/${editingService._id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            title: editTitle.trim(),
            basePrice: Number(editPrice),
            description: editDesc.trim(),
          }),
        }
      );

      if (res.success) {
        toast.success('Service updated and moved back to pending status for Admin moderation.');
        setEditingService(null);
        loadServices();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update service.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleAvailability = async (service: Service) => {
    try {
      const res = await fetchAPI<{ success: boolean; message: string; isAvailable: boolean }>(
        `/services/${service._id}/availability`,
        { method: 'PATCH' }
      );
      if (res.success) {
        toast.success(res.message);
        loadServices();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to toggle availability.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetchAPI<{ success: boolean; message: string }>(
        `/services/${deleteTarget._id}`,
        { method: 'DELETE' }
      );
      if (res.success) {
        toast.success(res.message || 'Service deleted.');
        setDeleteTarget(null);
        loadServices();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete service.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            My Repair Services
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Full CRUD management. Editing a service resets its approval status to pending.
          </p>
        </div>

        <Link
          href="/dashboard/technician/add-service"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Service</span>
        </Link>
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
                  <th className="p-4">Service</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Approval Status</th>
                  <th className="p-4">Availability</th>
                  <th className="p-4 text-right">Actions</th>
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
                        <span className="font-bold text-slate-900 dark:text-white max-w-[220px] truncate">
                          {svc.title}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-600 dark:text-slate-300">
                      {svc.category}
                    </td>

                    <td className="p-4 font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                      ${svc.basePrice}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={svc.approvalStatus} />
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleAvailability(svc)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          svc.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {svc.isAvailable ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{svc.isAvailable ? 'Visible' : 'Hidden'}</span>
                      </button>
                    </td>

                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(svc)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                        title="Edit Service"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(svc)}
                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
          <Briefcase className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Services Created Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You have not listed any repair services. Click Add Service above to begin receiving booking requests.
          </p>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Edit Repair Service
                </h3>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                  Note: Editing will reset approval status to &quot;Pending&quot; for Admin review.
                </p>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Base Price ($ USD)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save & Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Repair Service?"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmText="Delete Service"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
