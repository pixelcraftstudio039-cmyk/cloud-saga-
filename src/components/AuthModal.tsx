import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Cloud, AlertCircle, Check, ShieldCheck, FileText, ChevronRight, Lock } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    enterDemoMode, 
    signInWithGoogle, 
    setShowTermsModal,
    setIsAuthenticated 
  } = useApp();

  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  if (!showAuthModal) return null;

  const handleGoogleSignIn = () => {
    if (!agreedToTerms) {
      setError('Please review and accept the Data Usage Terms and Privacy Conditions to proceed.');
      return;
    }
    setError(null);
    setIsGoogleSigningIn(true);
    window.location.href = '/auth/google';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreedToTerms) {
      setError('Please accept the Data Usage Terms to proceed.');
      return;
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (tab === 'register' && !name.trim()) {
      setError('Please enter your full name or company name.');
      return;
    }

    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 leading-none">
                {tab === 'signin' ? 'Sign in to CloudSage AI' : 'Create Organization Account'}
              </h3>
              <p className="text-[11px] text-neutral-500 mt-1">Autonomous AWS Cost Optimization & FinOps</p>
            </div>
          </div>
          <button
            onClick={() => setShowAuthModal(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-[#F5F7FA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Instant 1-Click Demo Fast Track */}
          <div className="p-3 bg-[#EAF4FC] rounded-xl border border-blue-100 flex items-center justify-between gap-3">
            <div className="text-xs text-blue-900 leading-snug">
              <span className="font-bold text-neutral-900 block">Instant Demo Access</span>
              Explore all features with realistic billing data (no keys required).
            </div>
            <button
              type="button"
              onClick={enterDemoMode}
              className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-lg shadow-xs whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>⚡ Demo</span>
            </button>
          </div>

          {/* Primary Option: Continue with Google */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleSigningIn}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#F5F7FA] text-neutral-800 font-semibold border border-[#E5E7EB] rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer group hover:border-neutral-300 active:scale-[0.99]"
            >
              {isGoogleSigningIn ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-neutral-300 border-t-[#2563EB] rounded-full animate-spin"></div>
                  <span>Saving Google Account...</span>
                </div>
              ) : (
                <>
                  {/* Google SVG Logo */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-xs">Continue with Google</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Direct secure Google OAuth 2.0 authentication</span>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-1">
            <div className="w-full border-t border-[#E5E7EB]"></div>
            <span className="bg-white px-2 text-[10px] text-neutral-400 uppercase tracking-wider relative font-medium">
              or continue with email
            </span>
          </div>

          {/* Segmented Tab */}
          <div className="flex items-center gap-1 p-1 bg-[#F5F7FA] rounded-lg border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => { setTab('signin'); setError(null); }}
              className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
                tab === 'signin' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(null); }}
              className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${
                tab === 'register' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {tab === 'register' && (
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mohammed Aatif Shariff"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#171717] hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              {tab === 'signin' ? 'Sign In with Email' : 'Create Account'}
            </button>
          </form>

          {/* Terms & Data Usage Accordion / Notice */}
          <div className="pt-3 border-t border-[#E5E7EB] space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-[#2563EB] rounded border-neutral-300 focus:ring-0"
              />
              <span className="text-[11px] text-neutral-600 leading-snug">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="font-semibold text-[#2563EB] hover:underline"
                >
                  CloudSage Data Usage Terms & Privacy Policy
                </button>
                .
              </span>
            </label>

            {/* Why We Use Your Data - Compact Transparency Box */}
            <div className="p-3 bg-[#F5F7FA] rounded-xl border border-[#E5E7EB] space-y-1.5 text-[11px] text-neutral-600">
              <div className="flex items-center justify-between font-semibold text-neutral-900">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Why we use your data:</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-[#2563EB] text-[10px] hover:underline flex items-center gap-0.5"
                >
                  <span>Full Policy</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-1 text-[10px] leading-relaxed">
                <p>
                  <strong>Google Identity:</strong> Used strictly to authenticate your account and route your budget alert emails. We never access your Google Drive, Gmail messages, or contacts.
                </p>
                <p>
                  <strong>Cloud Billing Signals:</strong> Read-only AWS Cost Explorer telemetry is used exclusively to uncover waste, monitor budgets, and forecast expenses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
