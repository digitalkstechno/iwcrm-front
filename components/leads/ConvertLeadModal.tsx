'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
import { Sparkles, X, CheckCircle, Store, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ConvertLeadModal: React.FC = () => {
  const { openModal, modalData, closeModal, convertLeadToDealer, showToast } = useCRM();

  const [tier, setTier] = useState<'Platinum' | 'Gold' | 'Silver' | 'Bronze'>('Gold');
  const [creditLimit, setCreditLimit] = useState(250000);
  const [region, setRegion] = useState('West Coast');

  if (openModal !== 'convert_lead' || !modalData) return null;

  const lead = modalData;

  const handleConvert = () => {
    convertLeadToDealer(lead.id, {
      tier,
      creditLimit,
      location: lead.location || region,
    });

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    closeModal();
  };

  return (
    <div
      id="convert-lead-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      onClick={closeModal}
    >
      <div
        id="convert-lead-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">Convert Lead to Dealer</h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Onboard <strong>{lead.company}</strong> as an authorized dealer
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-900">{lead.name}</p>
              <p className="text-slate-500">{lead.email} · {lead.phone}</p>
            </div>
            <span className="font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
              Lead #{lead.leadCode}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Authorized Dealer Tier
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Platinum', 'Gold', 'Silver', 'Bronze'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                    tier === t
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Allocated Credit Line (₹)
              </label>
              <input
                type="number"
                value={creditLimit}
                onChange={(e) => setCreditLimit(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Territory Region
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                placeholder="e.g. Northwest"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-800 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Automatic Workflow Actions:
            </p>
            <ul className="list-disc pl-5 space-y-0.5 text-emerald-700">
              <li>Generates official Dealer Code (e.g. DLR-90XX)</li>
              <li>Enables dealer portal ordering access & staff assignments</li>
              <li>Marks pipeline status as &ldquo;Converted&rdquo; and notifies account executive</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConvert}
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirm & Onboard Dealer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
