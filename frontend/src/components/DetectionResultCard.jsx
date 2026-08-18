import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, AlertTriangle, AlertOctagon, Link2, CheckCircle2, ShieldAlert } from 'lucide-react';

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
    <div className={`mt-6 cyber-card p-6 lg:p-8 border-t-4 transition-all animate-pulse-glow shadow-2xl relative overflow-hidden ${
      isSafe
        ? 'border-t-emerald-500 border-emerald-500/30'
        : isSuspicious
        ? 'border-t-amber-500 border-amber-500/30'
        : 'border-t-rose-500 border-rose-500/40'
    }`}>
      {/* Background Lighting Glow */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${
        isSafe ? 'bg-emerald-500/5' : isSuspicious ? 'bg-amber-500/5' : 'bg-rose-500/10'
      }`}></div>

      {/* Top Banner Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
            isSafe
              ? 'badge-safe'
              : isSuspicious
              ? 'badge-suspicious'
              : 'badge-phishing'
          }`}>
            {isSafe && <ShieldCheck className="w-8 h-8" />}
            {isSuspicious && <AlertTriangle className="w-8 h-8" />}
            {isPhishing && <AlertOctagon className="w-8 h-8" />}
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className={`text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full ${
                isSafe
                  ? 'badge-safe'
                  : isSuspicious
                  ? 'badge-suspicious'
                  : 'badge-phishing'
              }`}>
                {bannerText}
              </span>

              <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                {localizedLangName}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-white mt-1.5 font-display tracking-tight">
              {categoryTitle}
            </h3>
          </div>
        </div>

        {/* Sender Analysis Status */}
        {sender.provided && (
          <div className="text-right text-xs bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800/80 shadow-inner font-mono">
            <span className="text-slate-500 block text-[10px] uppercase tracking-wider">{t('results.senderId')}</span>
            <span className="font-bold text-slate-200">{sender.sender}</span>
            <span className="text-amber-400 block text-[11px] mt-0.5 font-sans font-medium">{localizedSenderLabel}</span>
          </div>
        )}
      </div>

      {/* Dual Score Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">

        {/* Risk Score Meter */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 shadow-inner">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              {t('results.riskScore')}
            </span>
            <span className={`text-3xl font-black font-mono tracking-tight ${
              isSafe ? 'text-emerald-400' : isSuspicious ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {riskScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </span>
          </div>
          <div className="w-full h-3.5 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-1000 shadow-md ${
                isSafe ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : isSuspicious ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-rose-600 to-pink-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(6, riskScore))}%` }}
            />
          </div>
        </div>

        {/* Confidence Score Meter */}
        <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800/80 shadow-inner">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              {t('results.confidence')}
            </span>
            <span className="text-3xl font-black font-mono tracking-tight text-cyan-400">
              {confidence}%
            </span>
          </div>
          <div className="w-full h-3.5 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 shadow-md"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

      </div>

      {/* Itemized Explainable Breakdown */}
      <div className="mb-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 shadow-inner">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3.5 font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>{isSafe ? t('results.whySafeHeader') : t('results.whyHeader')}</span>
        </h4>
        <ul className="space-y-2.5 text-sm text-slate-200 font-medium">
          {activeReasonKeys.map((rk, idx) => (
            <li key={idx} className="flex items-start gap-2.5 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/50">
              <span className={`mt-0.5 font-bold shrink-0 ${isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isSafe ? '✓' : '⚠️'}
              </span>
              <span>{getReasonText(rk)}</span>
            </li>
          ))}
        </ul>
        {isSafe && (
          <p className="mt-3.5 text-xs text-amber-300/90 bg-amber-950/30 p-3 rounded-xl border border-amber-800/40 leading-relaxed font-medium">
            {t('results.safeDisclaimer')}
          </p>
        )}
      </div>

      {/* Embedded Web Link Analysis (If Any) */}
      {urls.length > 0 && (
        <div className="mb-6 bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 shadow-inner">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3.5 font-mono flex items-center gap-2">
            <Link2 className="w-4 h-4 text-cyan-400" />
            <span>{t('results.urlsHeader')} ({urls.length})</span>
          </h4>
          <div className="space-y-2.5">
            {urls.map((u, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-cyan-300 break-all font-semibold">
                  {u.originalUrl || u.fullUrl}
                </div>
                <div className="flex items-center gap-2 flex-wrap font-sans font-medium">
                  {u.isShortener && (
                    <span className="px-2.5 py-1 rounded-md bg-amber-950/80 text-amber-300 border border-amber-800/80 text-[10px]">
                      {t('urlAnalysis.shortener')}
                    </span>
                  )}
                  {u.isIp && (
                    <span className="px-2.5 py-1 rounded-md bg-rose-950/80 text-rose-300 border border-rose-800/80 text-[10px]">
                      {t('urlAnalysis.ip')}
                    </span>
                  )}
                  {u.brandMismatch && (
                    <span className="px-2.5 py-1 rounded-md bg-rose-950/80 text-rose-300 border border-rose-800/80 text-[10px] font-bold">
                      {t('urlAnalysis.brandMismatch')}
                    </span>
                  )}
                  {u.isHttp && (
                    <span className="px-2.5 py-1 rounded-md bg-amber-950/80 text-amber-300 border border-amber-800/80 text-[10px]">
                      {t('urlAnalysis.http')}
                    </span>
                  )}
                  <span className="font-mono font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-900/50">
                    {t('urlAnalysis.riskAddition', { score: u.riskScore || 30 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Localized Recommended Actions */}
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-blue-950/20 border border-cyan-500/25 shadow-lg">
        <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-3.5 font-mono">
          {t('results.recsHeader')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          {activeRecKeys.map((recKey, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-950/80 text-slate-200 border border-slate-800 flex items-center gap-2.5 font-medium shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{t(`recommendations.${recKey}`)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Triggers */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => onReportScam(result)}
          className="px-5 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-rose-950/50 hover:shadow-rose-900/50 transform active:scale-98"
        >
          <AlertOctagon className="w-4 h-4 text-rose-400" />
          <span>{t('results.reportThisBtn')}</span>
        </button>
      </div>

    </div>
  );
}
