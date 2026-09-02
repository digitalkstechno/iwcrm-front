'use client';

import React, { useState } from 'react';
import { useCRM } from '@/lib/crm-context';
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

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activityLimit, setActivityLimit] = useState<number>(5);
  const [activeChartPoint, setActiveChartPoint] = useState<number | null>(null);

  // Live KPI Calculations
  const calculatedTotalLeads = 1284 + (leads.length - 7);
  const calculatedNewLeads = 48 + leads.filter((l) => l.status === 'New').length - 1;
  const calculatedConverted = 856 + leads.filter((l) => l.status === 'Converted').length - 1;
  const calculatedTotalDealers = 124 + (dealers.length - 6);
  const calculatedActiveDealers = 118 + (dealers.filter((d) => d.status === 'Active').length - 4);
  const calculatedTotalStaff = 32 + (staff.length - 7);

  // Chart Data based on time range
  const chartDataMap = {
    '7d': [
      { label: 'Mon', leads: 42, converted: 28 },
      { label: 'Tue', leads: 58, converted: 39 },
      { label: 'Wed', leads: 64, converted: 45 },
      { label: 'Thu', leads: 72, converted: 51 },
      { label: 'Fri', leads: 89, converted: 63 },
      { label: 'Sat', leads: 34, converted: 22 },
      { label: 'Sun', leads: 29, converted: 19 },
    ],
    '30d': [
      { label: 'Week 1', leads: 240, converted: 165 },
      { label: 'Week 2', leads: 310, converted: 215 },
      { label: 'Week 3', leads: 385, converted: 270 },
      { label: 'Week 4', leads: 420, converted: 298 },
    ],
    '90d': [
      { label: 'June', leads: 980, converted: 640 },
      { label: 'July', leads: 1120, converted: 780 },
      { label: 'August', leads: 1284, converted: 856 },
    ],
    '1y': [
      { label: 'Q1', leads: 2800, converted: 1820 },
      { label: 'Q2', leads: 3450, converted: 2310 },
      { label: 'Q3', leads: 4100, converted: 2890 },
      { label: 'Q4', leads: 4850, converted: 3410 },
    ],
  };

  const currentChartData = chartDataMap[timeRange];
  const maxLeadsValue = Math.max(...currentChartData.map((d) => d.leads)) * 1.15;

  // Source performance calculations
  const sourceStats = [
    { name: 'Website Form', percentage: 38, count: 488, color: 'bg-blue-600' },
    { name: 'Trade Show', percentage: 24, count: 308, color: 'bg-indigo-500' },
    { name: 'Referral', percentage: 18, count: 231, color: 'bg-emerald-500' },
    { name: 'Cold Call', percentage: 12, count: 154, color: 'bg-amber-500' },
    { name: 'Social Ads / Partner', percentage: 8, count: 103, color: 'bg-purple-500' },
  ];

  // Top Performing Dealers for table (Image 1 reference)
  const topDealers = [
    { name: 'Apex Auto Group', region: 'Northwest', leads: 342, convRate: 68 },
    { name: 'Sunrise Motors', region: 'South', leads: 289, convRate: 62 },
    { name: 'Urban Drive', region: 'East Coast', leads: 215, convRate: 55 },
    { name: 'Elite Drive', region: 'West', leads: 198, convRate: 54 },
  ];

  // Upcoming follow ups gathered from leads
  const allFollowUps = leads.flatMap((l) => l.followUps || []);

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
            {calculatedTotalLeads.toLocaleString()}
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
            {calculatedNewLeads}
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
            {calculatedConverted}
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
            {calculatedTotalDealers}
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
            {calculatedActiveDealers}
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
            {calculatedTotalStaff}
          </p>
        </div>
      </div>

      {/* Main Grid: Charts & Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Leads Over Time Chart Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Leads Over Time</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison between total leads generated vs converted.
                </p>
              </div>

              {/* Time Range Selector */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {(['7d', '30d', '90d', '1y'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                      timeRange === r
                        ? 'bg-white text-blue-600 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive SVG Chart Canvas */}
            <div className="mt-4 relative h-64 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal guidelines */}
                {[0, 50, 100, 150].map((y) => (
                  <line
                    key={y}
                    x1="0"
                    y1={y}
                    x2="500"
                    y2={y}
                    stroke="#f1f5f9"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Area & Line for Leads */}
                {(() => {
                  const pts = currentChartData.map((d, i) => {
                    const x = (i / (currentChartData.length - 1)) * 480 + 10;
                    const y = 180 - (d.leads / maxLeadsValue) * 160;
                    return { x, y, data: d };
                  });

                  const convPts = currentChartData.map((d, i) => {
                    const x = (i / (currentChartData.length - 1)) * 480 + 10;
                    const y = 180 - (d.converted / maxLeadsValue) * 160;
                    return { x, y, data: d };
                  });

                  const leadPath = pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
                  const leadArea = `${leadPath} L ${pts[pts.length - 1].x} 190 L ${pts[0].x} 190 Z`;

                  const convPath = convPts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
                  const convArea = `${convPath} L ${convPts[convPts.length - 1].x} 190 L ${convPts[0].x} 190 Z`;

                  return (
                    <>
                      <path d={leadArea} fill="url(#leadGrad)" />
                      <path d={leadPath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />

                      <path d={convArea} fill="url(#convGrad)" />
                      <path d={convPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" />

                      {/* Interactive hover points */}
                      {pts.map((p, i) => (
                        <g key={i} className="cursor-pointer" onMouseEnter={() => setActiveChartPoint(i)}>
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={activeChartPoint === i ? 6 : 4}
                            fill="#2563eb"
                            stroke="#ffffff"
                            strokeWidth="2"
                            className="transition-all"
                          />
                        </g>
                      ))}
                    </>
                  );
                })()}
              </svg>

              {/* X Axis Labels */}
              <div className="flex justify-between text-xs text-slate-400 font-medium px-2 mt-2">
                {currentChartData.map((d, i) => (
                  <span
                    key={i}
                    className={`cursor-pointer ${
                      activeChartPoint === i ? 'text-blue-600 font-bold' : ''
                    }`}
                    onClick={() => setActiveChartPoint(i)}
                  >
                    {d.label}
                  </span>
                ))}
              </div>

              {/* Tooltip Overlay */}
              {activeChartPoint !== null && currentChartData[activeChartPoint] && (
                <div className="absolute top-2 right-4 bg-slate-900 text-white text-xs rounded-lg p-2 shadow-xl border border-slate-700 animate-in fade-in">
                  <p className="font-bold text-slate-300">{currentChartData[activeChartPoint].label}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-blue-400 flex items-center gap-1">
                      ● Leads: {currentChartData[activeChartPoint].leads}
                    </span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      ● Converted: {currentChartData[activeChartPoint].converted}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Legend & Stats Summary */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  Total Pipeline Leads
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Converted to Dealer
                </span>
              </div>
              <span className="text-slate-400 font-normal">
                Avg. Conversion Rate: <strong className="text-emerald-600">66.7%</strong>
              </span>
            </div>
          </div>

          {/* Top Performing Dealers (Image 1 reference) */}
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
                    <th className="pb-2.5 font-semibold">Region</th>
                    <th className="pb-2.5 font-semibold text-right">Leads</th>
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

        {/* Right Column (1 Col) */}
        <div className="space-y-6">
          {/* Lead Source Performance (Image 1 reference) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Lead Source Performance</h3>
              <MoreVertical className="w-4 h-4 text-slate-400 cursor-pointer" />
            </div>

            <div className="space-y-3.5 mt-4">
              {sourceStats.map((s, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-700">{s.name}</span>
                    <span className="text-slate-500">
                      <strong>{s.percentage}%</strong> ({s.count})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${s.color} rounded-full transition-all duration-500`}
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-800 flex items-center justify-between">
              <span>Top Inbound: <strong>Website Form</strong></span>
              <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => setActiveTab('reports')}>
                Analytics →
              </span>
            </div>
          </div>

          {/* Recent Activities Timeline (Image 1 reference) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Recent Activities</h3>
              <span className="text-xs text-slate-400">Live feed</span>
            </div>

            {/* Timeline List */}
            <div className="relative mt-4 pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {activities.slice(0, activityLimit).map((act, i) => (
                <div key={act.id || i} className="relative group">
                  {/* Blue bullet dot */}
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 leading-tight">
                      {act.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {act.description}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {act.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More button matching Image 1 */}
            <div className="mt-5 pt-3 border-t border-slate-100">
              <button
                id="dashboard-load-more-activities"
                onClick={() => setActivityLimit((prev) => (prev >= activities.length ? 5 : prev + 4))}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-xl transition-colors"
              >
                {activityLimit >= activities.length ? 'Show Less Activities' : 'Load More'}
              </button>
            </div>
          </div>

          {/* Upcoming Follow-ups Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                Upcoming Follow-ups
              </h3>
              <button
                onClick={() => setOpenModal('follow_up')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                + Schedule
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {allFollowUps.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No pending follow-ups</p>
              ) : (
                allFollowUps.slice(0, 3).map((fu) => (
                  <div
                    key={fu.id}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-start gap-2.5 hover:bg-slate-100/60 transition-colors"
                  >
                    <button
                      onClick={() => completeFollowUp(fu.id, !fu.completed)}
                      className="mt-0.5 text-slate-400 hover:text-blue-600"
                    >
                      <CheckSquare
                        className={`w-4 h-4 ${fu.completed ? 'text-emerald-600 fill-emerald-100' : ''}`}
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold text-slate-800 truncate ${fu.completed ? 'line-through text-slate-400' : ''}`}>
                        {fu.type} with {fu.leadName}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {fu.date} at {fu.time} · {fu.assignedStaffName}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
