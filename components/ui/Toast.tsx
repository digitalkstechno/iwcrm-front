'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useCRM();

  return (
    <div
      id="toast-container"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          let icon = <Info className="w-5 h-5 text-blue-600 shrink-0" />;
          let bg = 'bg-white border-blue-200';

          if (toast.type === 'success') {
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
            bg = 'bg-white border-emerald-200';
          } else if (toast.type === 'warning') {
            icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
            bg = 'bg-white border-amber-200';
          } else if (toast.type === 'error') {
            icon = <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />;
            bg = 'bg-white border-red-200';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bg} text-slate-800`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 leading-tight">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{toast.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
