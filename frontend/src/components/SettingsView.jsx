import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Globe, Shield, Trash2, Lock } from 'lucide-react';
import { clearHistory } from '../services/apiService';

export default function SettingsView({ currentLang, onLanguageChange, onShowToast }) {
  const { t } = useTranslation();

  const handleClearData = async () => {
    if (window.confirm(t('settings.deleteConfirm'))) {
      localStorage.clear();
      await clearHistory('user-101');
      if (onShowToast) onShowToast(t('settings.deleteSuccess'), 'info');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-teal-600" />
          <span>{t('settings.title')}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Settings Grid */}
      <div className="space-y-4">

        {/* Language Selection */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display">
                {t('settings.langTitle')}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {t('settings.langDesc')}
              </p>
            </div>
          </div>

          <select
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-slate-100 border border-slate-200 text-slate-900 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none"
          >
            <option value="en">English</option>
            <option value="te">Telugu (తెలుగు)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="ta">Tamil (தமிழ்)</option>
          </select>
        </div>

        {/* Data Delete */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-display">
                {t('settings.deleteTitle')}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {t('settings.deleteDesc')}
              </p>
            </div>
          </div>

          <button
            onClick={handleClearData}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-2xs"
          >
            {t('settings.deleteBtn')}
          </button>
        </div>

        {/* Privacy Notice Card */}
        <div className="bg-teal-50 border border-teal-200 rounded-3xl p-6 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wider font-mono">
            <Lock className="w-4 h-4" />
            <span>{t('settings.privacyGuarantee')}</span>
          </div>
          <p className="text-xs text-teal-900 leading-relaxed font-medium">
            {t('settings.privacyNotice')}
          </p>
        </div>

      </div>

    </div>
  );
}
