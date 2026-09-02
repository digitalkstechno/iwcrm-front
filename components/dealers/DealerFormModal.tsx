'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Dealer, DealerStatus } from '@/lib/types';
import { X, Store, Save } from 'lucide-react';

interface DealerFormContentProps {
  modalData: any;
  closeModal: () => void;
  addDealer: (data: any) => void;
  updateDealer: (id: string, data: any) => void;
}

const DealerFormContent: React.FC<DealerFormContentProps> = ({
  modalData,
  closeModal,
  addDealer,
  updateDealer,
}) => {
  const isEdit = !!modalData?.id;

  const [formData, setFormData] = useState({
    name: modalData?.name || '',
    company: modalData?.company || modalData?.name || '',
    contactPerson: modalData?.contactPerson || '',
    email: modalData?.email || '',
    phone: modalData?.phone || '',
    location: modalData?.location || 'Northwest Region',
    region: modalData?.region || 'Northwest',
    status: (modalData?.status || 'Active') as DealerStatus,
    tier: (modalData?.tier || 'Gold') as 'Platinum' | 'Gold' | 'Silver' | 'Bronze',
    creditLimit: modalData?.creditLimit || 250000,
    totalLeads: modalData?.totalLeads || 45,
    conversionRate: modalData?.conversionRate || 62,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contactPerson.trim()) return;

    const payload = {
      ...formData,
      company: formData.company || formData.name,
    };

    if (isEdit) {
      updateDealer(modalData.id, payload);
    } else {
      addDealer(payload);
    }
    closeModal();
  };

  return (
    <div
      id="dealer-form-modal"
      className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {isEdit ? 'Edit Dealership Profile' : 'Register New Dealer'}
            </h2>
            <p className="text-xs text-slate-500">Authorized dealership partner details</p>
          </div>
        </div>
        <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Dealership / Company Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Apex Auto Holdings"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Contact Person *
            </label>
            <input
              type="text"
              required
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="e.g. Marcus Vance"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@dealership.com"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Territory / Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Northwest"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tier</label>
            <select
              value={formData.tier}
              onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            >
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as DealerStatus })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Credit Limit (₹)</label>
            <input
              type="number"
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Avg Conversion Rate (%)</label>
            <input
              type="number"
              value={formData.conversionRate}
              onChange={(e) => setFormData({ ...formData, conversionRate: Number(e.target.value) })}
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
            <span>{isEdit ? 'Save Changes' : 'Register Dealer'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const DealerFormModal: React.FC = () => {
  const { openModal, modalData, closeModal, addDealer, updateDealer } = useCRM();

  if (openModal !== 'dealer_form') return null;

  return (
    <div
      id="dealer-form-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      onClick={closeModal}
    >
      <DealerFormContent
        key={modalData?.id || 'new-dealer'}
        modalData={modalData}
        closeModal={closeModal}
        addDealer={addDealer}
        updateDealer={updateDealer}
      />
    </div>
  );
};
