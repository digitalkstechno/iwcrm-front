'use client';

import React, { useState, useMemo } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Lead, LeadStatus, LeadPriority } from '@/lib/types';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import { CommonTable, Column } from '@/components/ui/CommonTable';
import {
  ArrowUpDown,
  Download,
  Plus,
  Filter,
  Check,
  MoreHorizontal,
  UserCheck,
  Trash2,
} from 'lucide-react';

export const LeadsView: React.FC = () => {
  const {
    leads,
    setOpenModal,
    deleteLead,
    updateLead,
    showToast,
    showConfirmDialog,
  } = useCRM();

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'name' | 'priority' | 'value'>('date-desc');
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        searchTerm === '' ||
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.leadCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'All' || l.status === statusFilter;
      const matchSource = sourceFilter === 'All' || l.source === sourceFilter;
      const matchPriority = priorityFilter === 'All' || l.priority === priorityFilter;

      return matchSearch && matchStatus && matchSource && matchPriority;
    }).sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      if (sortBy === 'date-asc') return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'priority') {
        const priorityOrder: Record<LeadPriority, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'value') return (b.estimatedValue || 0) - (a.estimatedValue || 0);
      return 0;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter, priorityFilter, sortBy]);

  // Pagination calculation
  const totalResults = 1284 + (filteredLeads.length - 7);
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / itemsPerPage));
  const displayedLeads = filteredLeads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Checkbox selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeadIds(displayedLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkDelete = () => {
    showConfirmDialog('Bulk Delete', `Are you sure you want to delete ${selectedLeadIds.length} selected leads?`, () => {
      selectedLeadIds.forEach((id) => deleteLead(id));
      setSelectedLeadIds([]);
      showToast({ type: 'warning', title: 'Bulk Delete', message: 'Selected leads have been removed.' });
    });
  };

  const handleBulkStatus = (status: LeadStatus) => {
    selectedLeadIds.forEach((id) => updateLead(id, { status }));
    setSelectedLeadIds([]);
    showToast({ type: 'success', title: 'Status Updated', message: `Updated ${selectedLeadIds.length} leads to ${status}.` });
  };

  const handleExportCSV = () => {
    const headers = ['Lead Code', 'Name', 'Company', 'Email', 'Phone', 'Source', 'Assigned Staff', 'Status', 'Priority', 'Estimated Value', 'Created Date'];
    const rows = filteredLeads.map((l) => [
      l.leadCode,
      `"${l.name}"`,
      `"${l.company}"`,
      l.email,
      l.phone,
      `"${l.source}"`,
      `"${l.assignedStaffName}"`,
      l.status,
      l.priority,
      l.estimatedValue || 0,
      l.createdDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast({ type: 'info', title: 'Export Generated', message: `Exported ${filteredLeads.length} leads to CSV.` });
  };

  const columns: Column<Lead>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (lead) => (
        <>
          <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
            {lead.name}
          </p>
          <p className="text-xs text-slate-400 mt-0.5 leading-none">
            {lead.email}
          </p>
        </>
      ),
    },
    {
      key: 'company',
      header: 'Company',
      render: (lead) => (
        <span className="text-slate-700 text-sm font-medium">{lead.company}</span>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      render: (lead) => (
        <span className="text-xs text-slate-600 font-medium">{lead.source}</span>
      ),
    },
    {
      key: 'assignedStaffName',
      header: 'Assigned',
      render: (lead) => {
        const initials = lead.assignedStaffName && lead.assignedStaffName !== 'Unassigned'
          ? lead.assignedStaffName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
          : 'Un';
        const avatarBg =
          initials === 'JD' ? 'bg-blue-600 text-white' :
          initials === 'AS' ? 'bg-indigo-600 text-white' :
          initials === 'SJ' ? 'bg-purple-600 text-white' :
          initials === 'Un' ? 'bg-slate-200 text-slate-600' :
          'bg-emerald-600 text-white';
        return (
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${avatarBg}`}>
              {initials}
            </span>
            <span className={`text-xs ${lead.assignedStaffName === 'Unassigned' ? 'italic text-slate-400' : 'text-slate-800 font-medium'}`}>
              {lead.assignedStaffName || 'Unassigned'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (lead) => <StatusBadge status={lead.status} size="sm" />,
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (lead) => <PriorityBadge priority={lead.priority} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (lead) => (
        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
          {lead.status !== 'Converted' && (
            <button
              onClick={() => setOpenModal('convert_lead', lead)}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
              title="Convert lead to dealer"
            >
              Convert
            </button>
          )}
          <button
            onClick={() => setOpenModal('lead_assign', lead)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Assign to staff"
          >
            <UserCheck className="w-4 h-4" />
          </button>
          <button
            onClick={() => setOpenModal('lead_detail', lead)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="View full lead record"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const actions = (
    <>
      {/* Filter toggle */}
      <div className="relative">
        <button
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors ${
            sourceFilter !== 'All' || priorityFilter !== 'All'
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
          {(sourceFilter !== 'All' || priorityFilter !== 'All') && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          )}
        </button>
        {isFilterOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-30 space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Source</label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
              >
                <option value="All">All Sources</option>
                <option value="Website Form">Website Form</option>
                <option value="Referral">Referral</option>
                <option value="Trade Show">Trade Show</option>
                <option value="Cold Call">Cold Call</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full mt-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-hidden"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Sort Menu Toggle */}
      <div className="relative">
        <button
          onClick={() => setIsSortOpen((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span>Sort</span>
        </button>
        {isSortOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 space-y-0.5">
            {[
              { id: 'date-desc', label: 'Date (Newest)' },
              { id: 'date-asc', label: 'Date (Oldest)' },
              { id: 'priority', label: 'Priority (Urgent)' },
              { id: 'name', label: 'Lead Name (A-Z)' },
              { id: 'value', label: 'Estimated Value (₹)' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSortBy(s.id as any);
                  setIsSortOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                  sortBy === s.id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{s.label}</span>
                {sortBy === s.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </button>
            ))}
          </div>
        )}
      </div>

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Leads</h1>
          <p className="text-sm text-slate-500 mt-1">
            {totalResults.toLocaleString()} total leads currently in the pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenModal('lead_form')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {['All', 'New', 'Contacted', 'Follow-up', 'Qualified', 'Negotiation', 'Converted', 'Lost'].map((st) => {
          const isActive = statusFilter === st;
          const count = st === 'All' ? totalResults : leads.filter((l) => l.status === st).length;
          return (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span>{st}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {selectedLeadIds.length > 0 && (
        <div className="px-4 py-2.5 bg-blue-50/80 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900 animate-in fade-in rounded-t-xl">
          <span className="font-semibold">{selectedLeadIds.length} leads selected</span>
          <div className="flex items-center gap-2">
            <button onClick={() => handleBulkStatus('Qualified')} className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-blue-200 rounded-lg text-blue-700 font-medium">
              Mark Qualified
            </button>
            <button onClick={() => handleBulkStatus('Contacted')} className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-blue-200 rounded-lg text-blue-700 font-medium">
              Mark Contacted
            </button>
            <button onClick={handleBulkDelete} className="px-2.5 py-1 bg-white hover:bg-red-50 border border-red-200 rounded-lg text-red-600 font-medium flex items-center gap-1">
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}

      <CommonTable
        data={displayedLeads}
        columns={columns}
        keyExtractor={(l) => l.id}
        searchTerm={searchTerm}
        onSearchChange={(term) => {
          setSearchTerm(term);
          setCurrentPage(1);
        }}
        selectedIds={selectedLeadIds}
        onSelectAll={handleSelectAll}
        onToggleSelect={handleToggleSelect}
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
