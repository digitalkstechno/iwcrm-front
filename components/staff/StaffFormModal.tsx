'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Staff } from '@/lib/types';
import { X, User, Save } from 'lucide-react';

interface StaffFormContentProps {
  modalData: any;
  closeModal: () => void;
  addStaff: (data: any) => void;
  updateStaff: (id: string, data: any) => void;
}

const StaffFormContent: React.FC<StaffFormContentProps> = ({
  modalData,
  closeModal,
  addStaff,
  updateStaff,
}) => {
  const isEdit = !!modalData?.id;

  const [formData, setFormData] = useState({
    name: modalData?.name || '',
    role: modalData?.role || 'Senior Sales Executive',
    department: modalData?.department || 'Enterprise Sales',
    email: modalData?.email || '',
    phone: modalData?.phone || '',
    photo: modalData?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: (modalData?.status || 'Active') as 'Active' | 'On Leave' | 'Inactive',
    conversionRate: modalData?.conversionRate || 65,
    assignedLeadsCount: modalData?.assignedLeadsCount || 12,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    const payload = {
      name: formData.name,
      role: formData.role as any,
      department: formData.department,
      email: formData.email,
      phone: formData.phone,
      photo: formData.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: formData.status,
      conversionRate: formData.conversionRate,
      assignedLeadsCount: formData.assignedLeadsCount || 0,
      convertedLeadsCount: modalData?.convertedLeadsCount || 0,
      performanceScore: modalData?.performanceScore || 88,
      location: modalData?.location || 'Seattle, WA',
      pendingFollowUps: modalData?.pendingFollowUps || 0,
      attendanceRate: modalData?.attendanceRate || 98,
    };

    if (isEdit) {
      updateStaff(modalData.id, payload);
    } else {
      addStaff(payload);
    }
    closeModal();
  };

  return (
    <div
      id="staff-form-modal"
      className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {isEdit ? 'Edit Staff Member' : 'Add New Staff Member'}
            </h2>
            <p className="text-xs text-slate-500">Internal CRM employee profile & role assignment</p>
          </div>
        </div>
        <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Rachel Adams"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="rachel@nexus.io"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 019-2831"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            >
              <option value="Enterprise Sales">Enterprise Sales</option>
              <option value="Dealer Operations">Dealer Operations</option>
              <option value="Executive">Executive</option>
              <option value="Client Success">Client Success</option>
              <option value="Support">Support</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Account Executive"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Avatar Photo URL</label>
            <input
              type="text"
              value={formData.photo}
              onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isEdit ? 'Save Staff' : 'Add Staff'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const StaffFormModal: React.FC = () => {
  const { openModal, modalData, closeModal, addStaff, updateStaff } = useCRM();

  if (openModal !== 'staff_form') return null;

  return (
    <div
      id="staff-form-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      onClick={closeModal}
    >
      <StaffFormContent
        key={modalData?.id || 'new-staff'}
        modalData={modalData}
        closeModal={closeModal}
        addStaff={addStaff}
        updateStaff={updateStaff}
      />
    </div>
  );
};
