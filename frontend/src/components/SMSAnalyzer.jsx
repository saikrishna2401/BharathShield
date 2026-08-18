import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Trash2, Clipboard, ShieldCheck, Sparkles } from 'lucide-react';
import DemoPresetBar from './DemoPresetBar';

export default function SMSAnalyzer({ onAnalyze, isLoading, prefillSender = '', prefillMessage = '' }) {
  const { t } = useTranslation();
  const [sender, setSender] = useState(prefillSender);
  const [message, setMessage] = useState(prefillMessage);

  // Sync state if prefill changes via demo preset selection
  React.useEffect(() => {
    if (prefillSender !== undefined) setSender(prefillSender);
    if (prefillMessage !== undefined) setMessage(prefillMessage);
  }, [prefillSender, prefillMessage]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setMessage(text);
    } catch (e) {
      console.warn('Clipboard access denied or unavailable.');
    }
  };

  const handleClear = () => {
    setSender('');
    setMessage('');
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

  return (
    <div className="w-full">
      {/* Demo Preset Bar */}
      <DemoPresetBar onSelectPreset={handleSelectPreset} />

      {/* Main Analyzer Form Card */}
      <div className="cyber-card p-6 border-cyan-500/30">
        <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              {t('analyzer.title')}
            </h2>
            <p className="text-xs text-slate-400">
              {t('analyzer.subtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sender Header Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t('analyzer.senderLabel')}
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder={t('analyzer.senderPlaceholder')}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
            />
          </div>

          {/* SMS Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                {t('analyzer.messageLabel')} <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500 font-mono">
                {message.length} / 4000
              </span>
            </div>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('analyzer.messagePlaceholder')}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePaste}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all flex items-center gap-1.5"
              >
                <Clipboard className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('analyzer.pasteBtn')}</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={!message && !sender}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium transition-all flex items-center gap-1.5 disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('analyzer.clearBtn')}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>{t('analyzer.analyzingBtn')}</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>{t('analyzer.analyzeBtn')}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
