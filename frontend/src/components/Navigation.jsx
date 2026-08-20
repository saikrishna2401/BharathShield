import React from 'react';
import { useTranslation } from 'react-i18next';
import { Home, Search, Shield, Bell, Settings, BookOpen, ShieldAlert } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab, unreadCount = 0, currentUser }) {
  const { t } = useTranslation();
  const isAdmin = currentUser?.role === 'admin';

  const navItems = [
    { id: 'dashboard', label: t('nav.home', 'Home'), icon: Home },
    { id: 'quickScan', label: t('nav.quickScan', 'Quick Scan'), icon: Search },
    { id: 'analyze', label: t('nav.protect', 'Protect'), icon: Shield },
    { id: 'history', label: t('nav.alerts', 'Alerts'), icon: Bell, badge: unreadCount },
    ...(isAdmin ? [{ id: 'adminReports', label: 'Admin Reports', icon: ShieldAlert }] : []),
    { id: 'learn', label: t('nav.learn', 'Stay Safe'), icon: BookOpen },
    { id: 'settings', label: t('nav.settings', 'Settings'), icon: Settings }
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:block w-64 shrink-0 p-4 border-r border-slate-200/80 bg-white/60 min-h-[calc(100vh-65px)]">
        <nav className="space-y-1 sticky top-20">
          <div className="px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
            {t('nav.menuTitle', 'Cybersecurity Navigation')}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all text-left relative group ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 border border-teal-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2.5 bottom-2.5 w-1.5 bg-teal-600 rounded-r-full"></span>
                )}
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 ${isActive ? 'text-teal-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isCenterShield = item.id === 'analyze';

          if (isCenterShield) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="relative -top-5 p-3.5 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-600/30 transform active:scale-95 transition-all border-4 border-white"
                title={item.label}
              >
                <Shield className="w-6 h-6 stroke-[2.5]" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-teal-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-500'}`} />
              <span className="text-[10px] mt-1 font-mono tracking-tight">{item.label}</span>
              {item.badge > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
