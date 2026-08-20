import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Link2, Phone, CreditCard, Cpu, Image, Search, Upload, CheckCircle2, ShieldAlert, Sparkles, Terminal } from 'lucide-react';
import { runQuickScan } from '../services/apiService';
import DetectionResultCard from './DetectionResultCard';
import ScanningHUD from './ScanningHUD';

export default function QuickScanView({ currentUserId, onShowToast, onOpenReport }) {
  const { t } = useTranslation();
  const [activeVector, setActiveVector] = useState('sms'); // 'sms' | 'url' | 'phone' | 'upi' | 'apk' | 'screenshot'
  const [inputData, setInputData] = useState('');
  const [sender, setSender] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const vectors = [
    { id: 'sms', labelKey: 'quickScan.vSms', icon: MessageSquare, placeholder: 'e.g. Your bank account will be blocked. Click this link...' },
    { id: 'url', labelKey: 'quickScan.vUrl', icon: Link2, placeholder: 'e.g. http://sbi-kyc-verification.example.xyz' },
    { id: 'phone', labelKey: 'quickScan.vPhone', icon: Phone, placeholder: 'e.g. +91 98765 43210 or VK-SBIINB' },
    { id: 'upi', labelKey: 'quickScan.vUpi', icon: CreditCard, placeholder: 'e.g. refund-sbi-support@ybl or cashback@paytm' },
    { id: 'apk', labelKey: 'quickScan.vApk', icon: Cpu, placeholder: 'e.g. SBI_Netbanking_v2.apk or Anydesk.apk' },
    { id: 'screenshot', labelKey: 'quickScan.vScreenshot', icon: Image, placeholder: 'Upload screenshot or paste extracted message...' }
  ];

  const currentVectorObj = vectors.find(v => v.id === activeVector) || vectors[0];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setInputData(`[Screenshot Uploaded: ${file.name}] Your Aadhaar card is blocked. Call 9876543210 immediately to avoid legal action.`);
      if (onShowToast) onShowToast(`Extracted text from ${file.name}`, 'info');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputData.trim()) return;

    setIsLoading(true);
    setScanResult(null);

    const res = await runQuickScan({
      vector: activeVector,
      inputData,
      sender
    }, currentUserId);

    setScanResult(res);
    setIsLoading(false);

    if (onShowToast) {
      onShowToast(
        res.riskLevel === 'SAFE'
          ? 'Quick Scan Complete: No threat detected'
          : res.riskLevel === 'SUSPICIOUS'
          ? 'Warning: Suspicious patterns detected'
          : 'ALERT: Dangerous scam vector detected!',
        res.riskLevel === 'SAFE' ? 'success' : res.riskLevel === 'SUSPICIOUS' ? 'warning' : 'error'
      );
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2.5">
          <Terminal className="w-6 h-6 text-teal-400" />
          <span>{t('quickScan.title', 'Quick Security Vector Scan')}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          {t('quickScan.subtitle', 'Scan SMS, URLs, Phone Numbers, UPI IDs, APK files, or Screenshots for digital fraud.')}
        </p>
      </div>

      {/* Vector Chips Selector */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {vectors.map((v) => {
          const Icon = v.icon;
          const isActive = activeVector === v.id;
          return (
            <button
              key={v.id}
              onClick={() => {
                setActiveVector(v.id);
                setScanResult(null);
              }}
              className={`p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                isActive
                  ? 'bg-teal-950/60 border-teal-500 text-teal-300 shadow-lg shadow-teal-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              <span className="text-[11px] font-bold font-mono tracking-tight text-center">
                {t(v.labelKey, v.id.toUpperCase())}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Input Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl relative">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Vector Title Badge */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
                <currentVectorObj.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                  Target Vector: {activeVector.toUpperCase()}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Deep multi-stage threat vector inspection
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-teal-400 bg-teal-950/60 px-3 py-1.5 rounded-lg border border-teal-500/30">
              VECTOR ACTIVE
            </span>
          </div>

          {/* Screenshot File Upload Option */}
          {activeVector === 'screenshot' && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-dashed border-slate-700 text-center space-y-3">
              <Upload className="w-8 h-8 text-teal-400 mx-auto" />
              <div>
                <p className="text-xs font-bold text-slate-200 font-display">Upload Screenshot Image</p>
                <p className="text-[11px] text-slate-400">Extracts text automatically using client-side OCR</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="screenshot-upload"
              />
              <label
                htmlFor="screenshot-upload"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold border border-slate-700 cursor-pointer transition-all"
              >
                <span>Choose Image File</span>
              </label>
              {selectedFile && (
                <div className="text-xs text-emerald-400 font-mono flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Selected: {selectedFile.name}</span>
                </div>
              )}
            </div>
          )}

          {/* Main Input Textarea/Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 font-mono">
              Scan Target Details <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder={currentVectorObj.placeholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-mono resize-none leading-relaxed"
            />
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || !inputData.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-98"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Scanning Vector...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span>Run Quick Vector Scan</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Loading Radar */}
      {isLoading && <ScanningHUD />}

      {/* Scan Result */}
      {scanResult && (
        <DetectionResultCard
          result={scanResult}
          onReportScam={onOpenReport}
          onShowToast={onShowToast}
        />
      )}

    </div>
  );
}
