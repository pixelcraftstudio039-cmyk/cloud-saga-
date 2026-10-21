import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Lock, FileText, CheckCircle2, AlertCircle, Eye, Database, Sparkles } from 'lucide-react';

export const TermsModal: React.FC = () => {
  const { showTermsModal, setShowTermsModal } = useApp();

  if (!showTermsModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                Terms of Service & Data Usage Policy
              </h3>
              <p className="text-xs text-neutral-500">Transparent explanation of data processing and privacy protections</p>
            </div>
          </div>
          <button
            onClick={() => setShowTermsModal(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-[#F5F7FA] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-700 leading-relaxed">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-[#EAF4FC] border border-blue-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#2563EB]">
              <ShieldCheck className="w-4 h-4" />
              <span>Summary: Transparent & Minimal Data Footprint</span>
            </div>
            <p className="text-neutral-700">
              CloudSage AI collects only the minimal data strictly necessary to authenticate your session and calculate cloud cost-saving recommendations. We <strong>never</strong> sell, share, or monetize your data.
            </p>
          </div>

          {/* Section 1: Google Account Data */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
              <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-mono">1</span>
              <span>Why We Use Your Google Account Data</span>
            </div>
            <p className="text-neutral-600">
              When you choose <strong>"Continue with Google"</strong>, Google securely passes your basic profile information to authenticate your session:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E5E7EB] space-y-1">
                <span className="font-semibold text-neutral-900 block">Identity & Profile (Name, Email, Avatar)</span>
                <p className="text-[11px] text-neutral-500">
                  Used solely to identify your workspace account, display your profile, and personalize your FinOps interface.
                </p>
              </div>
              <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E5E7EB] space-y-1">
                <span className="font-semibold text-neutral-900 block">Alert & Notification Delivery</span>
                <p className="text-[11px] text-neutral-500">
                  Your verified Google email address is used to deliver threshold warnings (e.g. 80% and 100% budget alerts) that you configure.
                </p>
              </div>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>We do <strong>not</strong> request access to your Gmail messages, Google Drive files, contacts, calendar, or Google passwords.</span>
            </div>
          </div>

          {/* Section 2: AWS Cloud Billing Data */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
              <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-mono">2</span>
              <span>Why We Use Your Cloud Billing & Telemetry Data</span>
            </div>
            <p className="text-neutral-600">
              CloudSage AI analyzes cloud billing telemetry to identify waste and deliver financial recommendations:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-neutral-600 text-[11px]">
              <li>
                <strong>Waste Identification:</strong> Cross-referencing compute instance IDs with CPU utilization to pinpoint idle staging VMs.
              </li>
              <li>
                <strong>Orphaned Storage Detection:</strong> Scanning EBS volume attachment states to flag unattached storage accumulating hourly charges.
              </li>
              <li>
                <strong>Budget Pacing & Anomaly Pinpointing:</strong> Calculating month-to-date linear burn velocity and detecting single-day surges (such as unclosed load-test clusters).
              </li>
              <li>
                <strong>Rightsizing Guidance:</strong> Evaluating database cluster utilization (e.g. Aurora Postgres memory headroom) to suggest optimal instance classes.
              </li>
            </ul>
          </div>

          {/* Section 3: Zero-Trust Security Guarantees */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
              <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-mono">3</span>
              <span>Zero-Trust Security Guarantees</span>
            </div>
            <div className="space-y-2 text-[11px] text-neutral-600">
              <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block">Strictly Read-Only Access</strong>
                  IAM policies are strictly confined to <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">ce:GetCostAndUsage</code> and <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">ce:GetCostForecast</code>. CloudSage AI cannot create, modify, reboot, or delete any cloud resources.
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-[#E5E7EB] flex items-start gap-2.5">
                <Eye className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block">Zero Secret Key Storage in Browser</strong>
                  Neither AWS secret access keys nor external auth tokens are stored in unencrypted client localStorage or browser caches.
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: User Ownership & Revocation Rights */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-neutral-900 text-sm">
              <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-mono">4</span>
              <span>Your Rights: Revocation & Deletion</span>
            </div>
            <p className="text-neutral-600 text-[11px]">
              You retain 100% ownership of your data at all times. You can disconnect your AWS connection, sign out of Google, and purge all session telemetry from CloudSage AI with a single click in <strong>Settings → Session Management</strong>.
            </p>
          </div>

          {/* Authorship & Compliance */}
          <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-neutral-500">
            <span>Crafted with passion by <strong>Mohammed Aatif Shariff</strong></span>
            <span>Effective Date: October 2026 · v2.4</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F5F7FA] flex items-center justify-between shrink-0">
          <span className="text-xs text-neutral-500">
            By using CloudSage AI, you agree to these data usage terms.
          </span>
          <button
            onClick={() => setShowTermsModal(false)}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
};
