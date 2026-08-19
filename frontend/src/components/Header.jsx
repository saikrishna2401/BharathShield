import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export default function Header({ currentLang, onLanguageChange }) {
  const { t } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* Brand & Logo */}
        <div className="flex items-center gap-3.5">
          <img
            src="/logo.png"
            alt="BharathShield Logo"
            className="w-10 h-10 object-contain rounded-xl border border-slate-200/80 bg-white p-0.5 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 font-display">
                {t('app.name')}
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80">
                v2.0-PRO
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block font-medium">
              {t('app.tagline')}
            </p>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold hover:border-slate-300 transition-all cursor-pointer shadow-xs">
              <Globe className="w-4 h-4 text-teal-600 shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none cursor-pointer pr-1 text-xs"
                aria-label={t('header.selectLanguage')}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-white text-slate-800 py-1">
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
