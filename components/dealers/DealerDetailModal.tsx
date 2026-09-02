'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  X,
  Edit2,
  Trash2,
} from 'lucide-react';
import api from '@/lib/axios';

export const DealerDetailModal: React.FC = () => {
  const { openModal, modalData, closeModal, setOpenModal, showToast, showConfirmDialog } = useCRM();
  const [tab, setTab] = useState<'overview' | 'orders' | 'agreements'>('overview');

  if (openModal !== 'dealer_detail' || !modalData) return null;

  const dealer = modalData;

  const handleStatusToggle = async (status: string) => {
    try {
      await api.put(`/v1/api/dealer/${dealer._id}`, { status });
      dealer.status = status; // optimistically update local object
      showToast({ type: 'success', title: 'Status Updated', message: `Dealer status changed to ${status}` });
    } catch (err: any) {
      console.error('Failed to update status', err);
      showToast({ type: 'error', title: 'Error', message: 'Failed to update status' });
    }
  };

  const handleDelete = () => {
    showConfirmDialog('Delete Dealer', `Delete dealer ${dealer.DealerName}?`, async () => {
      try {
        await api.delete(`/v1/api/dealer/${dealer._id}`);
        showToast({ type: 'success', title: 'Deleted', message: `${dealer.DealerName} has been removed.` });
        closeModal();
      } catch (err: any) {
        console.error('Failed to delete dealer:', err);
        showToast({ type: 'error', title: 'Error', message: err.response?.data?.message || 'Failed to delete dealer' });
      }
    });
  };

  return (
    <div
      id="dealer-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs transition-opacity overflow-y-auto"
      onClick={closeModal}
    >
      <div
        id="dealer-detail-modal"
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-xs shrink-0">
              {dealer.DealerName ? dealer.DealerName.substring(0, 2).toUpperCase() : 'NA'}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{dealer.DealerName}</h2>
                <StatusBadge status={dealer.status.charAt(0).toUpperCase() + dealer.status.slice(1)} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                <span>{dealer.Email}</span>
                <span>•</span>
                <span>{dealer.Phone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setOpenModal('dealer_form', dealer)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl"
              title="Edit Dealer"
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

        {/* Tabs */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-6">
          {[
            { id: 'overview', label: 'Overview & Metrics' },
            { id: 'orders', label: 'Orders & Commercials' },
            { id: 'agreements', label: 'Partner Agreements' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Metric Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Territory Region</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{dealer.city}</p>
                </div>
              </div>

              {/* Status and Operations */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase">Operational Status & Access</h4>
                <div className="flex items-center gap-3">
                  {(['active', 'inactive'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusToggle(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        dealer.status === st
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </button>
                  )))}
                </div>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Recent Wholesale Orders</h4>
              <div className="text-xs text-slate-500 p-4 bg-slate-50 rounded-xl border border-slate-200">
                No orders available in the new backend module yet.
              </div>
            </div>
          )}

          {tab === 'agreements' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Distribution & Compliance Contract</h4>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                <p><strong>Territory:</strong> {dealer.city}</p>
                <p><strong>Master Service Agreement:</strong> Active</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Dealer ID: {dealer._id}</span>
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
