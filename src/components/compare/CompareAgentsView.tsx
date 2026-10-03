/**
 * ResearchLens AI - "Compare Agents" Side-by-Side View
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * Visual comparison of Explorer discoveries vs Investigator findings with diff highlighting
 * and Arbiter adjudication details.
 */
import React, { useState } from 'react';
import { 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react';
import { ResearchState } from '../../types/research';

interface CompareAgentsViewProps {
  state: ResearchState;
  onSelectConflict: (conflict: any) => void;
}

export function CompareAgentsView({ state, onSelectConflict }: CompareAgentsViewProps) {
  const [filterConflictStatus, setFilterConflictStatus] = useState<'ALL' | 'RESOLVED' | 'UNRESOLVED'>('ALL');
  
  const explorerClaims = state.claims.filter(c => c.discoveredBy === 'explorer');
  const investigatorClaims = state.claims.filter(c => c.discoveredBy === 'investigator');

  const filteredConflicts = state.conflicts.filter(c => {
    if (filterConflictStatus === 'RESOLVED') return c.resolutionStatus === 'RESOLVED';
    if (filterConflictStatus === 'UNRESOLVED') return c.resolutionStatus === 'UNRESOLVED';
    return true;
  });

  return (
    <div className="space-y-5 pb-12 font-sans select-none">
      {/* Header */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-950/80 text-amber-300 border border-amber-800/60 font-semibold">
            Adversarial Reconciliation
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">
            Epistemic Checks & Balances
          </span>
        </div>
        <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
          <Scale className="w-5 h-5 text-amber-400" />
          <span>Independent Agent Comparison & Claim Reconciliation</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
          Inspect raw claims discovered by Explorer alongside adversarial cross-verifications by Investigator.
          Green highlights indicate consensus; amber/red indicates disagreements adjudicated by the ResearchLens AI Arbiter.
        </p>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-neutral-800/80 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-500" />
            <span className="text-neutral-300">Consensus Match</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-rose-500/30 border border-rose-500" />
            <span className="text-neutral-300">Discrepancy / Conflict</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-cyan-500/30 border border-cyan-500" />
            <span className="text-neutral-300">Explorer Unique</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded bg-indigo-500/30 border border-indigo-500" />
            <span className="text-neutral-300">Investigator Primary</span>
          </div>
        </div>
      </div>

      {/* Discrepancies Focus Card */}
      {state.conflicts.length > 0 && (
        <div className="bg-neutral-900/60 border border-rose-900/50 rounded-xl p-5 backdrop-blur-md space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-neutral-800/80">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
              <AlertTriangle className="w-4 h-4" />
              <span>Audited Discrepancies Matrix ({state.conflicts.length})</span>
            </div>

            <div className="flex items-center gap-1.5">
              {(['ALL', 'RESOLVED', 'UNRESOLVED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterConflictStatus(filter)}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase cursor-pointer transition-colors ${
                    filterConflictStatus === filter
                      ? 'bg-neutral-800 text-rose-300 border border-rose-800/80'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {filteredConflicts.map((cfl) => (
              <div
                key={cfl.id}
                onClick={() => onSelectConflict(cfl)}
                className="p-3.5 rounded-lg bg-neutral-950/80 border border-neutral-800 hover:border-rose-500/60 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
                  <span className="text-neutral-100 font-semibold">{cfl.entityName}</span>
                  <span className="text-rose-400 font-medium">[{cfl.fieldName}]</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start justify-between text-cyan-300 bg-cyan-950/20 p-2 rounded border border-cyan-900/20">
                    <span className="text-[10px] font-mono text-cyan-500 uppercase shrink-0">Explorer:</span>
                    <span className="text-right truncate ml-2 font-medium">{cfl.explorerClaim.value}</span>
                  </div>
                  <div className="flex items-start justify-between text-indigo-300 bg-indigo-950/20 p-2 rounded border border-indigo-900/20">
                    <span className="text-[10px] font-mono text-indigo-500 uppercase shrink-0">Investigator:</span>
                    <span className="text-right truncate ml-2 font-medium">{cfl.investigatorClaim.value}</span>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 text-[10px] text-amber-300 flex items-center justify-between border-t border-neutral-800/80 font-mono">
                  <span>Arbiter: <span className="text-neutral-200 font-semibold">{cfl.arbiterDecision || 'ESCALATED'}</span></span>
                  <span className="group-hover:translate-x-0.5 transition-transform text-neutral-400 flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Side-by-Side Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Explorer Column */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-cyan-950/60 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-xs font-semibold text-cyan-300">Explorer Agent Output</h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {explorerClaims.length} Claims
            </span>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {explorerClaims.map((claim) => (
              <div
                key={claim.id}
                className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800/80 hover:border-cyan-500/40 transition-colors text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-neutral-200 font-semibold">{claim.entityName}</span>
                  <span className="text-cyan-400">{claim.fieldName}</span>
                </div>
                <div className="text-neutral-100 font-medium">{claim.value}</div>
                <div className="text-[10px] text-neutral-500 truncate pt-1">
                  Source: {claim.sourceTitle} ({claim.sourceAuthority})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investigator Column */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-indigo-950/60 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
              <h3 className="text-xs font-semibold text-indigo-300">Investigator Agent Output</h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {investigatorClaims.length} Claims
            </span>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {investigatorClaims.map((claim) => (
              <div
                key={claim.id}
                className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800/80 hover:border-indigo-500/40 transition-colors text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-neutral-200 font-semibold">{claim.entityName}</span>
                  <span className="text-indigo-400">{claim.fieldName}</span>
                </div>
                <div className="text-neutral-100 font-medium">{claim.value}</div>
                <div className="text-[10px] text-neutral-500 truncate pt-1">
                  Source: {claim.sourceTitle} ({claim.sourceAuthority})
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
