import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, User, X } from 'lucide-react';

export default function ProtectionOnboardingModal({ isOpen, onClose, onSelectOption }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleContinue = () => {
    onSelectOption();
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
            Welcome to BharathShield
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-medium">
            BharathShield provides real-time AI-powered protection against SMS phishing, bank fraud, and malicious digital threats.
          </p>
        </div>

        {/* Option Card */}
        <div className="p-4 rounded-2xl border bg-teal-950/40 border-teal-500 text-white shadow-lg shadow-teal-500/10 flex items-center gap-4 text-left">
          <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400 shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white font-display">
              Personal Anti-Phishing Shield
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Real-time threat detection for SMS, links, numbers, and UPI fraud.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleContinue}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-98"
        >
          <span>Enable Protection Now →</span>
        </button>

      </div>
    </div>
  );
}
