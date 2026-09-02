'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { LeadPriority, LeadSource, LeadStatus } from '@/lib/types';
import { X, UserPlus, Building, Mail, Phone, Globe, DollarSign, Tag, Save } from 'lucide-react';

interface LeadFormContentProps {
  modalData: any;
  closeModal: () => void;
  addLead: (data: any) => void;
  updateLead: (id: string, data: any) => void;
  staff: any[];
}

const LeadFormContent: React.FC<LeadFormContentProps> = ({
  modalData,
  closeModal,
  addLead,
  updateLead,
  staff,
}) => {
  const isEdit = !!modalData?.id;

  const [formData, setFormData] = useState({
    name: modalData?.name || '',
    company: modalData?.company || '',
    email: modalData?.email || '',
    phone: modalData?.phone || '',
    source: (modalData?.source || 'Website Form') as LeadSource,
    status: (modalData?.status || 'New') as LeadStatus,
    priority: (modalData?.priority || 'Medium') as LeadPriority,
    assignedStaffId: modalData?.assignedStaffId || (staff[0]?.id || 'staff-1'),
    assignedStaffName: modalData?.assignedStaffName || (staff[0]?.name || 'John Doe'),
    estimatedValue: modalData?.estimatedValue || 120000,
    location: modalData?.location || 'Seattle, WA',
    industry: modalData?.industry || 'Automotive Distribution',
    notes: '',
  });

  const handleStaffChange = (staffId: string) => {
    const selected = staff.find((s) => s.id === staffId);
    setFormData((prev) => ({
      ...prev,
      assignedStaffId: staffId,
      assignedStaffName: selected ? selected.name : 'Unassigned',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim()) return;

    const { notes: noteText, ...rest } = formData;
    const initialNotes = noteText.trim()
      ? [
          {
            id: 'n-' + Date.now(),
            authorName: 'CRM User',
            authorRole: 'Manager',
            content: noteText.trim(),
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          },
        ]
      : [];

    if (isEdit) {
      updateLead(modalData.id, {
        ...rest,
        ...(initialNotes.length > 0
          ? { notes: [...(modalData.notes || []), ...initialNotes] }
          : {}),
      });
    } else {
      addLead({
        ...rest,
        notes: initialNotes,
      });
    }
    closeModal();
  };

  return (
    <div
      id="lead-form-modal"
      className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {isEdit ? `Edit Lead — ${modalData.name}` : 'Create Lead'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEdit ? 'Update prospect profile and sales metrics' : 'Add a new prospect to the CRM'}
            </p>
          </div>
        </div>
        <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Alex Morgan"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Company / Dealership Name *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g. Pacific Auto Group"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alex@pacificautogroup.com"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pipeline Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-500"
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
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as LeadPriority })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Lead Source</label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as LeadSource })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-500"
            >
              <option value="Website Form">Website Form</option>
              <option value="Trade Show">Trade Show</option>
              <option value="Referral">Referral</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Social Media">Social Media</option>
              <option value="Google Search">Google Search</option>
              <option value="Partner">Partner</option>
              <option value="Email Campaign">Email Campaign</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assigned Staff Representative
            </label>
            <select
              value={formData.assignedStaffId}
              onChange={(e) => handleStaffChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-500"
            >
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Est. Deal Value (₹)
            </label>
            <input
              type="number"
              value={formData.estimatedValue}
              onChange={(e) => setFormData({ ...formData, estimatedValue: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Seattle"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Prospect Notes</label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Add qualification requirements, budget range, or key decision maker info..."
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 resize-none"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isEdit ? 'Update Lead' : 'Create Lead'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export const LeadFormModal: React.FC = () => {
  const { openModal, modalData, closeModal, addLead, updateLead, staff } = useCRM();

  if (openModal !== 'lead_form') return null;

  return (
    <div
      id="lead-form-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity overflow-y-auto"
      onClick={closeModal}
    >
      <LeadFormContent
        key={modalData?.id || 'new-lead'}
        modalData={modalData}
        closeModal={closeModal}
        addLead={addLead}
        updateLead={updateLead}
        staff={staff}
      />
    </div>
  );
};
