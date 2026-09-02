'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCRM } from '@/lib/crm-context';
import {
  LayoutDashboard,
  Users,
  Store,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Layers,
  Settings,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    setOpenModal,
  } = useCRM();

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'leads' as const,
      label: 'Leads',
      icon: Users,
    },
    {
      id: 'dealers' as const,
      label: 'Dealers',
      icon: Store,
    },
    {
      id: 'staff' as const,
      label: 'Staff',
      icon: UserCheck,
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside
      id="crm-sidebar"
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <div
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-900 leading-tight tracking-tight flex items-center gap-1.5 truncate">
                Invisibe World
              </h1>
            </div>
          )}
        </div>

        {/* Toggle collapse button */}
        <button
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === `/${item.id}`;

          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => router.push(`/${item.id}`)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all select-none ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'
                }`}
              />
              {!sidebarCollapsed && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Logout */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        <button
          id="sidebar-logout-btn"
          onClick={() => setOpenModal('logout_confirm')}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors ${
            sidebarCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-rose-500 shrink-0" />
          {!sidebarCollapsed && <span className="truncate">Logout</span>}
        </button>
      </div>
    </aside>
  );
};
