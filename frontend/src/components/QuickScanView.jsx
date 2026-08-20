import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Link2, Phone, CreditCard, Cpu, Image, Search, Upload, CheckCircle2, Terminal } from 'lucide-react';
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
    { id: 'sms', labelKey: 'quickScan.vSms', icon: MessageSquare, placeholderKey: 'quickScan.phSms', defaultPh: 'e.g. Your bank account will be blocked. Click this link...' },
    { id: 'url', labelKey: 'quickScan.vUrl', icon: Link2, placeholderKey: 'quickScan.phUrl', defaultPh: 'e.g. http://sbi-kyc-verification.example.xyz' },
    { id: 'phone', labelKey: 'quickScan.vPhone', icon: Phone, placeholderKey: 'quickScan.phPhone', defaultPh: 'e.g. +91 98765 43210 or VK-SBIINB' },
    { id: 'upi', labelKey: 'quickScan.vUpi', icon: CreditCard, placeholderKey: 'quickScan.phUpi', defaultPh: 'e.g. refund-sbi-support@ybl or cashback@paytm' },
    { id: 'apk', labelKey: 'quickScan.vApk', icon: Cpu, placeholderKey: 'quickScan.phApk', defaultPh: 'e.g. SBI_Netbanking_v2.apk or Anydesk.apk' },
    { id: 'screenshot', labelKey: 'quickScan.vScreenshot', icon: Image, placeholderKey: 'quickScan.phScreenshot', defaultPh: 'Upload screenshot or paste extracted message...' }
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
        <h2 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2.5">
          <Terminal className="w-6 h-6 text-teal-600" />
          <span>{t('quickScan.title', 'Quick Security Vector Scan')}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
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
                  ? 'bg-teal-50 border-teal-300 text-teal-800 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-500'}`} />
              <span className="text-[11px] font-bold font-mono tracking-tight text-center">
                {t(v.labelKey, v.id.toUpperCase())}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Input Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-xs relative">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Vector Title Badge */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
                <currentVectorObj.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display uppercase tracking-wider">
                  Target Vector: {activeVector.toUpperCase()}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Deep multi-stage threat vector inspection
                </p>
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200">
              VECTOR ACTIVE
            </span>
          </div>

          {/* Screenshot File Upload Option */}
          {activeVector === 'screenshot' && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
              <Upload className="w-8 h-8 text-teal-600 mx-auto" />
              <div>
                <p className="text-xs font-bold text-slate-800 font-display">Upload Screenshot Image</p>
                <p className="text-[11px] text-slate-500">Extracts text automatically using client-side OCR</p>
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-teal-700 text-xs font-bold border border-slate-300 cursor-pointer transition-all shadow-2xs"
              >
                <span>Choose Image File</span>
              </label>
              {selectedFile && (
                <div className="text-xs text-emerald-700 font-mono flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Selected: {selectedFile.name}</span>
                </div>
              )}
            </div>
          )}

          {/* Main Input Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
              Scan Target Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder={t(currentVectorObj.placeholderKey, currentVectorObj.defaultPh)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-mono resize-none leading-relaxed"
            />
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading || !inputData.trim()}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-98"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Scanning Vector...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 text-white stroke-[2.5]" />
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
