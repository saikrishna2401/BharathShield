import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, MessageSquare } from 'lucide-react';

export default function DemoPresetBar({ onSelectPreset }) {
  const { t } = useTranslation();

  const presets = [
    {
      id: 'enPhish',
      labelKey: 'presets.enPhish',
      sender: 'VK-SBIINB',
      message: 'Dear customer, your SBI netbanking account has been suspended due to pending KYC. Click http://sbi-kyc-update.xyz to update immediately.'
    },
    {
      id: 'tePhish',
      labelKey: 'presets.tePhish',
      sender: 'AX-BANKIN',
      message: 'గమనిక: మీ బ్యాంక్ ఖాతా ఈరోజే నిలిపివేయబడుతుంది. వెంటనే రద్దు కాకుండా ఉండేందుకు ఈ లింక్పై క్లిక్ చేయండి: http://bit.ly/bank-kyc-te'
    },
    {
      id: 'hiPhish',
      labelKey: 'presets.hiPhish',
      sender: 'BZ-PRIZE',
      message: 'बधाई हो! आपने ₹25,00,000 की लॉटरी जीती है। इनाम राशि प्राप्त करने के लिए तुरंत इस लिंक पर क्लिक करें: http://lottery-claim.top'
    },
    {
      id: 'taPhish',
      labelKey: 'presets.taPhish',
      sender: 'TN-GOVT',
      message: 'எச்சரிக்கை: உங்கள் வங்கி கணக்கு முடக்கப்படும். உடனடியாக புதுப்பிக்க இந்த லிங்கை கிளிக் செய்யவும்: http://tn-bank-update.xyz'
    },
    {
      id: 'mixedPhish',
      labelKey: 'presets.mixedPhish',
      sender: '9876543210',
      message: 'మీ ఖాతా Block కాకుండా ఉండటానికి Urgent గా OTP మరియు Aadhaar వివరాలు ఈ క్రింది లింక్ లో ఇవ్వండి: http://192.168.1.1/update'
    },
    {
      id: 'safeOtp',
      labelKey: 'presets.safeOtp',
      sender: 'VM-HDFCBK',
      message: '849201 is your secret OTP for transaction of Rs. 2,500 at Amazon. Do NOT share OTP with anyone. HDFC Bank will never call to ask for OTP.'
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-4 lg:p-5 shadow-xs space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-teal-600" />
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
          {t('analyzer.presetsTitle')}
        </h4>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelectPreset(p.message, p.sender)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 text-xs font-medium transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
            <span>{t(p.labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
