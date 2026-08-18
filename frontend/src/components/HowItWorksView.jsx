import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu } from 'lucide-react';

export default function HowItWorksView() {
  const { t } = useTranslation();

  const steps = [
    { num: '01', titleKey: 'howItWorks.step1Title', descKey: 'howItWorks.step1Desc' },
    { num: '02', titleKey: 'howItWorks.step2Title', descKey: 'howItWorks.step2Desc' },
    { num: '03', titleKey: 'howItWorks.step3Title', descKey: 'howItWorks.step3Desc' },
    { num: '04', titleKey: 'howItWorks.step4Title', descKey: 'howItWorks.step4Desc' },
    { num: '05', titleKey: 'howItWorks.step5Title', descKey: 'howItWorks.step5Desc' },
    { num: '06', titleKey: 'howItWorks.step6Title', descKey: 'howItWorks.step6Desc' },
    { num: '07', titleKey: 'howItWorks.step7Title', descKey: 'howItWorks.step7Desc' },
    { num: '08', titleKey: 'howItWorks.step8Title', descKey: 'howItWorks.step8Desc' },
    { num: '09', titleKey: 'howItWorks.step9Title', descKey: 'howItWorks.step9Desc' },
    { num: '10', titleKey: 'howItWorks.step10Title', descKey: 'howItWorks.step10Desc' }
  ];

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
          <Cpu className="w-6 h-6 text-cyan-400" />
          <span>{t('howItWorks.title')}</span>
        </h2>
        <p className="text-xs text-slate-400">
          {t('howItWorks.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((s) => (
          <div key={s.num} className="cyber-card p-4 border-slate-800 flex items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-cyan-500/20">
              {s.num}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200 font-display">
                {t(s.titleKey)}
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {t(s.descKey)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
