import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, RotateCcw, Clipboard, Sparkles, Shield, Terminal } from 'lucide-react';
import DemoPresetBar from './DemoPresetBar';

export default function SMSAnalyzer({ onAnalyze, isLoading, onShowToast }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [sender, setSender] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    onAnalyze({ message, sender });
  };

  const handleClear = () => {
    setMessage('');
    setSender('');
    if (onShowToast) onShowToast(t('analyzer.clearBtn') + ' successful', 'info');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMessage(text);
        if (onShowToast) onShowToast('Pasted text from clipboard', 'info');
      }
    } catch (err) {
      if (onShowToast) onShowToast('Clipboard permission required', 'error');
    }
  };

  const handleSelectPreset = (presetMessage, presetSender) => {
    setMessage(presetMessage);
    if (presetSender) setSender(presetSender);
    if (onShowToast) onShowToast('Loaded preset example into analyzer', 'info');
  };

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2.5">
          <Shield className="w-6 h-6 text-teal-600" />
          <span>{t('analyzer.title')}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {t('analyzer.subtitle')}
        </p>
      </div>

      {/* Interactive Demo Presets */}
      <DemoPresetBar onSelectPreset={handleSelectPreset} />

      {/* Form Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-xs relative">
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
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-mono transition-all"
            />
          </div>

          {/* Message Text Area */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                {t('analyzer.messageLabel')} <span className="text-rose-500">*</span>
              </label>

              <button
                type="button"
                onClick={handlePaste}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 transition-colors"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>{t('analyzer.pasteBtn')}</span>
              </button>
            </div>

            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('analyzer.messagePlaceholder')}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-mono resize-none leading-relaxed transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={!message && !sender}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('analyzer.clearBtn')}</span>
            </button>

            <button
              type="submit"
              disabled={isLoading || !message.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-98"
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

    </div>
  );
}
