import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BrainCircuit,
  SlidersHorizontal,
  Target,
  TrendingUp,
  Settings,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Layers,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, recommendations, awsConfig } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const activeRecommendationsCount = recommendations.filter(r => r.status !== 'Resolved').length;

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Cost Analytics',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'advisor' as const,
      label: 'CloudSage Advisor',
      icon: BrainCircuit,
      badge: 'AI'
    },
    {
      id: 'recommendations' as const,
      label: 'Optimization Center',
      icon: SlidersHorizontal,
      badge: activeRecommendationsCount > 0 ? activeRecommendationsCount.toString() : null
    },
    {
      id: 'budgets' as const,
      label: 'Budget Guardrails',
      icon: Target,
      badge: null
    },
    {
      id: 'forecasting' as const,
      label: 'Cost Forecasting',
      icon: TrendingUp,
      badge: null
    },
    {
      id: 'settings' as const,
      label: 'AWS & Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside
      className={`bg-[#171717] text-neutral-300 flex flex-col justify-between transition-all duration-200 z-20 shrink-0 border-r border-neutral-800 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top: Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-800">
          <div 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shrink-0">
              <Cloud className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="whitespace-nowrap">
                <span className="font-bold text-white text-base tracking-tight">CloudSage</span>
                <span className="text-[#2563EB] font-bold ml-1 text-base">AI</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EAF4FC] text-[#2563EB] shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#2563EB]' : 'text-neutral-400'}`} />
                {!collapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold tabular-nums shrink-0 ${
                      isActive
                        ? 'bg-[#2563EB] text-white'
                        : item.badge === 'AI'
                        ? 'bg-neutral-800 text-[#2563EB] border border-neutral-700'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: AWS Context Strip */}
      <div className="p-3 border-t border-neutral-800">
        {!collapsed ? (
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
              <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                <span className="font-medium text-neutral-300">Environment</span>
                <span className="text-emerald-400 font-mono text-[10px]">Active</span>
              </div>
              <div className="text-white font-medium truncate text-[11px]">
                {awsConfig.isConnected ? 'AWS Production Role' : 'Demo Simulator'}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-0.5 truncate">
                Zero API Key · Demo Mode
              </div>
            </div>

            <div className="px-1 text-[10px] text-neutral-500 font-medium">
              Crafted with passion by <span className="text-neutral-400">Mohammed Aatif Shariff</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2" title="Crafted by Mohammed Aatif Shariff">
            <div className="w-8 h-8 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
