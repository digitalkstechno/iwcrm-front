'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { StaffMember, StaffStatus } from '@/lib/types';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  X,
  UserCheck,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Award,
  Target,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const StaffDetailModal: React.FC = () => {
  const { openModal, modalData, closeModal, staff, updateStaff, deleteStaff, leads, setOpenModal } = useCRM();

  if (openModal !== 'staff_detail' || !modalData) return null;

  const member: StaffMember = staff.find((s) => s.id === modalData.id) || modalData;

  const assignedLeads = leads.filter((l) => l.assignedStaffId === member.id);

  return (
    <div
      id="staff-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-xs transition-opacity overflow-y-auto"
      onClick={closeModal}
    >
      <div
        id="staff-detail-modal"
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photo}
              alt={member.name}
              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{member.name}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                  #{member.employeeId}
                </span>
                <StatusBadge status={member.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <span className="font-semibold text-slate-700">{member.role}</span>
                <span>•</span>
                <span>{member.department}</span>
                <span>•</span>
                <span>{member.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setOpenModal('staff_form', member)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl"
              title="Edit Profile"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (confirm(`Remove staff member ${member.name}?`)) {
                  deleteStaff(member.id);
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

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Conversion Win Rate</p>
              <p className="text-xl font-bold text-emerald-600 mt-0.5">{member.conversionRate}%</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Active Leads</p>
              <p className="text-xl font-bold text-slate-900 mt-0.5">{member.assignedLeadsCount}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Closed Value</p>
              <p className="text-xl font-bold text-blue-600 mt-0.5">$840,000</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Tenure</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">Since {member.joinedDate}</p>
            </div>
          </div>

          {/* Assigned Leads Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Assigned Pipeline Leads ({assignedLeads.length})
              </h4>
              <button
                onClick={() => setOpenModal('lead_form')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                + Assign Lead
              </button>
            </div>

            {assignedLeads.length === 0 ? (
              <p className="text-xs text-slate-400 p-4 text-center bg-slate-50 rounded-xl">
                No active leads currently assigned
              </p>
            ) : (
              <div className="space-y-2">
                {assignedLeads.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => setOpenModal('lead_detail', l)}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{l.name} — {l.company}</p>
                      <p className="text-[11px] text-slate-500">{l.email} · Last contact: {l.lastFollowUp}</p>
                    </div>
                    <StatusBadge status={l.status} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Employee Code: {member.employeeId}</span>
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
