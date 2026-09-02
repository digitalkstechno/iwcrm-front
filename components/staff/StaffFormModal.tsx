'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { X, User, Save } from 'lucide-react';
import api from '@/lib/axios';

interface StaffFormContentProps {
  modalData: any;
  closeModal: () => void;
  onSuccess: () => void;
}

const StaffFormContent: React.FC<StaffFormContentProps> = ({
  modalData,
  closeModal,
  onSuccess,
}) => {
  const isEdit = !!modalData?._id || !!modalData?.id;
  const idToEdit = modalData?._id || modalData?.id;

  const [formData, setFormData] = useState({
    fullName: modalData?.fullName || modalData?.name || '',
    email: modalData?.email || '',
    phone: modalData?.phone || '',
    password: '',
    status: (modalData?.status || 'active') as string,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const rawPhone = formData.phone.replace(/^\+91\s*/, '');
    if (rawPhone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }
    
    // For create, password is required
    if (!isEdit && !formData.password) {
      setError('Password is required for new staff.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload: any = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      if (isEdit) {
        await api.put(`/v1/api/staff/${idToEdit}`, payload);
      } else {
        await api.post('/v1/api/staff/create', payload);
      }
      onSuccess(); // Triggers table refresh
      closeModal();
    } catch (err: any) {
      console.error('Failed to save staff:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
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
            <p className="text-xs text-slate-500">Internal CRM employee profile</p>
          </div>
        </div>
        <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        {error && (
          <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone *</label>
            <div className="flex items-center w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus-within:border-blue-500 overflow-hidden">
              <span className="text-slate-500 mr-2 font-medium">+91</span>
              <input
                type="text"
                required
                maxLength={10}
                value={formData.phone.replace(/^\+91\s*/, '')}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, phone: val ? `+91 ${val}` : '' });
                }}
                placeholder="9876543210"
                className="w-full text-slate-800 bg-transparent focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password {isEdit ? '(Leave blank to keep current)' : '*'}
            </label>
            <input
              type="password"
              required={!isEdit}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            disabled={isLoading}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Saving...' : (isEdit ? 'Save Staff' : 'Add Staff')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const StaffFormModal: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { openModal, modalData, closeModal } = useCRM();

  if (openModal !== 'staff_form') return null;

  return (
    <div
      id="staff-form-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      onClick={closeModal}
    >
      <StaffFormContent
        key={modalData?._id || modalData?.id || 'new-staff'}
        modalData={modalData}
        closeModal={closeModal}
        onSuccess={onSuccess || (() => {})}
      />
    </div>
  );
};
