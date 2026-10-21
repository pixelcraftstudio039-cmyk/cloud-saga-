import React, { useState } from 'react';
import { OptimizationRecommendation, RecommendationStatus } from '../types';
import { X, Check, Copy, AlertTriangle, ShieldCheck, ArrowRight, Terminal } from 'lucide-react';

interface Props {
  recommendation: OptimizationRecommendation | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: RecommendationStatus) => void;
}

export const RecommendationDetailModal: React.FC<Props> = ({
  recommendation,
  onClose,
  onUpdateStatus,
}) => {
  const [copiedCli, setCopiedCli] = useState(false);

  if (!recommendation) return null;

  const copyCli = () => {
    if (recommendation.actionCliSnippet) {
      navigator.clipboard.writeText(recommendation.actionCliSnippet);
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E5E7EB] flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
              <span>{recommendation.service}</span>
              <span aria-hidden="true">·</span>
              <span>{recommendation.region}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{recommendation.category}</span>
            </div>
            <h3 className="text-base font-bold text-neutral-900 leading-snug">
              {recommendation.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-[#F5F7FA] transition-colors shrink-0 ml-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-700">
          {/* Key Metric Strip */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-[#F5F7FA] rounded-xl border border-[#E5E7EB]">
            <div>
              <span className="text-[11px] text-neutral-500 block">Est. Monthly Savings</span>
              <span className="text-base font-bold text-[#2563EB] font-mono tabular-nums">
                +${recommendation.estimatedMonthlySavings.toFixed(2)}/mo
              </span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 block">Confidence Level</span>
              <span className={`text-xs font-semibold ${
                recommendation.confidence === 'High' ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                {recommendation.confidence} Confidence
              </span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 block">Operational Risk</span>
              <span className={`text-xs font-semibold ${
                recommendation.risk === 'Low' ? 'text-neutral-800' : 'text-amber-700'
              }`}>
                {recommendation.risk} Risk
              </span>
            </div>
          </div>

          {/* Impacted Resource */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">Impacted AWS Resource(s)</h4>
            <div className="p-2.5 bg-neutral-100 rounded-lg font-mono text-[11px] text-neutral-800 break-all select-all">
              {recommendation.resourceId}
            </div>
          </div>

          {/* Detected Issue */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">Detected Issue</h4>
            <p className="text-neutral-600 leading-relaxed bg-[#FFFFFF] p-3 rounded-lg border border-[#E5E7EB]">
              {recommendation.detectedIssue}
            </p>
          </div>

          {/* Telemetry Reasoning */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">Telemetry Evidence & Root Cause</h4>
            <p className="text-neutral-600 leading-relaxed bg-[#FFFFFF] p-3 rounded-lg border border-[#E5E7EB]">
              {recommendation.reason}
            </p>
          </div>

          {/* Risk Considerations */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-900 block">Risk & Performance Considerations</span>
              <p className="text-amber-800 leading-relaxed mt-0.5">
                {recommendation.riskConsideration}
              </p>
            </div>
          </div>

          {/* Recommended Action & CLI */}
          <div>
            <h4 className="font-semibold text-neutral-900 mb-1">Recommended Next Step</h4>
            <p className="text-neutral-700 leading-relaxed mb-3">
              {recommendation.recommendedAction}
            </p>

            {recommendation.actionCliSnippet && (
              <div>
                <div className="flex items-center justify-between mb-1 text-[11px] text-neutral-500">
                  <span className="flex items-center gap-1 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-neutral-400" />
                    AWS CLI Remediation Script
                  </span>
                  <button
                    onClick={copyCli}
                    className="flex items-center gap-1 text-[#2563EB] hover:underline font-medium"
                  >
                    {copiedCli ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCli ? 'Copied' : 'Copy Command'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-[#171717] text-neutral-200 font-mono text-[11px] rounded-lg overflow-x-auto border border-neutral-800 leading-relaxed">
                  {recommendation.actionCliSnippet}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Status Actions */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F5F7FA] flex items-center justify-between shrink-0">
          <div className="text-xs text-neutral-500">
            Current Status: <span className="font-semibold text-neutral-900">{recommendation.status}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onUpdateStatus(recommendation.id, 'New');
                onClose();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                recommendation.status === 'New'
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-700 border-[#E5E7EB] hover:bg-neutral-50'
              }`}
            >
              Mark New
            </button>

            <button
              onClick={() => {
                onUpdateStatus(recommendation.id, 'Reviewed');
                onClose();
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                recommendation.status === 'Reviewed'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-neutral-700 border-[#E5E7EB] hover:bg-neutral-50'
              }`}
            >
              Mark Reviewed
            </button>

            <button
              onClick={() => {
                onUpdateStatus(recommendation.id, 'Resolved');
                onClose();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                recommendation.status === 'Resolved'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              Mark Resolved (Save ${recommendation.estimatedMonthlySavings.toFixed(0)}/mo)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
