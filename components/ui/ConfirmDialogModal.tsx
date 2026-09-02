'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import { AlertTriangle } from 'lucide-react';

export const ConfirmDialogModal: React.FC = () => {
  const { confirmDialog, hideConfirmDialog } = useCRM();

  if (!confirmDialog?.isOpen) return null;

  const handleConfirm = () => {
    confirmDialog.onConfirm();
    hideConfirmDialog();
  };

  return (
    <div
      id="confirm-dialog-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      onClick={hideConfirmDialog}
    >
      <div
        id="confirm-dialog-modal"
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-slate-900">{confirmDialog.title}</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {confirmDialog.message}
          </p>

          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={hideConfirmDialog}
              className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
