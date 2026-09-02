'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, ChevronDown, Check, Loader2 } from 'lucide-react';
import api from '@/lib/axios';

interface AsyncSelectProps {
  apiEndpoint: string;
  value: string;
  onChange: (value: string) => void;
  labelKey: string;
  valueKey: string;
  placeholder?: string;
  initialLabel?: string;
}

export const AsyncSelect: React.FC<AsyncSelectProps> = ({
  apiEndpoint,
  value,
  onChange,
  labelKey,
  valueKey,
  placeholder = 'Select...',
  initialLabel = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string>(initialLabel);

  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset page on new search
      setOptions([]);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch data
  const fetchData = useCallback(async () => {
    if (!hasMore && page !== 1) return;
    setIsLoading(true);
    try {
      const res = await api.get(apiEndpoint, {
        params: { page, limit: 15, search: debouncedSearch },
      });

      let newItems = [];
      let totalPages = 1;

      if (res?.data?.data) {
        newItems = res.data.data;
        totalPages = res.data.pagination?.totalPages || 1;
      } else if (res?.data) {
        newItems = res.data;
      } else if (Array.isArray(res)) {
        newItems = res;
      }

      setOptions((prev) => (page === 1 ? newItems : [...prev, ...newItems]));
      setHasMore(page < totalPages);
    } catch (err) {
      console.error('Failed to fetch options', err);
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, page, debouncedSearch, hasMore]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [fetchData, isOpen]);

  // Fetch initial selected label if value exists but options are empty
  useEffect(() => {
    if (value && !selectedLabel && options.length > 0) {
      const match = options.find((opt) => opt[valueKey] === value);
      if (match) {
        setSelectedLabel(match[labelKey]);
      }
    }
  }, [value, options, valueKey, labelKey, selectedLabel]);

  // Infinite Scroll Observer
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 cursor-pointer flex items-center justify-between focus:outline-hidden focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-slate-800' : 'text-slate-400'}>
          {value ? (selectedLabel || 'Selected') : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 flex flex-col overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-slate-100 flex items-center gap-2 shrink-0">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              className="w-full text-xs outline-hidden placeholder:text-slate-400"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="flex-1 overflow-y-auto p-1">
            {options.length === 0 && !isLoading && (
              <div className="p-3 text-center text-xs text-slate-500">No results found.</div>
            )}
            
            {options.map((opt, index) => {
              const isSelected = opt[valueKey] === value;
              const isLast = index === options.length - 1;

              return (
                <div
                  key={opt[valueKey]}
                  ref={isLast ? lastElementRef : null}
                  className={`px-3 py-2 text-xs rounded-lg cursor-pointer flex items-center justify-between ${
                    isSelected ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => {
                    onChange(opt[valueKey]);
                    setSelectedLabel(opt[labelKey]);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <span>{opt[labelKey]}</span>
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              );
            })}

            {isLoading && (
              <div className="p-3 flex justify-center">
                <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
