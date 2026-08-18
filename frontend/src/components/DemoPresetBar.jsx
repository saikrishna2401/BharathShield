import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, AlertOctagon, CheckCircle2 } from 'lucide-react';

export default function DemoPresetBar({ onSelectPreset }) {
  const { t } = useTranslation();

  const presets = [
    {
      id: 'enPhish',
      labelKey: 'presets.enPhish',
      sender: '9876543210',
      type: 'phishing',
      message: 'Congratulations! You won ₹25,00,000. Click this link immediately to claim your prize: http://sbi-kyc-verification.example.xyz'
    },
    {
      id: 'tePhish',
      labelKey: 'presets.tePhish',
      sender: '9123456789',
      type: 'phishing',
      message: 'మీ బ్యాంక్ ఖాతా ఈరోజు బ్లాక్ అవుతుంది. బహుమతి పొందడానికి మరియు KYC పూర్తి చేయడానికి వెంటనే ఈ లింక్పై క్లిక్ చేయండి: http://secure-bank-login.top'
    },
    {
      id: 'hiPhish',
      labelKey: 'presets.hiPhish',
      sender: '9988776655',
      type: 'phishing',
      message: 'बधाई हो! आपने ₹10,00,000 जीते हैं। अपना इनाम पाने के लिए तुरंत इस लिंक पर क्लिक करें और केवाईसी अपडेट करें: http://gift-reward-claim.xyz'
    },
    {
      id: 'taPhish',
      labelKey: 'presets.taPhish',
      sender: '9444012345',
      type: 'phishing',
      message: 'வாழ்த்துகள்! நீங்கள் ₹10,00,000 வென்றுள்ளீர்கள். பரிசைப் பெற உடனடியாக இந்த இணைப்பைக் கிளிக் செய்து விவரங்களை புதுப்பிக்கவும்: http://bank-kyc-update.site'
    },
    {
      id: 'mixedPhish',
      labelKey: 'presets.mixedPhish',
      sender: '9811223344',
      type: 'phishing',
      message: 'మీ account block అవుతుంది. Click this link immediately to verify KYC: http://bit.ly/fake-bank'
    },
    {
      id: 'safeOtp',
      labelKey: 'presets.safeOtp',
      sender: 'VK-SBIINB',
      type: 'safe',
      message: 'Your OTP for login is 483921. Do not share this OTP with anyone for security purposes.'
    }
  ];

  return (
    <div className="mb-6 p-4.5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-cyan-500/25 shadow-xl shadow-cyan-500/5">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1 rounded bg-cyan-500/20 text-cyan-400">
          <Zap className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300 font-mono">
          {t('analyzer.presetsTitle')}
        </h3>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectPreset(p.sender, p.message)}
            className={`text-xs font-medium px-3.5 py-2 rounded-xl border transition-all flex items-center gap-2 shadow-sm ${
              p.type === 'phishing'
                ? 'bg-rose-950/40 text-rose-200 border-rose-800/50 hover:bg-rose-900/60 hover:border-rose-400 hover:shadow-rose-900/30'
                : 'bg-emerald-950/40 text-emerald-200 border-emerald-800/50 hover:bg-emerald-900/60 hover:border-emerald-400 hover:shadow-emerald-900/30'
            }`}
          >
            {p.type === 'phishing' ? (
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            <span>{t(p.labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
