import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Globe, Server, Database, Sparkles } from 'lucide-react';

export default function Header({ healthStatus, currentLang, onLanguageChange }) {
  const { t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' }
  ];

  const isConnected = healthStatus.status === 'ok';

  const dbLabel = healthStatus.database === 'supabase'
    ? 'Supabase DB'
    : healthStatus.database === 'mongodb'
      ? t('header.mongoDb')
      : t('header.memoryStore');

  return (
    <header className="sticky top-0 z-40 bg-[#050811]/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-50 blur group-hover:opacity-75 transition-all"></div>
            <div className="relative w-11 h-11 rounded-xl bg-slate-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-xl">
              <ShieldAlert className="w-6 h-6 animate-pulse-glow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-display">
                {t('app.name')}
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shadow-inner">
                v2.0-PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block font-medium">
              {t('app.tagline')}
            </p>
          </div>
        </div>

        {/* System Status Indicators & Language Selector */}
        <div className="flex items-center gap-3">

          {/* Backend Connection & DB Badge */}
          <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs shadow-inner">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
            <span className="text-slate-200 font-semibold flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              {isConnected ? t('header.apiConnected') : t('header.offlineMode')}
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-cyan-400 font-medium flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              {dbLabel}
            </span>
          </div>

          {/* Language Selector Dropdown Pill */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/30 text-cyan-300 text-sm font-semibold hover:border-cyan-400 transition-all cursor-pointer shadow-lg shadow-cyan-500/5">
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-cyan-200 font-medium focus:outline-none cursor-pointer pr-1"
                aria-label={t('header.selectLanguage')}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-950 text-slate-100 py-1">
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
}
