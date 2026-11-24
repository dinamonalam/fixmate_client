'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import { uploadToImgBB } from '@/lib/imgbb';
import { User, Mail, Phone, MapPin, FileText, Upload, Save, ShieldCheck, Trash2 } from 'lucide-react';
import UserAvatar from '@/components/UserAvatar';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, updateUser, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [area, setArea] = useState(user?.area || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    try {
      let finalImageUrl = imagePreview;

      if (imageFile) {
        toast.info('Uploading updated profile photo to ImgBB...');
        finalImageUrl = await uploadToImgBB(imageFile);
      }

      const res = await fetchAPI<{
        success: boolean;
        message: string;
        user: any;
      }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          area: area.trim(),
          bio: bio.trim(),
          image: finalImageUrl,
        }),
      });

      if (res.success && res.user) {
        updateUser(res.user);
        toast.success('Profile updated successfully! Header and avatar updated.');
        refreshUser();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Update Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your contact information, location, bio, and profile photo.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Upload */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <UserAvatar name={name || user?.name} image={imagePreview} size="xl" />
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-blue-500 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer bg-slate-50 dark:bg-slate-800 transition-colors">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Upload Photo (ImgBB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setImageFile(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Optional profile photo (JPG, PNG or WebP)
              </p>
            </div>
          </div>

          {/* Read-Only Email & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-xs">
            <div>
              <span className="font-semibold text-slate-400">Email Address (Read-only):</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{user?.email}</p>
            </div>
            <div>
              <span className="font-semibold text-slate-400">Account Role (Read-only):</span>
              <p className="font-bold text-blue-600 dark:text-blue-400 capitalize mt-0.5">{user?.role}</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Phone & Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  placeholder="+880 1XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Area / City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Dhanmondi, Dhaka"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Bio (Specializations / Profile Overview)
            </label>
            <textarea
              rows={3}
              placeholder="Tell others about your experience, certifications, or expectations..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
