import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { History, Trash2, Download, Search, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';
import { fetchHistory, clearHistory } from '../services/apiService';

export default function HistoryView({ currentUserId, onShowToast }) {
  const { t } = useTranslation();
  const [historyItems, setHistoryItems] = useState([]);
  const [filterLang, setFilterLang] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadHistory = async () => {
    const data = await fetchHistory(currentUserId);
    setHistoryItems(data);
  };

  useEffect(() => {
    loadHistory();
  }, [currentUserId]);

  const handleClearAll = async () => {
    if (window.confirm(t('history.clearConfirm'))) {
      await clearHistory(currentUserId);
      setHistoryItems([]);
      if (onShowToast) onShowToast(t('settings.deleteSuccess'), 'info');
    }
  };

  const handleExportCSV = () => {
    if (historyItems.length === 0) return;
    const headers = 'ID,Timestamp,Language,RiskLevel,RiskScore,CategoryKey,Preview\n';
    const rows = historyItems.map(item =>
      `"${item.id}","${item.timestamp}","${item.language}","${item.riskLevel}",${item.riskScore},"${item.categoryKey}","${(item.preview || '').replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BharathShield_History_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    if (onShowToast) onShowToast('Exported history as CSV file', 'success');
  };

  const filteredHistory = historyItems.filter(item => {
    const matchesLang = filterLang === 'all' || item.language === filterLang;
    const matchesSearch = !searchTerm || (item.preview && item.preview.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesLang && matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2.5">
            <History className="w-6 h-6 text-teal-600" />
            <span>{t('history.title')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {t('history.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {historyItems.length > 0 && (
            <>
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleClearAll}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('history.clearAllBtn')}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search preview history..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-teal-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Filter:</label>
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
          >
            <option value="all">{t('history.filterAll')}</option>
            <option value="en">English</option>
            <option value="te">Telugu (తెలుగు)</option>
            <option value="hi">Hindi (हिन्दी)</option>
            <option value="ta">Tamil (தமிழ்)</option>
          </select>
        </div>
      </div>

      {/* History Items */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-3 shadow-xs">
          <History className="w-12 h-12 text-slate-400 mx-auto stroke-1" />
          <p className="text-sm font-medium">{t('history.noHistory')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const isSafe = item.riskLevel === 'SAFE';
            const isSuspicious = item.riskLevel === 'SUSPICIOUS';
            const isPhishing = item.riskLevel === 'PHISHING';

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 lg:p-5 shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                      isSafe ? 'badge-safe' : isSuspicious ? 'badge-suspicious' : 'badge-phishing'
                    }`}>
                      {item.riskLevel}
                    </span>

                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {t(`categories.${item.categoryKey}`, item.categoryKey)}
                    </span>

                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 font-mono truncate pt-1">
                    "{item.preview}"
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">{t('history.colScore')}</span>
                    <span className={`text-base font-extrabold font-mono ${
                      isSafe ? 'text-emerald-600' : isSuspicious ? 'text-amber-600' : 'text-rose-600'
                    }`}>
                      {item.riskScore} / 100
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
