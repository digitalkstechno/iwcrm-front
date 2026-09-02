'use client';

import React from 'react';
import { useCRM } from '@/lib/crm-context';

export const Header: React.FC = () => {
  const { sidebarCollapsed } = useCRM();

  return (
    <header
      id="crm-header"
      className={`fixed top-0 right-0 h-16 bg-white border-b border-slate-200 z-20 transition-all duration-300 ease-in-out flex items-center justify-end px-6 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* User Profile Section */}
      <div className="flex items-center gap-4">
        {/* Profile Info */}
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">Sarah J.</p>
          <p className="text-xs text-slate-500">Enterprise Director</p>
        </div>

        {/* Profile Avatar */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            alt="Admin Profile"
            className="w-10 h-10 rounded-full object-cover border border-slate-200"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
      </div>
    </header>
  );
};
