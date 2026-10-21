# CloudSage AI — AI-Powered Cloud Cost Optimization Platform

> **"Understand Your Cloud. Optimize Your Costs. Make Every Cloud Dollar Count."**

CloudSage AI is a production-grade cloud financial intelligence (FinOps) web application designed for engineering teams and cloud architects to monitor AWS spending, detect waste, simulate budget guardrails, forecast monthly expenses, and receive AI-guided optimization recommendations.

---

## 1. Key Capabilities

1. **Granular Cost Analytics Dashboard**:
   - Total period spend ($14,820.40) with previous-period comparison (+12.4%).
   - Multi-month historical spending area chart and 20-day daily spend bar chart.
   - Root-cause anomaly detection highlighting anomalous single-day spikes (e.g. October 14 Kubernetes test pod surge of $985.40).
   - Cost breakdown by AWS service (EC2, RDS, S3, EKS, Lambda, CloudFront) with reactive period and service filtering.

2. **CloudSage Advisor (AI Cost Assistant)**:
   - Interactive conversational assistant powered by an intelligent rule-based AWS FinOps reasoning engine with telemetry synthesis.
   - Instant analytical queries:
     - *"Why did my cloud spending increase?"*
     - *"Which services cost the most?"*
     - *"How can I reduce my cloud bill?"*
     - *"What resources may be underutilized?"*
     - *"Am I likely to exceed my monthly budget?"*
   - Returns structured telemetry reasoning, estimated savings ranges, analytical confidence scores, and copyable AWS CLI remediation commands.

3. **Cost Optimization Center**:
   - Comprehensive catalog of verified optimization opportunities:
     - Decommissioning idle EC2 staging instances (`i-078a9c21b3e`, `i-0a8b99142f`)
     - Deleting orphaned unattached EBS storage volumes (1,420 GB in `us-west-2`)
     - Right-sizing over-provisioned Aurora Postgres cluster (`aurora-prod-analytics`)
     - S3 lifecycle transition to Glacier Flexible Retrieval for cold telemetry logs
     - Releasing unassociated Elastic IPs incurring idle hourly surcharges
     - Graviton3 (ARM64) container compute migration for stateless APIs
   - Filterable by Status (New, Reviewed, Resolved), Service, and Confidence.
   - Interactive modal with copyable AWS CLI commands and instant metric recalculation upon resolution.

4. **Budget Guardrails & Pacing**:
   - Multi-threshold monthly budget tracking with 50%, 80%, and 100% warning markers.
   - Color-coded pacing indicators (Nominal, Approaching, Breached).
   - Interactive budget creator modal.
   - Simulated alert notification log clearly distinguishing synthetic telemetry from live SNS messages.

5. **Predictive Cost Forecasting**:
   - Statistical month-end projections ($19,250 projected vs $20,000 budget limit).
   - Overrun risk meter with confidence rating (Moderate / 96.2% of ceiling).
   - Transparent, documented mathematical methodology explaining run-rate extrapolation and anomaly dampening.

6. **AWS Least-Privilege IAM Integration**:
   - Architected according to AWS security best practices using STS Cross-Account IAM Role assume-role federation.
   - Unique tenant External ID (`cloudsage-secure-verify-9938`) eliminating the Confused Deputy problem.
   - Read-only IAM policy restricted strictly to `ce:GetCostAndUsage`, `ce:GetCostForecast`, `ce:GetDimensionValues`, and `ce:GetTags`.
   - Zero credential or key storage in frontend code.

---

## 2. Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                 React SPA (Vite + Tailwind v4)              │
│  - Plus Jakarta Sans + JetBrains Mono tabular figures       │
│  - Recharts (AreaChart, BarChart, LineChart)                │
│  - Lucide Icons & Responsive Collapsible Sidebar            │
└──────────────────────────────┬──────────────────────────────┘
                               │ /api/*
┌──────────────────────────────▼──────────────────────────────┐
│                  Express Full-Stack Server                  │
│                     (Node.js / tsx)                         │
├──────────────────────────────┬──────────────────────────────┤
│  POST /api/advisor/chat      │ GET /api/billing/summary     │
│  POST /api/aws/connect       │ PATCH /api/recommendations/:id│
│  POST /api/budgets           │ DELETE /api/budgets/:id      │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
┌──────────────▼───────────────┐ ┌────────────▼───────────────┐
│ Gemini 2.5 Flash / Bedrock   │ │ AWS Cost Explorer API      │
│ (Secure Backend AI Proxy)    │ │ (IAM Read-Only Federation) │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## 3. Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | (Optional) Gemini API Key for live AI advisor generation. If omitted, the platform uses its built-in rule-based FinOps engine. |
| `APP_URL` | Hosted application URL (injected automatically in AI Studio). |
| `AWS_ROLE_ARN` | (Optional) ARN of the AWS IAM cross-account role for live Cost Explorer access. |
| `AWS_EXTERNAL_ID` | (Optional) External ID matching the AWS IAM trust policy. |
| `AWS_REGION` | (Optional) Default AWS region (e.g. `us-east-1`). |

---

## 4. Quickstart & Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:3000`.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Run Production Server**:
   ```bash
   npm start
   ```

---

## 5. Hackathon & Evaluator Guide

- **Instant Evaluation Mode**: On launch, click **"Explore Live Dashboard"** or **"Launch Demo"** on the Sign In modal. The platform is preloaded with realistic AWS telemetry, recommendations, budgets, and forecasts.
- **Test Optimization Status**: Go to **Optimization Center** and click **Mark Resolved** on any recommendation. Notice how the dashboard's potential savings and overall metrics update immediately!
- **Test AI Advisor**: Go to **CloudSage Advisor** and click any of the suggested prompt buttons to see how the assistant analyzes the account telemetry.
- **Test Budget Creation**: Go to **Budget Guardrails** and click **Create New Budget** to test the interactive budget form.

---

## 6. Independent Project Notice

CloudSage AI is an independent software development project and is not affiliated with, sponsored by, or endorsed by Amazon Web Services, Inc. (AWS) or Amazon.com. All product names, logos, and brands are property of their respective owners. Sample figures shown in demo mode are illustrative models for evaluation.
