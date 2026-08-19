import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, AlertTriangle, AlertOctagon, Link2, CheckCircle2, ShieldAlert, Share2, Copy, Check } from 'lucide-react';

export default function DetectionResultCard({ result, onReportScam, onShowToast }) {
  const { t, i18n } = useTranslation();
  const [copiedUrlIndex, setCopiedUrlIndex] = useState(null);
  const [copiedAlert, setCopiedAlert] = useState(false);

  if (!result) return null;

  const {
    riskScore = 0,
    riskLevel = 'SAFE',
    confidence = 90,
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

  // Category translation
  const activeCategoryKey = categoryKey || scamCategory.categoryKey || scamCategory.name || 'INFORMATIONAL';
  const categoryTitle = t(`categories.${activeCategoryKey}`);

  // Banner translation
  const bannerText = t(`risk.${riskLevel}_BANNER`);

  // Language name
  const langKey = language.primary || 'en';
  const localizedLangName = t(`languageNames.${langKey}`);

  // Sender status
  const activeSenderStatus = senderStatus || sender.status || 'UNKNOWN';
  const localizedSenderLabel = t(`senderStatus.${activeSenderStatus}`);

  // Reasons list
  const activeReasonKeys = (reasonKeys && reasonKeys.length > 0)
    ? reasonKeys
    : (explanation.reasonKeys && explanation.reasonKeys.length > 0)
      ? explanation.reasonKeys
      : (signalKeys && signalKeys.length > 0)
        ? signalKeys
        : (isSafe ? ['SAFE_NO_SUSPICIOUS_URL', 'SAFE_NO_CREDENTIAL_REQUEST', 'SAFE_NO_URGENT_LANGUAGE', 'SAFE_INFORMATIONAL'] : ['SUSPICIOUS_URL']);

  const getReasonText = (key) => {
    if (i18n.exists(`reasons.${key}`)) return t(`reasons.${key}`);
    if (i18n.exists(`signals.${key}`)) return t(`signals.${key}`);
    return key;
  };

  // Recommendations list
  const activeRecKeys = (recommendationKeys && recommendationKeys.length > 0)
    ? recommendationKeys
    : (explanation.recommendationKeys && explanation.recommendationKeys.length > 0)
      ? explanation.recommendationKeys
      : (isSafe ? ['KEEP_FOR_REFERENCE', 'VERIFY_UNKNOWN_NUMBER'] : ['DO_NOT_CLICK_LINK', 'DO_NOT_SHARE_OTP', 'VERIFY_OFFICIAL_CHANNEL', 'DELETE_MESSAGE', 'REPORT_MESSAGE']);

  // Copy Security Warning Summary
  const handleCopyAlert = () => {
    const mainUrl = urls.length > 0 ? (urls[0].originalUrl || urls[0].fullUrl) : 'None';
    const alertMessage = `🚨 BHARATHSHIELD SECURITY ALERT 🚨\nRisk Level: ${bannerText} (Score: ${riskScore}/100)\nCategory: ${categoryTitle}\nLanguage: ${localizedLangName}\nDetected Link: ${mainUrl}\n\n⚠️ Caution: Do NOT share OTPs or credentials!\nVerified by BharathShield AI System`;

    navigator.clipboard.writeText(alertMessage);
    setCopiedAlert(true);
    if (onShowToast) onShowToast('Security alert warning copied to clipboard!', 'success');
    setTimeout(() => setCopiedAlert(false), 2500);
  };

  const handleCopyUrl = (urlStr, idx) => {
    navigator.clipboard.writeText(urlStr);
    setCopiedUrlIndex(idx);
    if (onShowToast) onShowToast('URL copied to clipboard', 'info');
    setTimeout(() => setCopiedUrlIndex(null), 2000);
  };

  // SVG Gauge Math
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (Math.min(100, Math.max(5, riskScore)) / 100) * circumference;

  const gaugeColor = isSafe ? '#059669' : isSuspicious ? '#d97706' : '#e11d48';

  return (
    <div className={`mt-8 bg-white rounded-2xl p-6 lg:p-8 border-l-4 shadow-sm relative overflow-hidden transition-all animate-fade-in ${
      isSafe
        ? 'border-l-emerald-500 border border-slate-200/90'
        : isSuspicious
        ? 'border-l-amber-500 border border-slate-200/90'
        : 'border-l-rose-500 border border-slate-200/90'
    }`}>

      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
            isSafe
              ? 'badge-safe'
              : isSuspicious
              ? 'badge-suspicious'
              : 'badge-phishing'
          }`}>
            {isSafe && <ShieldCheck className="w-6 h-6" />}
            {isSuspicious && <AlertTriangle className="w-6 h-6" />}
            {isPhishing && <AlertOctagon className="w-6 h-6" />}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full ${
                isSafe
                  ? 'badge-safe'
                  : isSuspicious
                  ? 'badge-suspicious'
                  : 'badge-phishing'
              }`}>
                {bannerText}
              </span>

              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                {localizedLangName}
              </span>
            </div>

            <h3 className="text-xl lg:text-2xl font-bold text-slate-900 font-display tracking-tight">
              {categoryTitle}
            </h3>
          </div>
        </div>

        {/* Sender Info Badge */}
        {sender.provided && (
          <div className="text-right text-xs bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200/80 font-mono shrink-0">
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">{t('results.senderId')}</span>
            <span className="font-bold text-slate-900 text-sm">{sender.sender}</span>
            <span className="text-amber-700 block text-[11px] font-sans font-semibold mt-0.5">{localizedSenderLabel}</span>
          </div>
        )}
      </div>

      {/* Dual Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">

        {/* Risk Score Card */}
        <div className="bg-slate-50/70 p-5 lg:p-6 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono block">
              {t('results.riskScore')}
            </span>
            <div className={`text-4xl font-extrabold font-mono tracking-tight ${
              isSafe ? 'text-emerald-700' : isSuspicious ? 'text-amber-700' : 'text-rose-700'
            }`}>
              {riskScore} <span className="text-sm text-slate-400 font-normal">/ 100</span>
            </div>
            <p className="text-xs text-slate-600 font-medium pt-1">
              {isSafe ? 'Low Threat Vector' : isSuspicious ? 'Moderate Security Risk' : 'Critical Threat Detected'}
            </p>
          </div>

          {/* SVG Radial Gauge */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="stroke-slate-200"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={gaugeColor}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm text-slate-800">
              {riskScore}%
            </div>
          </div>
        </div>

        {/* Confidence Rating Card */}
        <div className="bg-slate-50/70 p-5 lg:p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                {t('results.confidence')}
              </span>
              <span className="text-3xl font-extrabold font-mono tracking-tight text-teal-700">
                {confidence}%
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              AI NLP pattern density confidence score
            </p>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-200/90 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-teal-600 transition-all duration-1000"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

      </div>

      {/* Itemized Explainable Threat Breakdown */}
      <div className="mb-6 bg-slate-50/50 p-5 lg:p-6 rounded-2xl border border-slate-200/80">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-teal-600" />
          <span>{isSafe ? t('results.whySafeHeader') : t('results.whyHeader')}</span>
        </h4>
        <ul className="space-y-2.5 text-xs lg:text-sm text-slate-800 font-medium">
          {activeReasonKeys.map((rk, idx) => (
            <li key={idx} className="flex items-start gap-3 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <span className={`mt-0.5 font-bold shrink-0 text-base ${isSafe ? 'text-emerald-600' : 'text-rose-600'}`}>
                {isSafe ? '✓' : '⚠️'}
              </span>
              <span>{getReasonText(rk)}</span>
            </li>
          ))}
        </ul>
        {isSafe && (
          <p className="mt-3.5 text-xs text-amber-800 bg-amber-50 p-3.5 rounded-xl border border-amber-200/80 leading-relaxed font-medium">
            {t('results.safeDisclaimer')}
          </p>
        )}
      </div>

      {/* Embedded Web Link Analysis */}
      {urls.length > 0 && (
        <div className="mb-6 bg-slate-50/50 p-5 lg:p-6 rounded-2xl border border-slate-200/80">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 font-mono flex items-center gap-2">
            <Link2 className="w-4 h-4 text-teal-600" />
            <span>{t('results.urlsHeader')} ({urls.length})</span>
          </h4>
          <div className="space-y-2.5">
            {urls.map((u, idx) => {
              const urlStr = u.originalUrl || u.fullUrl;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="font-mono text-slate-900 truncate font-semibold">
                      {urlStr}
                    </span>
                    <button
                      onClick={() => handleCopyUrl(urlStr, idx)}
                      title="Copy URL"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      {copiedUrlIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap font-sans font-semibold">
                    {u.isShortener && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px]">
                        {t('urlAnalysis.shortener')}
                      </span>
                    )}
                    {u.isIp && (
                      <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-[10px]">
                        {t('urlAnalysis.ip')}
                      </span>
                    )}
                    {u.brandMismatch && (
                      <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-[10px]">
                        {t('urlAnalysis.brandMismatch')}
                      </span>
                    )}
                    {u.isHttp && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px]">
                        {t('urlAnalysis.http')}
                      </span>
                    )}
                    <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                      {t('urlAnalysis.riskAddition', { score: u.riskScore || 30 })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Actions */}
      <div className="mb-6 p-5 lg:p-6 rounded-2xl bg-teal-50/60 border border-teal-200/80">
        <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider mb-3.5 font-mono">
          {t('results.recsHeader')}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {activeRecKeys.map((recKey, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white text-slate-800 border border-teal-100/90 flex items-center gap-2.5 font-semibold shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{t(`recommendations.${recKey}`)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <button
          onClick={handleCopyAlert}
          className="px-4.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition-all flex items-center gap-2 shadow-xs"
        >
          {copiedAlert ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-500" />}
          <span>{copiedAlert ? 'Alert Copied!' : 'Copy Security Alert (WhatsApp / SMS)'}</span>
        </button>

        <button
          onClick={() => onReportScam(result)}
          className="px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-2 shadow-xs transform active:scale-98"
        >
          <AlertOctagon className="w-4 h-4 text-rose-600" />
          <span>{t('results.reportThisBtn')}</span>
        </button>
      </div>

    </div>
  );
}
