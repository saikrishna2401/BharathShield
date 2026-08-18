import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Trash2, Clipboard, Sparkles, Terminal } from 'lucide-react';
import DemoPresetBar from './DemoPresetBar';

export default function SMSAnalyzer({ onAnalyze, isLoading, prefillSender = '', prefillMessage = '' }) {
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

  const charPercent = Math.min(100, Math.round((message.length / 4000) * 100));

  return (
    <div className="w-full">
      {/* Demo Preset Bar */}
      <DemoPresetBar onSelectPreset={handleSelectPreset} />

      {/* Main Analyzer Form Card */}
      <div className="cyber-card p-6 lg:p-8 border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3.5 mb-6 border-b border-slate-800/80 pb-4">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-md">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display tracking-tight flex items-center gap-2">
              <span>{t('analyzer.title')}</span>
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('analyzer.subtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Sender Header Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              {t('analyzer.senderLabel')}
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder={t('analyzer.senderPlaceholder')}
              className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono shadow-inner"
            />
          </div>

          {/* SMS Message Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                {t('analyzer.messageLabel')} <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${charPercent > 80 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                    style={{ width: `${charPercent}%` }}
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {message.length} / 4000
                </span>
              </div>
            </div>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('analyzer.messagePlaceholder')}
              className="w-full bg-slate-950/80 border border-slate-700/70 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none leading-relaxed shadow-inner"
            />
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePaste}
                className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-semibold transition-all flex items-center gap-2 shadow-sm"
              >
                <Clipboard className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('analyzer.pasteBtn')}</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={!message && !sender}
                className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-semibold transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('analyzer.clearBtn')}</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-98"
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
