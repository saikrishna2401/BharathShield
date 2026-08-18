import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, AlertTriangle, AlertOctagon, Link2, ExternalLink, Share2, CheckCircle2, Lock, PhoneCall, Trash2 } from 'lucide-react';

export default function DetectionResultCard({ result, onReportScam }) {
  const { t, i18n } = useTranslation();

  if (!result) return null;

  const {
    riskScore,
    riskLevel = 'SAFE',
    confidence,
    language = {},
    categoryKey,
    scamCategory = {},
    signals = [],
    signalKeys = [],
    reasonKeys = [],
    recommendationKeys = [],
    urls = [],
    explanation = {},
    sender = {},
    senderStatus
  } = result;

  const isSafe = riskLevel === 'SAFE';
  const isSuspicious = riskLevel === 'SUSPICIOUS';
  const isPhishing = riskLevel === 'PHISHING';

  // 1. Category translation
  const activeCategoryKey = categoryKey || scamCategory.categoryKey || scamCategory.name || 'INFORMATIONAL';
  const categoryTitle = t(`categories.${activeCategoryKey}`);

  // 2. Risk Level Banner translation
  const bannerText = t(`risk.${riskLevel}_BANNER`);

  // 3. Detected Language Name
  const langKey = language.primary || 'en';
  const localizedLangName = t(`languageNames.${langKey}`);

  // 4. Sender Status
  const activeSenderStatus = senderStatus || sender.status || 'UNKNOWN';
  const localizedSenderLabel = t(`senderStatus.${activeSenderStatus}`);

  // 5. Reasons & Explanations list
  const activeReasonKeys = (reasonKeys && reasonKeys.length > 0)
    ? reasonKeys
    : (explanation.reasonKeys && explanation.reasonKeys.length > 0)
      ? explanation.reasonKeys
      : (signalKeys && signalKeys.length > 0)
        ? signalKeys
        : (isSafe ? ['SAFE_NO_SUSPICIOUS_URL', 'SAFE_NO_CREDENTIAL_REQUEST', 'SAFE_NO_URGENT_LANGUAGE', 'SAFE_INFORMATIONAL'] : ['SUSPICIOUS_URL']);

  // Helper to translate reason key safely
  const getReasonText = (key) => {
    if (i18n.exists(`reasons.${key}`)) {
      return t(`reasons.${key}`);
    }
    if (i18n.exists(`signals.${key}`)) {
      return t(`signals.${key}`);
    }
    return key;
  };

  // 6. Recommendations list
  const activeRecKeys = (recommendationKeys && recommendationKeys.length > 0)
    ? recommendationKeys
    : (explanation.recommendationKeys && explanation.recommendationKeys.length > 0)
      ? explanation.recommendationKeys
      : (isSafe ? ['KEEP_FOR_REFERENCE', 'VERIFY_UNKNOWN_NUMBER'] : ['DO_NOT_CLICK_LINK', 'DO_NOT_SHARE_OTP', 'VERIFY_OFFICIAL_CHANNEL', 'DELETE_MESSAGE', 'REPORT_MESSAGE']);

  return (
    <div className={`mt-6 cyber-card p-6 border-t-4 transition-all animate-pulse-glow ${
      isSafe
        ? 'border-t-emerald-500 border-emerald-500/20'
        : isSuspicious
        ? 'border-t-amber-500 border-amber-500/20'
        : 'border-t-rose-500 border-rose-500/30'
    }`}>

      {/* Top Banner Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isSafe
              ? 'badge-safe'
              : isSuspicious
              ? 'badge-suspicious'
              : 'badge-phishing'
          }`}>
            {isSafe && <ShieldCheck className="w-7 h-7" />}
            {isSuspicious && <AlertTriangle className="w-7 h-7" />}
            {isPhishing && <AlertOctagon className="w-7 h-7" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                isSafe
                  ? 'badge-safe'
                  : isSuspicious
                  ? 'badge-suspicious'
                  : 'badge-phishing'
              }`}>
                {bannerText}
              </span>

              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                {localizedLangName}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mt-1 font-display">
              {categoryTitle}
            </h3>
          </div>
        </div>

        {/* Sender Analysis Status */}
        {sender.provided && (
          <div className="text-right text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider">{t('results.senderId')}</span>
            <span className="font-mono font-bold text-slate-200">{sender.sender}</span>
            <span className="text-amber-400 block text-[11px] mt-0.5">{localizedSenderLabel}</span>
          </div>
        )}
      </div>

      {/* Dual Score Meters: Risk Score (0-100) & Confidence Rating */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">

        {/* Risk Score Meter */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-400">
              {t('results.riskScore')}
            </span>
            <span className={`text-2xl font-black font-mono ${
              isSafe ? 'text-emerald-400' : isSuspicious ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {riskScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isSafe ? 'bg-emerald-500' : isSuspicious ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, riskScore))}%` }}
            />
          </div>
        </div>

        {/* Confidence Score Meter */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase text-slate-400">
              {t('results.confidence')}
            </span>
            <span className="text-2xl font-black font-mono text-cyan-400">
              {confidence}%
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all duration-1000"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

      </div>

      {/* Itemized Explainable Breakdown */}
      <div className="mb-6 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <span>{isSafe ? t('results.whySafeHeader') : t('results.whyHeader')}</span>
        </h4>
        <ul className="space-y-2 text-sm text-slate-300">
          {activeReasonKeys.map((rk, idx) => (
            <li key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="mt-0.5 text-cyan-400">{isSafe ? '✓' : '⚠️'}</span>
              <span>{getReasonText(rk)}</span>
            </li>
          ))}
        </ul>
        {isSafe && (
          <p className="mt-3 text-xs text-amber-300/90 bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/40">
            {t('results.safeDisclaimer')}
          </p>
        )}
      </div>

      {/* Embedded Web Link Analysis (If Any) */}
      {urls.length > 0 && (
        <div className="mb-6 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-cyan-400" />
            <span>{t('results.urlsHeader')} ({urls.length})</span>
          </h4>
          <div className="space-y-2">
            {urls.map((u, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono text-cyan-300 break-all">
                  {u.originalUrl || u.fullUrl}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {u.isShortener && (
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
                      {t('urlAnalysis.shortener')}
                    </span>
                  )}
                  {u.isIp && (
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px]">
                      {t('urlAnalysis.ip')}
                    </span>
                  )}
                  {u.brandMismatch && (
                    <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">
                      {t('urlAnalysis.brandMismatch')}
                    </span>
                  )}
                  {u.isHttp && (
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
                      {t('urlAnalysis.http')}
                    </span>
                  )}
                  <span className="font-mono font-bold text-slate-400">
                    {t('urlAnalysis.riskAddition', { score: u.riskScore || 30 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Localized Recommended Actions */}
      <div className="mb-6 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
        <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider mb-3">
          {t('results.recsHeader')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {activeRecKeys.map((recKey, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-900/90 text-slate-200 border border-slate-800 flex items-center gap-2">
              <span className="text-cyan-400 font-bold">✓</span>
              <span>{t(`recommendations.${recKey}`)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Triggers */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-800">
        <button
          onClick={() => onReportScam(result)}
          className="px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold transition-all flex items-center gap-2"
        >
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>{t('results.reportThisBtn')}</span>
        </button>
      </div>

    </div>
  );
}
