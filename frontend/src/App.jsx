import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';

import Header from './components/Header';
import Navigation from './components/Navigation';
import DashboardView from './components/DashboardView';
import QuickScanView from './components/QuickScanView';
import SMSAnalyzer from './components/SMSAnalyzer';
import DetectionResultCard from './components/DetectionResultCard';
import FamilyCircleView from './components/FamilyCircleView';
import HistoryView from './components/HistoryView';
import StaySafeView from './components/StaySafeView';
import HowItWorksView from './components/HowItWorksView';
import ReportModal from './components/ReportModal';
import SettingsView from './components/SettingsView';
import Toast from './components/Toast';
import ProtectionOnboardingModal from './components/ProtectionOnboardingModal';
import NotificationModal from './components/NotificationModal';

import { checkBackendHealth, analyzeSMS, fetchNotifications } from './services/apiService';

export default function App() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'quickScan' | 'analyze' | 'history' | 'family' | 'learn' | 'settings'

  // User Profile Identity (Strict Data Isolation)
  const [currentUserId, setCurrentUserId] = useState('user-101');
  const [userName, setUserName] = useState('Sai Krishna');

  // System & Telemetry State
  const [healthStatus, setHealthStatus] = useState({ status: 'checking', database: 'local_file', ml: 'unavailable' });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // UI Modals State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Analysis State
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    checkBackendHealth().then(setHealthStatus);

    // Check onboarding preference
    const onboarded = localStorage.getItem('bharathshield_onboarded');
    if (!onboarded) {
      setIsOnboardingOpen(true);
    }
  }, []);

  const loadNotificationsData = async () => {
    const notifData = await fetchNotifications(currentUserId);
    if (notifData && notifData.notifications) {
      setNotifications(notifData.notifications);
      setUnreadCount(notifData.unreadCount || 0);
    }
  };

  useEffect(() => {
    loadNotificationsData();
  }, [currentUserId]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev && prev.message === message ? null : prev));
    }, 3200);
  };

  const handleLanguageChange = (newLang) => {
    setCurrentLang(newLang);
    i18n.changeLanguage(newLang);
    const langNames = { en: 'English', te: 'Telugu', hi: 'Hindi', ta: 'Tamil' };
    showToast(`Language switched to ${langNames[newLang] || newLang}`, 'success');
  };

  const handleSwitchUser = () => {
    if (currentUserId === 'user-101') {
      setCurrentUserId('user-202');
      setUserName('Priya Sharma');
      showToast('Switched account to Priya Sharma (User B) — Data Isolated', 'info');
    } else {
      setCurrentUserId('user-101');
      setUserName('Sai Krishna');
      showToast('Switched account to Sai Krishna (User A) — Data Isolated', 'info');
    }
    setAnalysisResult(null);
  };

  const handleAnalyze = async (payload) => {
    setIsLoading(true);
    setAnalysisResult(null);

    const res = await analyzeSMS({
      ...payload,
      language: currentLang
    }, currentUserId);

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

    setTimeout(() => {
      const el = document.getElementById('analysis-results');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleOnboardingSelect = (option) => {
    localStorage.setItem('bharathshield_onboarded', 'true');
    if (option === 'family') {
      setActiveTab('family');
      showToast('Family Circle protection active!', 'success');
    } else {
      showToast('Personal scam protection active!', 'info');
    }
  };

  return (
    <div className={`min-h-screen bg-[#080c14] text-slate-100 flex flex-col lang-${currentLang} selection:bg-teal-500 selection:text-slate-950`}>
      
      {/* Header Bar */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        userName={userName}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-24 lg:pb-8">
        
        {/* Navigation Sidebar & Mobile Bottom Navigation */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadCount={unreadCount}
        />

        {/* Dynamic View Area */}
        <main className="flex-1 p-4 lg:p-8 min-w-0">

          {/* VIEW: Dashboard (Home) */}
          {activeTab === 'dashboard' && (
            <DashboardView
              currentUserId={currentUserId}
              userName={userName}
              onNavigate={setActiveTab}
              onShowToast={showToast}
            />
          )}

          {/* VIEW: Quick Scan */}
          {activeTab === 'quickScan' && (
            <QuickScanView
              currentUserId={currentUserId}
              onShowToast={showToast}
              onOpenReport={(res) => setIsReportModalOpen(true)}
            />
          )}

          {/* VIEW: Protect / SMS Threat Analyzer */}
          {activeTab === 'analyze' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <SMSAnalyzer
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                onShowToast={showToast}
              />

              <div id="analysis-results">
                {analysisResult && (
                  <DetectionResultCard
                    result={analysisResult}
                    onReportScam={() => setIsReportModalOpen(true)}
                    onShowToast={showToast}
                  />
                )}
              </div>
            </div>
          )}

          {/* VIEW: Family Circle */}
          {activeTab === 'family' && (
            <FamilyCircleView
              currentUserId={currentUserId}
              onShowToast={showToast}
              onOpenQuickScan={() => setActiveTab('quickScan')}
            />
          )}

          {/* VIEW: Alerts & History */}
          {activeTab === 'history' && (
            <HistoryView
              currentUserId={currentUserId}
              onShowToast={showToast}
            />
          )}

          {/* VIEW: Stay Safe Guidelines */}
          {activeTab === 'learn' && (
            <StaySafeView onShowToast={showToast} />
          )}

          {/* VIEW: How It Works */}
          {activeTab === 'howItWorks' && <HowItWorksView />}

          {/* VIEW: Settings & Profile */}
          {activeTab === 'settings' && (
            <SettingsView
              currentLang={currentLang}
              onLanguageChange={handleLanguageChange}
              onShowToast={showToast}
            />
          )}

        </main>
      </div>

      {/* Onboarding Modal */}
      {isOnboardingOpen && (
        <ProtectionOnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onSelectOption={handleOnboardingSelect}
        />
      )}

      {/* Notification Center Modal */}
      {isNotificationsOpen && (
        <NotificationModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          unreadCount={unreadCount}
          currentUserId={currentUserId}
          onRefresh={loadNotificationsData}
        />
      )}

      {/* Report Scam Modal */}
      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          initialData={analysisResult}
          onShowToast={showToast}
        />
      )}

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
