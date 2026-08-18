import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, History, BookOpen, AlertTriangle, LayoutDashboard, Cpu, Settings } from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab }) {
  const { t } = useTranslation();

  const navItems = [
    { id: 'analyze', label: t('nav.analyze'), icon: Search },
    { id: 'history', label: t('nav.history'), icon: History },
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'learn', label: t('nav.learn'), icon: BookOpen },
    { id: 'howItWorks', label: t('nav.howItWorks'), icon: Cpu },
    { id: 'report', label: t('nav.report'), icon: AlertTriangle },
    { id: 'settings', label: t('nav.settings'), icon: Settings }
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:block w-64 shrink-0 p-4 border-r border-slate-800/60 bg-[#050811]/40 min-h-[calc(100vh-65px)]">
        <nav className="space-y-1.5 sticky top-20">
          <div className="px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            {t('nav.menuTitle')}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all text-left relative group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full shadow-md shadow-cyan-400"></span>
                )}
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#050811]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-2 flex items-center justify-around shadow-2xl">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-cyan-400 font-semibold bg-cyan-500/15 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
