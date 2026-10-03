/**
 * ResearchLens AI - Research Timeline Panel
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * Chronological view of all execution events, duration intervals, and agent actions.
 */
import React from 'react';
import { Clock, Search, ShieldCheck, Scale, Compass, LayoutDashboard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ResearchEvent } from '../../types/research';

interface ResearchTimelineProps {
  events: ResearchEvent[];
  onSelectEvent: (event: ResearchEvent) => void;
}

export function ResearchTimeline({ events, onSelectEvent }: ResearchTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const startTime = sortedEvents[0] ? new Date(sortedEvents[0].timestamp).getTime() : 0;

  const getDeltaMs = (ts: string) => {
    if (!startTime) return '+0.0s';
    const delta = (new Date(ts).getTime() - startTime) / 1000;
    return `+${delta.toFixed(1)}s`;
  };

  return (
    <div className="space-y-4 pb-12 max-w-4xl mx-auto">
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md">
        <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>Autonomous Research Execution Timeline</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Chronological event audit with precise timestamp deltas and multi-agent coordination intervals.
        </p>
      </div>

      <div className="relative pl-6 border-l-2 border-neutral-800 space-y-4 font-mono text-xs">
        {sortedEvents.map((evt, idx) => (
          <div 
            key={evt.id} 
            onClick={() => onSelectEvent(evt)}
            className="relative group cursor-pointer"
          >
            {/* Timeline bullet */}
            <div className={`absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 ${
              evt.type.includes('conflict') ? 'bg-rose-950 border-rose-500' :
              evt.type.includes('arbiter') ? 'bg-amber-950 border-amber-400' :
              evt.agent === 'explorer' ? 'bg-cyan-950 border-cyan-400' :
              evt.agent === 'investigator' ? 'bg-indigo-950 border-indigo-400' :
              'bg-neutral-900 border-neutral-600'
            }`} />

            <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-colors">
              <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
                <span className="font-semibold text-neutral-300 uppercase">{evt.agent || 'SYSTEM'} · {evt.type}</span>
                <div className="flex items-center gap-2">
                  <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  <span className="text-cyan-400 font-semibold">{getDeltaMs(evt.timestamp)}</span>
                </div>
              </div>
              <div className="text-neutral-200 text-xs font-sans">
                {evt.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
