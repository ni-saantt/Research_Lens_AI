/**
 * ResearchLens AI - Top Navigation Bar
 * Multi-Agent Research & Evidence Intelligence Platform
 * Developer: Nishant Choudhary
 */
import React from 'react';
import { 
  Network, 
  LayoutDashboard, 
  Activity, 
  Scale, 
  Globe,
  Download,
  ShieldCheck,
  Workflow,
  Sparkles,
  GitCompare,
  FileCheck
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'graph' | 'pipeline' | 'compare' | 'sources' | 'provenance' | 'feed';

interface TopBarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  isDemoMode: boolean;
  hasResults: boolean;
  onExportCsv?: () => void;
}

export function TopBar({ activeTab, onChangeTab, isDemoMode, hasResults, onExportCsv }: TopBarProps) {
  return (
    <header className="h-14 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 select-none z-20">
      {/* Zone 1: Wordmark / Breadcrumb / Developer attribution */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-neutral-100">
                ResearchLens AI
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                v1.0
              </span>
            </div>
          </div>
        </div>

        <span className="text-neutral-700 hidden md:inline">/</span>

        <span className="text-xs text-neutral-400 font-mono hidden md:inline">
          {activeTab === 'dashboard' && 'Evidence Intelligence Dashboard'}
          {activeTab === 'graph' && 'Multi-Agent Arena Graph'}
          {activeTab === 'pipeline' && 'Intelligence Pipeline & NLP Engine'}
          {activeTab === 'compare' && 'Adversarial Agent Reconciliation'}
          {activeTab === 'sources' && 'Web Crawl & Source Authority Index'}
          {activeTab === 'provenance' && 'Evidentiary Chain-of-Custody'}
          {activeTab === 'feed' && 'Live Agent Event Feed'}
        </span>
      </div>

      {/* Zone 2: Navigation Tabs */}
      <nav className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-lg border border-neutral-800/80">
        <button
          onClick={() => onChangeTab('dashboard')}
          disabled={!hasResults}
          title={!hasResults ? 'Run a research query to view dashboard' : 'View research dashboard'}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'dashboard' 
              ? 'bg-neutral-800 text-cyan-300 shadow-sm' 
              : hasResults ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 cursor-not-allowed'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => onChangeTab('graph')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'graph' 
              ? 'bg-neutral-800 text-cyan-300 shadow-sm' 
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Arena Graph</span>
        </button>

        <button
          onClick={() => onChangeTab('pipeline')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'pipeline' 
              ? 'bg-neutral-800 text-indigo-300 shadow-sm' 
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Workflow className="w-3.5 h-3.5" />
          <span>Intelligence Pipeline</span>
        </button>

        <button
          onClick={() => onChangeTab('compare')}
          disabled={!hasResults}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'compare' 
              ? 'bg-neutral-800 text-cyan-300 shadow-sm' 
              : hasResults ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 cursor-not-allowed'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Compare Agents</span>
        </button>

        <button
          onClick={() => onChangeTab('sources')}
          disabled={!hasResults}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'sources' 
              ? 'bg-neutral-800 text-cyan-300 shadow-sm' 
              : hasResults ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 cursor-not-allowed'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Sources</span>
        </button>

        <button
          onClick={() => onChangeTab('provenance')}
          disabled={!hasResults}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'provenance' 
              ? 'bg-neutral-800 text-cyan-300 shadow-sm' 
              : hasResults ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 cursor-not-allowed'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span>Provenance</span>
        </button>

        <button
          onClick={() => onChangeTab('feed')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'feed' 
              ? 'bg-neutral-800 text-cyan-300 shadow-sm' 
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Events</span>
        </button>
      </nav>

      {/* Zone 3: Mode Status & Export */}
      <div className="flex items-center gap-2.5">
        <div className="hidden lg:flex items-center gap-1 text-[11px] text-neutral-400 font-sans border-r border-neutral-800 pr-3 mr-1">
          <span>By</span>
          <span className="text-neutral-200 font-medium">Nishant Choudhary</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-mono">
          <div className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse`} />
          <span className={isDemoMode ? 'text-amber-300 font-semibold' : 'text-emerald-300 font-semibold'}>
            {isDemoMode ? 'DEMO / SHOWCASE' : 'LIVE GROQ LLM'}
          </span>
        </div>

        {hasResults && onExportCsv && (
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="whitespace-nowrap hidden sm:inline">Export CSV</span>
          </button>
        )}
      </div>
    </header>
  );
}
