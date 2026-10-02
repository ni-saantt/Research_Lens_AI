/**
 * ResearchLens AI - Left Navigation & Session Sidebar
 * Multi-Agent Research & Evidence Intelligence Platform
 * Developer: Nishant Choudhary
 */
import React from 'react';
import { 
  Plus, 
  Cpu, 
  Globe, 
  Clock, 
  ShieldCheck, 
  Zap,
  BookOpen,
  UserCheck
} from 'lucide-react';
import { SystemStatus } from '../../types/research';

interface SidebarProps {
  onNewResearch: () => void;
  onSelectPrompt: (prompt: string) => void;
  systemStatus: SystemStatus | null;
  activeSessionId: string;
  recentSessions: Array<{ id: string; query: string; timestamp: string }>;
  onSelectSession: (id: string) => void;
}

const EXAMPLE_PROMPTS = [
  {
    title: 'Rajasthan EV Charging Grid',
    query: 'Find EV charging companies operating in Rajasthan, compare cities served, charger types, tariff pricing and official contact information, verify important claims and flag contradictions',
    tag: 'CleanTech & Policy',
  },
  {
    title: 'AI Coding Tools 2026 Benchmark',
    query: 'Compare autonomous AI coding tools launched in 2026, verify monthly pricing, context windows, and supported models',
    tag: 'NLP & AI Systems',
  },
  {
    title: 'National AI Education Initiatives',
    query: 'Investigate recent Indian government AI education initiatives and compare their official objectives, allocated budget, and launch dates',
    tag: 'Public Policy',
  }
];

export function Sidebar({
  onNewResearch,
  onSelectPrompt,
  systemStatus,
  activeSessionId,
  recentSessions,
  onSelectSession,
}: SidebarProps) {
  return (
    <aside className="w-72 h-full bg-neutral-950/95 border-r border-neutral-800/80 flex flex-col justify-between p-4 shrink-0 font-sans select-none overflow-y-auto">
      <div className="space-y-6">
        {/* Brand Lockup */}
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-neutral-100 tracking-tight leading-tight">
                ResearchLens AI
              </h1>
              <p className="text-[10px] text-cyan-400 font-mono tracking-tight">
                Evidence Intelligence Platform
              </p>
            </div>
          </div>
          <div className="pt-1.5 flex items-center gap-1.5 text-[11px] text-neutral-400 font-mono">
            <UserCheck className="w-3 h-3 text-cyan-400 shrink-0" />
            <span>Developer: <span className="text-neutral-200 font-sans font-medium">Nishant Choudhary</span></span>
          </div>
        </div>

        {/* Action: + New Research */}
        <button
          onClick={onNewResearch}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition-all duration-150 cursor-pointer group"
        >
          <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90 duration-200" />
          <span>New Research</span>
        </button>

        {/* Example Inquiries */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-1 flex items-center gap-1.5">
            <BookOpen className="w-3 h-3 text-neutral-500" />
            <span>Benchmark Queries</span>
          </div>
          <div className="space-y-1.5">
            {EXAMPLE_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPrompt(item.query)}
                className="w-full text-left p-2.5 rounded-lg bg-neutral-900/60 hover:bg-neutral-800/70 border border-neutral-800/60 hover:border-neutral-700 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-0.5">
                  <span className="truncate font-semibold">{item.title}</span>
                  <span className="text-[9px] text-neutral-500">{item.tag}</span>
                </div>
                <p className="text-[11px] text-neutral-400 group-hover:text-neutral-200 line-clamp-2 leading-relaxed">
                  {item.query}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Active In-Memory Sessions */}
        {recentSessions.length > 0 && (
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-1">
              Active Sessions ({recentSessions.length})
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
              {recentSessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectSession(s.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs truncate transition-colors flex items-center gap-2 ${
                    s.id === activeSessionId
                      ? 'bg-neutral-800 text-cyan-300 font-medium'
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                  }`}
                >
                  <Clock className="w-3 h-3 shrink-0" />
                  <span className="truncate">{s.query}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* System Infrastructure Footer */}
      <div className="pt-4 border-t border-neutral-800/80 space-y-2.5 text-xs">
        <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-1">
          NLP & Inference Status
        </div>
        
        <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800/80 space-y-2 text-[11px] font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>Groq API</span>
            </div>
            <span className={`text-[10px] font-semibold ${systemStatus?.groqConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
              {systemStatus?.groqConfigured ? 'Active (Live)' : 'Showcase Mode'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Globe className="w-3 h-3 text-indigo-400" />
              <span>Web Search</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">Online</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Zap className="w-3 h-3 text-purple-400" />
              <span>Cheerio Scraper</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">Ready</span>
          </div>
        </div>

        <div className="text-[10px] text-neutral-400 font-mono text-center pt-1">
          ResearchLens AI • Multi-Agent Platform
        </div>
      </div>
    </aside>
  );
}
