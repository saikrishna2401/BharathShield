import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, UserPlus, Trash2, ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, Phone, Share2, Lock, ArrowRight } from 'lucide-react';
import { fetchFamilyMembers, addFamilyMember, removeFamilyMember } from '../services/apiService';

export default function FamilyCircleView({ currentUserId, onShowToast, onOpenQuickScan }) {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('PARENT');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadFamilyData = async () => {
    const data = await fetchFamilyMembers(currentUserId);
    if (data && data.members) setMembers(data.members);
    if (data && data.alerts) setAlerts(data.alerts);
  };

  useEffect(() => {
    loadFamilyData();
  }, [currentUserId]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    await addFamilyMember({ name, relationship, phone }, currentUserId);
    setIsSubmitting(false);
    setIsAddModalOpen(false);
    setName('');
    setPhone('');
    if (onShowToast) onShowToast(`Added ${name} to Family Protection Circle!`, 'success');
    loadFamilyData();
  };

  const handleRemove = async (id, memberName) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from your Family Circle?`)) {
      await removeFamilyMember(id, currentUserId);
      if (onShowToast) onShowToast(`Removed ${memberName} from Family Circle`, 'info');
      loadFamilyData();
    }
  };

  const protectedCount = members.filter(m => m.protectionStatus === 'PROTECTED').length;

  return (
    <div className="w-full space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2.5">
              <Users className="w-6 h-6 text-teal-400" />
              <span>{t('family.title', 'Family Circle')}</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold font-mono uppercase animate-pulse">
              SOS ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-2">
            <span>{members.length} visible</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">{protectedCount} protected</span>
            <span>•</span>
            <span>Brahmaastra Security</span>
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-teal-500/10"
        >
          <UserPlus className="w-4 h-4 text-teal-400" />
          <span>+ Add Member</span>
        </button>
      </div>

      {/* Live Family Threat Alert Banner (Inspired by NeoRakshak) */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-rose-950/80 border border-rose-500/60 p-6 rounded-3xl shadow-2xl relative overflow-hidden space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-xs font-bold text-rose-400 font-mono tracking-wider uppercase">
              🚨 LIVE FAMILY ALERT — CRITICAL
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-mono font-bold">
            97% AI CONFIDENCE
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-extrabold text-white font-display tracking-tight flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0" />
            <span>Dadi is AT RISK</span>
          </h3>
          <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            "Received a message: Your Aadhaar is blocked. Call 9876543210 immediately to avoid legal action."
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-slate-400 font-medium">
            Threat Type: <strong className="text-rose-300 font-mono">Fake TRAI / Government Impersonation Scam</strong>
          </div>

          <button
            onClick={() => {
              if (onShowToast) onShowToast('Sent emergency safety guidance alert to Dadi via WhatsApp!', 'success');
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all transform active:scale-95"
          >
            <span>Protect Dadi Now →</span>
          </button>
        </div>
      </div>

      {/* Protected Members List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Protected Family Members ({members.length})
        </h3>

        {members.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 space-y-2">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs font-medium">No family members added yet. Click "+ Add Member" to protect your family.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {members.map((m) => {
              const isProtected = m.protectionStatus === 'PROTECTED';
              const initial = m.name ? m.name.charAt(0).toUpperCase() : 'M';

              return (
                <div key={m.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between gap-3 hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 font-bold font-display text-lg flex items-center justify-center shrink-0">
                      {initial}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white font-display truncate">
                          {m.name}
                        </h4>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[9px] font-bold">
                          {m.relationship}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono truncate mt-0.5">
                        {m.phone || '+91 9123456789'}
                      </p>
                      <span className="text-[10px] text-slate-500 block">Long press to remove</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      isProtected ? 'badge-safe' : 'badge-suspicious'
                    }`}>
                      {isProtected ? 'Protected' : 'Check Required'}
                    </span>

                    <button
                      onClick={() => handleRemove(m.id, m.name)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Remove Member"
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

      {/* Circle Features Cards Grid */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Family Protection Shield Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300 font-medium">Real-time alerts when member is targeted</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300 font-medium">Safe Word Protocol — verify caller identity</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300 font-medium">Weekly family threat summary report</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300 font-medium">Family admin dashboard for all members</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 lg:p-8 relative shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white font-display">Add Family Member</h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-mono">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dadi, Naa, Sister"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-mono">
                  Relationship
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  <option value="PARENT">PARENT</option>
                  <option value="SPOUSE">SPOUSE</option>
                  <option value="CHILD">CHILD</option>
                  <option value="SIBLING">SIBLING</option>
                  <option value="RELATIVE">RELATIVE</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1.5 font-mono">
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20"
                >
                  {isSubmitting ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
