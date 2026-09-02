'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';
import { LogOut } from 'lucide-react';

export const LogoutConfirmModal: React.FC = () => {
  const { openModal, closeModal, showToast } = useCRM();

  if (openModal !== 'logout_confirm') return null;

  const handleLogout = () => {
    closeModal();
    
    // Clear authentication
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    
    showToast({
      type: 'info',
      title: 'Session Concluded',
      message: 'You have been safely signed out. Redirecting to login...',
    });

    // Redirect to login after a short delay using window.location
    setTimeout(() => {
      window.location.href = '/login';
    }, 1000);
  };

  return (
    <div
      id="logout-confirm-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      onClick={closeModal}
    >
      <div
        id="logout-confirm-modal"
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
            <LogOut className="w-6 h-6" />
          </div>

          <h3 className="text-base font-bold text-slate-900">Sign Out of CRM?</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your pipeline updates and local notes are safely saved. Are you sure you want to end your current session?
          </p>

          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={closeModal}
              className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors shadow-2xs"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
