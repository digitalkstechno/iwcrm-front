'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { X, Store, Save } from 'lucide-react';
import api from '@/lib/axios';

interface DealerFormContentProps {
  modalData: any;
  closeModal: () => void;
}

const DealerFormContent: React.FC<DealerFormContentProps> = ({
  modalData,
  closeModal,
}) => {
  const isEdit = !!modalData?._id || !!modalData?.id;
  const idToEdit = modalData?._id || modalData?.id;

  const [formData, setFormData] = useState({
    DealerName: modalData?.DealerName || modalData?.name || '',
    Phone: modalData?.Phone || modalData?.phone || '',
    Email: modalData?.Email || modalData?.email || '',
    city: modalData?.city || modalData?.location || '',
    status: (modalData?.status || 'active') as string,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.DealerName.trim() || !formData.Phone.trim() || !formData.city.trim()) {
      setError('Please fill in all required fields (Name, Phone, City).');
      return;
    }

    const rawPhone = formData.Phone.replace(/^\+91\s*/, '');
    if (rawPhone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isEdit) {
        await api.put(`/v1/api/dealer/${idToEdit}`, formData);
      } else {
        await api.post('/v1/api/dealer/create', formData);
      }
      closeModal(); // fetch is handled by useEffect in DealersView when modal closes
    } catch (err: any) {
      console.error('Failed to save dealer:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred while saving.');
    } finally {
      setIsLoading(false);
    }
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
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Dealer Name *
          </label>
          <input
            type="text"
            required
            value={formData.DealerName}
            onChange={(e) => setFormData({ ...formData, DealerName: e.target.value })}
            placeholder="e.g. Apex Auto Holdings"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone *
            </label>
            <div className="flex items-center w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus-within:border-blue-500 overflow-hidden">
              <span className="text-slate-500 mr-2 font-medium">+91</span>
              <input
                type="text"
                required
                maxLength={10}
                value={formData.Phone.replace(/^\+91\s*/, '')}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setFormData({ ...formData, Phone: val ? `+91 ${val}` : '' });
                }}
                placeholder="9876543210"
                className="w-full text-slate-800 bg-transparent focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.Email}
              onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
              placeholder="contact@dealership.com"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g. Mumbai"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
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
            <span>{isLoading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Register Dealer')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const DealerFormModal: React.FC = () => {
  const { openModal, modalData, closeModal } = useCRM();

  if (openModal !== 'dealer_form') return null;

  return (
    <div
      id="dealer-form-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      onClick={closeModal}
    >
      <DealerFormContent
        key={modalData?._id || 'new-dealer'}
        modalData={modalData}
        closeModal={closeModal}
      />
    </div>
  );
};
