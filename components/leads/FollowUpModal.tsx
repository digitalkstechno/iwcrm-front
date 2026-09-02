'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Calendar, Clock, X, Check, Bell } from 'lucide-react';

export const FollowUpModal: React.FC = () => {
  const { openModal, modalData, closeModal, addLeadFollowUp, staff, leads } = useCRM();

  const [leadId, setLeadId] = useState(modalData?.leadId || leads[0]?.id || '');
  const [type, setType] = useState<'Call' | 'Meeting' | 'WhatsApp' | 'Email' | 'Demo' | 'Contract Review'>('Call');
  const [date, setDate] = useState('Tomorrow');
  const [time, setTime] = useState('10:30 AM');
  const [assignedStaffId, setAssignedStaffId] = useState(staff[0]?.id || '');
  const [notes, setNotes] = useState('');

  if (openModal !== 'follow_up') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedLead = leads.find((l) => l.id === leadId);
    const selectedStaff = staff.find((s) => s.id === assignedStaffId);

    addLeadFollowUp({
      leadId: selectedLead?.id || 'gen-1',
      leadName: selectedLead?.name || 'General Task',
      type,
      date,
      time,
      assignedStaffId: selectedStaff?.id || 'staff-1',
      assignedStaffName: selectedStaff?.name || 'Sarah J.',
      notes: notes || `Follow-up ${type} regarding pipeline opportunity.`,
      completed: false,
      priority: 'Medium',
    });

    closeModal();
  };

  return (
    <div
      id="follow-up-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      onClick={closeModal}
    >
      <div
        id="follow-up-modal"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Schedule Follow-up</h3>
              <p className="text-xs text-slate-500">Set automatic reminder and task assignment</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Lead</label>
            <select
              value={leadId}
              onChange={(e) => setLeadId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-purple-500"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} — {l.company} (#{l.leadCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Interaction Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Call', 'Meeting', 'WhatsApp', 'Email', 'Demo', 'Contract Review'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all ${
                    type === t
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Tomorrow or 2026-09-04"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 10:30 AM"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Rep</label>
            <select
              value={assignedStaffId}
              onChange={(e) => setAssignedStaffId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-purple-500"
            >
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Agenda / Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key discussion topics or follow-up goals..."
              className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-purple-500"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Confirm Follow-up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
