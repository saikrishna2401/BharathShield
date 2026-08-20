import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, AlertTriangle, Activity, Sparkles, PhoneCall, ArrowRight, MessageSquare, Link2, Phone, CreditCard, Cpu, Image } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchStatistics } from '../services/apiService';

export default function DashboardView({ currentUserId, onNavigate, onShowToast }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);

  const loadData = async () => {
    const data = await fetchStatistics(currentUserId);
    setStats(data);
  };

  useEffect(() => {
    loadData();
  }, [currentUserId]);

  if (!stats) return null;

  const hasData = stats.totalAnalyzed > 0;
  const shieldScore = stats.shieldScore || 100;
  const envThreat = stats.environmentThreatIndex || 72;

  const pieData = [
    { name: t('risk.SAFE', 'SAFE'), value: stats.safeCount || 0, color: '#10b981' },
    { name: t('risk.SUSPICIOUS', 'SUSPICIOUS'), value: stats.suspiciousCount || 0, color: '#f59e0b' },
    { name: t('risk.PHISHING', 'PHISHING'), value: stats.phishingCount || 0, color: '#f43f5e' }
  ].filter(d => d.value > 0);

  const langData = [
    { name: t('languageNames.en', 'English'), count: stats.languageDistribution.en || 0 },
    { name: t('languageNames.te', 'Telugu'), count: stats.languageDistribution.te || 0 },
    { name: t('languageNames.hi', 'Hindi'), count: stats.languageDistribution.hi || 0 },
    { name: t('languageNames.ta', 'Tamil'), count: stats.languageDistribution.ta || 0 }
  ];

  const quickScanIcons = [
    { id: 'sms', labelKey: 'quickScan.vSms', icon: MessageSquare },
    { id: 'url', labelKey: 'quickScan.vUrl', icon: Link2 },
    { id: 'phone', labelKey: 'quickScan.vPhone', icon: Phone },
    { id: 'upi', labelKey: 'quickScan.vUpi', icon: CreditCard },
    { id: 'apk', labelKey: 'quickScan.vApk', icon: Cpu },
    { id: 'screenshot', labelKey: 'quickScan.vScreenshot', icon: Image }
  ];

  // Dynamic Live Recent Threats
  const recentThreats = [
    {
      id: 'T-101',
      titleKey: 'recentThreats.t1Title',
      defaultTitle: 'DIGITAL ARREST SCAM',
      severity: 'CRITICAL',
      textKey: 'recentThreats.t1Text',
      defaultText: 'Main CBI officer hoon, aapka Aadhaar number illegal activity mein pakda gaya hai...'
    },
    {
      id: 'T-102',
      titleKey: 'recentThreats.t2Title',
      defaultTitle: 'UPI COLLECT FRAUD',
      severity: 'HIGH',
      textKey: 'recentThreats.t2Text',
      defaultText: 'Congratulations! ₹50,000 cashback approved. Enter UPI PIN to claim reward...'
    },
    {
      id: 'T-103',
      titleKey: 'recentThreats.t3Title',
      defaultTitle: 'OTP BANK FRAUD',
      severity: 'HIGH',
      textKey: 'recentThreats.t3Text',
      defaultText: 'HDFC Bank: Verify your account immediately or debit card will be blocked...'
    }
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* Personalized Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 font-display">
              {t('dashboard.welcomeTitle', 'Cybersecurity Overview')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
              {t('dashboard.activeStatus', 'PROTECTION ACTIVE')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {t('dashboard.subtitle', 'BharathShield Real-Time Cybersecurity Engine')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700">
          <Activity className="w-4 h-4 text-teal-600 animate-pulse" />
          <span>{t('dashboard.telemetry', 'LIVE THREAT TELEMETRY')}</span>
        </div>
      </div>

      {/* Dual Protection Score Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* YOUR SHIELD SCORE */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative overflow-hidden flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
              {t('dashboard.shieldScore', 'YOUR SHIELD SCORE')}
            </span>
            <div className="text-4xl font-extrabold font-mono tracking-tight text-emerald-600">
              {shieldScore} <span className="text-sm text-slate-400 font-normal">/ 100</span>
            </div>
            <span className="inline-block px-3 py-1 rounded-full badge-safe text-xs font-bold font-display mt-2">
              🟢 {t('dashboard.fullyProtected', 'Fully Protected')}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              {t('dashboard.shieldDesc', 'Personal Anti-Phishing Shield Active')}
            </p>
          </div>

          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" className="stroke-slate-100" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 38}
                strokeDashoffset={(2 * Math.PI * 38) * (1 - shieldScore / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono font-bold text-sm text-slate-900">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* INDIA REGIONAL THREAT INDEX */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs relative overflow-hidden flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
              {t('dashboard.threatIndex', 'INDIA REGIONAL THREAT INDEX')}
            </span>
            <div className="text-4xl font-extrabold font-mono tracking-tight text-amber-600">
              {envThreat} <span className="text-sm text-slate-400 font-normal">/ 100</span>
            </div>
            <span className="inline-block px-3 py-1 rounded-full badge-suspicious text-xs font-bold font-display mt-2">
              🟡 {t('dashboard.moderateRisk', 'Moderate Risk Environment')}
            </span>
            <p className="text-[11px] text-slate-500 mt-1 font-sans">
              {t('dashboard.activeCampaigns', 'Active phishing campaigns targeting banks & TRAI')}
            </p>
          </div>

          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" className="stroke-slate-100" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#f59e0b"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 38}
                strokeDashoffset={(2 * Math.PI * 38) * (1 - envThreat / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-amber-600">
              {envThreat}%
            </div>
          </div>
        </div>

      </div>

      {/* Quick Scan Grid Launcher */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{t('quickScan.title', 'Quick Security Vector Scan')}</span>
          </h3>

          <button
            onClick={() => onNavigate('quickScan')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 font-mono"
          >
            <span>{t('dashboard.seeAll', 'See all →')}</span>
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickScanIcons.map((qs) => {
            const Icon = qs.icon;
            return (
              <button
                key={qs.id}
                onClick={() => onNavigate('quickScan')}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 hover:bg-teal-50/50 text-slate-700 hover:text-teal-900 flex flex-col items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-2xs"
              >
                <div className="p-2.5 rounded-xl bg-teal-100/80 text-teal-700 border border-teal-200">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold font-mono tracking-tight text-center">
                  {t(qs.labelKey, qs.id.toUpperCase())}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Live Threats Feed */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{t('dashboard.recentThreatsTitle', 'Recent Threats & Prevailing Regional Scams')}</span>
          </h3>

          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 font-mono"
          >
            <span>{t('dashboard.seeAll', 'See all →')}</span>
          </button>
        </div>

        <div className="space-y-3">
          {recentThreats.map((rt) => {
            const isCritical = rt.severity === 'CRITICAL';
            return (
              <div
                key={rt.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 font-display tracking-tight">
                      {t(rt.titleKey, rt.defaultTitle)}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-extrabold uppercase ${
                      isCritical ? 'badge-critical' : 'badge-phishing'
                    }`}>
                      {rt.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-mono truncate">
                    "{t(rt.textKey, rt.defaultText)}"
                  </p>
                </div>

                <button
                  onClick={() => {
                    onNavigate('analyze');
                    if (onShowToast) onShowToast(`Loaded ${t(rt.titleKey, rt.defaultTitle)} into Threat Scanner`, 'info');
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <span>{t('dashboard.protectNowBtn', 'Protect Now →')}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cyber Crime Helpline 1930 Emergency Banner */}
      <a
        href="tel:1930"
        className="p-5 rounded-3xl bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 text-white border border-rose-700 flex items-center justify-between gap-4 hover:opacity-95 transition-all shadow-md group"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-white/10 text-white border border-white/20 shadow-xs">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-display">
              {t('learn.emergencyTitle', 'National Cyber Crime Helpline: Dial 1930')}
            </h4>
            <p className="text-xs text-rose-100 font-medium">
              {t('learn.emergencySubtitle', 'Immediate government hotline to report financial cyber fraud within 24 hours.')}
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
      </a>

      {/* Recharts Analytics Charts Section */}
      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Risk Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 font-mono">
              {t('dashboard.riskBreakdown', 'Your Scan Risk Distribution')}
            </h3>

            <div className="h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={6} dataKey="value">
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} stroke="#ffffff" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black font-mono text-slate-900">{stats.totalAnalyzed}</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Scans</span>
              </div>
            </div>
          </div>

          {/* Language Breakdown */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 font-mono">
              {t('dashboard.langBreakdown', 'Indic Language Distribution')}
            </h3>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={langData}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0d9488' }} />
                  <Bar dataKey="count" fill="#0d9488" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
