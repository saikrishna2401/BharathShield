import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { message, type = 'info' } = toast;

  const typeStyles = {
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-xs',
    warning: 'bg-amber-50 text-amber-900 border-amber-200 shadow-xs',
    error: 'bg-rose-50 text-rose-900 border-rose-200 shadow-xs',
    info: 'bg-white text-slate-900 border-slate-200 shadow-md'
  };

  const Icon = {
    success: CheckCircle2,
    warning: AlertTriangle,
    error: AlertTriangle,
    info: Info
  }[type] || Info;

  const iconColors = {
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    error: 'text-rose-600',
    info: 'text-teal-600'
  }[type] || 'text-teal-600';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-sm">
      <div className={`px-4 py-3 border rounded-xl flex items-center gap-3 shadow-lg ${typeStyles[type]}`}>
        <Icon className={`w-5 h-5 shrink-0 ${iconColors}`} />
        <span className="text-xs font-semibold font-sans leading-tight">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
