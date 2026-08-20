import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Trash2, Filter, RefreshCw, UserCheck, CheckCircle2 } from 'lucide-react';
import { fetchAdminReports, updateAdminReportStatus, deleteAdminReport } from '../services/apiService';

export default function AdminReportsView({ onShowToast }) {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const loadReports = async () => {
    setLoading(true);
    const data = await fetchAdminReports();
    if (data && data.reports) {
      setReports(data.reports);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await updateAdminReportStatus(id, status);
    if (onShowToast) onShowToast(`Report status updated to ${status}`, 'success');
    loadReports();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user scam report?')) {
      await deleteAdminReport(id);
      if (onShowToast) onShowToast('Report deleted', 'info');
      loadReports();
    }
  };

  const filteredReports = reports.filter(r => {
    if (filterStatus === 'NEW') return r.status === 'NEW';
    if (filterStatus === 'REVIEWED') return r.status === 'REVIEWED';
    return true;
  });

  const newCount = reports.filter(r => r.status === 'NEW').length;

  return (
    <div className="w-full space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 font-display flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
              <span>{t('admin.title', 'Admin Spam Reports Center')}</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-mono text-[10px] font-bold">
              {t('admin.controlBadge', 'ADMIN CONTROL PANEL')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {t('admin.subtitle', 'Review and manage all user-submitted scam reports in real time.')}
          </p>
        </div>

        <button
          onClick={loadReports}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-all flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{t('admin.refreshBtn', 'Refresh Reports')}</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase font-mono text-slate-400">{t('admin.totalReports', 'Total User Reports')}</span>
          <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1">{reports.length}</div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase font-mono text-rose-700">{t('admin.newReports', 'New Unreviewed Reports')}</span>
          <div className="text-3xl font-extrabold font-mono text-rose-700 mt-1">{newCount}</div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase font-mono text-emerald-700">{t('admin.reviewedReports', 'Reviewed & Actioned')}</span>
          <div className="text-3xl font-extrabold font-mono text-emerald-700 mt-1">{reports.length - newCount}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">{t('admin.filterTitle', 'Filter Reports:')}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
              filterStatus === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('admin.filterAll', 'All')} ({reports.length})
          </button>
          <button
            onClick={() => setFilterStatus('NEW')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
              filterStatus === 'NEW' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            {t('admin.filterNew', 'New')} ({newCount})
          </button>
          <button
            onClick={() => setFilterStatus('REVIEWED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all ${
              filterStatus === 'REVIEWED' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {t('admin.filterReviewed', 'Reviewed')} ({reports.length - newCount})
          </button>
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 space-y-2 shadow-xs">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-xs font-semibold">{t('admin.noReportsMsg', 'No scam reports matching the filter criteria.')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const isNew = report.status === 'NEW';

            return (
              <div
                key={report.id}
                className={`bg-white border rounded-3xl p-6 shadow-xs transition-all space-y-3 ${
                  isNew ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase ${
                      isNew ? 'badge-critical' : 'badge-safe'
                    }`}>
                      {isNew ? t('admin.statusNew', '🚨 NEW USER SPAM REPORT') : t('admin.statusReviewed', '✅ REVIEWED')}
                    </span>

                    <span className="text-xs font-bold text-slate-800 font-mono">
                      {t('report.categoryLabel', 'Category')}: {t(`categories.${report.categoryKey}`, report.categoryKey)}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>{t('admin.submittedBy', 'Submitted by')}: <strong>{report.userId}</strong></span>
                    <span>•</span>
                    <span>{new Date(report.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                {/* Report Content */}
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 font-mono">
                    {t('report.senderLabel', 'Sender')}: <strong className="text-slate-900">{report.sender}</strong>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 leading-relaxed">
                    "{report.fullMessage || report.preview}"
                  </div>

                  {report.description && (
                    <div className="text-xs text-slate-600 font-sans italic">
                      Note: {report.description}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  {isNew ? (
                    <button
                      onClick={() => handleUpdateStatus(report.id, 'REVIEWED')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t('admin.markReviewedBtn', 'Mark as Reviewed')}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(report.id, 'NEW')}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300"
                    >
                      {t('admin.reopenBtn', 'Re-open Report')}
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(report.id)}
                    className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
