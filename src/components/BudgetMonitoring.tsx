import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Budget, BudgetItemAlert } from '../types';
import { 
  Target, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Bell, 
  X, 
  Info,
  Calendar,
  Layers,
  Clock
} from 'lucide-react';

export const BudgetMonitoring: React.FC = () => {
  const { budgets, alerts, createBudget, deleteBudget, summary } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [budgetName, setBudgetName] = useState('');
  const [budgetScope, setBudgetScope] = useState('All AWS Services');
  const [limitAmount, setLimitAmount] = useState('');
  const [recipient, setRecipient] = useState('finops@cloudsage.internal');
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = parseFloat(limitAmount);
    if (!budgetName.trim()) {
      setError('Please provide a budget name.');
      return;
    }
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid positive dollar amount.');
      return;
    }

    await createBudget({
      name: budgetName.trim(),
      scope: budgetScope,
      limitAmount: parsed,
      warningThresholds: [50, 80, 100],
      alertRecipients: [recipient.trim()]
    });

    setBudgetName('');
    setLimitAmount('');
    setShowCreateModal(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#171717] tracking-tight">Budget Guardrails & Pacing</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Set multi-tiered monthly financial ceilings with automated 50%, 80%, and 100% early warning alerts.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Budget</span>
        </button>
      </div>

      {/* Distinction Banner: Simulated vs Real */}
      <div className="p-3.5 rounded-xl bg-[#EAF4FC] border border-blue-100 flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-semibold block">Simulated CloudWatch & SNS Telemetry:</span>
          Alerts rendered below illustrate multi-threshold anomaly detection in Demo Mode. When linked to an AWS account, CloudSage syncs via AWS Budgets and SNS topics.
        </div>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((b) => {
          const percent = Math.min(100, Math.round((b.currentSpend / b.limitAmount) * 100));
          const isWarning = percent >= 80 && percent < 100;
          const isBreach = percent >= 100;
          const statusColor = isBreach ? 'bg-[#DC2626]' : isWarning ? 'bg-[#D97706]' : 'bg-[#16A34A]';
          const textColor = isBreach ? 'text-[#DC2626]' : isWarning ? 'text-[#D97706]' : 'text-[#16A34A]';

          return (
            <div key={b.id} className="p-5 rounded-xl border border-[#E5E7EB] bg-white shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                    <span>{b.scope}</span>
                    <span aria-hidden="true">·</span>
                    <span>Monthly Cycle</span>
                  </div>
                  <h3 className="text-sm font-bold text-neutral-900">{b.name}</h3>
                </div>

                <button
                  onClick={() => deleteBudget(b.id)}
                  className="text-neutral-400 hover:text-red-600 p-1 rounded transition-colors"
                  title="Delete budget"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Progress and Numbers */}
              <div>
                <div className="flex items-baseline justify-between text-xs mb-1.5">
                  <span className="text-neutral-600 font-medium">Current Spend</span>
                  <div className="font-mono tabular-nums">
                    <span className="text-base font-bold text-neutral-900">
                      ${b.currentSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-neutral-400 text-xs ml-1">
                      / ${b.limitAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Multi-Threshold Progress Bar */}
                <div className="relative w-full bg-[#F5F7FA] h-3 rounded-full overflow-hidden border border-[#E5E7EB]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
                    style={{ width: `${percent}%` }}
                  ></div>

                  {/* Threshold Tick Marks */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-neutral-300 pointer-events-none" title="50% threshold"></div>
                  <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-neutral-400 pointer-events-none" title="80% threshold"></div>
                </div>

                {/* Threshold Markers Legend */}
                <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono mt-1">
                  <span>0%</span>
                  <span>50% Warn</span>
                  <span>80% Alert</span>
                  <span>100% Limit</span>
                </div>
              </div>

              {/* Pacing & Projection */}
              <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E5E7EB] flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-500 block text-[11px]">End-of-Month Projected</span>
                  <span className="font-bold font-mono text-neutral-900 tabular-nums">
                    ${b.forecastAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-neutral-500 block text-[11px]">Utilization Status</span>
                  <span className={`font-semibold text-xs ${textColor}`}>
                    {percent}% {isBreach ? 'BREACHED' : isWarning ? 'PACING HIGH' : 'NOMINAL'}
                  </span>
                </div>
              </div>

              {/* Recipients */}
              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 truncate">
                  <Bell className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <span className="truncate">{b.alertRecipients.join(', ')}</span>
                </div>
                <span className="font-mono text-[10px] text-neutral-400">AWS Budgets v2</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alert History Section */}
      <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-sm font-bold text-[#171717]">Alert Notification History</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Chronological record of budget threshold crossings and telemetry anomalies.</p>
          </div>
          <span className="text-xs text-neutral-400 font-mono">
            {alerts.length} Triggered Events
          </span>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {alerts.map((alt) => (
            <div key={alt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-start gap-3">
                {alt.severity === 'critical' ? (
                  <div className="p-1.5 rounded-lg bg-red-50 text-[#DC2626] border border-red-200 shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-1.5 rounded-lg bg-amber-50 text-[#D97706] border border-amber-200 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-neutral-900">{alt.budgetName}</span>
                    <span className="text-neutral-400">·</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono">
                      Simulated Alert
                    </span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed max-w-3xl">
                    {alt.message}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0 text-neutral-400 font-mono text-[11px] sm:pl-4">
                {new Date(alt.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(alt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Budget Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">Create Monthly Budget</h3>
                  <p className="text-xs text-neutral-500">Configure spend ceiling and alert limits</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs text-neutral-700">
              {error && (
                <div className="p-2.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-semibold text-neutral-900 mb-1">Budget Name</label>
                <input
                  type="text"
                  placeholder="e.g. Staging Kubernetes Compute"
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-900 mb-1">Service Scope</label>
                <select
                  value={budgetScope}
                  onChange={(e) => setBudgetScope(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB]"
                >
                  <option value="All AWS Services">All AWS Services (Account Wide)</option>
                  <option value="Amazon EC2">Amazon EC2 Compute</option>
                  <option value="Amazon RDS">Amazon RDS Database Tier</option>
                  <option value="Amazon S3">Amazon S3 Object Storage</option>
                  <option value="Amazon EKS">Amazon EKS Container Clusters</option>
                  <option value="AWS Lambda">AWS Lambda Serverless</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-neutral-900 mb-1">Monthly Spending Limit ($ USD)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB] font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-900 mb-1">Alert Notification Recipient</label>
                <input
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#E5E7EB] text-[11px] text-neutral-500">
                Automatic triggers will be set at 50% (Information), 80% (Warning), and 100% (Critical Budget Overrun).
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-2 text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg shadow-xs"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
