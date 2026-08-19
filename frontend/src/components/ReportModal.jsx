import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertOctagon, X, CheckCircle } from 'lucide-react';
import { submitScamReport } from '../services/apiService';

export default function ReportModal({ isOpen, onClose, initialData = null, onShowToast }) {
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

    if (onShowToast) onShowToast('Scam threat report submitted to community database!', 'success');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200/90 rounded-2xl w-full max-w-lg p-6 lg:p-8 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl bg-slate-100 border border-slate-200 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 mb-5 border-b border-slate-100 pb-4">
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 shadow-xs">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              {t('report.title')}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {t('report.subtitle')}
            </p>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-xs">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-emerald-800">
              {t('report.successMsg')}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {t('report.reportRecorded')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 font-mono">
                {t('report.categoryLabel')}
              </label>
              <select
                value={categoryKey}
                onChange={(e) => setCategoryKey(e.target.value)}
                className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 font-sans"
              >
                {categories.map((catKey) => (
                  <option key={catKey} value={catKey} className="bg-white">
                    {t(`categories.${catKey}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 font-mono">
                {t('report.senderLabel')}
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder={t('analyzer.senderPlaceholder')}
                className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 font-mono">
                {t('report.messageLabel')} <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('analyzer.messagePlaceholder')}
                required
                className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5 font-mono">
                {t('report.descLabel')}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-all"
              >
                {t('report.cancelBtn')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 disabled:opacity-50 transition-all"
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
