import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';

import Header from './components/Header';
import Navigation from './components/Navigation';
import SMSAnalyzer from './components/SMSAnalyzer';
import DetectionResultCard from './components/DetectionResultCard';
import HistoryView from './components/HistoryView';
import DashboardView from './components/DashboardView';
import StaySafeView from './components/StaySafeView';
import HowItWorksView from './components/HowItWorksView';
import ReportModal from './components/ReportModal';
import SettingsView from './components/SettingsView';
import Toast from './components/Toast';

import { checkBackendHealth, analyzeSMS } from './services/apiService';

export default function App() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');
  const [activeTab, setActiveTab] = useState('analyze');
  const [healthStatus, setHealthStatus] = useState({ status: 'checking', database: 'memory', ml: 'unavailable' });

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [prefillSender, setPrefillSender] = useState('');
  const [prefillMessage, setPrefillMessage] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    checkBackendHealth().then(setHealthStatus);
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev && prev.message === message ? null : prev));
    }, 3000);
  };

  const handleLanguageChange = (newLang) => {
    setCurrentLang(newLang);
    i18n.changeLanguage(newLang);
    const langNames = { en: 'English', te: 'Telugu', hi: 'Hindi', ta: 'Tamil' };
    showToast(`Language switched to ${langNames[newLang] || newLang}`, 'success');
  };

  const handleAnalyze = async (payload) => {
    setIsLoading(true);
    setAnalysisResult(null);

    const res = await analyzeSMS({
      ...payload,
      language: currentLang
    });

    setAnalysisResult(res);
    setIsLoading(false);

    showToast(
      res.riskLevel === 'SAFE'
        ? 'Analysis Complete: Message is SAFE'
        : res.riskLevel === 'SUSPICIOUS'
        ? 'Warning: Suspicious SMS patterns detected'
        : 'ALERT: Phishing scam threat detected!',
      res.riskLevel === 'SAFE' ? 'success' : res.riskLevel === 'SUSPICIOUS' ? 'warning' : 'error'
    );

    // Auto-scroll to results card
    setTimeout(() => {
      const el = document.getElementById('analysis-results');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleOpenReport = (resultData) => {
    setIsReportModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col lang-${currentLang} selection:bg-teal-100 selection:text-teal-900`}>
      {/* Top Header */}
      <Header
        healthStatus={healthStatus}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 lg:pb-8">
        {/* Navigation Sidebar */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content View Area */}
        <main className="flex-1 p-4 lg:p-8 min-w-0">

          {/* View: SMS Analyzer */}
          {activeTab === 'analyze' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <SMSAnalyzer
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                prefillSender={prefillSender}
                prefillMessage={prefillMessage}
                onShowToast={showToast}
              />

              <div id="analysis-results">
                {analysisResult && (
                  <DetectionResultCard
                    result={analysisResult}
                    onReportScam={handleOpenReport}
                    onShowToast={showToast}
                  />
                )}
              </div>
            </div>
          )}

          {/* View: History */}
          {activeTab === 'history' && <HistoryView onShowToast={showToast} />}

          {/* View: Dashboard */}
          {activeTab === 'dashboard' && <DashboardView />}

          {/* View: Stay Safe */}
          {activeTab === 'learn' && <StaySafeView onShowToast={showToast} />}

          {/* View: How It Works */}
          {activeTab === 'howItWorks' && <HowItWorksView />}

          {/* View: Report Scam */}
          {activeTab === 'report' && (
            <div className="max-w-xl mx-auto">
              <ReportModal
                isOpen={true}
                onClose={() => setActiveTab('analyze')}
                initialData={analysisResult}
                onShowToast={showToast}
              />
            </div>
          )}

          {/* View: Settings */}
          {activeTab === 'settings' && (
            <SettingsView
              currentLang={currentLang}
              onLanguageChange={handleLanguageChange}
              onShowToast={showToast}
            />
          )}

        </main>
      </div>

      {/* Global Report Scam Modal */}
      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          initialData={analysisResult}
          onShowToast={showToast}
        />
      )}

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
