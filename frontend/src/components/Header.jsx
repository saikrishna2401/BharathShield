import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Bell, UserCheck, Shield } from 'lucide-react';

export default function Header({ currentLang, onLanguageChange, userName = 'Sai Krishna', unreadCount = 0, onOpenNotifications, onSwitchUser }) {
  const { t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src="/logo.png"
              alt="BharathShield Logo"
              className="w-10 h-10 object-contain rounded-2xl border border-slate-800 bg-slate-900 p-0.5 shadow-lg shadow-teal-500/10"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-white font-display">
                {t('app.name')}
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30">
                PRO-SHIELD
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block font-medium">
              {t('app.tagline')}
            </p>
          </div>
        </div>

        {/* User Identity, Notification Bell & Language Dropdown */}
        <div className="flex items-center gap-3">

          {/* User Profile Identity Switcher */}
          <button
            onClick={onSwitchUser}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-all font-medium"
            title="Switch User Profile"
          >
            <UserCheck className="w-4 h-4 text-teal-400" />
            <span className="font-bold">Namaste, {userName}</span>
          </button>

          {/* Notification Alert Center Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all"
            title="Security Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold hover:border-slate-700 transition-all cursor-pointer">
              <Globe className="w-4 h-4 text-teal-400 shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer pr-1 text-xs"
                aria-label={t('header.selectLanguage')}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-200 py-1">
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
