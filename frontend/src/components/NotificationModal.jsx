import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, X, AlertTriangle, ShieldCheck, CheckCheck } from 'lucide-react';
import { markNotificationsRead } from '../services/apiService';

export default function NotificationModal({ isOpen, onClose, notifications = [], unreadCount = 0, currentUserId, onRefresh }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleMarkRead = async () => {
    await markNotificationsRead(currentUserId);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 lg:p-8 relative shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <span>{t('notifications.title', 'Security Alert Center')}</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold">
                    {unreadCount} UNREAD
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {t('notifications.subtitle', 'Real-time threat alerts and system security updates.')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 border border-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleMarkRead}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-xs font-medium">No new security notifications at this time.</p>
            </div>
          ) : (
            notifications.map((n) => {
              const isCritical = n.severity === 'CRITICAL';
              const isHigh = n.severity === 'HIGH';

              return (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    !n.read
                      ? isCritical
                        ? 'bg-rose-950/40 border-rose-500/60 text-white'
                        : isHigh
                        ? 'bg-amber-950/40 border-amber-500/60 text-white'
                        : 'bg-teal-950/30 border-teal-500/50 text-white'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-extrabold uppercase ${
                        isCritical ? 'badge-critical' : isHigh ? 'badge-phishing' : 'badge-safe'
                      }`}>
                        {n.severity}
                      </span>
                      <h4 className="text-xs font-bold text-white font-display">
                        {n.title}
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed font-sans font-medium">
                    {n.text}
                  </p>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
