import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, ShieldAlert, Lock, Link2, Landmark, Smartphone, Gift, Briefcase, PhoneCall, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

export default function StaySafeView({ onShowToast }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('tips'); // 'tips' | 'quiz' | 'emergency'
  const [checkedSteps, setCheckedSteps] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});

  const cards = [
    { icon: Lock, titleKey: 'learn.card1Title', descKey: 'learn.card1Desc' },
    { icon: Link2, titleKey: 'learn.card2Title', descKey: 'learn.card2Desc' },
    { icon: Landmark, titleKey: 'learn.card3Title', descKey: 'learn.card3Desc' },
    { icon: Smartphone, titleKey: 'learn.card4Title', descKey: 'learn.card4Desc' },
    { icon: Gift, titleKey: 'learn.card5Title', descKey: 'learn.card5Desc' },
    { icon: Briefcase, titleKey: 'learn.card6Title', descKey: 'learn.card6Desc' }
  ];

  const quizQuestions = [
    {
      id: 1,
      sender: '9849012345',
      message: 'Dear customer, your bank electricity bill is unpaid. Power will be cut at 9 PM tonight. Pay immediately at http://power-pay-update.xyz',
      isScam: true,
      explanation: 'Urgent threat of service disconnection combined with an unofficial domain (.xyz).'
    },
    {
      id: 2,
      sender: 'AX-ICICIB',
      message: 'Your account balance is ₹48,250.00 as of 18-AUG-2026. For details call 18002001.',
      isScam: false,
      explanation: 'Legitimate informational SMS from registered bank header with official customer service number and no credential requests.'
    },
    {
      id: 3,
      sender: '9123456789',
      message: 'మీ బ్యాంక్ ఖాతా ఈరోజు రద్దు చేయబడుతుంది. వెంటనే KYC రికార్డులను అప్‌డేట్ చేయడానికి ఇక్కడ క్లిక్ చేయండి: http://bit.ly/bank-verify',
      isScam: true,
      explanation: 'Telugu message creating panic regarding account cancellation and using a shortened suspicious URL.'
    }
  ];

  const emergencySteps = [
    { id: 1, textKey: 'emergency.step1', detail: 'Turn off Wi-Fi and Cellular Data immediately to prevent remote access or malicious payload transfers.' },
    { id: 2, textKey: 'emergency.step2', detail: 'Call your bank helpline immediately or use their official app to temporarily lock your debit/credit card and freeze UPI handle.' },
    { id: 3, textKey: 'emergency.step3', detail: 'Update your internet banking password, UPI PINs, and email credentials from a secure secondary device.' },
    { id: 4, textKey: 'emergency.step4', detail: 'Report financial fraud instantly on national cybercrime portal cybercrime.gov.in or dial Toll-Free 1930.' }
  ];

  const handleToggleStep = (id) => {
    setCheckedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAnswerQuiz = (qId, userChoice) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: userChoice }));
    const question = quizQuestions.find(q => q.id === qId);
    if (question.isScam === userChoice) {
      if (onShowToast) onShowToast('Correct! Good eye for detecting threat vectors.', 'success');
    } else {
      if (onShowToast) onShowToast('Incorrect! Check the breakdown explanation.', 'error');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span>{t('learn.title')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            {t('learn.subtitle')}
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('tips')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'tips' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Safety Guidelines
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'quiz' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Spot-the-Phish Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'emergency' ? 'bg-rose-50 text-rose-800 border border-rose-200/80 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>Emergency Action</span>
          </button>
        </div>
      </div>

      {/* VIEW: Safety Guidelines */}
      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {cards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-500/50 transition-all group">
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 flex items-center justify-center mb-4 transition-transform group-hover:scale-105 shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 font-display">
                  {t(c.titleKey)}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {t(c.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: Spot-the-Phish Interactive Quiz */}
      {activeTab === 'quiz' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs text-slate-800 font-medium">
            <strong className="text-teal-900">Interactive Security Training:</strong> Test your instinct on real-world regional SMS examples. Can you identify which messages are legitimate and which are phishing attempts?
          </div>

          <div className="grid grid-cols-1 gap-4">
            {quizQuestions.map((q) => {
              const userAns = quizAnswers[q.id];
              const hasAnswered = userAns !== undefined;
              const isCorrect = hasAnswered && userAns === q.isScam;

              return (
                <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Sender ID: <strong className="text-slate-800">{q.sender}</strong></span>
                    <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">Scenario #{q.id}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 font-mono leading-relaxed">
                    "{q.message}"
                  </div>

                  {/* Options */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAnswerQuiz(q.id, true)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                          userAns === true
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white hover:bg-rose-50 text-rose-700 border border-rose-200/80 shadow-xs'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Flag as Phishing Scam</span>
                      </button>

                      <button
                        onClick={() => handleAnswerQuiz(q.id, false)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                          userAns === false
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Legitimate SMS</span>
                      </button>
                    </div>

                    {hasAnswered && (
                      <div className={`text-xs font-bold font-mono px-3 py-1.5 rounded-lg border ${
                        isCorrect ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                      </div>
                    )}
                  </div>

                  {hasAnswered && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans animate-fade-in">
                      <strong className="text-teal-800 font-mono">Analysis: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: Emergency Response Checklist */}
      {(activeTab === 'emergency' || activeTab === 'tips') && (
        <div className="bg-rose-50/60 p-6 lg:p-8 rounded-2xl border border-rose-200/80 shadow-xs mt-8 animate-fade-in">

          <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-rose-200/60 pb-4">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700 border border-rose-200 shadow-xs">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-rose-950 font-display">
                  {t('learn.emergencyTitle')}
                </h3>
                <p className="text-xs text-rose-800 font-medium mt-0.5">
                  {t('learn.emergencySubtitle')}
                </p>
              </div>
            </div>

            <a
              href="tel:1930"
              className="px-4.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all transform active:scale-95"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Dial Helpline 1930</span>
            </a>
          </div>

          <div className="space-y-3 text-xs text-slate-800 font-medium">
            {emergencySteps.map((step) => {
              const isChecked = checkedSteps[step.id];
              return (
                <div
                  key={step.id}
                  onClick={() => handleToggleStep(step.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 shadow-xs ${
                    isChecked
                      ? 'bg-emerald-50/90 border-emerald-200 text-slate-800'
                      : 'bg-white border-rose-100 hover:border-rose-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!isChecked}
                    onChange={() => {}}
                    className="w-4 h-4 accent-emerald-600 rounded mt-0.5 cursor-pointer shrink-0"
                  />
                  <div>
                    <span className={`font-bold block text-sm ${isChecked ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {t(step.textKey)}
                    </span>
                    <p className="text-slate-600 mt-1 text-[11px] leading-relaxed font-sans">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
