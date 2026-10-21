import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OptimizationRecommendation, RecommendationStatus, ServiceName } from '../types';
import { 
  SlidersHorizontal, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Check, 
  ArrowRight,
  Info,
  DollarSign,
  Layers,
  Terminal
} from 'lucide-react';
import { RecommendationDetailModal } from './RecommendationDetailModal';

export const OptimizationCenter: React.FC = () => {
  const { recommendations, updateRecommendationStatus, summary } = useApp();

  const [statusFilter, setStatusFilter] = useState<'All' | RecommendationStatus>('All');
  const [serviceFilter, setServiceFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [selectedRec, setSelectedRec] = useState<OptimizationRecommendation | null>(null);

  // Filter recommendations
  const filtered = recommendations.filter(rec => {
    if (statusFilter !== 'All' && rec.status !== statusFilter) return false;
    if (serviceFilter !== 'All' && rec.service !== serviceFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const match = 
        rec.title.toLowerCase().includes(q) ||
        rec.resourceId.toLowerCase().includes(q) ||
        rec.detectedIssue.toLowerCase().includes(q) ||
        rec.service.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const resolvedSavings = recommendations
    .filter(r => r.status === 'Resolved')
    .reduce((acc, r) => acc + r.estimatedMonthlySavings, 0);

  const highConfidenceSavings = recommendations
    .filter(r => r.status !== 'Resolved' && r.confidence === 'High')
    .reduce((acc, r) => acc + r.estimatedMonthlySavings, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#171717] tracking-tight">Cost Optimization Center</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Verified rightsizing and waste reduction opportunities detected from AWS CloudWatch & Cost Explorer signals.
          </p>
        </div>

        {/* Verification disclaimer */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 bg-[#F5F7FA] px-3 py-1.5 rounded-lg border border-[#E5E7EB]">
          <Info className="w-3.5 h-3.5 text-neutral-400" />
          <span>Opportunities require engineering validation before execution</span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white">
          <div className="text-xs font-medium text-neutral-500">Unresolved Addressable Savings</div>
          <div className="mt-1.5 text-2xl font-bold font-mono text-[#2563EB] tabular-nums">
            ${summary.potentialSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">
            Across {recommendations.filter(r => r.status !== 'Resolved').length} active findings
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white">
          <div className="text-xs font-medium text-neutral-500">High-Confidence Low-Risk Savings</div>
          <div className="mt-1.5 text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            ${highConfidenceSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">
            Ready for immediate review and script execution
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white">
          <div className="text-xs font-medium text-neutral-500">Realized Monthly Savings</div>
          <div className="mt-1.5 text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            ${resolvedSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/mo
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">
            {recommendations.filter(r => r.status === 'Resolved').length} recommendations marked resolved
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-[#F5F7FA] rounded-xl border border-[#E5E7EB]">
        {/* Status Segmented Control */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#E5E7EB] text-xs">
          {(['All', 'New', 'Reviewed', 'Resolved'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                statusFilter === s
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Service filter and Search */}
        <div className="flex items-center gap-3">
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-none text-neutral-800"
          >
            <option value="All">All AWS Services</option>
            <option value="Amazon EC2">Amazon EC2</option>
            <option value="Amazon RDS">Amazon RDS</option>
            <option value="Amazon S3">Amazon S3</option>
            <option value="Amazon EKS">Amazon EKS</option>
            <option value="Amazon CloudFront">Amazon CloudFront</option>
            <option value="Amazon DynamoDB">Amazon DynamoDB</option>
          </select>

          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search findings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E5E7EB] rounded-lg focus:outline-none text-neutral-800 placeholder:text-neutral-400"
            />
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-[#E5E7EB]">
            <CheckCircle2 className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-neutral-900">No recommendations match the filter</h3>
            <p className="text-xs text-neutral-500 mt-1">Try clearing the search query or selecting a different status filter.</p>
          </div>
        ) : (
          filtered.map((rec) => {
            const isResolved = rec.status === 'Resolved';
            return (
              <div
                key={rec.id}
                className={`p-5 rounded-xl border transition-all ${
                  isResolved
                    ? 'bg-neutral-50/70 border-neutral-200 opacity-75'
                    : 'bg-white border-[#E5E7EB] hover:border-[#2563EB]/40 shadow-xs'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Details */}
                  <div className="space-y-2 flex-1">
                    {/* Unboxed Metadata row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                      <span className="font-semibold text-neutral-800">{rec.service}</span>
                      <span aria-hidden="true">·</span>
                      <span>{rec.region}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-neutral-600">{rec.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className={`font-medium ${
                        rec.confidence === 'High' ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {rec.confidence} Confidence
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-neutral-600">{rec.risk} Risk</span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 leading-snug">
                      {rec.title}
                    </h3>

                    <p className="text-xs text-neutral-600 leading-relaxed max-w-3xl">
                      {rec.detectedIssue}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                      <span className="font-sans text-neutral-400">Target:</span>
                      <span className="truncate max-w-md">{rec.resourceId}</span>
                    </div>
                  </div>

                  {/* Right Column: Financial Impact & Actions */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E5E7EB]">
                    <div className="text-left lg:text-right">
                      <div className="text-xs text-neutral-400 font-medium">Est. Monthly Savings</div>
                      <div className="text-xl font-bold text-[#2563EB] font-mono tabular-nums">
                        +${rec.estimatedMonthlySavings.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRec(rec)}
                        className="px-3 py-1.5 text-xs font-semibold text-[#2563EB] bg-[#EAF4FC] hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        Details & CLI
                      </button>

                      {/* Status toggle button */}
                      <button
                        onClick={() => updateRecommendationStatus(rec.id, isResolved ? 'New' : 'Resolved')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                          isResolved
                            ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                            : 'bg-white text-neutral-700 border-[#E5E7EB] hover:bg-[#F5F7FA]'
                        }`}
                      >
                        {isResolved ? 'Resolved ✓' : 'Mark Resolved'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <RecommendationDetailModal
        recommendation={selectedRec}
        onClose={() => setSelectedRec(null)}
        onUpdateStatus={(id, status) => {
          updateRecommendationStatus(id, status);
        }}
      />
    </div>
  );
};
