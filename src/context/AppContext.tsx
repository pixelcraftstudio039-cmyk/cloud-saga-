import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  BillingSummary,
  ServiceSpendItem,
  DailySpendPoint,
  MonthlyTrendPoint,
  OptimizationRecommendation,
  Budget,
  BudgetItemAlert,
  AWSConnectionConfig,
  RecommendationStatus
} from '../types';
import {
  initialBillingSummary,
  initialServicesSpend,
  initialMonthlyTrend,
  initialDailySpend,
  initialRecommendations,
  initialBudgets,
  initialAlerts,
  initialAwsConfig
} from '../data/mockData';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  company: string;
  avatarUrl: string;
  authProvider?: 'Google' | 'Email' | 'Demo';
  googleId?: string;
}

interface AppContextType {
  // Navigation
  activeTab: 'landing' | 'dashboard' | 'advisor' | 'recommendations' | 'budgets' | 'forecasting' | 'settings';
  setActiveTab: (tab: 'landing' | 'dashboard' | 'advisor' | 'recommendations' | 'budgets' | 'forecasting' | 'settings') => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (val: boolean) => void;
  showAwsConnectModal: boolean;
  setShowAwsConnectModal: (val: boolean) => void;
  showTermsModal: boolean;
  setShowTermsModal: (val: boolean) => void;
  user: UserProfile;

  // Filters
  dateRange: 'last7' | 'last30' | 'mtd' | 'prevMonth' | 'q3';
  setDateRange: (range: 'last7' | 'last30' | 'mtd' | 'prevMonth' | 'q3') => void;
  selectedService: string;
  setSelectedService: (svc: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data
  summary: BillingSummary;
  services: ServiceSpendItem[];
  monthlyTrend: MonthlyTrendPoint[];
  dailySpend: DailySpendPoint[];
  recommendations: OptimizationRecommendation[];
  budgets: Budget[];
  alerts: BudgetItemAlert[];
  awsConfig: AWSConnectionConfig;
  isLoading: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  clearError: () => void;

  // Actions
  updateRecommendationStatus: (id: string, status: RecommendationStatus) => Promise<void>;
  createBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'status' | 'currentSpend' | 'forecastAmount'>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  connectAwsRole: (roleArn: string, externalId: string, region: string) => Promise<{ success: boolean; reason?: string }>;
  disconnectAws: () => Promise<void>;
  refreshData: () => Promise<void>;
  signOut: () => Promise<void>;
  enterDemoMode: () => void;
  signInWithGoogle: () => void;
}

const defaultUser: UserProfile = {
  name: 'Demo User',
  email: 'demo@cloudsage.app',
  role: 'Lead Cloud Architect & FinOps Director',
  company: 'Acme Cloud Platform',
  avatarUrl: '/src/assets/images/avatar_sarah_finops_1792555061850.jpg',
  authProvider: 'Demo'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<'landing' | 'dashboard' | 'advisor' | 'recommendations' | 'budgets' | 'forecasting' | 'settings'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showAwsConnectModal, setShowAwsConnectModal] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [dateRange, setDateRange] = useState<'last7' | 'last30' | 'mtd' | 'prevMonth' | 'q3'>('mtd');
  const [selectedService, setSelectedService] = useState<string>('All Services');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data state
  const [summary, setSummary] = useState<BillingSummary>(initialBillingSummary);
  const [services, setServices] = useState<ServiceSpendItem[]>(initialServicesSpend);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrendPoint[]>(initialMonthlyTrend);
  const [dailySpend, setDailySpend] = useState<DailySpendPoint[]>(initialDailySpend);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>(initialRecommendations);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [alerts, setAlerts] = useState<BudgetItemAlert[]>(initialAlerts);
  const [awsConfig, setAwsConfig] = useState<AWSConnectionConfig>(initialAwsConfig);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clearError = () => setError(null);

