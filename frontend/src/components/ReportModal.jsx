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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="cyber-card w-full max-w-lg p-6 relative border-rose-500/40">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
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
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
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
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                {t('report.categoryLabel')}
              </label>
              <select
                value={categoryKey}
                onChange={(e) => setCategoryKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500"
              >
                {categories.map((catKey) => (
                  <option key={catKey} value={catKey}>
                    {t(`categories.${catKey}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                {t('report.senderLabel')}
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder={t('analyzer.senderPlaceholder')}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                {t('report.messageLabel')} <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('analyzer.messagePlaceholder')}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                {t('report.descLabel')}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-semibold"
              >
                {t('report.cancelBtn')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 disabled:opacity-50"
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
