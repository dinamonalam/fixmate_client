'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Service } from '@/types';
import { MapPin, User, ArrowRight, Home, Store } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

const DEFAULT_SERVICE_FALLBACK = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop';

export default function ServiceCard({ service }: ServiceCardProps) {
  const [imgSrc, setImgSrc] = useState(service.image || DEFAULT_SERVICE_FALLBACK);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 overflow-hidden group">
      {/* Image Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={imgSrc}
          alt={service.title}
          onError={() => setImgSrc(DEFAULT_SERVICE_FALLBACK)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600/90 text-white shadow-sm backdrop-blur-sm">
            {service.category}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-900/80 text-white flex items-center gap-1 backdrop-blur-sm">
            {service.serviceMode === 'Home Visit' ? (
              <>
                <Home className="w-3 h-3 text-emerald-400" /> Home Visit
              </>
            ) : (
              <>
                <Store className="w-3 h-3 text-amber-400" /> Shop Drop-off
              </>
            )}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-2 min-h-[3rem] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
          {service.title}
        </h3>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {service.description}
        </p>

        {/* Location & Technician */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">Tech: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{service.technicianName}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{service.serviceArea}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">Starting at</span>
            <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
              ${service.basePrice}
            </span>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-sm"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
