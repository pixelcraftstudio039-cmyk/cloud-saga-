import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings, 
  User, 
  Cloud, 
  Bell, 
  ShieldCheck, 
  Download, 
  LogOut, 
  Check, 
  RefreshCw,
  ExternalLink,
  Save
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    user, 
    awsConfig, 
    setShowAwsConnectModal, 
    disconnectAws, 
    signOut,
    summary,
    services,
    recommendations
  } = useApp();

  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);
  const [company, setCompany] = useState(user.company);
  const [role, setRole] = useState(user.role);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T000/B000/XXXX');
  const [slackEnabled, setSlackEnabled] = useState(false);
  const [anomalyThreshold, setAnomalyThreshold] = useState('25');
  const [savedSettings, setSavedSettings] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  const exportTelemetryJson = () => {
    const data = {
      summary,
      services,
      recommendations,
      exportedAt: new Date().toISOString(),
      source: awsConfig.dataSourceLabel
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudsage-telemetry-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[#E5E7EB]">
        <h1 className="text-xl font-bold text-[#171717] tracking-tight">Settings & Integrations</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Manage your FinOps profile, AWS credentials federation, notification webhooks, and demo telemetry data.
        </p>
      </div>

      {savedSettings && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Preferences and notification thresholds updated successfully.</span>
        </div>
      )}

      {/* Section 1: AWS Connection Architecture */}
      <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">AWS Connection & Data Source</h2>
              <p className="text-xs text-neutral-500">Cross-account IAM Role or Demo Sample Mode</p>
            </div>
          </div>

          <span className={`text-xs px-2.5 py-1 rounded font-medium border ${
            awsConfig.isConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-[#EAF4FC] text-[#2563EB] border-blue-200'
          }`}>
            {awsConfig.isConnected ? 'AWS Role Connected' : 'Demo Mode Active'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E5E7EB] space-y-1">
            <span className="text-neutral-500 block text-[11px]">Active Data Source</span>
            <span className="font-semibold text-neutral-900">{awsConfig.dataSourceLabel}</span>
          </div>
          <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E5E7EB] space-y-1">
            <span className="text-neutral-500 block text-[11px]">AWS Account ID (Masked)</span>
            <span className="font-mono font-semibold text-neutral-900">{awsConfig.accountIdMasked}</span>
          </div>
          <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E5E7EB] space-y-1">
            <span className="text-neutral-500 block text-[11px]">Default Region</span>
            <span className="font-mono text-neutral-900">{awsConfig.region || 'us-east-1'}</span>
          </div>
          <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E5E7EB] space-y-1">
            <span className="text-neutral-500 block text-[11px]">Last Synchronized</span>
            <span className="font-mono text-neutral-900">
              {new Date(awsConfig.lastSyncTimestamp || Date.now()).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Zero-API-Key Demo Engine Card */}
        <div className="p-4 bg-[#EAF4FC] rounded-xl border border-blue-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-neutral-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>Zero-API-Key FinOps Engine (100% Free Demo Mode)</span>
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active & Zero-Cost
            </span>
          </div>
          <p className="text-neutral-600 leading-relaxed">
            CloudSage AI runs completely free in Demo Mode with realistic AWS billing telemetry and intelligent rule-based cost-saving recommendations. No external API keys, credit cards, or paid services are required.
          </p>
          <div className="text-[11px] text-neutral-600 flex flex-wrap items-center justify-between pt-1 border-t border-blue-100">
            <span>Crafted with passion by <strong>Mohammed Aatif Shariff</strong></span>
            <span className="text-neutral-500 font-mono text-[10px]">Author: demo@cloudsage.app</span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setShowAwsConnectModal(true)}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
          >
            {awsConfig.isConnected ? 'Reconfigure IAM Role' : 'Connect AWS Account via IAM Role'}
          </button>

          {awsConfig.isConnected && (
            <button
              onClick={disconnectAws}
              className="text-xs text-neutral-600 hover:text-neutral-900 font-medium hover:underline"
            >
              Switch back to Demo Sample Mode
            </button>
          )}
        </div>
      </div>

      {/* Section 2: User Profile */}
      <form onSubmit={handleSavePreferences} className="p-6 rounded-xl border border-[#E5E7EB] bg-white space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-white">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900">User Profile & Organization</h2>
            <p className="text-xs text-neutral-500">Your details for reports and alert assignments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-neutral-700 mb-1">Full Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">Email Address</label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">Organization Name</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          <div>
            <label className="block font-medium text-neutral-700 mb-1">Role & Title</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-[#171717] hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </form>

      {/* Section 3: Notification & Anomaly Preferences */}
      <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-neutral-900">Alert Dispatch & Notification Channels</h2>
            <p className="text-xs text-neutral-500">Configure where budget warnings and daily anomalies trigger notifications</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-neutral-700">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 text-[#2563EB] rounded focus:ring-0"
            />
            <div>
              <span className="font-semibold text-neutral-900 block">Email Digest & 80%/100% Threshold Alerts</span>
              <span className="text-neutral-500">Send instant alerts to {userEmail} when budgets exceed warning levels.</span>
            </div>
          </label>

          <div className="pt-2 border-t border-[#E5E7EB]">
            <label className="flex items-center gap-3 cursor-pointer mb-2">
              <input
                type="checkbox"
                checked={slackEnabled}
                onChange={(e) => setSlackEnabled(e.target.checked)}
                className="w-4 h-4 text-[#2563EB] rounded focus:ring-0"
              />
              <span className="font-semibold text-neutral-900">Slack Webhook Integration</span>
            </label>
            <input
              type="text"
              disabled={!slackEnabled}
              value={slackWebhook}
              onChange={(e) => setSlackWebhook(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB] disabled:bg-[#F5F7FA] font-mono text-[11px]"
            />
          </div>

          <div className="pt-2 border-t border-[#E5E7EB]">
            <label className="block font-semibold text-neutral-900 mb-1">
              Daily Spend Anomaly Trigger Sensitivity
            </label>
            <div className="flex items-center gap-3">
              <select
                value={anomalyThreshold}
                onChange={(e) => setAnomalyThreshold(e.target.value)}
                className="px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none text-xs"
              >
                <option value="15">High Sensitivity (+15% surge over 7-day baseline)</option>
                <option value="25">Standard Sensitivity (+25% surge over 7-day baseline)</option>
                <option value="50">Conservative Sensitivity (+50% surge over 7-day baseline)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Data Export & Session */}
      <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-neutral-900">Export Telemetry & Session Management</h2>
          <p className="text-xs text-neutral-500 mt-0.5">Download current billing analysis or sign out of your account.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportTelemetryJson}
            className="px-3.5 py-2 text-xs font-semibold text-neutral-700 bg-[#F5F7FA] hover:bg-neutral-200 border border-[#E5E7EB] rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Telemetry (JSON)</span>
          </button>

          <button
            onClick={signOut}
            className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
