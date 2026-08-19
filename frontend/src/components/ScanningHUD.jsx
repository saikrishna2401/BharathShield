import React, { useState, useEffect } from 'react';
import { Shield, Cpu, Globe, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function ScanningHUD() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Indic NLP Script Analysis', desc: 'Detecting language, tokenizing text & normalizing scripts (EN, TE, HI, TA)...', icon: Globe },
    { title: 'URL & Domain Verification', desc: 'Extracting web links, resolving shorteners & checking brand typosquatting...', icon: Cpu },
    { title: 'Threat Vector Classification', desc: 'Evaluating urgency triggers, credential requests & financial fraud signals...', icon: AlertTriangle },
    { title: 'AI Risk Synthesis', desc: 'Computing confidence metrics & compiling explainable safety report...', icon: Shield }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 600);
    const timer2 = setTimeout(() => setCurrentStep(2), 1200);
    const timer3 = setTimeout(() => setCurrentStep(3), 1800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="bg-white p-6 lg:p-8 rounded-2xl border border-teal-200/90 shadow-xs relative overflow-hidden my-6 animate-fade-in">
      {/* Laser Scanning Beam Line */}
      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-teal-500 to-transparent shadow-xs animate-scan-beam z-10 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row items-center gap-6">

        {/* Radar HUD */}
        <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 rounded-full border border-teal-200 bg-teal-50/50"></div>
          <div className="absolute inset-2 rounded-full border border-teal-400/50 border-dashed animate-scan-radar"></div>
          <div className="absolute inset-5 rounded-full border border-teal-300/40"></div>
          
          <div className="relative z-10 text-teal-700 flex flex-col items-center justify-center">
            <Shield className="w-7 h-7 text-teal-600 animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase mt-1 text-teal-800">SCANNING</span>
          </div>
        </div>

        {/* Live Step Progress Feed */}
        <div className="flex-1 w-full space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping"></span>
              Real-Time AI Inspection Engine
            </h3>
            <span className="text-xs font-mono text-teal-700 font-semibold">
              Stage {Math.min(currentStep + 1, steps.length)} / {steps.length}
            </span>
          </div>

          <div className="space-y-2">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isDone = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border transition-all duration-300 flex items-start gap-3 ${
                    isCurrent
                      ? 'bg-teal-50/80 border-teal-300 text-teal-900 shadow-xs'
                      : isDone
                      ? 'bg-slate-50/70 border-slate-200 text-slate-700'
                      : 'bg-slate-50/30 border-slate-100 text-slate-400'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-teal-600 border-t-transparent animate-spin"></div>
                    ) : (
                      <StepIcon className="w-4 h-4 opacity-40" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold font-display ${isCurrent ? 'text-teal-950' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                        {step.title}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono text-teal-700 font-bold">ANALYZING...</span>
                      )}
                    </div>
                    <p className={`text-[11px] mt-0.5 truncate font-sans ${isCurrent ? 'text-teal-800' : isDone ? 'text-slate-500' : 'text-slate-400'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
