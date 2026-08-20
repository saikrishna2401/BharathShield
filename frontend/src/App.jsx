import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './i18n';

import Header from './components/Header';
import Navigation from './components/Navigation';
import DashboardView from './components/DashboardView';
import QuickScanView from './components/QuickScanView';
import SMSAnalyzer from './components/SMSAnalyzer';
import DetectionResultCard from './components/DetectionResultCard';
import HistoryView from './components/HistoryView';
import StaySafeView from './components/StaySafeView';
import HowItWorksView from './components/HowItWorksView';
import ReportModal from './components/ReportModal';
import SettingsView from './components/SettingsView';
import Toast from './components/Toast';
import NotificationModal from './components/NotificationModal';
import LoginModal from './components/LoginModal';
import AdminReportsView from './components/AdminReportsView';

import { checkBackendHealth, analyzeSMS, fetchNotifications, submitScamReport } from './services/apiService';

const USER_STORAGE_KEY = 'bharathshield_current_user';
const TAB_STORAGE_KEY = 'bharathshield_active_tab';

export default function App() {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');

  // Restore session from localStorage across page reloads
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.warn('Failed to parse saved user session');
    }
    return {
      username: 'user',
      displayName: 'Standard User',
      role: 'user',
      token: 'token-user-session-1122'
    };
  });

  // Restore active tab from localStorage
  const [activeTab, setActiveTabState] = useState(() => {
    try {
      const savedTab = localStorage.getItem(TAB_STORAGE_KEY);
      if (savedTab) return savedTab;
    } catch (e) {}
    return 'dashboard';
  });

  const setActiveTab = (tabId) => {
    setActiveTabState(tabId);
    try {
      localStorage.setItem(TAB_STORAGE_KEY, tabId);
    } catch (e) {}
  };

  // System & Telemetry State
  const [healthStatus, setHealthStatus] = useState({ status: 'checking', database: 'local_file', ml: 'unavailable' });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // UI Modals State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Analysis State
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    checkBackendHealth().then(setHealthStatus);
  }, []);

  const loadNotificationsData = async () => {
    const currentId = currentUser ? currentUser.username : 'user';
    const notifData = await fetchNotifications(currentId);
    if (notifData && notifData.notifications) {
      setNotifications(notifData.notifications);
      setUnreadCount(notifData.unreadCount || 0);
    }
  };

  useEffect(() => {
    loadNotificationsData();
  }, [currentUser]);

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

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {}

    setAnalysisResult(null);
    showToast(`Logged in successfully as ${userData.displayName} (${userData.role.toUpperCase()})`, 'success');

    if (userData.role === 'admin') {
      setActiveTab('adminReports');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    const defaultUser = {
      username: 'user',
      displayName: 'Standard User',
      role: 'user',
      token: 'token-user-session-1122'
    };
    setCurrentUser(defaultUser);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.setItem(TAB_STORAGE_KEY, 'dashboard');
    } catch (e) {}

    setActiveTabState('dashboard');
    showToast('Logged out of session', 'info');
    setIsLoginOpen(true);
  };

  const handleAnalyze = async (payload) => {
    setIsLoading(true);
    setAnalysisResult(null);

    const currentId = currentUser ? currentUser.username : 'user';
    const res = await analyzeSMS({
      ...payload,
      language: currentLang
    }, currentId);

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

  const handleUserReportSubmit = async (reportPayload) => {
    const currentId = currentUser ? currentUser.username : 'user';
    await submitScamReport(reportPayload, currentId);
    showToast('Spam report submitted! Admin notified.', 'success');
    loadNotificationsData();
  };

  return (
    <div className={`min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col lang-${currentLang} selection:bg-teal-600 selection:text-white`}>
      
      {/* Header Bar */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-24 lg:pb-8">
        
        {/* Navigation Sidebar & Mobile Bottom Navigation */}
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadCount={unreadCount}
          currentUser={currentUser}
        />

        {/* Dynamic View Area */}
        <main className="flex-1 p-4 lg:p-8 min-w-0">

          {/* VIEW: Dashboard (Home) */}
          {activeTab === 'dashboard' && (
            <DashboardView
              currentUserId={currentUser ? currentUser.username : 'user'}
              onNavigate={setActiveTab}
              onShowToast={showToast}
            />
          )}

          {/* VIEW: Quick Scan */}
          {activeTab === 'quickScan' && (
            <QuickScanView
              currentUserId={currentUser ? currentUser.username : 'user'}
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

          {/* VIEW: Alerts & History */}
          {activeTab === 'history' && (
            <HistoryView
              currentUserId={currentUser ? currentUser.username : 'user'}
              onShowToast={showToast}
            />
          )}

          {/* VIEW: Admin Reports Management (Available to Admin) */}
          {activeTab === 'adminReports' && (
            <AdminReportsView onShowToast={showToast} />
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

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Notification Center Modal */}
      {isNotificationsOpen && (
        <NotificationModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          unreadCount={unreadCount}
          currentUserId={currentUser ? currentUser.username : 'user'}
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
          onSubmitCustom={handleUserReportSubmit}
        />
      )}

      {/* Global Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
