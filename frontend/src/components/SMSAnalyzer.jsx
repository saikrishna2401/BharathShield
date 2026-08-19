import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Trash2, Clipboard, Sparkles, Terminal } from 'lucide-react';
import DemoPresetBar from './DemoPresetBar';
import ScanningHUD from './ScanningHUD';

export default function SMSAnalyzer({ onAnalyze, isLoading, prefillSender = '', prefillMessage = '', onShowToast }) {
  const { t } = useTranslation();
  const [sender, setSender] = useState(prefillSender);
  const [message, setMessage] = useState(prefillMessage);

  React.useEffect(() => {
    if (prefillSender !== undefined) setSender(prefillSender);
    if (prefillMessage !== undefined) setMessage(prefillMessage);
  }, [prefillSender, prefillMessage]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMessage(text);
        if (onShowToast) onShowToast('Pasted text from clipboard', 'info');
      }
    } catch (e) {
      console.warn('Clipboard access denied or unavailable.');
    }
  };

  const handleClear = () => {
    setSender('');
    setMessage('');
    if (onShowToast) onShowToast('Cleared input fields', 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onAnalyze({ sender, message });
  };

  const handleSelectPreset = (pSender, pMessage) => {
    setSender(pSender);
    setMessage(pMessage);
    onAnalyze({ sender: pSender, message: pMessage });
  };

  const charPercent = Math.min(100, Math.round((message.length / 4000) * 100));

  return (
    <div className="w-full">
      {/* Demo Preset Bar */}
      <DemoPresetBar onSelectPreset={handleSelectPreset} />

      {/* Main Analyzer Form Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xs relative">
        
        <div className="flex items-center justify-between gap-3.5 mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 shadow-xs">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display tracking-tight flex items-center gap-2">
                <span>{t('analyzer.title')}</span>
                <Sparkles className="w-4 h-4 text-teal-600" />
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {t('analyzer.subtitle')}
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono font-bold text-teal-800 bg-teal-50/80 px-3 py-1.5 rounded-lg border border-teal-200/80">
            <span>AI ENGINE v2.0 ACTIVE</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sender Header Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
              {t('analyzer.senderLabel')}
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder={t('analyzer.senderPlaceholder')}
              className="w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/15 transition-all font-mono"
            />
          </div>

          {/* SMS Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                {t('analyzer.messageLabel')} <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div
                    className={`h-full transition-all duration-300 ${charPercent > 80 ? 'bg-rose-500' : 'bg-teal-600'}`}
                    style={{ width: `${charPercent}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  {message.length} / 4000
                </span>
              </div>
            </div>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('analyzer.messagePlaceholder')}
              className="w-full bg-slate-50/60 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/15 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePaste}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs"
              >
                <Clipboard className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('analyzer.pasteBtn')}</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={!message && !sender}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200 text-xs font-semibold transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('analyzer.clearBtn')}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-98"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('analyzer.analyzingBtn')}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-white stroke-[2.5]" />
                  <span>{t('analyzer.analyzeBtn')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Scanning HUD Overlay during load */}
      {isLoading && <ScanningHUD />}
    </div>
  );
}
