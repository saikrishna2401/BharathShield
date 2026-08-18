import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { History, Trash2, ShieldCheck, AlertTriangle, AlertOctagon, Filter } from 'lucide-react';
import { fetchHistory, clearHistory } from '../services/apiService';

export default function HistoryView() {
  const { t } = useTranslation();
  const [historyItems, setHistoryItems] = useState([]);
  const [filterLang, setFilterLang] = useState('all');

  const loadData = async () => {
    const data = await fetchHistory();
    setHistoryItems(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearAll = async () => {
    if (window.confirm(t('history.clearConfirm'))) {
      await clearHistory();
      setHistoryItems([]);
    }
  };

  const filteredItems = filterLang === 'all'
    ? historyItems
    : historyItems.filter(i => i.language === filterLang);

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <History className="w-6 h-6 text-cyan-400" />
            <span>{t('history.title')}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {t('history.subtitle')}
          </p>
        </div>

        {historyItems.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
            >
              <option value="all">{t('history.filterAll')}</option>
              <option value="en">{t('languageNames.en')}</option>
              <option value="te">{t('languageNames.te')}</option>
              <option value="hi">{t('languageNames.hi')}</option>
              <option value="ta">{t('languageNames.ta')}</option>
            </select>

            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800 hover:bg-rose-900 text-xs font-semibold flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('history.clearAllBtn')}</span>
            </button>
          </div>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="cyber-card p-12 text-center text-slate-500">
          <History className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">{t('history.noHistory')}</p>
        </div>
      ) : (
        <div className="cyber-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/90 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  <th className="p-4">{t('history.colDate')}</th>
                  <th className="p-4">{t('history.colPreview')}</th>
                  <th className="p-4">{t('history.colResult')}</th>
                  <th className="p-4">{t('history.colScore')}</th>
                  <th className="p-4">{t('history.colLang')}</th>
                  <th className="p-4">{t('history.colCategory')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {filteredItems.map((item) => {
                  const isSafe = item.riskLevel === 'SAFE';
                  const isSuspicious = item.riskLevel === 'SUSPICIOUS';
                  const catKey = item.categoryKey || item.scamCategory || 'INFORMATIONAL';
                  const langCode = item.language || 'en';

                  return (
                    <tr key={item.id} className="hover:bg-slate-900/50 transition-all">
                      <td className="p-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4 max-w-xs truncate font-sans">
                        {item.preview}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isSafe ? 'badge-safe' : isSuspicious ? 'badge-suspicious' : 'badge-phishing'
                        }`}>
                          {t(`risk.${item.riskLevel || 'SAFE'}`)}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold">
                        {item.riskScore} <span className="text-slate-500 font-normal text-[10px]">/100</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-400">
                        {t(`languageNames.${langCode}`)}
                      </td>
                      <td className="p-4 text-slate-300">
                        {t(`categories.${catKey}`)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
