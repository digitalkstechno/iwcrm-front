'use client';

import React, { useState, useMemo } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Dealer, DealerStatus } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CommonTable, Column } from '@/components/ui/CommonTable';
import {
  Download,
  Plus,
  MapPin,
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
  const totalPages = Math.max(1, Math.ceil(filteredDealers.length / itemsPerPage));

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

  const columns: Column<Dealer>[] = [
    {
      key: 'name',
      header: 'Dealer Name',
      render: (dealer) => {
        const initials = dealer.name.substring(0, 2).toUpperCase();
        return (
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
        );
      },
    },
    {
      key: 'contactPerson',
      header: 'Contact Person',
      render: (dealer) => (
        <>
          <p className="font-medium text-slate-800 leading-tight">{dealer.contactPerson}</p>
          <p className="text-xs text-slate-400 mt-0.5">{dealer.email}</p>
        </>
      ),
    },
    {
      key: 'location',
      header: 'Region / Territory',
      render: (dealer) => (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          {dealer.location}
        </span>
      ),
    },
    {
      key: 'totalLeads',
      header: 'Total Leads',
      render: (dealer) => (
        <div className="text-right text-xs font-bold text-slate-800">
          {dealer.totalLeads.toLocaleString()}
        </div>
      ),
    },
    {
      key: 'conversionRate',
      header: 'Conv. Rate',
      render: (dealer) => (
        <div className="text-right">
          <span className="inline-block text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            {dealer.conversionRate}%
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (dealer) => <StatusBadge status={dealer.status} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (dealer) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
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
      ),
    },
  ];

  const actions = (
    <>
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
    </>
  );

  return (
    <div id="dealers-module" className="space-y-5 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Dealers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage authorized dealership network, territory distributions, and performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
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
          <p className="text-xl font-bold text-blue-600 mt-0.5">₹18.5M</p>
          <span className="text-[11px] text-slate-400 font-normal">Active credit line</span>
        </div>
      </div>

      <CommonTable
        data={displayedDealers}
        columns={columns}
        keyExtractor={(d) => d.id}
        searchTerm={searchTerm}
        onSearchChange={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
        }}
        selectedIds={selectedDealerIds}
        onSelectAll={(checked) => {
          if (checked) setSelectedDealerIds(displayedDealers.map((d) => d.id));
          else setSelectedDealerIds([]);
        }}
        onToggleSelect={(id) => {
          setSelectedDealerIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
          );
        }}
        onRowClick={(dealer) => setOpenModal('dealer_detail', dealer)}
        actions={actions}
        pagination={{
          currentPage,
          totalPages,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
};
