import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Users, User, ArrowRight, X, Sparkles } from 'lucide-react';

export default function ProtectionOnboardingModal({ isOpen, onClose, onSelectOption }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState('family'); // 'myself' | 'family'

  if (!isOpen) return null;

  const handleContinue = () => {
    onSelectOption(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 lg:p-8 relative shadow-2xl space-y-6 text-center">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800/80 border border-slate-700 transition-all text-xs flex items-center gap-1"
        >
          <span>Skip</span>
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/10">
          <Shield className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white font-display tracking-tight">
            {t('onboarding.title', 'Who do you want to protect?')}
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">
            {t('onboarding.subtitle', 'BharathShield shields you & your loved ones from digital fraud — tell us who needs protection.')}
          </p>
        </div>

        {/* Options Grid */}
        <div className="space-y-3.5 text-left">

          {/* Option A: Just Myself */}
          <div
            onClick={() => setSelected('myself')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
              selected === 'myself'
                ? 'bg-teal-950/40 border-teal-500 text-white shadow-lg shadow-teal-500/10'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className={`p-3 rounded-xl ${selected === 'myself' ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-400'}`}>
              <User className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white font-display">
                {t('onboarding.myselfTitle', 'Just myself')}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t('onboarding.myselfDesc', 'Personal scam protection for daily life')}
              </p>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected === 'myself' ? 'border-teal-400 bg-teal-400' : 'border-slate-600'}`}>
              {selected === 'myself' && <div className="w-2 h-2 rounded-full bg-slate-950"></div>}
            </div>
          </div>

          {/* Option B: My Family (RECOMMENDED) */}
          <div
            onClick={() => setSelected('family')}
            className={`p-4 rounded-2xl border relative transition-all cursor-pointer flex items-center gap-4 ${
              selected === 'family'
                ? 'bg-teal-950/40 border-teal-500 text-white shadow-lg shadow-teal-500/10'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="absolute -top-2.5 right-4 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-xs">
              RECOMMENDED
            </span>

            <div className={`p-3 rounded-xl ${selected === 'family' ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-800 text-slate-400'}`}>
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                <span>{t('onboarding.familyTitle', 'My family')}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {t('onboarding.familyDesc', 'Protect parents, spouse & children too')}
              </p>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected === 'family' ? 'border-teal-400 bg-teal-400' : 'border-slate-600'}`}>
              {selected === 'family' && <div className="w-2 h-2 rounded-full bg-slate-950"></div>}
            </div>
          </div>

        </div>

        {/* Action Button */}
        <button
          onClick={handleContinue}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98"
        >
          <span>{selected === 'family' ? t('onboarding.protectFamilyBtn', 'Protect Family Now →') : t('onboarding.protectMyselfBtn', 'Protect Myself Now →')}</span>
        </button>

      </div>
    </div>
  );
}
