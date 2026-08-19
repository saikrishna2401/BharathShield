import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Trash2, Globe, Lock, EyeOff } from 'lucide-react';
import { clearHistory } from '../services/apiService';

export default function SettingsView({ currentLang, onLanguageChange, onShowToast }) {
  const { t } = useTranslation();
  const [saveHistory, setSaveHistory] = useState(true);

  const handleClearData = async () => {
    if (window.confirm(t('settings.deleteConfirm'))) {
      await clearHistory();
      localStorage.clear();
      if (onShowToast) onShowToast(t('settings.deleteSuccess'), 'warning');
    }
  };

  const handleToggleHistory = (e) => {
    setSaveHistory(e.target.checked);
    if (onShowToast) {
      onShowToast(e.target.checked ? 'History logging enabled' : 'Incognito scanning mode enabled (No local history saved)', 'info');
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-teal-600" />
          <span>{t('settings.title')}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">

        {/* Language Selection */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
              <Globe className="w-4 h-4 text-teal-600" />
              <span>{t('settings.langTitle')}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {t('settings.langDesc')}
            </p>
          </div>
          <select
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-800 font-semibold rounded-xl px-4 py-2.5 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/15 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="ta">தமிழ் (Tamil)</option>
          </select>
        </div>

        {/* Save History Toggle */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 font-display">
              <EyeOff className="w-4 h-4 text-teal-600" />
              <span>{t('settings.historyTitle')}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {t('settings.historyDesc')}
            </p>
          </div>
          <input
            type="checkbox"
            checked={saveHistory}
            onChange={handleToggleHistory}
            className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
          />
        </div>

        {/* Data Wiping */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h3 className="text-sm font-bold text-rose-900 flex items-center gap-2 font-display">
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>{t('settings.deleteTitle')}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {t('settings.deleteDesc')}
            </p>
          </div>
          <button
            onClick={handleClearData}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-xs"
          >
            {t('settings.deleteBtn')}
          </button>
        </div>

      </div>

      {/* Privacy Notice Card */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs text-slate-600 space-y-2 shadow-xs">
        <h4 className="font-bold text-slate-900 flex items-center gap-2 font-display text-sm">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>{t('settings.privacyGuarantee')}</span>
        </h4>
        <p className="leading-relaxed font-medium">
          {t('settings.privacyNotice')}
        </p>
      </div>
    </div>
  );
}
