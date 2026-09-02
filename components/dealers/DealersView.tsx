'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/lib/crm-context';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CommonTable, Column } from '@/components/ui/CommonTable';
import { Download, Plus, MapPin, Edit2, Trash2, ExternalLink } from 'lucide-react';
import api from '@/lib/axios';

export interface BackendDealer {
  _id: string;
  DealerName: string;
  Phone: string;
  Email: string;
  city: string;
  status: string;
  createdAt?: string;
}

export const DealersView: React.FC = () => {
  const { setOpenModal, openModal, showToast, showConfirmDialog } = useCRM();

  const [dealerList, setDealerList] = useState<BackendDealer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedDealerIds, setSelectedDealerIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchDealerData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/v1/api/dealer', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
        },
      });
      
      let dealerArray = [];
      let total = 0;
      let pages = 1;

      if (Array.isArray(res)) {
        dealerArray = res;
        total = res.length;
      } else if (res && res.data && Array.isArray(res.data)) {
        dealerArray = res.data;
        total = (res as any).pagination?.totalRecords || dealerArray.length;
        pages = (res as any).pagination?.totalPages || Math.ceil(total / itemsPerPage) || 1;
      } else if (res && Array.isArray(res.data?.data)) {
        dealerArray = res.data.data;
        total = res.data.pagination?.totalRecords || dealerArray.length;
        pages = res.data.pagination?.totalPages || Math.ceil(total / itemsPerPage) || 1;
      }

      if (statusFilter !== 'All') {
        dealerArray = dealerArray.filter((d: BackendDealer) => d.status.toLowerCase() === statusFilter.toLowerCase());
      }
      
      setDealerList(dealerArray);
      setTotalPages(pages);
      setTotalRecords(total);
    } catch (err) {
      console.error('Failed to fetch dealers:', err);
      showToast({ type: 'error', title: 'Error', message: 'Failed to fetch dealer data' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!openModal) {
      fetchDealerData();
    }
  }, [currentPage, debouncedSearch, statusFilter, itemsPerPage, openModal]);

  const handleDelete = async (id: string, name: string) => {
    showConfirmDialog(
      'Delete Dealer',
      `Are you sure you want to delete dealer ${name}?`,
      async () => {
        try {
          await api.delete(`/v1/api/dealer/${id}`);
          showToast({ type: 'success', title: 'Deleted', message: `${name} has been removed.` });
          fetchDealerData();
        } catch (err: any) {
          console.error('Failed to delete dealer:', err);
          showToast({ type: 'error', title: 'Error', message: err.response?.data?.message || 'Failed to delete dealer' });
        }
      }
    );
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'City', 'Status'];
    const rows = dealerList.map((d) => [
      `"${d.DealerName}"`,
      d.Email,
      d.Phone,
      `"${d.city}"`,
      d.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dealers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({ type: 'info', title: 'Export Complete', message: `Exported ${dealerList.length} dealers to CSV.` });
  };

  const columns: Column<BackendDealer>[] = [
    {
      key: 'name',
      header: 'Dealer Name',
      render: (dealer) => {
        const initials = dealer.DealerName ? dealer.DealerName.substring(0, 2).toUpperCase() : 'NA';
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                {dealer.DealerName}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (dealer) => (
        <>
          <p className="font-medium text-slate-800 leading-tight">{dealer.Phone}</p>
          <p className="text-xs text-slate-400 mt-0.5">{dealer.Email}</p>
        </>
      ),
    },
    {
      key: 'location',
      header: 'City',
      render: (dealer) => (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          {dealer.city}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (dealer) => <StatusBadge status={dealer.status.charAt(0).toUpperCase() + dealer.status.slice(1)} size="sm" />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (dealer) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setOpenModal('dealer_form', dealer)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
            title="Edit Dealer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(dealer._id, dealer.DealerName)}
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
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
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
          <p className="text-xl font-bold text-slate-900 mt-0.5">{totalRecords}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Active Dealerships</p>
          <p className="text-xl font-bold text-emerald-600 mt-0.5">
            {dealerList.filter((d) => d.status === 'active').length}
          </p>
        </div>
      </div>

      <CommonTable
        data={dealerList}
        columns={columns}
        keyExtractor={(d) => d._id}
        searchTerm={searchTerm}
        onSearchChange={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
        }}
        actions={actions}
        pagination={{
          currentPage,
          totalPages,
          limit: itemsPerPage,
          onPageChange: setCurrentPage,
          onLimitChange: (limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          },
        }}
      />
    </div>
  );
};
