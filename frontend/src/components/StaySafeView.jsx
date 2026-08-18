import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, ShieldAlert, Lock, Link2, Landmark, Smartphone, Gift, Briefcase, PhoneCall } from 'lucide-react';

export default function StaySafeView() {
  const { t } = useTranslation();

  const cards = [
    { icon: Lock, titleKey: 'learn.card1Title', descKey: 'learn.card1Desc' },
    { icon: Link2, titleKey: 'learn.card2Title', descKey: 'learn.card2Desc' },
    { icon: Landmark, titleKey: 'learn.card3Title', descKey: 'learn.card3Desc' },
    { icon: Smartphone, titleKey: 'learn.card4Title', descKey: 'learn.card4Desc' },
    { icon: Gift, titleKey: 'learn.card5Title', descKey: 'learn.card5Desc' },
    { icon: Briefcase, titleKey: 'learn.card6Title', descKey: 'learn.card6Desc' }
  ];

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <span>{t('learn.title')}</span>
        </h2>
        <p className="text-xs text-slate-400">
          {t('learn.subtitle')}
        </p>
      </div>

      {/* Educational Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="cyber-card p-5 border-slate-800 hover:border-cyan-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-100 mb-1.5 font-display">
                {t(c.titleKey)}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t(c.descKey)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Emergency Action Guide ("What to do if you clicked?") */}
      <div className="cyber-card p-6 border-rose-500/30 bg-rose-950/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-300 font-display">
              {t('learn.emergencyTitle')}
            </h3>
            <p className="text-xs text-slate-400">
              {t('learn.emergencySubtitle')}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-200">
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            {t('emergency.step1')}
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            {t('emergency.step2')}
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            {t('emergency.step3')}
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-rose-900/40 font-semibold text-rose-300 flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{t('emergency.step4')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
