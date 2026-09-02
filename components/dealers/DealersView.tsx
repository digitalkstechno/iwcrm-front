'use client';

import React, { useState, useMemo } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Dealer, DealerStatus } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Store,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export const DealersView: React.FC = () => {
  const { dealers, setOpenModal, deleteDealer, showToast } = useCRM();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [regionFilter, setRegionFilter] = useState<string>('All');
  const [selectedDealerIds, setSelectedDealerIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered Dealers
  const filteredDealers = useMemo(() => {
    return dealers.filter((d) => {
      const matchSearch =
        searchTerm === '' ||
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.dealerCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || d.status === statusFilter;
      const matchRegion =
        regionFilter === 'All' ||
        d.location.toLowerCase().includes(regionFilter.toLowerCase());

      return matchSearch && matchStatus && matchRegion;
    });
  }, [dealers, searchTerm, statusFilter, regionFilter]);

  const displayedDealers = filteredDealers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalResults = 124 + (filteredDealers.length - 6);

  const handleExportCSV = () => {
    const headers = ['Dealer Code', 'Name', 'Contact Person', 'Email', 'Phone', 'Location', 'Status', 'Tier', 'Total Leads', 'Conversion Rate %'];
    const rows = filteredDealers.map((d) => [
      d.dealerCode,
      `"${d.name}"`,
      `"${d.contactPerson}"`,
      d.email,
      d.phone,
      `"${d.location}"`,
      d.status,
      d.tier || 'Gold',
      d.totalLeads,
      d.conversionRate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dealers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({ type: 'info', title: 'Export Complete', message: `Exported ${filteredDealers.length} dealers to CSV.` });
  };

  return (
    <div id="dealers-module" className="space-y-5 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Page Header (Matching Image 7 Layout) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Dealers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage authorized dealership network, territory distributions, and performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="dealers-add-dealer-top-btn"
            onClick={() => setOpenModal('dealer_form')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Dealer</span>
          </button>
        </div>
      </div>

      {/* Network Stats Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Network</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{totalResults}</p>
          <span className="text-[11px] text-emerald-600 font-medium">95.2% Operational</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Active Dealerships</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">
            {118 + (dealers.filter((d) => d.status === 'Active').length - 4)}
          </p>
          <span className="text-[11px] text-slate-400 font-normal">Active agreements</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Avg Conversion Rate</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">61.4%</p>
          <span className="text-[11px] text-emerald-600 font-medium">+3.8% MoM</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Credit Allocated</p>
          <p className="text-xl font-bold text-blue-600 mt-0.5">$18.5M</p>
          <span className="text-[11px] text-slate-400 font-normal">Active credit line</span>
        </div>
      </div>

      {/* Main Table Card (Image 7 Layout) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="dealers-search-input"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search dealers by name, contact, or code..."
              className="w-full pl-9 pr-4 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-xl placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending</option>
              <option value="Blocked">Blocked</option>
            </select>

            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Regions</option>
              <option value="Northwest">Northwest</option>
              <option value="South">South</option>
              <option value="East">East Coast</option>
              <option value="Midwest">Midwest</option>
              <option value="West">West Coast</option>
            </select>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Dealers Table (Exact match to Image 7) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 border-b border-slate-200">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      displayedDealers.length > 0 &&
                      displayedDealers.every((d) => selectedDealerIds.includes(d.id))
                    }
                    onChange={(e) => {
                      if (e.target.checked) setSelectedDealerIds(displayedDealers.map((d) => d.id));
                      else setSelectedDealerIds([]);
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="py-3 px-4 font-semibold">Dealer Name</th>
                <th className="py-3 px-4 font-semibold">Contact Person</th>
                <th className="py-3 px-4 font-semibold">Region / Territory</th>
                <th className="py-3 px-4 font-semibold text-right">Total Leads</th>
                <th className="py-3 px-4 font-semibold text-right">Conv. Rate</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedDealers.map((dealer) => {
                const initials = dealer.name.substring(0, 2).toUpperCase();

                return (
                  <tr
                    key={dealer.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setOpenModal('dealer_detail', dealer)}
                  >
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedDealerIds.includes(dealer.id)}
                        onChange={() => {
                          setSelectedDealerIds((prev) =>
                            prev.includes(dealer.id)
                              ? prev.filter((i) => i !== dealer.id)
                              : [...prev, dealer.id]
                          );
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>

                    {/* Dealer Name with Monogram Box */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                            {dealer.name}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 leading-none">
                            #{dealer.dealerCode} · {dealer.tier || 'Gold Tier'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Person */}
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800 leading-tight">{dealer.contactPerson}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{dealer.email}</p>
                    </td>

                    {/* Region */}
                    <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {dealer.location}
                      </span>
                    </td>

                    {/* Total Leads */}
                    <td className="py-3.5 px-4 text-right text-xs font-bold text-slate-800">
                      {dealer.totalLeads.toLocaleString()}
                    </td>

                    {/* Conv Rate */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {dealer.conversionRate}%
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={dealer.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setOpenModal('dealer_detail', dealer)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg"
                          title="View Dealer Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setOpenModal('dealer_form', dealer)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                          title="Edit Dealer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete dealer ${dealer.name}?`)) {
                              deleteDealer(dealer.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Dealer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <p>
            Showing <strong className="text-slate-800">1</strong> to{' '}
            <strong className="text-slate-800">{displayedDealers.length}</strong> of{' '}
            <strong className="text-slate-800">{totalResults}</strong> dealers
          </p>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-semibold text-slate-700">Page {currentPage} of 16</span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
