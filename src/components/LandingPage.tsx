import React from 'react';
import { useApp } from '../context/AppContext';
import { Footer } from './Footer';
import { 
  Cloud, 
  ArrowRight, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  Target, 
  BrainCircuit, 
  CheckCircle2, 
  Lock, 
  Eye, 
  Cpu, 
  Layers, 
  FileText,
  AlertCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setShowAuthModal, enterDemoMode } = useApp();

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Subtle kicker without pill enclosure */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold tracking-wide text-[#2563EB]">
            <span>CRAFTED BY MOHAMMED AATIF SHARIFF</span>
            <span aria-hidden="true">·</span>
            <span>100% DEMO MODE (NO API KEYS REQUIRED)</span>
            <span aria-hidden="true">·</span>
            <span>SAMPLE CLOUD BILLING & COST ADVISOR</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#171717] text-balance leading-tight">
            Make Every Cloud Dollar Count.
          </h1>

          <p className="text-lg sm:text-xl text-neutral-600 font-normal leading-relaxed text-balance">
            CloudSage AI continuously inspects your AWS infrastructure to pinpoint waste, monitor budgets against real-time pacing, forecast monthly exposure, and deliver actionable rightsizing guidance — with zero API keys or credit cards required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                enterDemoMode();
              }}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="text-base">⚡</span>
              <span>Launch Live Demo (Instant Access)</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => {
                enterDemoMode();
              }}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#EAF4FC] hover:bg-blue-100 text-[#2563EB] font-semibold text-sm rounded-lg transition-colors border border-blue-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Dashboard</span>
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-5 py-3.5 bg-white hover:bg-[#F5F7FA] text-neutral-700 hover:text-neutral-900 font-medium text-sm rounded-lg transition-colors border border-[#E5E7EB] flex items-center justify-center"
            >
              See How It Works
            </a>
          </div>

          {/* Trust markers */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-600">
            <div className="flex items-center gap-1.5 font-medium text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>No API keys or paid services needed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
              <span>Full sample billing & telemetry data</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-neutral-700">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
              <span>Crafted with passion by Mohammed Aatif Shariff</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview Frame */}
        <div className="mt-14 max-w-6xl mx-auto rounded-2xl border border-[#E5E7EB] bg-white shadow-xl overflow-hidden">
          {/* Mock Top bar of preview */}
          <div className="h-10 bg-[#171717] px-4 flex items-center justify-between border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-700"></div>
              <span className="text-xs text-neutral-400 font-mono ml-2">cloudsage.app/analytics</span>
            </div>
            <span className="text-[11px] text-neutral-400 font-mono">Demo Environment · Read-Only</span>
          </div>

          <div className="p-6 bg-[#F5F7FA]">
            {/* 4 Mini KPI Cards in preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <div className="text-xs text-neutral-500 font-medium">Month-to-Date Spend</div>
                <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">$14,820.40</div>
                <div className="text-xs text-neutral-500 mt-1">
                  <span className="text-amber-600 font-medium">+12.4%</span> vs last month
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <div className="text-xs text-neutral-500 font-medium">Addressable Monthly Savings</div>
                <div className="text-2xl font-bold text-[#2563EB] mt-1 font-mono tabular-nums">$3,410.00</div>
                <div className="text-xs text-neutral-500 mt-1">23.0% of total expenditure</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <div className="text-xs text-neutral-500 font-medium">Budget Utilization</div>
                <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">74.1%</div>
                <div className="text-xs text-neutral-500 mt-1">$14.8k of $20.0k limit</div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#E5E7EB]">
                <div className="text-xs text-neutral-500 font-medium">Active Optimization Findings</div>
                <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">8 Resources</div>
                <div className="text-xs text-neutral-500 mt-1">3 High Confidence</div>
              </div>
            </div>

            {/* Split Visual in Preview: Image Asset + Quick Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-8 rounded-xl overflow-hidden border border-[#E5E7EB] bg-white relative">
                <img
                  src="/src/assets/images/cloud_infrastructure_analytics_1792555061654.jpg"
                  alt="Cloud infrastructure analytics interface preview"
                  className="w-full h-72 sm:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs font-semibold text-blue-300">TELEMETRY CORRELATION ENGINE</div>
                  <h3 className="text-lg font-bold mt-1">Daily Spend & Anomaly Detection</h3>
                  <p className="text-xs text-neutral-300 max-w-lg mt-1">
                    Detects irregular spikes in real time — such as the unclosed Kubernetes stress testing nodes identified on October 14.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-[#E5E7EB] flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-neutral-900 mb-3">Top Services by Spend</div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-neutral-700">Amazon EC2</span>
                        <span className="font-mono text-neutral-900 font-semibold">$6,120.50 (41%)</span>
                      </div>
                      <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '41.3%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-neutral-700">Amazon RDS</span>
                        <span className="font-mono text-neutral-900 font-semibold">$3,450.20 (23%)</span>
                      </div>
                      <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#0284C7] h-full rounded-full" style={{ width: '23.3%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-neutral-700">Amazon S3</span>
                        <span className="font-mono text-neutral-900 font-semibold">$1,890.30 (13%)</span>
                      </div>
                      <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#0D9488] h-full rounded-full" style={{ width: '12.8%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5E7EB]">
                  <button
                    onClick={() => enterDemoMode()}
                    className="w-full py-2 text-xs font-semibold text-[#2563EB] bg-[#EAF4FC] hover:bg-blue-100 rounded-lg transition-colors text-center"
                  >
                    Open Interactive Analytics View →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#E5E7EB]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold text-[#2563EB] tracking-wide">CORE CAPABILITIES</div>
          <h2 className="text-3xl font-bold tracking-tight text-[#171717] mt-2">
            Engineered for Cloud Financial Precision
          </h2>
          <p className="text-sm text-neutral-600 mt-3">
            Everything engineers and finance leaders need to uncover wastage without breaking production systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#2563EB]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#EAF4FC] text-[#2563EB] flex items-center justify-center mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#171717]">Granular Cost Analysis</h3>
            <p className="text-xs text-neutral-600 leading-relaxed mt-2">
              Break down historical and daily spending by AWS service, region, and tags. Quickly pinpoint daily anomalies and usage regressions.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#2563EB]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#EAF4FC] text-[#2563EB] flex items-center justify-center mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#171717]">Budget Monitoring & Alerts</h3>
            <p className="text-xs text-neutral-600 leading-relaxed mt-2">
              Set monthly budget thresholds with 50%, 80%, and 100% warning triggers. Receive automated notifications before bills overrun expectations.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#2563EB]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#EAF4FC] text-[#2563EB] flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#171717]">Predictive Forecasting</h3>
            <p className="text-xs text-neutral-600 leading-relaxed mt-2">
              Project end-of-month costs using statistical run-rate modeling with transparent methodology and explicit risk confidence bands.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-xl border border-[#E5E7EB] bg-white hover:border-[#2563EB]/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#EAF4FC] text-[#2563EB] flex items-center justify-center mb-4">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[#171717]">CloudSage AI Advisor</h3>
            <p className="text-xs text-neutral-600 leading-relaxed mt-2">
              Ask natural questions to discover why spend rose, which services to prune, and review validated AWS CLI commands with confidence scores.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step "How It Works" Section */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#E5E7EB] bg-[#F5F7FA]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-semibold text-[#2563EB] tracking-wide">STREAMLINED WORKFLOW</div>
          <h2 className="text-3xl font-bold tracking-tight text-[#171717] mt-2">
            Three Steps to Sustainable Cloud Efficiency
          </h2>
          <p className="text-sm text-neutral-600 mt-3">
            Start saving in minutes without risking availability or sharing administrative master credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] space-y-3">
            <div className="text-xs font-mono font-bold text-[#2563EB]">STEP 01</div>
            <h3 className="text-base font-semibold text-[#171717]">Connect Securely or Launch Demo</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Authenticate via a read-only AWS IAM Cross-Account Role with a unique External ID, or immediately inspect our comprehensive preloaded demo dataset.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] space-y-3">
            <div className="text-xs font-mono font-bold text-[#2563EB]">STEP 02</div>
            <h3 className="text-base font-semibold text-[#171717]">Autonomous Waste & Anomaly Detection</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              CloudSage algorithms cross-reference utilization metrics against billing records to flag idle compute, unattached EBS disks, and oversized database clusters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E5E7EB] space-y-3">
            <div className="text-xs font-mono font-bold text-[#2563EB]">STEP 03</div>
            <h3 className="text-base font-semibold text-[#171717]">Action Verified Recommendations</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Review confidence metrics, performance considerations, and generated AWS CLI scripts. Mark recommendations as Reviewed or Resolved as your team saves.
            </p>
          </div>
        </div>
      </section>

      {/* Security & Architecture Section */}
      <section id="security" className="py-20 px-6 max-w-7xl mx-auto border-t border-[#E5E7EB]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-semibold text-[#2563EB] tracking-wide">ENTERPRISE COMPLIANCE & SECURITY</div>
            <h2 className="text-3xl font-bold tracking-tight text-[#171717] mt-2">
              Built on Zero-Trust Cloud Principles
            </h2>
            <p className="text-sm text-neutral-600 mt-4 leading-relaxed">
              We never ask for root credentials or write permissions. CloudSage AI functions purely via standard AWS Cost Explorer read-only APIs and cross-account IAM federation.
            </p>

            <div className="mt-6 space-y-4 text-xs text-neutral-700">
              <div className="flex items-start gap-3">
                <Lock className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-900">No Secret Storage on Client</span>
                  <p className="text-neutral-500 mt-0.5">Sensitive keys and tokens never touch browser memory or localStorage.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-900">Strictly Read-Only Access</span>
                  <p className="text-neutral-500 mt-0.5">IAM policies are constrained strictly to <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono">ce:GetCostAndUsage</code> and related read telemetry.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-neutral-900">External ID Verification</span>
                  <p className="text-neutral-500 mt-0.5">Eliminates the Confused Deputy problem through tenant-scoped External IDs.</p>
                </div>
              </div>
            </div>
          </div>

          <div id="architecture" className="bg-[#171717] p-6 rounded-2xl text-white font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-neutral-400">
              <span>IAM Least-Privilege Policy</span>
              <span className="text-emerald-400">read-only-verified</span>
            </div>
            <pre className="mt-4 text-neutral-300 overflow-x-auto text-[11px] leading-relaxed">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "CloudSageCostExplorerReadOnly",
      "Effect": "Allow",
      "Action": [
        "ce:GetCostAndUsage",
        "ce:GetCostForecast",
        "ce:GetDimensionValues",
        "ce:GetTags"
      ],
      "Resource": "*"
    }
  ]
}`}
            </pre>
            <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400 font-sans">
              Compatible with AWS Cost Explorer, AWS Organizations consolidated billing, and modern FinOps architecture proxies.
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimers & Independent Project Notice */}
      <section className="py-8 px-6 max-w-7xl mx-auto border-t border-[#E5E7EB]">
        <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E5E7EB] flex items-start gap-3 text-xs text-neutral-600">
          <AlertCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-neutral-900">Independent Project Notice: </span>
            CloudSage AI is an independent software development project and is not affiliated with, sponsored by, or endorsed by Amazon Web Services, Inc. (AWS) or Amazon.com. All product names, logos, and brands are property of their respective owners. Sample metrics shown in demo mode are illustrative models for evaluation.
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};
