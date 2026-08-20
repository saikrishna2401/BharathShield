import React from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { message, type = 'info' } = toast;

  const typeConfig = {
    success: {
      bgColor: 'bg-emerald-50 text-emerald-900 border-emerald-300',
      icon: <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
    },
    error: {
      bgColor: 'bg-rose-50 text-rose-900 border-rose-300',
      icon: <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
    },
    warning: {
      bgColor: 'bg-amber-50 text-amber-900 border-amber-300',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
    },
    info: {
      bgColor: 'bg-slate-900 text-white border-slate-700',
      icon: <Info className="w-4 h-4 text-teal-400 shrink-0" />
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-sm">
      <div className={`p-4 rounded-2xl border shadow-lg flex items-center justify-between gap-3 text-xs font-semibold font-display ${config.bgColor}`}>
        <div className="flex items-center gap-2.5">
          {config.icon}
          <span>{message}</span>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:opacity-75 transition-opacity"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
