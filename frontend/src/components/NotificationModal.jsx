import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, X, ShieldCheck, CheckCheck } from 'lucide-react';
import { markNotificationsRead } from '../services/apiService';

export default function NotificationModal({ isOpen, onClose, notifications = [], unreadCount = 0, currentUserId, onRefresh }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleMarkRead = async () => {
    await markNotificationsRead(currentUserId);
    if (onRefresh) onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 lg:p-8 relative shadow-xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                <span>{t('notifications.title', 'Security Alert Center')}</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold">
                    {unreadCount} UNREAD
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {t('notifications.subtitle', 'Real-time threat alerts and system security updates.')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl bg-slate-100 border border-slate-200 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <div className="flex justify-end">
            <button
              onClick={handleMarkRead}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
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
                        ? 'bg-rose-50 border-rose-300 text-slate-900'
                        : isHigh
                        ? 'bg-amber-50 border-amber-300 text-slate-900'
                        : 'bg-teal-50 border-teal-300 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-extrabold uppercase ${
                        isCritical ? 'badge-critical' : isHigh ? 'badge-phishing' : 'badge-safe'
                      }`}>
                        {n.severity}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 font-display">
                        {n.title}
                      </h4>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mt-2 leading-relaxed font-sans font-medium">
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
