/**
 * ResearchLens AI - Structured Research Plan Display
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 */
import React from 'react';
import { 
  Compass, 
  Target, 
  MapPin, 
  CheckSquare, 
  Search, 
  ShieldCheck, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { ResearchPlan } from '../../types/research';

interface PlanDisplayProps {
  plan: ResearchPlan;
}

export function PlanDisplay({ plan }: PlanDisplayProps) {
  return (
    <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4 mb-4 backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/50">
            <Compass className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-neutral-200">Autonomous Research Strategy</h4>
            <p className="text-[11px] text-neutral-400">{plan.objective}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <span className="text-neutral-400">Confidence Threshold:</span>
          <span className="text-emerald-400 font-semibold">{Math.round(plan.confidenceThreshold * 100)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Scope & Entities */}
        <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/60">
          <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[10px] uppercase mb-1.5">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scope & Target Entities</span>
          </div>
          <div className="text-neutral-200 font-medium mb-1">{plan.targetEntitiesDescription}</div>
          <div className="text-[11px] text-neutral-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-neutral-500 shrink-0" />
            <span>{plan.geographyScope}</span>
          </div>
        </div>

        {/* Required Fields */}
        <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/60">
          <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[10px] uppercase mb-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Audited Specifications</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {plan.requiredFields.map((f, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Verification Constraints */}
        <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/60">
          <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-[10px] uppercase mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Freshness & Authority</span>
          </div>
          <div className="text-[11px] text-neutral-300 mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3 text-neutral-500" />
            <span>{plan.freshnessRequirements}</span>
          </div>
          <div className="text-[10px] text-neutral-400 truncate">
            Prefers: {plan.sourcePreferences.join(', ')}
          </div>
        </div>
      </div>

      {/* Dual Search Strategies */}
      <div className="mt-3 pt-3 border-t border-neutral-800/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
        <div className="flex items-start gap-2">
          <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-cyan-300">Explorer Discovery Vectors: </span>
            <span className="text-neutral-400 font-mono">{plan.searchStrategies.explorerFocus.join(' · ')}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-indigo-300">Investigator Adversarial Vectors: </span>
            <span className="text-neutral-400 font-mono">{plan.searchStrategies.investigatorFocus.join(' · ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
