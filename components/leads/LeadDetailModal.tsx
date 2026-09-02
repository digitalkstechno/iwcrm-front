'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import {
  X,
  Edit2,
  Trash2,
} from 'lucide-react';
import api from '@/lib/axios';

export const LeadDetailModal: React.FC = () => {
  const { openModal, modalData, closeModal, setOpenModal, showToast, showConfirmDialog } = useCRM();

  if (openModal !== 'lead_detail' || !modalData) return null;

  const lead = modalData;

  const handleDelete = () => {
    showConfirmDialog('Delete Lead', `Delete lead ${lead.contactName}?`, async () => {
      try {
        await api.delete(`/v1/api/lead/${lead._id}`);
        showToast({ type: 'success', title: 'Deleted', message: `${lead.contactName} has been removed.` });
        closeModal();
      } catch (err: any) {
        console.error('Failed to delete lead:', err);
        showToast({ type: 'error', title: 'Error', message: err.response?.data?.message || 'Failed to delete lead' });
      }
    });
  };

  const staffName = lead.staff?.fullName || 'Unassigned';
  const dealerName = lead.dealer?.DealerName || 'Unassigned';

  return (
    <div
      id="lead-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs transition-opacity overflow-y-auto"
      onClick={closeModal}
    >
      <div
        id="lead-detail-modal"
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-xs shrink-0">
              {lead.contactName ? lead.contactName.substring(0, 2).toUpperCase() : 'NA'}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{lead.contactName}</h2>
                <StatusBadge status={lead.pipelineStatus} size="sm" />
                <PriorityBadge priority={lead.priority} />
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                <span><strong className="text-slate-700">{lead.companyName}</strong></span>
                <span>•</span>
                <span>{lead.email}</span>
                <span>•</span>
                <span>{lead.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setOpenModal('lead_form', lead)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl"
              title="Edit Lead"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="h-5 w-px bg-slate-200 mx-1" />
            <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-6">
            {/* Metric Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">City</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">{lead.city}</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Priority</p>
                <p className="text-base font-bold text-slate-900 mt-0.5">{lead.priority}</p>
              </div>
            </div>

            {/* Assignments */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Assignments</h4>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-slate-700"><strong>Staff:</strong> {staffName}</p>
                <p className="text-sm text-slate-700"><strong>Dealer:</strong> {dealerName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Lead ID: {lead._id}</span>
          <button
            onClick={closeModal}
            className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