  // On app load, check if user is already authenticated via session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
            setShowAuthModal(false);
            setActiveTab('dashboard');
          }
        }
      } catch {
        // Not authenticated, stay on landing page
      }
    };
    checkAuth();
  }, []);

  // Fetch summary and session data from backend
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/billing/summary');
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary);
        setServices(data.services);
        setMonthlyTrend(data.monthlyTrend);
        setDailySpend(data.dailySpend);
        setRecommendations(data.recommendations);
        setBudgets(data.budgets);
        setAlerts(data.alerts);
        setAwsConfig(data.awsConfig);
        setError(null);
      } else {
        setError(`Failed to retrieve billing summary: HTTP ${res.status}`);
      }
    } catch (err: any) {
      setError(`Unable to connect to CloudSage backend: ${err?.message || 'Network error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const updateRecommendationStatus = async (id: string, status: RecommendationStatus) => {
    // Optimistic update
    setRecommendations(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );

    // Recalculate summary locally
    const updated = recommendations.map(r => (r.id === id ? { ...r, status } : r));
    const active = updated.filter(r => r.status !== 'Resolved');
    const savings = active.reduce((acc, r) => acc + r.estimatedMonthlySavings, 0);

    setSummary(prev => ({
      ...prev,
      potentialSavings: parseFloat(savings.toFixed(2)),
      savingsPercentage: prev.totalSpend > 0 ? parseFloat(((savings / prev.totalSpend) * 100).toFixed(1)) : 0,
      unresolvedRecommendationsCount: active.length
    }));

    try {
      const res = await fetch(`/api/recommendations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        setError(`Failed to update recommendation status (HTTP ${res.status})`);
      }
    } catch (err: any) {
      setError(`Network error updating recommendation: ${err?.message || 'Check connection'}`);
    }
  };

  const createBudget = async (budgetInput: Omit<Budget, 'id' | 'createdAt' | 'status' | 'currentSpend' | 'forecastAmount'>) => {
    const newBudget: Budget = {
      id: `budget-${Date.now()}`,
      name: budgetInput.name,
      scope: budgetInput.scope,
      limitAmount: budgetInput.limitAmount,
      currentSpend: 0,
      forecastAmount: budgetInput.limitAmount * 0.85,
      warningThresholds: budgetInput.warningThresholds,
      alertRecipients: budgetInput.alertRecipients,
      createdAt: new Date().toISOString(),
      status: 'nominal'
    };

    setBudgets(prev => [newBudget, ...prev]);

    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetInput)
      });
      if (!res.ok) {
        setError(`Failed to create budget (HTTP ${res.status})`);
      }
    } catch (err: any) {
      setError(`Network error creating budget: ${err?.message || 'Check connection'}`);
    }
  };

  const deleteBudget = async (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        setError(`Failed to delete budget (HTTP ${res.status})`);
      }
    } catch (err: any) {
      setError(`Network error deleting budget: ${err?.message || 'Check connection'}`);
    }
  };

  const connectAwsRole = async (
    roleArn: string,
    externalId: string,
    region: string
  ): Promise<{ success: boolean; reason?: string }> => {
    try {
      const res = await fetch('/api/aws/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authMethod: 'role', roleArn, externalId, region })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAwsConfig(data.config);
        await refreshData();
        return { success: true };
      } else {
        return {
          success: false,
          reason: data.reason || data.error || 'Failed to authenticate AWS IAM role'
        };
      }
    } catch (err: any) {
      return {
        success: false,
        reason: err?.message || 'Network error connecting to AWS Cost Explorer'
      };
    }
  };

  const disconnectAws = async () => {
    try {
      await fetch('/api/aws/disconnect', { method: 'POST' });
    } catch {
      // ignore
    }
    setAwsConfig({
      ...initialAwsConfig,
      isConnected: false,
      dataSourceLabel: 'Demo Sample Data'
    });
    await refreshData();
  };

  const signInWithGoogle = () => {
    window.location.href = '/auth/google';
  };

  const enterDemoMode = () => {
    setIsAuthenticated(true);
    setUser(defaultUser);
    setShowAuthModal(false);
    setActiveTab('dashboard');
  };

  const signOut = async () => {
    try {
      await fetch('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setUser(defaultUser);
    try {
      localStorage.removeItem('cloudsage_google_user');
    } catch {}
    setActiveTab('landing');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isAuthenticated,
        setIsAuthenticated,
        showAuthModal,
        setShowAuthModal,
        showAwsConnectModal,
        setShowAwsConnectModal,
        showTermsModal,
        setShowTermsModal,
        user,
        dateRange,
        setDateRange,
        selectedService,
        setSelectedService,
        searchQuery,
        setSearchQuery,
        summary,
        services,
        monthlyTrend,
        dailySpend,
        recommendations,
        budgets,
        alerts,
        awsConfig,
        isLoading,
        error,
        setError,
        clearError,
        updateRecommendationStatus,
        createBudget,
        deleteBudget,
        connectAwsRole,
        disconnectAws,
        refreshData,
        signOut,
        enterDemoMode,
        signInWithGoogle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
