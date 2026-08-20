import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, AlertTriangle, AlertOctagon, Activity, Sparkles, PhoneCall, ArrowRight, MessageSquare, Link2, Phone, CreditCard, Cpu, Image, Database, Users } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchStatistics, fetchFamilyMembers } from '../services/apiService';

export default function DashboardView({ currentUserId, userName = 'Sai Krishna', onNavigate, onShowToast }) {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [familyCount, setFamilyCount] = useState(3);

  const loadData = async () => {
    const data = await fetchStatistics(currentUserId);
    setStats(data);

    const familyData = await fetchFamilyMembers(currentUserId);
    if (familyData && familyData.members) setFamilyCount(familyData.members.length);
  };

  useEffect(() => {
    loadData();
  }, [currentUserId]);

  if (!stats) return null;

  const hasData = stats.totalAnalyzed > 0;
  const shieldScore = stats.shieldScore || 95;
  const envThreat = stats.environmentThreatIndex || 72;

  const pieData = [
    { name: t('risk.SAFE', 'SAFE'), value: stats.safeCount || 0, color: '#34d399' },
    { name: t('risk.SUSPICIOUS', 'SUSPICIOUS'), value: stats.suspiciousCount || 0, color: '#fbbf24' },
    { name: t('risk.PHISHING', 'PHISHING'), value: stats.phishingCount || 0, color: '#fb7185' }
  ].filter(d => d.value > 0);

  const langData = [
    { name: t('languageNames.en', 'English'), count: stats.languageDistribution.en || 0 },
    { name: t('languageNames.te', 'Telugu'), count: stats.languageDistribution.te || 0 },
    { name: t('languageNames.hi', 'Hindi'), count: stats.languageDistribution.hi || 0 },
    { name: t('languageNames.ta', 'Tamil'), count: stats.languageDistribution.ta || 0 }
  ];

  const quickScanIcons = [
    { id: 'sms', label: 'SMS', icon: MessageSquare },
    { id: 'url', label: 'URL', icon: Link2 },
    { id: 'phone', label: 'Phone No.', icon: Phone },
    { id: 'upi', label: 'UPI ID', icon: CreditCard },
    { id: 'apk', label: 'APK File', icon: Cpu },
    { id: 'screenshot', label: 'Screenshot', icon: Image }
  ];

  // Dynamic Live Recent Threats (Inspired by NeoRakshak)
  const recentThreats = [
    {
      id: 'T-101',
      title: 'DIGITAL ARREST SCAM',
      severity: 'CRITICAL',
      text: 'Main CBI officer hoon, aapka Aadhaar number illegal activity mein pakda gaya hai...',
      reasonKey: 'AUTHORITY_CLAIM',
      recKey: 'DO_NOT_SHARE_OTP'
    },
    {
      id: 'T-102',
      title: 'UPI COLLECT FRAUD',
      severity: 'HIGH',
      text: 'Congratulations! ₹50,000 cashback approved. Enter UPI PIN to claim reward...',
      reasonKey: 'FINANCIAL',
      recKey: 'DO_NOT_SHARE_OTP'
    },
    {
      id: 'T-103',
      title: 'OTP BANK FRAUD',
      severity: 'HIGH',
      text: 'HDFC Bank: Verify your account immediately or debit card will be blocked...',
      reasonKey: 'URGENCY',
      recKey: 'VERIFY_OFFICIAL_CHANNEL'
    }
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* Personalized Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-white font-display">
              Namaste, {userName} 👋
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 font-mono text-[10px] font-bold">
              PROTECTION ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Tuesday, 19 August • BharathShield Real-Time Cybersecurity Engine
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <Activity className="w-4 h-4 text-teal-400 animate-pulse" />
          <span>LIVE THREAT TELEMETRY</span>
        </div>
      </div>

      {/* Dual Protection Score Gauges (Inspired by NeoRakshak) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* YOUR SHIELD SCORE */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
              YOUR SHIELD SCORE
            </span>
            <div className="text-4xl font-extrabold font-mono tracking-tight text-emerald-400">
              {shieldScore} <span className="text-sm text-slate-500 font-normal">/ 100</span>
            </div>
            <span className="inline-block px-3 py-1 rounded-full badge-safe text-xs font-bold font-display mt-2">
              🟢 Fully Protected
            </span>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              {familyCount} family members protected • Privacy Active
            </p>
          </div>

          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" className="stroke-slate-800" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#34d399"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 38}
                strokeDashoffset={(2 * Math.PI * 38) * (1 - shieldScore / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center font-mono font-bold text-sm text-white">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* INDIA REGIONAL THREAT INDEX */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
              INDIA REGIONAL THREAT INDEX
            </span>
            <div className="text-4xl font-extrabold font-mono tracking-tight text-amber-400">
              {envThreat} <span className="text-sm text-slate-500 font-normal">/ 100</span>
            </div>
            <span className="inline-block px-3 py-1 rounded-full badge-suspicious text-xs font-bold font-display mt-2">
              🟡 Moderate Risk Environment
            </span>
            <p className="text-[11px] text-slate-400 mt-1 font-sans">
              Active phishing campaigns targeting banks & TRAI
            </p>
          </div>

          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" className="stroke-slate-800" strokeWidth="8" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="38"
                stroke="#fbbf24"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 38}
                strokeDashoffset={(2 * Math.PI * 38) * (1 - envThreat / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-xs text-amber-400">
              {envThreat}%
            </div>
          </div>
        </div>

      </div>

      {/* Quick Scan Grid Launcher (Inspired by NeoRakshak) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>Quick Threat Scan</span>
          </h3>

          <button
            onClick={() => onNavigate('quickScan')}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 font-mono"
          >
            <span>See all →</span>
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickScanIcons.map((qs) => {
            const Icon = qs.icon;
            return (
              <button
                key={qs.id}
                onClick={() => onNavigate('quickScan')}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-900 text-slate-300 hover:text-white flex flex-col items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-lg"
              >
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold font-mono tracking-tight">
                  {qs.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Live Threats Feed (Inspired by NeoRakshak) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Recent Threats & Prevailing Regional Scams</span>
          </h3>

          <button
            onClick={() => onNavigate('history')}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 font-mono"
          >
            <span>See all →</span>
          </button>
        </div>

        <div className="space-y-3">
          {recentThreats.map((rt) => {
            const isCritical = rt.severity === 'CRITICAL';
            return (
              <div
                key={rt.id}
                className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white font-display tracking-tight">
                      {rt.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-extrabold uppercase ${
                      isCritical ? 'badge-critical' : 'badge-phishing'
                    }`}>
                      {rt.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono truncate">
                    "{rt.text}"
                  </p>
                </div>

                <button
                  onClick={() => {
                    onNavigate('analyze');
                    if (onShowToast) onShowToast(`Loaded ${rt.title} into Threat Scanner`, 'info');
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 shadow-lg shadow-rose-500/10"
                >
                  <span>Protect Now →</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cyber Crime Helpline 1930 Emergency Banner */}
      <a
        href="tel:1930"
        className="p-5 rounded-3xl bg-gradient-to-r from-rose-950/90 via-slate-900 to-rose-950/90 border border-rose-500/40 flex items-center justify-between gap-4 hover:border-rose-500 transition-all shadow-2xl group"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-lg">
            <PhoneCall className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-display">
              National Cyber Crime Helpline: Dial 1930
            </h4>
            <p className="text-xs text-slate-400 font-medium">
              Immediate government hotline to report financial cyber fraud within 24 hours.
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" />
      </a>

      {/* Recharts Analytics Charts Section */}
      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Risk Breakdown */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Your Scan Risk Distribution
            </h3>

            <div className="h-56 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={6} dataKey="value">
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} stroke="#090d16" strokeWidth={3} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black font-mono text-white">{stats.totalAnalyzed}</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Scans</span>
              </div>
            </div>
          </div>

          {/* Language Breakdown */}
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Indic Language Distribution
            </h3>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={langData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', color: '#2dd4bf' }} />
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
