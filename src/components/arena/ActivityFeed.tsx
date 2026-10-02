/**
 * ResearchLens AI - Live Agent Activity Feed
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * Displays chronological execution events with role badges and timestamps.
 */
import React, { useRef, useEffect } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Scale, 
  Compass, 
  LayoutDashboard, 
  AlertCircle, 
  ExternalLink,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { ResearchEvent, AgentRole } from '../../types/research';

interface ActivityFeedProps {
  events: ResearchEvent[];
  onSelectEvent?: (event: ResearchEvent) => void;
}

export function ActivityFeed({ events, onSelectEvent }: ActivityFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events]);

  const getAgentBadge = (agent?: AgentRole) => {
    switch (agent) {
      case 'explorer':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-1.5 py-0.5 rounded">
            <Search className="w-2.5 h-2.5" /> Explorer
          </span>
        );
      case 'investigator':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-indigo-400 bg-indigo-950/70 border border-indigo-800/50 px-1.5 py-0.5 rounded">
            <ShieldCheck className="w-2.5 h-2.5" /> Investigator
          </span>
        );
      case 'arbiter':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-950/70 border border-amber-800/50 px-1.5 py-0.5 rounded">
            <Scale className="w-2.5 h-2.5" /> Arbiter Judge
          </span>
        );
      case 'planner':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-neutral-300 bg-neutral-800 px-1.5 py-0.5 rounded">
            <Compass className="w-2.5 h-2.5" /> Planner
          </span>
        );
      case 'visualizer':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-1.5 py-0.5 rounded">
            <LayoutDashboard className="w-2.5 h-2.5" /> Visualizer
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
            System
          </span>
        );
    }
  };

  const getEventIcon = (type: string) => {
    if (type.includes('conflict')) return <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />;
    if (type.includes('escalat')) return <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    if (type.includes('completed') || type.includes('decision')) return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    if (type.includes('search')) return <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
    return <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 shrink-0" />;
  };

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950/80 rounded-xl border border-neutral-800/80 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-neutral-800/80 flex items-center justify-between bg-neutral-900/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-neutral-200">Autonomous Agent Feed</span>
        </div>
        <span className="text-[11px] font-mono text-neutral-500">{events.length} events logged</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 font-mono text-xs">
        {events.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-neutral-500 text-xs text-center px-4 font-sans">
            Ready to initiate autonomous intelligence investigation. Enter research topic to dispatch agents.
          </div>
        ) : (
          events.map((evt) => (
            <div
              key={evt.id}
              onClick={() => onSelectEvent?.(evt)}
              className="group p-2 rounded-lg bg-neutral-900/40 hover:bg-neutral-800/60 border border-neutral-800/40 hover:border-neutral-700/60 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2 mb-1 text-[10px]">
                <div className="flex items-center gap-1.5">
                  {getAgentBadge(evt.agent)}
                </div>
                <span className="text-neutral-500">{formatTime(evt.timestamp)}</span>
              </div>
              <div className="flex items-start gap-2 text-neutral-300 group-hover:text-neutral-100 text-[11px] leading-relaxed">
                {getEventIcon(evt.type)}
                <span className="flex-1">{evt.message}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
