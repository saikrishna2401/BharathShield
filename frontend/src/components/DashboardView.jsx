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
    <div className="w-full space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white font-display flex items-center gap-2.5">
          <LayoutDashboard className="w-6 h-6 text-cyan-400" />
          <span>{t('dashboard.title')}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="cyber-card p-5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 font-mono">
            {t('dashboard.totalAnalyzed')}
          </span>
          <div className="text-3xl font-black text-white font-mono">{stats.totalAnalyzed}</div>
        </div>

        <div className="cyber-card p-5 border-emerald-500/30">
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            {t('dashboard.safeCount')}
          </span>
          <div className="text-3xl font-black text-emerald-400 font-mono">{stats.safeCount}</div>
        </div>

        <div className="cyber-card p-5 border-amber-500/30">
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1 font-mono flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            {t('dashboard.suspiciousCount')}
          </span>
          <div className="text-3xl font-black text-amber-400 font-mono">{stats.suspiciousCount}</div>
        </div>

        <div className="cyber-card p-5 border-rose-500/30">
          <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-1 font-mono flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4" />
            {t('dashboard.phishingCount')}
          </span>
          <div className="text-3xl font-black text-rose-400 font-mono">{stats.phishingCount}</div>
        </div>
      </div>

      {!hasData ? (
        <div className="cyber-card p-12 text-center text-slate-500 space-y-3">
          <BarChart3 className="w-12 h-12 text-slate-600 mx-auto opacity-40" />
          <p className="text-sm font-medium">{t('dashboard.noData')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Risk Distribution Pie Chart */}
          <div className="cyber-card p-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
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
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050811', borderColor: '#334155', borderRadius: '12px', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Language Bar Chart */}
          <div className="cyber-card p-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>{t('dashboard.langBreakdown')}</span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={langData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#050811', borderColor: '#334155', borderRadius: '12px', color: '#06b6d4' }}
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
