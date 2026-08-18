import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Globe, Server, Database } from 'lucide-react';

export default function Header({ healthStatus, currentLang, onLanguageChange }) {
  const { t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' }
  ];

  const isConnected = healthStatus.status === 'ok';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <ShieldAlert className="w-6 h-6 animate-pulse-glow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-display">
                {t('app.name')}
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                AP-083
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {t('app.tagline')}
            </p>
          </div>
        </div>

        {/* System Status Indicators & Language Selector */}
        <div className="flex items-center gap-3">

          {/* Backend Connection Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              {isConnected ? t('header.apiConnected') : t('header.offlineMode')}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              {healthStatus.database === 'mongodb' ? t('header.mongoDb') : t('header.memoryStore')}
            </span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-sm font-semibold hover:border-cyan-400 transition-all cursor-pointer">
              <Globe className="w-4 h-4 text-cyan-400" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-cyan-200 font-medium focus:outline-none cursor-pointer pr-1"
                aria-label={t('header.selectLanguage')}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100 py-1">
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
