'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import { uploadToImgBB } from '@/lib/imgbb';
import {
  PlusCircle,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  DollarSign,
  Clock,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

const MODES = ['Home Visit', 'Shop Drop-off'];

export default function AddServicePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('1-2 hours');
  const [serviceMode, setServiceMode] = useState<'Home Visit' | 'Shop Drop-off'>('Home Visit');
  const [serviceArea, setServiceArea] = useState(user?.area || 'Dhaka City');

  // ImgBB File Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !category || !description.trim() || !basePrice || !serviceArea.trim()) {
      toast.error('Please complete all required fields.');
      return;
    }

    const priceNum = Number(basePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Base price must be a positive number.');
      return;
    }

    setIsUploading(true);
    let imageUrl = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600';

    try {
      if (imageFile) {
        toast.info('Uploading service banner to ImgBB...');
        imageUrl = await uploadToImgBB(imageFile);
      }

      const res = await fetchAPI<{ success: boolean; message: string; service: any }>('/services', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          image: imageUrl,
          basePrice: priceNum,
          estimatedDuration: estimatedDuration.trim(),
          serviceMode,
          serviceArea: serviceArea.trim(),
        }),
      });

      if (res.success) {
        toast.success('Service created! It is waiting for Admin approval before appearing publicly.');
        router.push('/dashboard/technician/my-services');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit service.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Add New Repair Service
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          List a new repair specialty. All new listings are reviewed by an Admin before public visibility.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Read-Only Technician Snapshot from Session */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs">
            <div>
              <span className="font-semibold text-slate-400">Technician Name (Session):</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{user?.name}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-400">Technician Email (Session):</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Service Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Service Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. iPhone 15 OLED Screen Replacement & Digitizer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category & Service Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Service Mode <span className="text-rose-500">*</span>
              </label>
              <select
                value={serviceMode}
                onChange={(e) => setServiceMode(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Base Price, Estimated Duration & Service Area */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Base Price ($ USD) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 45"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Estimated Duration <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 1-2 hours or 1 day"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Service Area <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dhanmondi, Dhaka"
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              placeholder="Explain diagnostics performed, tools used, OEM parts authenticity, and warranty terms..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* ImgBB File Upload (File Input, not URL field) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Service Banner Image (ImgBB File Upload)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 cursor-pointer bg-slate-50 dark:bg-slate-800/50 transition-colors">
                <Upload className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Photo File
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              {isUploading ? 'Submitting Service...' : 'Create Service Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
