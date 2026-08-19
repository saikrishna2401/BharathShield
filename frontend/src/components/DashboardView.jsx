import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ShieldCheck, AlertTriangle, AlertOctagon, BarChart3, PieChart as PieChartIcon, Activity, Sparkles, Database } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchStatistics } from '../services/apiService';

export default function DashboardView() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStatistics().then(setStats);
  }, []);

  if (!stats) return null;

  const hasData = stats.totalAnalyzed > 0;

  const pieData = [
    { name: t('risk.SAFE'), value: stats.safeCount, color: '#10b981' },
    { name: t('risk.SUSPICIOUS'), value: stats.suspiciousCount, color: '#f59e0b' },
    { name: t('risk.PHISHING'), value: stats.phishingCount, color: '#f43f5e' }
  ].filter(d => d.value > 0);

  const langData = [
    { name: t('languageNames.en'), count: stats.languageDistribution.en || 0 },
    { name: t('languageNames.te'), count: stats.languageDistribution.te || 0 },
    { name: t('languageNames.hi'), count: stats.languageDistribution.hi || 0 },
    { name: t('languageNames.ta'), count: stats.languageDistribution.ta || 0 }
  ];

  const safePercent = stats.totalAnalyzed > 0 ? Math.round((stats.safeCount / stats.totalAnalyzed) * 100) : 0;
  const threatPercent = stats.totalAnalyzed > 0 ? Math.round(((stats.suspiciousCount + stats.phishingCount) / stats.totalAnalyzed) * 100) : 0;

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2.5">
            <LayoutDashboard className="w-5 h-5 text-teal-600" />
            <span>{t('dashboard.title')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700 shadow-xs">
          <Activity className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          <span>LIVE METRICS FEED</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-mono flex items-center justify-between">
            <span>{t('dashboard.totalAnalyzed')}</span>
            <Database className="w-4 h-4 text-slate-400" />
          </span>
          <div className="text-3xl font-black text-slate-900 font-mono tracking-tight">{stats.totalAnalyzed}</div>
          <span className="text-[10px] text-slate-500 font-sans mt-1 block">Inspected SMS messages</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {t('dashboard.safeCount')}
          </span>
          <div className="text-3xl font-black text-emerald-700 font-mono tracking-tight">{stats.safeCount}</div>
          <span className="text-[10px] text-emerald-800/80 font-sans mt-1 block font-medium">{safePercent}% legitimate messages</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block mb-1 font-mono flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            {t('dashboard.suspiciousCount')}
          </span>
          <div className="text-3xl font-black text-amber-700 font-mono tracking-tight">{stats.suspiciousCount}</div>
          <span className="text-[10px] text-amber-900/80 font-sans mt-1 block font-medium">Medium risk warnings</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider block mb-1 font-mono flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            {t('dashboard.phishingCount')}
          </span>
          <div className="text-3xl font-black text-rose-700 font-mono tracking-tight">{stats.phishingCount}</div>
          <span className="text-[10px] text-rose-900/80 font-sans mt-1 block font-medium">{threatPercent}% total scam rate</span>
        </div>
      </div>

      {!hasData ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-3 shadow-xs">
          <BarChart3 className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-medium">{t('dashboard.noData')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Risk Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-teal-600" />
                <span>{t('dashboard.riskBreakdown')}</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                PROPORTION
              </span>
            </div>

            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#0f172a' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Donut Center Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black font-mono text-slate-900">{stats.totalAnalyzed}</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Scans</span>
              </div>
            </div>
          </div>

          {/* Regional Language Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-600" />
                <span>{t('dashboard.langBreakdown')}</span>
              </h3>
              <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200/80">
                INDIC NLP
              </span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={langData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#0f766e' }}
                  />
                  <Bar dataKey="count" fill="#0d9488" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* Security Threat Insights Banner */}
      <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-white text-teal-700 border border-teal-200 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-display">
              Regional Language AI Protection Model
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              Continuously classifying Telugu, Hindi, Tamil & English SMS threats with dual-vector explainability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
