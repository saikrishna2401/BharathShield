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
        <h2 className="text-xl font-bold text-white font-display flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-cyan-400" />
          <span>{t('learn.title')}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t('learn.subtitle')}
        </p>
      </div>

      {/* Educational Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <div key={idx} className="cyber-card-interactive p-6 border-slate-800/80 shadow-xl group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-md">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2 font-display">
                {t(c.titleKey)}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {t(c.descKey)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Emergency Action Guide ("What to do if you clicked?") */}
      <div className="cyber-card p-6 lg:p-8 border-rose-500/40 bg-gradient-to-br from-rose-950/30 via-slate-950/80 to-slate-950/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3.5 mb-5 border-b border-slate-800/80 pb-4">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-lg">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-rose-300 font-display">
              {t('learn.emergencyTitle')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('learn.emergencySubtitle')}
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs text-slate-200 font-medium">
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
            {t('emergency.step1')}
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
            {t('emergency.step2')}
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 shadow-inner">
            {t('emergency.step3')}
          </div>
          <div className="p-4 rounded-xl bg-slate-950/90 border border-rose-900/60 font-bold text-rose-300 flex items-center gap-3 shadow-lg shadow-rose-950/50">
            <PhoneCall className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />
            <span>{t('emergency.step4')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
