'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import { Service } from '@/types';
import { fetchAPI } from '@/lib/api';
import {
  Search,
  Filter,
  ArrowUpDown,
  Wrench,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

const MODES = ['All', 'Home Visit', 'Shop Drop-off'];

const SORTS = [
  { label: 'Newest Listed', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

function BrowseServicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state synchronization
  const initialCategory = searchParams.get('category') || 'All';
  const initialServiceMode = searchParams.get('serviceMode') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'newest';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  const [services, setServices] = useState<Service[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filter form state
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMode, setSelectedMode] = useState(initialServiceMode);
  const [selectedSort, setSelectedSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  // Sync state when URL params change (e.g. Back/Forward or clicking category from Home)
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
    setSelectedMode(searchParams.get('serviceMode') || 'All');
    setSearchTerm(searchParams.get('search') || '');
    setSelectedSort(searchParams.get('sort') || 'newest');
    setPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  // Fetch from server on query changes
  useEffect(() => {
    async function loadServices() {
      setIsLoading(true);
      try {
        const query = new URLSearchParams();
        if (searchTerm.trim()) query.set('search', searchTerm.trim());
        if (selectedCategory && selectedCategory !== 'All') query.set('category', selectedCategory);
        if (selectedMode && selectedMode !== 'All') query.set('serviceMode', selectedMode);
        if (selectedSort) query.set('sort', selectedSort);
        query.set('page', page.toString());
        query.set('limit', '9');

        const res = await fetchAPI<{
          success: boolean;
          services: Service[];
          pagination: { total: number; totalPages: number; page: number };
        }>(`/services?${query.toString()}`);

        if (res.success) {
          setServices(res.services || []);
          setTotal(res.pagination?.total || 0);
          setTotalPages(res.pagination?.totalPages || 1);
        }
      } catch (err) {
        console.warn('Error fetching services:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadServices();
  }, [selectedCategory, selectedMode, selectedSort, page, searchParams]);

  const updateURL = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v || v === 'All') {
        params.delete(k);
      } else {
        params.set(k, v.toString());
      }
    });
    router.push(`/services?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    updateURL({ search: searchTerm, page: 1 });
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
    updateURL({ category: cat, page: 1 });
  };

  const handleModeChange = (mode: string) => {
    setSelectedMode(mode);
    setPage(1);
    updateURL({ serviceMode: mode, page: 1 });
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    setPage(1);
    updateURL({ sort, page: 1 });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedMode('All');
    setSelectedSort('newest');
    setPage(1);
    router.push('/services');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Verified Repair Directory
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Browse Repair Services
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Search by appliance, device issue, technician location, or filter by service mode. All work completed before you pay.
            </p>
          </div>

          {/* Search, Filter & Sort Bar (Challenge 1) */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            {/* Top row: Search input & Sort */}
            <div className="flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by service title, category, or problem description..."
                  className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm"
                >
                  Search
                </button>
              </form>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 shrink-0">
                <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={selectedSort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SORTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              {(searchTerm || selectedCategory !== 'All' || selectedMode !== 'All' || selectedSort !== 'newest') && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Service Mode Selector */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="font-semibold text-slate-400 shrink-0">Service Mode:</span>
              {MODES.map((mode) => {
                const isActive = selectedMode === mode;
                return (
                  <button
                    key={mode}
                    onClick={() => handleModeChange(mode)}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Metric */}
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400">
            <span>
              Showing {services.length} of {total} approved repair services
            </span>
            <span>
              Page {page} of {totalPages}
            </span>
          </div>

          {/* Service Cards Grid (3-4 desktop, 2 tablet, 1 mobile) */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
                />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            /* Friendly Empty State */
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <Wrench className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                No Repair Services Found
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                We couldn&apos;t find any services matching your criteria. Try adjusting your search keyword or clearing active filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm hover:bg-blue-700 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => {
                  const p = Math.max(1, page - 1);
                  setPage(p);
                  updateURL({ page: p });
                }}
                disabled={page <= 1}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setPage(num);
                    updateURL({ page: num });
                  }}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    page === num
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() => {
                  const p = Math.min(totalPages, page + 1);
                  setPage(p);
                  updateURL({ page: p });
                }}
                disabled={page >= totalPages}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BrowseServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BrowseServicesContent />
    </Suspense>
  );
}
