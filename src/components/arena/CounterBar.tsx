/**
 * ResearchLens AI - Live Metric Counter Bar
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * Displays live counts with semantic status colors and tabular numerals.
 */
import React from 'react';
import { 
  Globe, 
  FileText, 
  Database, 
  Tag, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Percent
} from 'lucide-react';
import { ResearchState } from '../../types/research';
import { computeCanonicalMetrics } from '../../utils/statusHelpers';

interface CounterBarProps {
  state: ResearchState;
}

export function CounterBar({ state }: CounterBarProps) {
  const sourcesCount = state.sources.length;
  const pagesScraped = state.sources.filter(s => s.scrapedSuccessfully).length;
  const entitiesCount = state.entities.length;
  const claimsCount = state.claims.length;
  const conflictsCount = state.conflicts.length;
  const metrics = computeCanonicalMetrics(state.entities);

  const items = [
    { label: 'SOURCES', val: sourcesCount, icon: <Globe className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: 'PAGES SCRAPED', val: pagesScraped, icon: <FileText className="w-3.5 h-3.5 text-indigo-400" /> },
    { label: 'ENTITIES', val: entitiesCount, icon: <Database className="w-3.5 h-3.5 text-purple-400" /> },
    { label: 'CLAIMS', val: claimsCount, icon: <Tag className="w-3.5 h-3.5 text-blue-400" /> },
    { label: 'VERIFIED', val: metrics.verifiedCount, icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />, tone: 'text-emerald-400' },
    { label: 'CONFLICTS', val: conflictsCount, icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />, tone: conflictsCount > 0 ? 'text-rose-400' : 'text-neutral-400' },
    { label: 'INSUFFICIENT', val: metrics.insufficientCount, icon: <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> },
    { label: 'COVERAGE', val: `${metrics.evidenceCoverage}%`, icon: <Percent className="w-3.5 h-3.5 text-cyan-400" /> },
  ];

  return (
    <div className="w-full bg-neutral-900/60 backdrop-blur-md rounded-xl border border-neutral-800/80 px-4 py-2.5 flex items-center justify-between gap-3 overflow-x-auto">
      {items.map((it, idx) => (
        <div key={idx} className="flex items-center gap-2 shrink-0">
          <div className="p-1 rounded bg-neutral-800/60">
            {it.icon}
          </div>
          <div>
            <div className="text-[9px] font-mono tracking-wider text-neutral-400 uppercase">{it.label}</div>
            <div className={`text-xs font-mono font-semibold tabular-nums ${it.tone || 'text-neutral-100'}`}>
              {it.val}
            </div>
          </div>
          {idx < items.length - 1 && (
            <div className="h-5 w-px bg-neutral-800 mx-2" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  );
}
