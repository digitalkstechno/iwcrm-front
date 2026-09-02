'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { UserCheck, X, Search, Check } from 'lucide-react';

export const LeadAssignModal: React.FC = () => {
  const { openModal, modalData, closeModal, staff, assignLead, showToast } = useCRM();
  const [search, setSearch] = useState('');

  if (openModal !== 'lead_assign' || !modalData) return null;

  const lead = modalData;

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (staffMember: any) => {
    assignLead(lead.id, staffMember.id);
    closeModal();
  };

  return (
    <div
      id="lead-assign-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      onClick={closeModal}
    >
      <div
        id="lead-assign-modal"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Assign Lead</h3>
              <p className="text-xs text-slate-500">
                Assign {lead.name} ({lead.company})
              </p>
            </div>
          </div>
          <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff by name or role..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        {/* Staff List */}
        <div className="max-h-64 overflow-y-auto p-2 space-y-1">
          {filteredStaff.map((s) => {
            const isAssigned = lead.assignedStaffId === s.id;

            return (
              <button
                key={s.id}
                onClick={() => handleSelect(s)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left ${
                  isAssigned ? 'bg-blue-50/60 border border-blue-200' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.photo}
                    alt={s.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{s.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{s.role} · {s.department}</p>
                  </div>
                </div>

                {isAssigned && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={closeModal}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
