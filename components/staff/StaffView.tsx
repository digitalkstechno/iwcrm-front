'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/lib/crm-context';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CommonTable, Column } from '@/components/ui/CommonTable';
import { Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import api from '@/lib/axios';

// Local interface representing the backend staff schema
interface BackendStaff {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  createdAt?: string;
}

export const StaffView: React.FC = () => {
  const { setOpenModal, openModal, showToast, showConfirmDialog } = useCRM();

  const [staffList, setStaffList] = useState<BackendStaff[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchStaffData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/v1/api/staff', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
        },
      });
      
      // The backend might return an array directly, or an object containing the array.
      let staffArray = [];
      let total = 0;
      let pages = 1;

      if (Array.isArray(res)) {
        staffArray = res;
        total = res.length;
      } else if (res && res.data && Array.isArray(res.data)) {
        staffArray = res.data;
        total = (res as any).pagination?.totalRecords || staffArray.length;
        pages = (res as any).pagination?.totalPages || Math.ceil(total / itemsPerPage) || 1;
      } else if (res && Array.isArray(res.data?.data)) {
        staffArray = res.data.data;
        total = res.data.pagination?.totalRecords || staffArray.length;
        pages = res.data.pagination?.totalPages || Math.ceil(total / itemsPerPage) || 1;
      }

      setStaffList(staffArray);
      setTotalPages(pages);
      setTotalRecords(total);
    } catch (err) {
      console.error('Failed to fetch staff data:', err);
      showToast({ type: 'error', title: 'Error', message: 'Failed to fetch staff data' });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch when page, search, limit, or modal state changes (to refresh after add/edit)
  useEffect(() => {
    if (!openModal) {
      fetchStaffData();
    }
  }, [currentPage, debouncedSearch, openModal, itemsPerPage]);

  const handleDelete = async (id: string, name: string) => {
    showConfirmDialog(
      'Delete Staff Member',
      `Are you sure you want to delete staff member ${name}?`,
      async () => {
        try {
          await api.delete(`/v1/api/staff/${id}`);
          showToast({ type: 'success', title: 'Deleted', message: `${name} has been removed.` });
          fetchStaffData();
        } catch (err: any) {
          console.error('Failed to delete staff:', err);
          showToast({ type: 'error', title: 'Error', message: err.response?.data?.message || 'Failed to delete staff' });
        }
      }
    );
  };

  const columns: Column<BackendStaff>[] = [
    {
      key: 'fullName',
      header: 'Full Name',
      render: (member) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
            {member.fullName.substring(0, 2).toUpperCase()}
          </div>
          <p className="font-semibold text-slate-900 leading-tight">
            {member.fullName}
          </p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email Address',
      render: (member) => (
        <span className="text-sm text-slate-700">{member.email}</span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone Number',
      render: (member) => (
        <span className="text-sm text-slate-700">{member.phone}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (member) => (
        <StatusBadge status={member.status.charAt(0).toUpperCase() + member.status.slice(1)} size="sm" />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (member) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setOpenModal('staff_form', member)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Edit Staff"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(member._id, member.fullName)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete Staff"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div id="staff-module" className="space-y-5 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Staff Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            {totalRecords} total staff members managed via the API.
          </p>
        </div>
        <button
          onClick={() => setOpenModal('staff_form')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Staff</span>
        </button>
      </div>

      <CommonTable
        data={staffList}
        columns={columns}
        keyExtractor={(s) => s._id}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        pagination={{
          currentPage,
          totalPages,
          limit: itemsPerPage,
          onPageChange: setCurrentPage,
          onLimitChange: (limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1); // Reset to page 1 on limit change
          },
        }}
      />
    </div>
  );
};
