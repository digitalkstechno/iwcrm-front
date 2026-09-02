'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import {
  UserPlus,
  Store,
  UserCheck,
  Calendar,
  PhoneCall,
  Download,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const QuickActionModal: React.FC = () => {
  const { openModal, closeModal, setOpenModal, setActiveTab } = useCRM();

  if (openModal !== 'quick_action') return null;

  const actions = [
    {
      title: 'Create New Lead',
      description: 'Add a prospective client or organization into the sales pipeline.',
      icon: UserPlus,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      onClick: () => setOpenModal('lead_form'),
    },
    {
      title: 'Register New Dealer',
      description: 'Onboard an authorized dealership partner and set credit limits.',
      icon: Store,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      onClick: () => setOpenModal('dealer_form'),
    },
    {
      title: 'Schedule Follow-up',
      description: 'Set a call, meeting, demo or task reminder for a sales rep.',
      icon: Calendar,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      onClick: () => setOpenModal('follow_up'),
    },
    {
      title: 'Onboard Staff Member',
      description: 'Add a new sales executive or account manager to the CRM roster.',
      icon: UserCheck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      onClick: () => setOpenModal('staff_form'),
    },
    {
      title: 'Executive Reports & Analytics',
      description: 'Review pipeline conversion funnels and regional performance.',
      icon: Download,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      onClick: () => {
        closeModal();
        setActiveTab('reports');
      },
    },
  ];

  return (
    <div
      id="quick-action-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      onClick={closeModal}
    >
      <div
        id="quick-action-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
              <p className="text-xs text-slate-500">Fast workflows and record creation</p>
            </div>
          </div>
          <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="p-4 space-y-2">
          {actions.map((act, i) => {
            const Icon = act.icon;
            return (
              <button
                key={i}
                onClick={act.onClick}
                className="w-full p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50/80 transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${act.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{act.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 shrink-0 ml-2" />
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={closeModal}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
