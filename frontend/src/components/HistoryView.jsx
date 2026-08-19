import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { History, Trash2, ShieldAlert, Search, Download, Filter } from 'lucide-react';
import { fetchHistory, clearHistory } from '../services/apiService';

export default function HistoryView({ onShowToast }) {
  const { t } = useTranslation();
  const [historyItems, setHistoryItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

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
      if (onShowToast) onShowToast('Scan history database cleared', 'warning');
    }
  };

  const handleExportCSV = () => {
    if (historyItems.length === 0) return;

    const headers = ['Timestamp', 'Preview', 'Risk Level', 'Risk Score', 'Language', 'Category'];
    const csvRows = [
      headers.join(','),
      ...historyItems.map(item => [
        `"${new Date(item.timestamp).toISOString()}"`,
        `"${(item.preview || '').replace(/"/g, '""')}"`,
        `"${item.riskLevel || 'SAFE'}"`,
        item.riskScore || 0,
        `"${item.language || 'en'}"`,
        `"${item.categoryKey || item.scamCategory || 'INFORMATIONAL'}"`
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BharathShield_Security_History_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    if (onShowToast) onShowToast('Exported scan history to CSV', 'success');
  };

  const filteredItems = historyItems.filter(item => {
    const matchLang = filterLang === 'all' || item.language === filterLang;
    const matchRisk = filterRisk === 'all' || item.riskLevel === filterRisk;
    const query = searchQuery.toLowerCase().trim();
    const matchSearch = !query ||
      (item.preview && item.preview.toLowerCase().includes(query)) ||
      (item.sender && item.sender.toLowerCase().includes(query)) ||
      (item.categoryKey && item.categoryKey.toLowerCase().includes(query));
    return matchLang && matchRisk && matchSearch;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2.5">
            <History className="w-5 h-5 text-teal-600" />
            <span>{t('history.title')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {t('history.subtitle')}
          </p>
        </div>

        {historyItems.length > 0 && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleClearAll}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>{t('history.clearAllBtn')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Controls Bar */}
      {historyItems.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history by keyword or sender..."
              className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/15 font-sans"
            />
          </div>

          {/* Risk Filter Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['all', 'SAFE', 'SUSPICIOUS', 'PHISHING'].map(rk => (
              <button
                key={rk}
                onClick={() => setFilterRisk(rk)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  filterRisk === rk
                    ? rk === 'SAFE'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : rk === 'SUSPICIOUS'
                      ? 'bg-amber-50 text-amber-900 border border-amber-200'
                      : rk === 'PHISHING'
                      ? 'bg-rose-50 text-rose-900 border border-rose-200'
                      : 'bg-teal-50 text-teal-800 border border-teal-200'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {rk === 'all' ? 'All Risks' : rk}
              </button>
            ))}
          </div>

          {/* Language Selector Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-600 font-mono cursor-pointer"
            >
              <option value="all">{t('history.filterAll')}</option>
              <option value="en">{t('languageNames.en')}</option>
              <option value="te">{t('languageNames.te')}</option>
              <option value="hi">{t('languageNames.hi')}</option>
              <option value="ta">{t('languageNames.ta')}</option>
            </select>
          </div>
        </div>
      )}

      {/* History Data Table */}
      {filteredItems.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-3 shadow-xs">
          <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-medium">
            {historyItems.length === 0 ? t('history.noHistory') : 'No matching records found for search criteria.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
                  <th className="p-4">{t('history.colDate')}</th>
                  <th className="p-4">{t('history.colPreview')}</th>
                  <th className="p-4">{t('history.colResult')}</th>
                  <th className="p-4">{t('history.colScore')}</th>
                  <th className="p-4">{t('history.colLang')}</th>
                  <th className="p-4">{t('history.colCategory')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {filteredItems.map((item) => {
                  const isSafe = item.riskLevel === 'SAFE';
                  const isSuspicious = item.riskLevel === 'SUSPICIOUS';
                  const catKey = item.categoryKey || item.scamCategory || 'INFORMATIONAL';
                  const langCode = item.language || 'en';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4 max-w-xs truncate font-medium text-slate-800" title={item.preview}>
                        {item.preview}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          isSafe ? 'badge-safe' : isSuspicious ? 'badge-suspicious' : 'badge-phishing'
                        }`}>
                          {t(`risk.${item.riskLevel || 'SAFE'}`)}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-xs">
                        <span className={isSafe ? 'text-emerald-700' : isSuspicious ? 'text-amber-700' : 'text-rose-700'}>
                          {item.riskScore}
                        </span>
                        <span className="text-slate-400 font-normal text-[10px]"> /100</span>
                      </td>
                      <td className="p-4 font-semibold text-slate-600 font-mono">
                        {t(`languageNames.${langCode}`)}
                      </td>
                      <td className="p-4 font-medium text-slate-700">
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
