export type ServiceName = 
  | 'Amazon EC2' 
  | 'Amazon RDS' 
  | 'Amazon S3' 
  | 'Amazon EKS' 
  | 'AWS Lambda' 
  | 'Amazon CloudFront' 
  | 'Amazon DynamoDB'
  | 'Other AWS Services';

export type RecommendationStatus = 'New' | 'Reviewed' | 'Resolved';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface ServiceSpendItem {
  service: ServiceName;
  amount: number;
  percentage: number;
  previousAmount: number;
  changePercentage: number;
  resourceCount: number;
  color: string;
}

export interface DailySpendPoint {
  date: string;
  dayNumber: number;
  amount: number;
  ec2: number;
  rds: number;
  s3: number;
  other: number;
  isAnomaly?: boolean;
  anomalyReason?: string;
}

export interface MonthlyTrendPoint {
  month: string;
  total: number;
  compute: number;
  database: number;
  storage: number;
  networking: number;
  forecast?: boolean;
}

export interface OptimizationRecommendation {
  id: string;
  title: string;
  service: ServiceName;
  resourceId: string;
  region: string;
  category: 'Idle Compute' | 'Unattached Storage' | 'Oversized Resource' | 'Lifecycle Policy' | 'Architectural Shift';
  detectedIssue: string;
  reason: string;
  estimatedMonthlySavings: number;
  confidence: ConfidenceLevel;
  risk: RiskLevel;
  riskConsideration: string;
  recommendedAction: string;
  actionCliSnippet?: string;
  status: RecommendationStatus;
  detectedAt: string;
}

export interface Budget {
  id: string;
  name: string;
  scope: string;
  limitAmount: number;
  currentSpend: number;
  forecastAmount: number;
  warningThresholds: number[]; // e.g. [50, 80, 100]
  alertRecipients: string[];
  createdAt: string;
  status: 'nominal' | 'warning' | 'breached';
}

export interface BudgetItemAlert {
  id: string;
  budgetName: string;
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  currentPercent: number;
  isSimulated: boolean;
}

export interface BillingSummary {
  totalSpend: number;
  previousPeriodSpend: number;
  changePercentage: number;
  potentialSavings: number;
  savingsPercentage: number;
  monthlyBudget: number;
  budgetUtilizedPercent: number;
  forecastedSpend: number;
  daysRemaining: number;
  unresolvedRecommendationsCount: number;
}

export interface AWSConnectionConfig {
  isConnected: boolean;
  authMethod: 'role' | 'keys' | 'demo';
  roleArn?: string;
  externalId?: string;
  aipKey?: string;
  region?: string;
  accountIdMasked?: string;
  lastSyncTimestamp?: string;
  dataSourceLabel: 'Demo Sample Data' | 'Connected AWS Account';
}

export interface AdvisorChatMessage {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  timestamp: string;
  reasoning?: string;
  estimatedSavingsRange?: string;
  confidence?: ConfidenceLevel;
  suggestedNextSteps?: string[];
  relatedResources?: string[];
  modelSource?: 'CloudSage AI Engine' | 'Rule-based Cost Engine';
}
