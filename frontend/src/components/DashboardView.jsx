import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ShieldCheck, AlertTriangle, AlertOctagon, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
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
    { name: t('risk.SAFE'), value: stats.safeCount, color: '#34d399' },
    { name: t('risk.SUSPICIOUS'), value: stats.suspiciousCount, color: '#fbbf24' },
    { name: t('risk.PHISHING'), value: stats.phishingCount, color: '#f87171' }
  ].filter(d => d.value > 0);

  const langData = [
    { name: t('languageNames.en'), count: stats.languageDistribution.en || 0 },
    { name: t('languageNames.te'), count: stats.languageDistribution.te || 0 },
    { name: t('languageNames.hi'), count: stats.languageDistribution.hi || 0 },
    { name: t('languageNames.ta'), count: stats.languageDistribution.ta || 0 }
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-cyan-400" />
          <span>{t('dashboard.title')}</span>
        </h2>
        <p className="text-xs text-slate-400">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="cyber-card p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {t('dashboard.totalAnalyzed')}
          </span>
          <div className="text-2xl font-black text-white font-mono">{stats.totalAnalyzed}</div>
        </div>

        <div className="cyber-card p-4 border-emerald-500/30">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t('dashboard.safeCount')}
          </span>
          <div className="text-2xl font-black text-emerald-400 font-mono">{stats.safeCount}</div>
        </div>

        <div className="cyber-card p-4 border-amber-500/30">
          <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {t('dashboard.suspiciousCount')}
          </span>
          <div className="text-2xl font-black text-amber-400 font-mono">{stats.suspiciousCount}</div>
        </div>

        <div className="cyber-card p-4 border-rose-500/30">
          <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5" />
            {t('dashboard.phishingCount')}
          </span>
          <div className="text-2xl font-black text-rose-400 font-mono">{stats.phishingCount}</div>
        </div>
      </div>

      {!hasData ? (
        <div className="cyber-card p-12 text-center text-slate-500">
          <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">{t('dashboard.noData')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Risk Distribution Pie Chart */}
          <div className="cyber-card p-5">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-cyan-400" />
              <span>{t('dashboard.riskBreakdown')}</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Language Bar Chart */}
          <div className="cyber-card p-5">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>{t('dashboard.langBreakdown')}</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={langData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
