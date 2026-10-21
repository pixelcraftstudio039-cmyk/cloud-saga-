import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Info, 
  Calendar, 
  Calculator,
  ArrowRight
} from 'lucide-react';

export const CostForecasting: React.FC = () => {
  const { summary, monthlyTrend, dailySpend, setActiveTab } = useApp();

  // Generate 30-day forecast projection series
  // Day 1-20 are historical actuals; Day 21-31 are forecasted at baseline ~$443/day
  const forecastSeries = [];
  let cumulativeSpend = 0;

  for (let i = 1; i <= 20; i++) {
    const day = dailySpend.find(d => d.dayNumber === i);
    const dayAmt = day ? day.amount : 490;
    cumulativeSpend += dayAmt;
    forecastSeries.push({
      day: `Oct ${i < 10 ? '0' + i : i}`,
      actualCumulative: Math.round(cumulativeSpend),
      projectedCumulative: null,
      budgetCeiling: 20000,
      dailyRate: dayAmt
    });
  }

  // Days 21 to 31
  let projectedCumulative = cumulativeSpend;
  const projectedDailyRate = 443; // normalized baseline run rate without Oct 14 spike

  for (let i = 21; i <= 31; i++) {
    projectedCumulative += projectedDailyRate;
    forecastSeries.push({
      day: `Oct ${i}`,
      actualCumulative: null,
      projectedCumulative: Math.round(projectedCumulative),
      budgetCeiling: 20000,
      dailyRate: projectedDailyRate
    });
  }

  // Connect day 20 to forecast curve for smooth line
  if (forecastSeries[19]) {
    forecastSeries[19].projectedCumulative = forecastSeries[19].actualCumulative;
  }

  const overrunRisk = summary.forecastedSpend > summary.monthlyBudget 
    ? 'High (Definite Overrun)' 
    : summary.forecastedSpend >= summary.monthlyBudget * 0.95 
    ? 'Moderate (96.2% of ceiling)' 
    : 'Low (Within safety margin)';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5E7EB] gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#171717] tracking-tight">Cost Forecasting & Exposure Modeling</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Statistical projection grounded in recent 14-day velocity and anomaly-dampened burn rates.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-500 bg-[#F5F7FA] px-3 py-1.5 rounded-lg border border-[#E5E7EB]">
          <Info className="w-3.5 h-3.5 text-neutral-400" />
          <span>Projections are statistical estimates, not guaranteed AWS invoices</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white">
          <div className="text-xs font-medium text-neutral-500">Current Spend (MTD)</div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#171717] tabular-nums">
            ${summary.totalSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            Day 20 of 31 · 11 days remaining
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white">
          <div className="text-xs font-medium text-neutral-500">Projected End-of-Month Spend</div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#2563EB] tabular-nums">
            ${summary.forecastedSpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            Current linear run-rate projection
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white">
          <div className="text-xs font-medium text-neutral-500">Budget Limit & Headroom</div>
          <div className="mt-2 text-2xl font-bold font-mono text-neutral-900 tabular-nums">
            ${summary.monthlyBudget.toLocaleString()}
          </div>
          <div className="mt-1 text-xs text-emerald-700 font-medium">
            +${(summary.monthlyBudget - summary.forecastedSpend).toLocaleString()} projected cushion
          </div>
        </div>

        <div className="p-5 rounded-xl border border-[#E5E7EB] bg-white">
          <div className="text-xs font-medium text-neutral-500">Budget Overrun Risk</div>
          <div className="mt-2 text-xl font-bold font-mono text-amber-700">
            {overrunRisk}
          </div>
          <div className="mt-1 text-xs text-neutral-500">
            Narrow headroom; action recommended
          </div>
        </div>
      </div>

      {/* Cumulative Forecast Chart */}
      <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E5E7EB] gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#171717]">Month-to-Date vs. Projected Spend Trajectory</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Solid line represents recorded AWS billing actuals; dashed curve models future burn rate with $20k budget threshold.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-neutral-700">
              <span className="w-3 h-0.5 bg-[#2563EB]"></span>
              <span>Actual Spend</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-500">
              <span className="w-3 h-0.5 bg-[#93C5FD] border-t border-dashed"></span>
              <span>Projected</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-500">
              <span className="w-3 h-0.5 bg-[#DC2626]"></span>
              <span>$20k Budget Ceiling</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastSeries} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis 
                dataKey="day" 
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
                tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                domain={[0, 22000]}
              />
              <Tooltip 
                formatter={(val: any, name: any) => [
                  val ? `$${Number(val).toLocaleString()}` : '-', 
                  name === 'actualCumulative' ? 'Actual Cumulative' : name === 'projectedCumulative' ? 'Forecast Trajectory' : 'Ceiling'
                ]}
                contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', color: '#FFF', fontSize: '12px' }}
              />
              <ReferenceLine y={20000} stroke="#DC2626" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Budget Limit: $20,000', position: 'insideTopRight', fill: '#DC2626', fontSize: 11 }} />
              <Line 
                type="monotone" 
                dataKey="actualCumulative" 
                stroke="#2563EB" 
                strokeWidth={2.5} 
                dot={false} 
              />
              <Line 
                type="monotone" 
                dataKey="projectedCumulative" 
                stroke="#93C5FD" 
                strokeWidth={2.5} 
                strokeDasharray="5 5" 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Assumptions and Mathematical Methodology Disclosure */}
      <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5E7EB]">
          <Calculator className="w-4 h-4 text-[#2563EB]" />
          <h2 className="text-sm font-bold text-[#171717]">Forecasting Methodology & Documented Assumptions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutral-600 leading-relaxed">
          <div className="space-y-1.5">
            <span className="font-semibold text-neutral-900 block">1. Run-Rate Extrapolation</span>
            <p>
              Projections combine recorded month-to-date spend ($14,820.40 over 20 days) with a normalized baseline burn rate of ~$443/day across the remaining 11 days.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold text-neutral-900 block">2. Anomaly Filtering</span>
            <p>
              The $985.40 spike on October 14 (caused by non-recurring Kubernetes test pods) has been dampened in the forward baseline to avoid inflating the end-of-month projection.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold text-neutral-900 block">3. Risk Classification</span>
            <p>
              Because the projected total ($19,250.00) sits within 3.8% of the $20,000 budget limit, overrun risk is classified as <strong>Moderate</strong>. A single unplanned benchmark could breach the ceiling.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-neutral-500">
            Resolving the top 3 recommendations in the Optimization Center would reduce projected spend to ~$16,510.00.
          </span>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="text-[#2563EB] hover:underline font-semibold flex items-center gap-1 shrink-0"
          >
            <span>Review Cost Levers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
