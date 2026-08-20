import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, LogIn, UserPlus, AlertCircle, X } from 'lucide-react';
import { loginUser, registerUser } from '../services/apiService';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const { t } = useTranslation();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Form State
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleToggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setError('');
    setIsSubmitting(true);

    const cleanUsername = username.trim().toLowerCase();
    const autoRole = cleanUsername.startsWith('admin') ? 'admin' : 'user';

    try {
      let res;
      if (isRegisterMode) {
        res = await registerUser({
          username: cleanUsername,
          password,
          displayName: displayName.trim() || cleanUsername,
          role: autoRole
        });
      } else {
        res = await loginUser({
          username: cleanUsername,
          password,
          role: autoRole
        });
      }

      setIsSubmitting(false);

      if (res && res.success) {
        onLoginSuccess(res.user);
        if (onClose) onClose();
      } else {
        setError(res.message || (isRegisterMode ? 'Registration failed.' : 'Login failed. Please check your credentials.'));
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || (isRegisterMode ? 'Registration failed.' : 'Login failed. Please check your credentials.'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 lg:p-8 relative shadow-xl space-y-5 text-center">
        
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-xl bg-slate-100 border border-slate-200 transition-all text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
          <Shield className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            {isRegisterMode
              ? t('login.registerTitle', 'Create BharathShield Account')
              : t('login.title', 'BharathShield Account Login')}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {isRegisterMode
              ? t('login.registerSubtitle', 'Register your details to enable real-time anti-phishing security.')
              : t('login.subtitle', 'Enter your username & password to access your protection account.')}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Dynamic Form: Login vs Register */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          
          {/* Display Name (Only in Register Mode) */}
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1 font-mono">
                {t('login.nameLabel', 'Full Name / Display Name')}
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={t('login.namePlaceholder', 'e.g. Sai Krishna')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:border-teal-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1 font-mono">
              {t('login.usernameLabel', 'Username')}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('login.usernamePlaceholder', 'e.g. user or admin')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1 font-mono">
              {t('login.passwordLabel', 'Password')}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 font-mono focus:outline-none focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !username.trim() || !password}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-98"
          >
            {isRegisterMode ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>
              {isSubmitting
                ? t('login.submittingBtn', 'Authenticating...')
                : isRegisterMode
                ? t('login.createAccountBtn', 'Create Account & Register')
                : t('login.submitBtn', 'Login to Account')}
            </span>
          </button>
        </form>

        {/* Toggle Mode: Don't have an account? Register / Already have an account? Login */}
        <div className="pt-3 border-t border-slate-100 text-xs">
          {isRegisterMode ? (
            <p className="text-slate-500 font-medium">
              {t('login.alreadyHaveAccount', 'Already have an account?')}{' '}
              <button
                type="button"
                onClick={handleToggleMode}
                className="text-teal-700 hover:text-teal-800 font-bold underline cursor-pointer"
              >
                {t('login.loginLink', 'Login here')}
              </button>
            </p>
          ) : (
            <p className="text-slate-500 font-medium">
              {t('login.dontHaveAccount', "Don't have an account?")}{' '}
              <button
                type="button"
                onClick={handleToggleMode}
                className="text-teal-700 hover:text-teal-800 font-bold underline cursor-pointer"
              >
                {t('login.registerLink', 'Register here')}
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
