import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, AlertOctagon, Send, CheckCircle2 } from 'lucide-react';
import { submitScamReport } from '../services/apiService';

export default function ReportModal({ isOpen, onClose, initialData, onShowToast, onSubmitCustom }) {
  const { t } = useTranslation();
  const [sender, setSender] = useState(initialData?.sender?.sender || '');
  const [message, setMessage] = useState(initialData?.originalMessage || '');
  const [categoryKey, setCategoryKey] = useState(initialData?.categoryKey || 'BANK_FRAUD');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    const payload = {
      categoryKey,
      sender,
      message,
      description
    };

    if (onSubmitCustom) {
      await onSubmitCustom(payload);
    } else {
      await submitScamReport(payload);
      if (onShowToast) onShowToast(t('report.successMsg'), 'success');
    }

    setIsSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 lg:p-8 relative shadow-xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
              <AlertOctagon className="w-5 h-5" />
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

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl bg-slate-100 border border-slate-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900 font-display">{t('report.successMsg')}</h4>
            <p className="text-xs text-slate-500 font-medium">{t('report.reportRecorded')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 font-mono">
                {t('report.categoryLabel')}
              </label>
              <select
                value={categoryKey}
                onChange={(e) => setCategoryKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-teal-500"
              >
                <option value="BANK_FRAUD">{t('categories.BANK_FRAUD')}</option>
                <option value="KYC_SCAM">{t('categories.KYC_SCAM')}</option>
                <option value="OTP_SCAM">{t('categories.OTP_SCAM')}</option>
                <option value="UPI_SCAM">{t('categories.UPI_SCAM')}</option>
                <option value="LOTTERY_SCAM">{t('categories.LOTTERY_SCAM')}</option>
                <option value="GOVT_IMPERSONATION">{t('categories.GOVT_IMPERSONATION')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 font-mono">
                {t('report.senderLabel')}
              </label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="e.g. VK-SBIINB"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5 font-mono">
                {t('report.messageLabel')} <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Paste scam message content..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-900 font-mono resize-none focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold"
              >
                {t('report.cancelBtn')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? t('report.submittingBtn') : t('report.submitBtn')}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
