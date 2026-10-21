import React from 'react';
import { Cloud, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { enterDemoMode, setShowTermsModal } = useApp();

  return (
    <footer className="bg-white border-t border-[#E5E7EB] py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white shadow-xs">
            <Cloud className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900">CloudSage AI</span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                Free Demo Mode
              </span>
            </div>
            <div className="text-xs text-neutral-500 mt-0.5 flex items-center gap-1">
              <span>Crafted with passion by</span>
              <span className="font-semibold text-neutral-900">Mohammed Aatif Shariff</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs text-neutral-600">
          <button 
            onClick={() => enterDemoMode()} 
            className="hover:text-neutral-900 font-medium transition-colors"
          >
            Demo Environment
          </button>
          <a href="#features" className="hover:text-neutral-900 transition-colors">Features</a>
          <a href="#security" className="hover:text-neutral-900 transition-colors">Security Architecture</a>
          <button
            onClick={() => setShowTermsModal(true)}
            className="hover:text-neutral-900 transition-colors"
          >
            Data Usage & Terms
          </button>
          <a 
            href="https://aws.amazon.com/aws-cost-management/aws-cost-explorer/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-neutral-900 transition-colors"
          >
            AWS Cost Explorer Docs
          </a>
        </div>

        <div className="text-xs text-neutral-600 font-medium">
          Crafted with passion by <span className="text-neutral-900 font-semibold">Mohammed Aatif Shariff</span> · © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};
