import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PiggyBank, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  SlidersHorizontal, 
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  Filter
} from 'lucide-react';
import { RecommendationDetailModal } from './RecommendationDetailModal';
import { OptimizationRecommendation } from '../types';

export const DashboardOverview: React.FC = () => {
  const { 
    summary, 
    services, 
    monthlyTrend, 
    dailySpend, 
    recommendations, 
    budgets, 
    dateRange, 
    setDateRange, 
    selectedService, 
    setSelectedService,
    updateRecommendationStatus,
    setActiveTab,
    setShowAwsConnectModal,
    awsConfig,
    error,
    clearError
  } = useApp();

  const [selectedRec, setSelectedRec] = useState<OptimizationRecommendation | null>(null);

  // Filter multiplier based on dateRange to demonstrate live reactive filtering
  const rangeMultiplier = 
    dateRange === 'last7' ? 0.23 :
    dateRange === 'last30' ? 1.0 :
    dateRange === 'mtd' ? 0.74 :
    dateRange === 'prevMonth' ? 0.89 : 2.8;

  const displayedTotalSpend = (summary.totalSpend * rangeMultiplier).toFixed(2);
  const displayedPreviousSpend = (summary.previousPeriodSpend * rangeMultiplier).toFixed(2);

  // Filter services if one is selected
  const filteredServices = selectedService === 'All Services' 
    ? services 
    : services.filter(s => s.service === selectedService);

  // Filter daily spend if service is selected
  const filteredDailySpend = dailySpend.map(d => {
    let amt = d.amount;
    if (selectedService === 'Amazon EC2') amt = d.ec2;
    else if (selectedService === 'Amazon RDS') amt = d.rds;
    else if (selectedService === 'Amazon S3') amt = d.s3;
    else if (selectedService !== 'All Services') amt = d.other;
    return {
      ...d,
      displayAmount: amt
    };
  });

  const unresolvedRecs = recommendations.filter(r => r.status !== 'Resolved').slice(0, 4);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Dismissible Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between gap-3 text-xs text-red-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <button
            onClick={clearError}
            className="text-red-700 hover:text-red-950 font-semibold text-xs px-2.5 py-1 rounded-md hover:bg-red-100 transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Demo Mode / Illustrative Data Banner */}
      <div className="p-3.5 rounded-xl bg-[#EAF4FC] border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-neutral-800">
          <Info className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>
            <strong className="font-semibold text-neutral-900">Zero API Key Demo Mode: </strong>
            Running 100% free with realistic AWS billing telemetry and rule-based cost-saving recommendations. No API keys or external paid services required.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowAwsConnectModal(true)}
            className="text-[#2563EB] hover:underline font-semibold"
          >
            {awsConfig.isConnected ? 'AWS Settings' : 'Optional AWS Setup →'}
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-bold text-[#171717] tracking-tight">Cloud Cost Analytics</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            AWS Account: <span className="font-mono">{awsConfig.accountIdMasked}</span> · Region: {awsConfig.region || 'us-east-1'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Picker */}
          <div className="flex items-center gap-1.5 bg-[#F5F7FA] border border-[#E5E7EB] rounded-lg p-1 text-xs">
            <Calendar className="w-3.5 h-3.5 text-neutral-400 ml-1.5" />
            {(['last7', 'last30', 'mtd', 'prevMonth'] as const).map((range) => {
              const labels = {
                last7: 'Last 7 Days',
                last30: 'Last 30 Days',
                mtd: 'Month to Date',
                prevMonth: 'Previous Month'
              };
              return (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    dateRange === range
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {labels[range]}
                </button>
              );
            })}
          </div>

          {/* Service Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#F5F7FA] border border-[#E5E7EB] rounded-lg px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="bg-transparent border-none text-xs text-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="All Services">All AWS Services</option>
              {services.map(s => (
                <option key={s.service} value={s.service}>{s.service}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Spend */}
        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Total Cloud Spending</span>
            <DollarSign className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#171717]">
            ${parseFloat(displayedTotalSpend).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center gap-1.5">
            <span className="font-semibold text-amber-600 flex items-center gap-0.5 font-mono">
              <TrendingUp className="w-3 h-3" />
              +{summary.changePercentage}%
            </span>
            <span>vs previous period (${parseFloat(displayedPreviousSpend).toLocaleString(undefined, { maximumFractionDigits: 0 })})</span>
          </div>
        </div>

        {/* Card 2: Potential Monthly Savings */}
        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Potential Monthly Savings</span>
            <PiggyBank className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#2563EB]">
            ${summary.potentialSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center gap-1.5">
            <span className="font-semibold text-[#2563EB] font-mono">
              {summary.savingsPercentage}%
            </span>
            <span>of total monthly spend addressable</span>
          </div>
        </div>

        {/* Card 3: Budget Utilization */}
        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Budget Utilization</span>
            <Target className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#171717]">
            {summary.budgetUtilizedPercent}%
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            <span>${summary.totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })} of ${summary.monthlyBudget.toLocaleString()} limit</span>
            <span className="text-neutral-400 ml-1">({summary.daysRemaining}d left)</span>
          </div>
        </div>

        {/* Card 4: Wastage Findings */}
        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white">
          <div className="flex items-center justify-between text-xs text-neutral-500 font-medium">
            <span>Active Waste Findings</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-[#171717]">
            {summary.unresolvedRecommendationsCount} Resources
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center justify-between">
            <span>3 High Confidence</span>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="text-[#2563EB] hover:underline font-medium text-[11px]"
            >
              Review All →
            </button>
          </div>
        </div>
      </div>

      {/* Main Charts Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Trend Area Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-xl border border-[#E5E7EB] bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB] gap-2">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">Monthly Spending Trajectory & Projection</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Historical 6-month spend with current month run-rate projection</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB]"></span>
                <span>Historical Spend</span>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#93C5FD]"></span>
                <span>End-of-Month Projected</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#94A3B8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={{ stroke: '#E2E8F0' }}
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Total Cloud Spend']}
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
                  itemStyle={{ color: '#EAF4FC' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#2563EB" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#spendGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Breakdown by Service (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-xl border border-[#E5E7EB] bg-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
              <h2 className="text-sm font-bold text-[#171717]">Cost by Cloud Service</h2>
              <span className="text-xs text-neutral-400 font-mono">7 Categories</span>
            </div>

            <div className="space-y-3.5">
              {filteredServices.slice(0, 5).map((s) => (
                <div key={s.service} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-800 truncate">{s.service}</span>
                    <span className="font-mono font-semibold text-neutral-900 tabular-nums">
                      ${s.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="w-full bg-[#F5F7FA] h-2 rounded-full overflow-hidden border border-[#E5E7EB]">
                    <div 
                      className="h-full rounded-full transition-all duration-300" 
                      style={{ width: `${s.percentage}%`, backgroundColor: s.color }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                    <span>{s.percentage}% of total</span>
                    <span className={s.changePercentage > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                      {s.changePercentage > 0 ? `+${s.changePercentage}%` : `${s.changePercentage}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('advisor')}
            className="w-full mt-6 py-2.5 bg-[#EAF4FC] hover:bg-blue-100 text-[#2563EB] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Advisor: "Which services cost the most?"</span>
          </button>
        </div>
      </div>

      {/* Daily Spending Chart with Anomaly Spike Flag */}
      <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB] gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#171717]">Daily Spend Pattern & Anomaly Pinpointing</h2>
              <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium border border-amber-200">
                Oct 14 Spike Identified (+104%)
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Daily AWS Cost Explorer telemetry across the last 20 billing days. Hover over bars to inspect service splits.
            </p>
          </div>
          <div className="text-xs text-neutral-500 font-mono">
            Baseline: ~$490/day
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredDailySpend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#94A3B8" 
                fontSize={10} 
                tickLine={false} 
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={11} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip 
                formatter={(val: any, _name: any, item: any) => [
                  `$${Number(val).toFixed(2)}${item.payload.isAnomaly ? ' ⚠️ (EKS Stress Test Spike)' : ''}`, 
                  'Day Spend'
                ]}
                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
              />
              <Bar dataKey="displayAmount" radius={[4, 4, 0, 0]}>
                {filteredDailySpend.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isAnomaly ? '#DC2626' : '#2563EB'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-800 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-900">Oct 14 Telemetry Analysis: </span>
            Single-day spend surged to $985.40 due to unclosed EKS load-testing worker nodes in us-east-1 running unthrottled for 18 hours.
            <button
              onClick={() => setActiveTab('advisor')}
              className="ml-2 font-medium underline text-amber-900 hover:text-black"
            >
              Analyze in Advisor →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Optimization Recommendations Strip */}
      <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-sm font-bold text-[#171717]">Top Optimization Opportunities Requiring Verification</h2>
            <p className="text-xs text-neutral-500 mt-0.5">Potential savings identified through automated infrastructure telemetry.</p>
          </div>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
          >
            <span>View All ({recommendations.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unresolvedRecs.map((rec) => (
            <div 
              key={rec.id}
              className="p-4 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB]/40 bg-[#F5F7FA] hover:bg-white transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-1">
                    <span className="font-medium text-neutral-700">{rec.service}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rec.region}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-semibold">{rec.confidence} Confidence</span>
                  </div>
                  <h3 className="text-xs font-bold text-neutral-900 leading-snug">
                    {rec.title}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#2563EB] font-mono tabular-nums block">
                    +${rec.estimatedMonthlySavings.toFixed(0)}/mo
                  </span>
                  <span className="text-[10px] text-neutral-400">est. savings</span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed">
                {rec.detectedIssue}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
                <button
                  onClick={() => setSelectedRec(rec)}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Inspect Telemetry & CLI →
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateRecommendationStatus(rec.id, 'Reviewed')}
                    className="px-2 py-1 text-[11px] text-neutral-600 hover:text-neutral-900 hover:bg-white rounded border border-transparent hover:border-[#E5E7EB]"
                  >
                    Reviewed
                  </button>
                  <button
                    onClick={() => updateRecommendationStatus(rec.id, 'Resolved')}
                    className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation Details Modal */}
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
