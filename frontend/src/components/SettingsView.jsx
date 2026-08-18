import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Trash2, Globe, Lock, EyeOff } from 'lucide-react';
import { clearHistory } from '../services/apiService';

export default function SettingsView({ currentLang, onLanguageChange }) {
  const { t } = useTranslation();
  const [saveHistory, setSaveHistory] = useState(true);

  const handleClearData = async () => {
    if (window.confirm(t('settings.deleteConfirm'))) {
      await clearHistory();
      localStorage.clear();
      alert(t('settings.deleteSuccess'));
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          <span>{t('settings.title')}</span>
        </h2>
        <p className="text-xs text-slate-400">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="cyber-card p-6 space-y-6">

        {/* Language Selection */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>{t('settings.langTitle')}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('settings.langDesc')}
            </p>
          </div>
          <select
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-cyan-300 font-semibold rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="ta">தமிழ் (Tamil)</option>
          </select>
        </div>

        {/* Save History Toggle */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-cyan-400" />
              <span>{t('settings.historyTitle')}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('settings.historyDesc')}
            </p>
          </div>
          <input
            type="checkbox"
            checked={saveHistory}
            onChange={(e) => setSaveHistory(e.target.checked)}
            className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
          />
        </div>

        {/* Data Wiping */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>{t('settings.deleteTitle')}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('settings.deleteDesc')}
            </p>
          </div>
          <button
            onClick={handleClearData}
            className="px-4 py-2 rounded-xl bg-rose-950/60 text-rose-300 border border-rose-800 hover:bg-rose-900 text-xs font-bold transition-all"
          >
            {t('settings.deleteBtn')}
          </button>
        </div>

      </div>

      {/* Privacy Notice Card */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
        <h4 className="font-bold text-slate-200 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>{t('settings.privacyGuarantee')}</span>
        </h4>
        <p>
          {t('settings.privacyNotice')}
        </p>
      </div>
    </div>
  );
}
