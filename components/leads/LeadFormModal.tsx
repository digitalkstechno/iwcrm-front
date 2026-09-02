'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/lib/crm-context';
import { X, Save, UserPlus } from 'lucide-react';
import api from '@/lib/axios';
import { AsyncSelect } from '@/components/ui/AsyncSelect';

interface LeadFormContentProps {
  modalData: any;
  closeModal: () => void;
}

const LeadFormContent: React.FC<LeadFormContentProps> = ({ modalData, closeModal }) => {
  const isEdit = !!modalData?._id;
  const idToEdit = modalData?._id;

  const [formData, setFormData] = useState({
    contactName: modalData?.contactName || '',
    companyName: modalData?.companyName || '',
    phone: modalData?.phone || '',
    email: modalData?.email || '',
    pipelineStatus: modalData?.pipelineStatus || 'New',
    priority: modalData?.priority || 'Medium',
    city: modalData?.city || '',
    staff: modalData?.staff?._id || '',
    dealer: modalData?.dealer?._id || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contactName.trim() || !formData.companyName.trim() || !formData.phone.trim() || !formData.city.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    const rawPhone = formData.phone.replace(/^\+91\s*/, '');
    if (rawPhone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const payload: any = { ...formData };
      if (!payload.staff) delete payload.staff;
      if (!payload.dealer) delete payload.dealer;

      if (isEdit) {
        await api.put(`/v1/api/lead/${idToEdit}`, payload);
      } else {
        await api.post('/v1/api/lead/create', payload);
      }
      closeModal();
    } catch (err: any) {
      console.error('Failed to save lead:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="lead-form-modal"
      className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {isEdit ? 'Edit Lead' : 'Create New Lead'}
            </h2>
            <p className="text-xs text-slate-500">Enter lead details for the pipeline</p>
          </div>
        </div>
        <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 pb-24 space-y-4 max-h-[75vh] overflow-y-auto">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Name *</label>
            <input
              type="text"
              required
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
                className="w-full text-slate-800 bg-transparent focus:outline-hidden"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pipeline Status</label>
            <select
              value={formData.pipelineStatus}
              onChange={(e) => setFormData({ ...formData, pipelineStatus: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Qualified">Qualified</option>
              <option value="Negotiation">Negotiation</option>
              <option value="Converted">Converted</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Staff</label>
            <AsyncSelect
              apiEndpoint="/v1/api/staff"
              value={formData.staff}
              onChange={(val) => setFormData({ ...formData, staff: val })}
              labelKey="fullName"
              valueKey="_id"
              placeholder="Search staff..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Dealer</label>
            <AsyncSelect
              apiEndpoint="/v1/api/dealer"
              value={formData.dealer}
              onChange={(val) => setFormData({ ...formData, dealer: val })}
              labelKey="DealerName"
              valueKey="_id"
              placeholder="Search dealer..."
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
            disabled={isLoading}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Lead')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const LeadFormModal: React.FC = () => {
  const { openModal, modalData, closeModal } = useCRM();

  if (openModal !== 'lead_form') return null;

  return (
    <div
      id="lead-form-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      onClick={closeModal}
    >
      <LeadFormContent
        key={modalData?._id || 'new-lead'}
        modalData={modalData}
        closeModal={closeModal}
      />
    </div>
  );
};
