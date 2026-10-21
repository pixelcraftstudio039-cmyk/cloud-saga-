import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Cloud, 
  Bell, 
  Search, 
  User, 
  LogOut, 
  ExternalLink, 
  ChevronDown,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    isAuthenticated, 
    setShowAuthModal, 
    setShowAwsConnectModal, 
    awsConfig, 
    alerts, 
    user, 
    signOut,
    enterDemoMode,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  // If on Landing page, render the 3-zone Top Bar Contract
  if (activeTab === 'landing' && !isAuthenticated) {
    return (
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
          {/* Zone 1: Brand title wordmark */}
          <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-sm">
              <Cloud className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#171717]">
              CloudSage <span className="text-[#2563EB]">AI</span>
            </span>
          </div>

          {/* Zone 2: Nav links, 1-2 word labels, single line */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
            <a href="#features" className="hover:text-[#171717] transition-colors whitespace-nowrap shrink-0">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#171717] transition-colors whitespace-nowrap shrink-0">
              How It Works
            </a>
            <a href="#security" className="hover:text-[#171717] transition-colors whitespace-nowrap shrink-0">
              Security
            </a>
            <a href="#architecture" className="hover:text-[#171717] transition-colors whitespace-nowrap shrink-0">
              Architecture
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                enterDemoMode();
              }}
              className="px-4 py-2 text-sm font-bold text-white bg-[#2563EB] rounded-lg hover:bg-[#1D4ED8] transition-all shadow-sm whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span>⚡</span>
              <span>Launch Live Demo</span>
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-sm font-medium text-neutral-600 hover:text-[#171717] px-2 py-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Inside authenticated or exploratory dashboard view
  const getBreadcrumb = () => {
    switch (activeTab) {
      case 'dashboard': return 'Cost Analytics';
      case 'advisor': return 'CloudSage Advisor';
      case 'recommendations': return 'Optimization Center';
      case 'budgets': return 'Budget Guardrails';
      case 'forecasting': return 'Cost Forecasting';
      case 'settings': return 'Settings & AWS Connection';
      default: return 'Overview';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6">
      {/* Left: Breadcrumbs & Data Source Tag */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <button 
            onClick={() => setActiveTab('landing')}
            className="hover:text-neutral-900 transition-colors font-medium"
          >
            CloudSage AI
          </button>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-semibold">{getBreadcrumb()}</span>
        </div>

        {/* Data Source Unboxed Marker */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-neutral-500 pl-4 border-l border-[#E5E7EB]">
          <span className="font-medium text-neutral-700">Source:</span>
          <span>{awsConfig.dataSourceLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{awsConfig.region || 'us-east-1'}</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
            Zero API Key Demo
          </span>
          <button
            onClick={() => setShowAwsConnectModal(true)}
            className="text-xs text-[#2563EB] hover:underline font-medium ml-1"
          >
            {awsConfig.isConnected ? 'Configure' : 'AWS Settings'}
          </button>
        </div>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Quick Search */}
        <div className="relative hidden sm:block w-64">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search resources, services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5F7FA] border border-[#E5E7EB] rounded-lg focus:outline-none focus:border-[#2563EB] transition-colors text-neutral-900 placeholder:text-neutral-400"
          />
        </div>

        {/* Alert Notifications Drawer Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
            className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-[#F5F7FA] rounded-lg transition-colors"
            title="System alerts"
          >
            <Bell className="w-4 h-4" />
            {alerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#DC2626] rounded-full"></span>
            )}
          </button>

          {showAlertsDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5E7EB]">
                <span className="text-xs font-semibold text-neutral-900">Active Cost Alerts</span>
                <span className="text-[11px] text-neutral-500">{alerts.length} alerts</span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {alerts.map((alt) => (
                  <div key={alt.id} className="p-2 rounded-lg bg-[#F5F7FA] text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-900 font-medium mb-1">
                      {alt.severity === 'critical' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                      )}
                      <span className="truncate">{alt.budgetName}</span>
                    </div>
                    <p className="text-neutral-600 text-[11px] leading-relaxed line-clamp-2">{alt.message}</p>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-400">
                      <span>Simulated Telemetry</span>
                      <span aria-hidden="true">·</span>
                      <span>Demo Mode</span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setShowAlertsDropdown(false);
                  setActiveTab('budgets');
                }}
                className="w-full mt-2 text-center text-xs font-medium text-[#2563EB] hover:underline pt-2 border-t border-[#E5E7EB]"
              >
                Manage All Budgets & Alerts →
              </button>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-[#F5F7FA] transition-colors"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover border border-[#E5E7EB]"
              onError={(e) => {
                // Fallback avatar if load issue
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-neutral-900 leading-none">{user.name}</div>
              <div className="text-[10px] text-neutral-500 leading-none mt-1">Acme Cloud Platform</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5E7EB] rounded-xl shadow-lg p-2 z-50">
              <div className="px-3 py-2 border-b border-[#E5E7EB] mb-1">
                <p className="text-xs font-semibold text-neutral-900">{user.name}</p>
                <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                <p className="text-[10px] text-[#2563EB] font-medium mt-1">{user.role}</p>
                <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                  Mode: 100% Free Demo (Zero API Key)
                </p>
              </div>

              <div className="px-3 py-1.5 text-[11px] text-neutral-700 bg-[#F5F7FA] rounded-md mb-1 font-medium">
                Crafted with passion by Mohammed Aatif Shariff
              </div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setActiveTab('settings');
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-[#F5F7FA] rounded-md transition-colors flex items-center justify-between"
              >
                <span>AWS & Settings</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowAwsConnectModal(true);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-neutral-700 hover:bg-[#F5F7FA] rounded-md transition-colors"
              >
                Connect Real AWS Account
              </button>

              <div className="border-t border-[#E5E7EB] my-1"></div>

              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  signOut();
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-[#DC2626] hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
