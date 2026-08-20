import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, ShieldAlert, PhoneCall, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function StaySafeView({ onShowToast }) {
  const { t } = useTranslation();

  const cards = [
    { id: 1, titleKey: 'learn.card1Title', descKey: 'learn.card1Desc' },
    { id: 2, titleKey: 'learn.card2Title', descKey: 'learn.card2Desc' },
    { id: 3, titleKey: 'learn.card3Title', descKey: 'learn.card3Desc' },
    { id: 4, titleKey: 'learn.card4Title', descKey: 'learn.card4Desc' },
    { id: 5, titleKey: 'learn.card5Title', descKey: 'learn.card5Desc' },
    { id: 6, titleKey: 'learn.card6Title', descKey: 'learn.card6Desc' }
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-teal-600" />
          <span>{t('learn.title')}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {t('learn.subtitle')}
        </p>
      </div>

      {/* Emergency Response Protocol Card */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 lg:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3 text-rose-800">
          <ShieldAlert className="w-6 h-6 shrink-0" />
          <div>
            <h3 className="text-base font-extrabold font-display">
              {t('learn.emergencyTitle')}
            </h3>
            <p className="text-xs text-rose-700 font-medium">
              {t('learn.emergencySubtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-rose-900">
          <div className="p-3.5 rounded-xl bg-white border border-rose-200 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
            <span>{t('emergency.step1')}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-rose-200 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
            <span>{t('emergency.step2')}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-rose-200 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
            <span>{t('emergency.step3')}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-rose-200 flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0"></span>
            <span>{t('emergency.step4')}</span>
          </div>
        </div>
      </div>

      {/* Awareness Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 font-display">
                {t(c.titleKey)}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {t(c.descKey)}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-teal-700 font-semibold font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Rule</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
