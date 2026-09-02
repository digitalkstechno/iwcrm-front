'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Lead, LeadStatus, LeadPriority, ActivityItem } from '@/lib/types';
import { StatusBadge, PriorityBadge } from '@/components/ui/StatusBadge';
import {
  X,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  Clock,
  Sparkles,
  Edit2,
  Trash2,
  CheckCircle2,
  Building,
  Globe,
  MapPin,
  DollarSign,
  User,
  Plus,
  Send,
  Download,
  Paperclip,
  Check,
} from 'lucide-react';

export const LeadDetailModal: React.FC = () => {
  const {
    openModal,
    modalData,
    closeModal,
    leads,
    updateLead,
    deleteLead,
    addLeadNote,
    addLeadActivity,
    setOpenModal,
    completeFollowUp,
    showToast,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'followups' | 'notes' | 'documents' | 'timeline'>('overview');
  const [newNoteText, setNewNoteText] = useState('');
  const [quickActivityType, setQuickActivityType] = useState<'call' | 'whatsapp' | 'email' | 'meeting' | null>(null);
  const [quickActivityNotes, setQuickActivityNotes] = useState('');

  if (openModal !== 'lead_detail' || !modalData) return null;

  // Retrieve freshest data from leads state
  const lead: Lead = leads.find((l) => l.id === modalData.id) || modalData;

  const handleStatusChange = (status: LeadStatus) => {
    updateLead(lead.id, { status });
  };

  const handlePriorityChange = (priority: LeadPriority) => {
    updateLead(lead.id, { priority });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addLeadNote(lead.id, newNoteText.trim());
    setNewNoteText('');
  };

  const handleLogQuickActivity = (type: 'call' | 'whatsapp' | 'email' | 'meeting') => {
    const titleMap = {
      call: 'Outbound Phone Call',
      whatsapp: 'WhatsApp Message Outreach',
      email: 'Email Sent to Lead',
      meeting: 'Client Conference Meeting',
    };

    addLeadActivity(lead.id, {
      type,
      title: titleMap[type],
      description: quickActivityNotes || `Logged ${type} interaction with ${lead.name}.`,
      authorName: 'Sarah J. (Admin)',
      meta: { outcome: 'Completed' },
    });

    setQuickActivityType(null);
    setQuickActivityNotes('');
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete lead ${lead.name}?`)) {
      deleteLead(lead.id);
      closeModal();
    }
  };

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
        {/* Header (Matching CRM Profile Requirements) */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-xs shrink-0">
              {lead.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                  #{lead.leadCode}
                </span>
                <StatusBadge status={lead.status} size="sm" />
                <PriorityBadge priority={lead.priority} />
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                <span className="font-medium text-slate-700">{lead.company}</span>
                <span>•</span>
                <span>{lead.email}</span>
                <span>•</span>
                <span>{lead.phone}</span>
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {lead.status !== 'Converted' && (
              <button
                id="lead-detail-convert-btn"
                onClick={() => setOpenModal('convert_lead', lead)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Convert Lead</span>
              </button>
            )}

            <button
              onClick={() => setOpenModal('lead_form', lead)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
              title="Edit lead details"
            >
              <Edit2 className="w-4 h-4" />
            </button>

            <button
              onClick={handleDelete}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              title="Delete lead"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-slate-200 mx-1" />

            <button
              onClick={closeModal}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Communication Action Bar */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Quick Actions:
          </span>

          <button
            onClick={() => setQuickActivityType('call')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            <span>Call</span>
          </button>

          <button
            onClick={() => setQuickActivityType('whatsapp')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={() => setQuickActivityType('email')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-600" />
            <span>Email</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>Add Note</span>
          </button>

          <button
            onClick={() => setOpenModal('follow_up', { leadId: lead.id, leadName: lead.name })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            <span>Schedule Follow-up</span>
          </button>
        </div>

        {/* Quick Activity Logger Popup */}
        {quickActivityType && (
          <div className="p-4 bg-blue-50/70 border-b border-blue-200 animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-900 uppercase">
                Log {quickActivityType} interaction
              </span>
              <button
                onClick={() => setQuickActivityType(null)}
                className="text-xs text-blue-700 hover:underline"
              >
                Cancel
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={quickActivityNotes}
                onChange={(e) => setQuickActivityNotes(e.target.value)}
                placeholder={`Add summary of the ${quickActivityType}...`}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-blue-200 rounded-lg text-slate-800 focus:outline-hidden"
              />
              <button
                onClick={() => handleLogQuickActivity(quickActivityType)}
                className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Log
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs (6 Tabs) */}
        <div className="px-6 border-b border-slate-200 flex items-center gap-6 overflow-x-auto">
          {[
            { id: 'overview', label: '1. Overview' },
            { id: 'activities', label: `2. Activities (${lead.activities?.length || 0})` },
            { id: 'followups', label: `3. Follow-ups (${lead.followUps?.length || 0})` },
            { id: 'notes', label: `4. Notes (${lead.notes?.length || 0})` },
            { id: 'documents', label: `5. Documents (${lead.documents?.length || 0})` },
            { id: 'timeline', label: '6. Timeline' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Estimated Value</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">
                    ${(lead.estimatedValue || 50000).toLocaleString()}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Lead Source</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{lead.source}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Assigned Rep</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{lead.assignedStaffName}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">Created Date</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{lead.createdDate}</p>
                </div>
              </div>

              {/* Detailed Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" />
                    Contact & Deal Details
                  </h4>
                  <div className="space-y-2 text-xs divide-y divide-slate-100">
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Full Name</span>
                      <span className="font-semibold text-slate-900">{lead.name}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Email Address</span>
                      <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                        {lead.email}
                      </a>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Phone</span>
                      <span className="font-semibold text-slate-900">{lead.phone}</span>
                    </div>
                    <div className="flex justify-between py-1.5 items-center">
                      <span className="text-slate-500">Pipeline Status</span>
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                        className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-800"
                      >
                        {['New', 'Contacted', 'Follow-up', 'Qualified', 'Negotiation', 'Converted', 'Lost'].map(
                          (st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className="flex justify-between py-1.5 items-center">
                      <span className="text-slate-500">Priority Level</span>
                      <select
                        value={lead.priority}
                        onChange={(e) => handlePriorityChange(e.target.value as LeadPriority)}
                        className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-800"
                      >
                        {['Urgent', 'High', 'Medium', 'Low'].map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-blue-600" />
                    Company & Location Profile
                  </h4>
                  <div className="space-y-2 text-xs divide-y divide-slate-100">
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Company Name</span>
                      <span className="font-semibold text-slate-900">{lead.company}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Industry</span>
                      <span className="font-semibold text-slate-900">{lead.industry || 'Automotive & Commercial'}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Location</span>
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {lead.location || 'Seattle, WA'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Website</span>
                      <a href={lead.website || '#'} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        {lead.website || 'https://sample-website.com'}
                      </a>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-500">Last Follow-up Interaction</span>
                      <span className="text-slate-700">{lead.lastFollowUp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITIES */}
          {activeTab === 'activities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase">Interaction Timeline</h4>
                <button
                  onClick={() => setQuickActivityType('call')}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Log Activity
                </button>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {lead.activities?.map((act) => (
                  <div key={act.id} className="relative">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100" />
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-900">{act.title}</p>
                        <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{act.description}</p>
                      <p className="text-[10px] text-slate-400 mt-2">By {act.authorName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FOLLOW-UPS */}
          {activeTab === 'followups' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase">Scheduled Follow-ups</h4>
                <button
                  onClick={() => setOpenModal('follow_up', { leadId: lead.id, leadName: lead.name })}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Schedule Follow-up
                </button>
              </div>

              <div className="space-y-2.5">
                {(!lead.followUps || lead.followUps.length === 0) ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No scheduled follow-ups yet.</p>
                ) : (
                  lead.followUps.map((fu) => (
                    <div
                      key={fu.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3"
                    >
                      <button
                        onClick={() => completeFollowUp(fu.id, !fu.completed)}
                        className={`mt-0.5 p-1 rounded-md border ${
                          fu.completed
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 text-transparent hover:border-slate-400'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-xs font-bold text-slate-900 ${fu.completed ? 'line-through text-slate-400' : ''}`}>
                            {fu.type}
                          </p>
                          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                            {fu.date} @ {fu.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{fu.notes}</p>
                        <p className="text-[10px] text-slate-400 mt-1">Assigned to: {fu.assignedStaffName}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-5">
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase">Add New Internal Note</label>
                <textarea
                  rows={3}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Type important information, call notes, objections, requirements..."
                  className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-1.5 shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Save Note
                  </button>
                </div>
              </form>

              <div className="space-y-3 pt-2">
                {lead.notes?.map((n) => (
                  <div key={n.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{n.authorName} ({n.authorRole})</span>
                      <span className="text-[10px] text-slate-400">{n.createdAt}</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{n.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 uppercase">Attached Documents & RFPs</h4>
                <button
                  onClick={() => showToast({ type: 'info', title: 'Upload Simulator', message: 'Document attached successfully.' })}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5"
                >
                  <Paperclip className="w-3.5 h-3.5" /> Attach File
                </button>
              </div>

              <div className="space-y-2.5">
                {(lead.documents || [
                  { id: 'd1', name: 'Proposal_Specs_v2.pdf', size: '1.4 MB', type: 'PDF', uploadedAt: '2026-08-30', uploadedBy: lead.assignedStaffName }
                ]).map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">{doc.size} · Uploaded {doc.uploadedAt} by {doc.uploadedBy}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast({ type: 'info', title: 'Downloading', message: `Downloading ${doc.name}...` })}
                      className="p-2 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase">Complete System Audit Log</h4>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Lead Created</span>
                    <span className="text-slate-400 font-normal">{lead.createdDate}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">Initial record created from {lead.source}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Assigned to {lead.assignedStaffName}</span>
                    <span className="text-slate-400 font-normal">{lead.createdDate}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">Assigned rep notification dispatched</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Lead ID: {lead.id}</span>
          <button
            onClick={closeModal}
            className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
