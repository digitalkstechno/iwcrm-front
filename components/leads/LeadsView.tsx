'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/lib/crm-context';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import { CommonTable, Column } from '@/components/ui/CommonTable';
import { Download, Plus, MoreHorizontal, UserCheck, Trash2, Edit2 } from 'lucide-react';
import api from '@/lib/axios';

export interface BackendLead {
  _id: string;
  contactName: string;
  companyName: string;
  phone: string;
  email: string;
  pipelineStatus: string;
  priority: string;
  city: string;
  staff?: { _id: string; fullName: string; email: string };
  dealer?: { _id: string; DealerName: string; Phone: string };
  createdAt?: string;
}

export const LeadsView: React.FC = () => {
  const { setOpenModal, openModal, showToast, showConfirmDialog } = useCRM();

  const [leadList, setLeadList] = useState<BackendLead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('All');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchLeadData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/v1/api/lead', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
        },
      });

      let leadArray: any[] = [];
      let total = 0;
      let pages = 1;

      if (Array.isArray(res)) {
        leadArray = res;
        total = res.length;
      } else if (res && res.data && Array.isArray(res.data)) {
        leadArray = res.data;
        total = (res as any).pagination?.totalRecords || leadArray.length;
        pages = (res as any).pagination?.totalPages || Math.ceil(total / itemsPerPage) || 1;
      } else if (res && Array.isArray(res.data?.data)) {
        leadArray = res.data.data;
        total = res.data.pagination?.totalRecords || leadArray.length;
        pages = res.data.pagination?.totalPages || Math.ceil(total / itemsPerPage) || 1;
      }

      if (statusFilter !== 'All') {
        leadArray = leadArray.filter((l: BackendLead) => l.pipelineStatus.toLowerCase() === statusFilter.toLowerCase());
      }

      setLeadList(leadArray);
      setTotalPages(pages);
      setTotalRecords(total);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
      showToast({ type: 'error', title: 'Error', message: 'Failed to fetch lead data' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!openModal) {
      fetchLeadData();
    }
  }, [currentPage, debouncedSearch, statusFilter, itemsPerPage, openModal]);

  const handleDelete = async (id: string, name: string) => {
    showConfirmDialog(
      'Delete Lead',
      `Are you sure you want to delete lead ${name}?`,
      async () => {
        try {
          await api.delete(`/v1/api/lead/${id}`);
          showToast({ type: 'success', title: 'Deleted', message: `${name} has been removed.` });
          fetchLeadData();
        } catch (err: any) {
          console.error('Failed to delete lead:', err);
          showToast({ type: 'error', title: 'Error', message: err.response?.data?.message || 'Failed to delete lead' });
        }
      }
    );
  };

  const handleExportCSV = () => {
    const headers = ['Contact Name', 'Company Name', 'Email', 'Phone', 'City', 'Pipeline Status', 'Priority', 'Assigned Staff', 'Assigned Dealer'];
    const rows = leadList.map((l) => [
      `"${l.contactName}"`,
      `"${l.companyName}"`,
      l.email,
      l.phone,
      `"${l.city}"`,
      l.pipelineStatus,
      l.priority,
      `"${l.staff?.fullName || 'Unassigned'}"`,
      `"${l.dealer?.DealerName || 'Unassigned'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({ type: 'info', title: 'Export Generated', message: `Exported ${leadList.length} leads to CSV.` });
  };

  const columns: Column<BackendLead>[] = [
    {
      key: 'name',
      header: 'Name & Company',
      render: (lead) => (
        <>
          <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
            {lead.contactName}
          </p>
          <p className="text-xs text-slate-500 mt-0.5 leading-none">
            {lead.companyName}
          </p>
        </>
      ),
    },
    {
      key: 'contact',
      header: 'Contact Info',
      render: (lead) => (
        <>
          <span className="text-slate-800 text-sm font-medium leading-tight">{lead.phone}</span>
          <p className="text-xs text-slate-400 mt-0.5">{lead.email}</p>
        </>
      ),
    },
    {
      key: 'city',
      header: 'City',
      render: (lead) => (
        <span className="text-xs text-slate-600 font-medium">{lead.city}</span>
      ),
    },
    {
      key: 'assignedStaffName',
      header: 'Assigned',
      render: (lead) => {
        const staffName = lead.staff?.fullName || 'Unassigned';
        const initials = staffName !== 'Unassigned'
          ? staffName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
          : 'Un';
        
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-blue-100 text-blue-700`}>
                {initials}
              </span>
              <span className={`text-xs ${staffName === 'Unassigned' ? 'italic text-slate-400' : 'text-slate-800 font-medium'}`}>
                {staffName}
              </span>
            </div>
            {lead.dealer && (
              <span className="text-[10px] text-slate-500 truncate w-32" title={lead.dealer.DealerName}>
                Dealer: {lead.dealer.DealerName}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'pipelineStatus',
      header: 'Status',
      render: (lead) => <StatusBadge status={lead.pipelineStatus as any} size="sm" />,
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (lead) => <PriorityBadge priority={lead.priority as any} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (lead) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setOpenModal('lead_form', lead)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit Lead"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(lead._id, lead.contactName)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Lead"
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
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Follow-up">Follow-up</option>
        <option value="Qualified">Qualified</option>
        <option value="Negotiation">Negotiation</option>
        <option value="Converted">Converted</option>
        <option value="Lost">Lost</option>
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
    <div id="leads-module" className="space-y-5 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Leads Pipeline</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage prospective clients through your conversion funnel.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpenModal('lead_form')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Network Stats Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Leads</p>
          <p className="text-xl font-bold text-slate-900 mt-0.5">{totalRecords}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">New Leads</p>
          <p className="text-xl font-bold text-blue-600 mt-0.5">
            {leadList.filter((d) => d.pipelineStatus === 'New').length}
          </p>
        </div>
      </div>

      <CommonTable
        data={leadList}
        columns={columns}
        keyExtractor={(l) => l._id}
        searchTerm={searchTerm}
        onSearchChange={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
        }}
        onRowClick={(lead) => setOpenModal('lead_detail', lead)}
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
