import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertOctagon, X, CheckCircle } from 'lucide-react';
import { submitScamReport } from '../services/apiService';

export default function ReportModal({ isOpen, onClose, initialData = null }) {
  const { t } = useTranslation();
  const [categoryKey, setCategoryKey] = useState('BANK_FRAUD');
  const [sender, setSender] = useState('');
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (initialData) {
      if (initialData.sender && initialData.sender.sender) setSender(initialData.sender.sender);
      if (initialData.categoryKey) setCategoryKey(initialData.categoryKey);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    await submitScamReport({
      categoryKey,
      sender,
      message,
      description
    });
    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  const categories = [
    'BANK_FRAUD',
    'UPI_SCAM',
    'OTP_SCAM',
    'KYC_SCAM',
    'LOTTERY_SCAM',
    'JOB_SCAM',
    'DELIVERY_SCAM',
    'GOVT_IMPERSONATION',
    'UNKNOWN'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="cyber-card w-full max-w-lg p-6 lg:p-8 relative border-rose-500/40 shadow-2xl shadow-rose-950/40">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-900 border border-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5 border-b border-slate-800/80 pb-4">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-lg">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">
              {t('report.title')}
            </h3>
            <p className="text-xs text-slate-400">
              {t('report.subtitle')}
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-lg">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-emerald-400">
              {t('report.successMsg')}
            </h4>
            <p className="text-xs text-slate-400">
              {t('report.reportRecorded')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 font-mono">
                {t('report.categoryLabel')}
              </label>
              <select
                value={categoryKey}
                onChange={(e) => setCategoryKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 font-sans shadow-inner"
              >
                {categories.map((catKey) => (
                  <option key={catKey} value={catKey} className="bg-slate-950">
                    {t(`categories.${catKey}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 font-mono">
                {t('report.senderLabel')}
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder={t('analyzer.senderPlaceholder')}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 font-mono shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 font-mono">
                {t('report.messageLabel')} <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('analyzer.messagePlaceholder')}
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-sm text-slate-200 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 resize-none shadow-inner leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 font-mono">
                {t('report.descLabel')}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 resize-none shadow-inner"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold border border-slate-800 transition-all"
              >
                {t('report.cancelBtn')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? t('report.submittingBtn') : t('report.submitBtn')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
