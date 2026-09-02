'use client';

import React, { useEffect, useState } from 'react';
import { useCRM } from '@/lib/crm-context';

export const Header: React.FC = () => {
  const { sidebarCollapsed } = useCRM();
  const [userName, setUserName] = useState('User');
  const [initials, setInitials] = useState('U');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
      setInitials(storedName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase());
    }
  }, []);

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
          <p className="text-sm font-semibold text-slate-900">{userName}</p>
          <p className="text-xs text-slate-500">Staff Member</p>
        </div>

        {/* Profile Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-slate-200">
            {initials}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
      </div>
    </header>
  );
};
