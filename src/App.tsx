/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { AIAdvisor } from './components/AIAdvisor';
import { OptimizationCenter } from './components/OptimizationCenter';
import { BudgetMonitoring } from './components/BudgetMonitoring';
import { CostForecasting } from './components/CostForecasting';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';
import { AwsConnectModal } from './components/AwsConnectModal';
import { TermsModal } from './components/TermsModal';

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated } = useApp();

  // If on landing page without entering workspace
  if (activeTab === 'landing' && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <LandingPage />
        <AuthModal />
        <AwsConnectModal />
        <TermsModal />
      </div>
    );
  }

  // Workspace Layout with Near-Black Sidebar & White Canvas
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto bg-[#FFFFFF]">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'advisor' && <AIAdvisor />}
          {activeTab === 'recommendations' && <OptimizationCenter />}
          {activeTab === 'budgets' && <BudgetMonitoring />}
          {activeTab === 'forecasting' && <CostForecasting />}
          {activeTab === 'settings' && <SettingsView />}
          {activeTab === 'landing' && <LandingPage />}
        </main>
      </div>

      {/* Modals */}
      <AuthModal />
      <AwsConnectModal />
      <TermsModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
