'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Dealer, DealerStatus } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  X,
  Store,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Trash2,
  CheckCircle2,
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const DealerDetailModal: React.FC = () => {
  const { openModal, modalData, closeModal, dealers, updateDealer, deleteDealer, leads, setOpenModal, showToast } = useCRM();
  const [tab, setTab] = useState<'overview' | 'leads' | 'orders' | 'agreements'>('overview');

  if (openModal !== 'dealer_detail' || !modalData) return null;

  const dealer: Dealer = dealers.find((d) => d.id === modalData.id) || modalData;

  const handleStatusToggle = (status: DealerStatus) => {
    updateDealer(dealer.id, { status });
  };

  const assignedLeads = leads.filter(
    (l) => l.company.toLowerCase().includes(dealer.name.toLowerCase()) || l.status === 'Converted'
  );

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
              {dealer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{dealer.name}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                  #{dealer.dealerCode}
                </span>
                <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                  {dealer.tier || 'Gold Tier'}
                </span>
                <StatusBadge status={dealer.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                <span>Primary Contact: <strong className="text-slate-700">{dealer.contactPerson}</strong></span>
                <span>•</span>
                <span>{dealer.email}</span>
                <span>•</span>
                <span>{dealer.phone}</span>
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
              onClick={() => {
                if (confirm(`Delete dealer ${dealer.name}?`)) {
                  deleteDealer(dealer.id);
                  closeModal();
                }
              }}
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
            { id: 'leads', label: `Assigned Leads (${dealer.totalLeads})` },
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
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Conversion Rate</p>
                  <p className="text-xl font-bold text-emerald-600 mt-0.5">
                    {dealer.conversionRate || (dealer.convertedLeads && dealer.totalLeads ? Math.round((dealer.convertedLeads / dealer.totalLeads) * 100) : 62)}%
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Pipeline Leads</p>
                  <p className="text-xl font-bold text-slate-900 mt-0.5">{dealer.totalLeads.toLocaleString()}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Credit Limit</p>
                  <p className="text-xl font-bold text-blue-600 mt-0.5">
                    ${(dealer.creditLimit || 350000).toLocaleString()}
                  </p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Territory Region</p>
                  <p className="text-base font-bold text-slate-900 mt-0.5">{dealer.location}</p>
                </div>
              </div>

              {/* Status and Operations */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase">Operational Status & Access</h4>
                <div className="flex items-center gap-3">
                  {(['Active', 'Pending', 'Inactive', 'Blocked'] as DealerStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusToggle(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        dealer.status === st
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'leads' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase">Active Leads in Region</h4>
                <button
                  onClick={() => setOpenModal('lead_form')}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Assign New Lead
                </button>
              </div>

              <div className="space-y-2">
                {assignedLeads.map((l) => (
                  <div
                    key={l.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{l.name} — {l.company}</p>
                      <p className="text-[11px] text-slate-500">{l.email} · Rep: {l.assignedStaffName}</p>
                    </div>
                    <StatusBadge status={l.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Recent Wholesale Orders</h4>
              <div className="space-y-2">
                {[
                  { id: 'ORD-9481', date: '2026-08-28', items: '24 Units (Fleet Package)', total: '₹3,84,000', status: 'Fulfilled' },
                  { id: 'ORD-9210', date: '2026-07-15', items: '12 Units (Standard Stock)', total: '₹1,92,000', status: 'Settled' },
                ].map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900">{ord.id}</span> · {ord.items}
                      <p className="text-[11px] text-slate-400 mt-0.5">Date: {ord.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{ord.total}</p>
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'agreements' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Distribution & Compliance Contract</h4>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
                <p><strong>Master Service Agreement:</strong> Active (Expires Dec 2027)</p>
                <p><strong>Territory Exclusivity:</strong> 40-mile radius in {dealer.location}</p>
                <p><strong>Payment Terms:</strong> Net 45 Days with 2% early settlement discount</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Dealer UID: {dealer.id}</span>
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
