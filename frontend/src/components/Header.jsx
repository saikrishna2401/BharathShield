import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Bell, User, ShieldAlert, LogOut, LogIn } from 'lucide-react';

export default function Header({ currentLang, onLanguageChange, unreadCount = 0, onOpenNotifications, currentUser, onOpenLogin, onLogout }) {
  const { t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' }
  ];

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src="/logo.png"
              alt="BharathShield Logo"
              className="w-10 h-10 object-contain rounded-2xl border border-slate-200 bg-slate-50 p-0.5 shadow-xs"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 font-display">
                {t('app.name')}
              </h1>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isAdmin ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-teal-50 text-teal-700 border-teal-200'
              }`}>
                {isAdmin ? 'ADMIN CONTROL' : 'PRO-SHIELD'}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-medium">
              {t('app.tagline')}
            </p>
          </div>
        </div>

        {/* User Identity, Notifications & Language */}
        <div className="flex items-center gap-3">

          {/* User Account / Role Badge */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
              {isAdmin ? <ShieldAlert className="w-4 h-4 text-rose-600" /> : <User className="w-4 h-4 text-teal-600" />}
              <span>{currentUser.displayName} ({currentUser.role.toUpperCase()})</span>
              <button
                onClick={onLogout}
                className="ml-1 text-slate-400 hover:text-rose-600 p-0.5 rounded"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Notification Alert Center Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-teal-700 hover:border-teal-300 transition-all"
            title="Security Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative flex items-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold hover:border-teal-300 transition-all cursor-pointer">
              <Globe className="w-4 h-4 text-teal-600 shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1 text-xs"
                aria-label={t('header.selectLanguage')}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white text-slate-900 py-1">
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
