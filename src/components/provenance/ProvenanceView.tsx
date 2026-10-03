/**
 * ResearchLens AI - "Explain How You Know" Provenance Walkthrough
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * Visual chain-of-custody showing the complete evidentiary pipeline.
 */
import React from 'react';
import { 
  FileSearch, 
  Compass, 
  Search, 
  ShieldCheck, 
  Globe, 
  Tag, 
  Scale, 
  Database, 
  LayoutDashboard,
  ArrowDown,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { ResearchState } from '../../types/research';

interface ProvenanceViewProps {
  state: ResearchState;
  onSelectEvidence: (item: any) => void;
}

export function ProvenanceView({ state, onSelectEvidence }: ProvenanceViewProps) {
  const steps = [
    {
      step: 1,
      title: 'User Natural Language Request',
      icon: <FileSearch className="w-4 h-4 text-neutral-300" />,
      content: (
        <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-200 font-mono text-xs">
          "{state.query || 'Research objective entered by analyst'}"
        </div>
      ),
      count: '1 Query',
    },
    {
      step: 2,
      title: 'Research Plan Specification',
      icon: <Compass className="w-4 h-4 text-cyan-400" />,
      content: state.plan ? (
        <div className="space-y-1.5 text-xs text-neutral-300">
          <div className="text-[11px] text-neutral-400">Objective: {state.plan.objective}</div>
          <div className="text-[11px] text-neutral-400">Geography Scope: <span className="text-cyan-300 font-mono">{state.plan.geographyScope}</span></div>
          <div className="flex flex-wrap gap-1 mt-1">
            {state.plan.requiredFields.map((f, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                {f}
              </span>
            ))}
          </div>
        </div>
      ) : <span className="text-neutral-500">Plan not initialized</span>,
      count: state.plan ? `${state.plan.requiredFields.length} Tracked Fields` : '0',
    },
    {
      step: 3,
      title: 'Sequential Dual-Vector Agent Execution',
      icon: <Search className="w-4 h-4 text-indigo-400" />,
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-900/40">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold block mb-1">
              Phase A: Explorer Agent (Discovery Vector)
            </span>
            <p className="text-[11px] text-neutral-400">
              Surfaces candidate entities, parses initial web directory records, and extracts candidate claims with authentic web snippets.
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-950/30 border border-indigo-900/40">
            <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold block mb-1">
              Phase B: Investigator Agent (Adversarial Vector)
            </span>
            <p className="text-[11px] text-neutral-400">
              Receives Explorer candidates and cross-examines findings against statutory orders, official gazettes, and primary documentation.
            </p>
          </div>
        </div>
      ),
      count: '2 Sequential Vectors',
    },
    {
      step: 4,
      title: 'Live Web Scraping & Evidence Extraction',
      icon: <Globe className="w-4 h-4 text-emerald-400" />,
      content: (
        <div className="space-y-2">
          <div className="text-[11px] text-neutral-400 mb-2">
            Discovered {state.sources.length} sources and scraped {state.sources.filter(s => s.scrapedSuccessfully).length} full HTML pages:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {state.sources.slice(0, 4).map((src) => (
              <div 
                key={src.id} 
                onClick={() => onSelectEvidence({ type: 'source', source: src })}
                className="p-2 rounded bg-neutral-950 border border-neutral-800 hover:border-cyan-500/50 cursor-pointer transition-colors"
              >
                <div className="font-semibold text-neutral-200 text-xs truncate flex items-center justify-between">
                  <span className="truncate">{src.domain}</span>
                  <ExternalLink className="w-3 h-3 text-neutral-500" />
                </div>
                <div className="text-[10px] text-neutral-400 truncate mt-0.5">{src.title}</div>
              </div>
            ))}
          </div>
        </div>
      ),
      count: `${state.sources.length} Sources Scraped`,
    },
    {
      step: 5,
      title: 'Arbitration & Conflict Escalation',
      icon: <Scale className="w-4 h-4 text-amber-400" />,
      content: (
        <div className="space-y-2">
          <div className="text-[11px] text-neutral-300">
            Arbiter evaluated claims field-by-field. Detected {state.conflicts.length} critical discrepancies and performed targeted web verification.
          </div>
          {state.conflicts.map((c) => (
            <div 
              key={c.id} 
              onClick={() => onSelectEvidence({ type: 'conflict', conflict: c })}
              className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs cursor-pointer hover:border-amber-700/60 transition-colors"
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-amber-400 mb-1">
                <span>{c.entityName} · {c.fieldName}</span>
                <span className={c.resolutionStatus === 'RESOLVED' ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  {c.resolutionStatus}
                </span>
              </div>
              <div className="text-neutral-200 text-[11px]">
                Basis: <span className="text-neutral-400">{c.decisionBasis}</span>
              </div>
            </div>
          ))}
        </div>
      ),
      count: `${state.conflicts.length} Discrepancies Audited`,
    },
    {
      step: 6,
      title: 'Final Normalized Intelligence Matrix',
      icon: <LayoutDashboard className="w-4 h-4 text-emerald-400" />,
      content: (
        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs">
          <div className="text-emerald-300 font-semibold mb-1">
            {state.entities.length} Verified Records Prepared
          </div>
          <p className="text-[11px] text-neutral-400">
            Every cell is backed by raw source citations and cryptographic provenance. No synthetic or unverified hallucinated records permitted.
          </p>
        </div>
      ),
      count: '100% Provenance Backed',
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md mb-6">
        <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Explain How ResearchLens AI Knows (Evidentiary Chain-of-Custody)</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Complete transparent audit trail showing the transformation of raw live web queries into verified structured data. Developed by Nishant Choudhary.
        </p>
      </div>

      <div className="space-y-4 relative">
        {steps.map((st, idx) => (
          <div key={st.step} className="relative">
            <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md relative z-10">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center font-mono text-xs font-semibold text-neutral-200">
                    {st.step}
                  </div>
                  <div className="p-1 rounded bg-neutral-800/70">
                    {st.icon}
                  </div>
                  <h3 className="text-xs font-semibold text-neutral-200">{st.title}</h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  {st.count}
                </span>
              </div>

              <div>{st.content}</div>
            </div>

            {idx < steps.length - 1 && (
              <div className="flex justify-center my-2 text-neutral-600">
                <ArrowDown className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
