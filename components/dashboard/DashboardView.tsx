'use client';

import React, { useState, useEffect } from 'react';
import { useCRM } from '@/lib/crm-context';
import api from '@/lib/axios';
import {
  UserPlus,
  Sparkles,
  UserCheck,
  Store,
  CheckCircle2,
  Users,
  ArrowUpRight,
  ChevronRight,
  Clock,
  CheckSquare,
  Calendar,
  MoreVertical,
  Plus,
  Loader2,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    leads,
    dealers,
    staff,
    activities,
    setActiveTab,
    setOpenModal,
    completeFollowUp,
  } = useCRM();

  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    convertedLeads: 0,
    totalDealers: 0,
    activeDealers: 0,
    totalStaff: 0,
    topDealers: [] as any[],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/v1/api/dashboard');
        if (res.data?.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Top Performing Dealers for table
  const topDealers = stats.topDealers.length > 0 ? stats.topDealers : [
    { name: 'No Data Yet', region: '-', leads: 0, convRate: 0 },
  ];

  return (
    <div id="dashboard-view" className="space-y-6 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor key performance metrics and activities across your dealer network.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenModal('quick_action')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Action</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Cards (Image 1 Layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Leads */}
        <div
          onClick={() => setActiveTab('leads')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +12%
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-3">
            Total Leads
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight group-hover:text-blue-600 transition-colors">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : stats.totalLeads.toLocaleString()}
          </p>
        </div>

        {/* New Leads */}
        <div
          onClick={() => setActiveTab('leads')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +5%
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-3">
            New Leads
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight group-hover:text-blue-600 transition-colors">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : stats.newLeads}
          </p>
        </div>

        {/* Converted */}
        <div
          onClick={() => setActiveTab('leads')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" /> +8%
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-3">
            Converted
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight group-hover:text-emerald-600 transition-colors">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : stats.convertedLeads}
          </p>
        </div>

        {/* Total Dealers */}
        <div
          onClick={() => setActiveTab('dealers')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-400 font-medium">—</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-3">
            Total Dealers
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight group-hover:text-blue-600 transition-colors">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : stats.totalDealers}
          </p>
        </div>

        {/* Active Dealers */}
        <div
          onClick={() => setActiveTab('dealers')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-400 font-medium">—</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-3">
            Active Dealers
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight group-hover:text-emerald-600 transition-colors">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : stats.activeDealers}
          </p>
        </div>

        {/* Total Staff */}
        <div
          onClick={() => setActiveTab('staff')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-xs text-slate-400 font-medium">—</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-3">
            Total Staff
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5 tracking-tight group-hover:text-blue-600 transition-colors">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : stats.totalStaff}
          </p>
        </div>
      </div>

      {/* Main Grid: Real Data Only */}
      <div className="grid grid-cols-1 gap-6">
        {/* Top Performing Dealers */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Top Performing Dealers</h3>
            <button
              onClick={() => setActiveTab('dealers')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm mt-2">
              <thead>
                <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="pb-2.5 font-semibold">Dealer Name</th>
                  <th className="pb-2.5 font-semibold">City</th>
                  <th className="pb-2.5 font-semibold text-right">Total Leads</th>
                  <th className="pb-2.5 font-semibold text-right">Conv. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topDealers.map((d, i) => (
                  <tr
                    key={i}
                    onClick={() => setActiveTab('dealers')}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 font-medium text-slate-900 group-hover:text-blue-600">
                      {d.name}
                    </td>
                    <td className="py-3 text-slate-500 text-xs">{d.region}</td>
                    <td className="py-3 text-slate-700 text-right font-medium text-xs">
                      {d.leads.toLocaleString()}
                    </td>
                    <td className="py-3 text-right">
                      <span className="inline-block text-xs font-semibold text-emerald-600">
                        {d.convRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
