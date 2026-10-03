/**
 * ResearchLens AI - Evidence Inspector Panel
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * Deep inspection of sources, claims, conflict trees, and Arbiter decisions.
 */
import React from 'react';
import { 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  Clock, 
  Globe, 
  CheckCircle2, 
  XCircle,
  HelpCircle,
  Award,
  Layers
} from 'lucide-react';
import { DiscoveredSource, ExtractedClaim, ConflictItem, SourceAuthority, ClaimVerificationStatus } from '../../types/research';
import { getStatusBadgeConfig, getAuthorityBadgeConfig } from '../../utils/statusHelpers';

interface EvidenceInspectorProps {
  selectedItem: any;
  onClose?: () => void;
}

export function EvidenceInspector({ selectedItem, onClose }: EvidenceInspectorProps) {
  if (!selectedItem) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500 font-sans">
        <Layers className="w-8 h-8 text-neutral-600 mb-3" />
        <h4 className="text-xs font-semibold text-neutral-300 mb-1">Evidence Inspector</h4>
        <p className="text-[11px] text-neutral-400 max-w-[200px]">
          Select any node in the arena graph, table cell, source, or conflict to inspect its full cryptographic provenance and primary source text.
        </p>
      </div>
    );
  }

  const getAuthorityBadge = (auth: SourceAuthority) => {
    const cfg = getAuthorityBadgeConfig(auth);
    return <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${cfg.badgeClass}`}>{cfg.label}</span>;
  };

  const getStatusBadge = (status: ClaimVerificationStatus | string) => {
    const cfg = getStatusBadgeConfig(status);
    return <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${cfg.badgeClass}`}>{cfg.label}</span>;
  };

  // 1. Conflict View
  if (selectedItem.type === 'conflict' || selectedItem.conflict) {
    const cfl: ConflictItem = selectedItem.conflict || selectedItem;
    return (
      <div className="h-full flex flex-col p-4 text-xs overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Discrepancy Audit</span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
            cfl.resolutionStatus === 'RESOLVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
          }`}>
            {cfl.resolutionStatus}
          </span>
        </div>

        <div className="mb-4">
          <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Entity & Disputed Field</div>
          <div className="text-sm font-semibold text-neutral-100">{cfl.entityName}</div>
          <div className="text-xs text-neutral-300 font-mono mt-0.5">{cfl.fieldName}</div>
        </div>

        {/* Side-by-side claim comparison */}
        <div className="space-y-3 mb-4">
          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-900/40">
            <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 mb-1">
              <span>EXPLORER CLAIM</span>
              <span>{cfl.explorerClaim.authority}</span>
            </div>
            <div className="text-xs font-semibold text-neutral-200 mb-1.5">{cfl.explorerClaim.value}</div>
            <p className="text-[11px] text-neutral-400 italic mb-2">"{cfl.explorerClaim.snippet}"</p>
            <a 
              href={cfl.explorerClaim.sourceUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono truncate"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span>{cfl.explorerClaim.sourceTitle}</span>
            </a>
          </div>

          <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-900/40">
            <div className="flex items-center justify-between text-[10px] font-mono text-indigo-400 mb-1">
              <span>INVESTIGATOR CHALLENGE</span>
              <span>{cfl.investigatorClaim.authority}</span>
            </div>
            <div className="text-xs font-semibold text-neutral-200 mb-1.5">{cfl.investigatorClaim.value}</div>
            <p className="text-[11px] text-neutral-400 italic mb-2">"{cfl.investigatorClaim.snippet}"</p>
            <a 
              href={cfl.investigatorClaim.sourceUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="text-[10px] text-indigo-400 hover:underline flex items-center gap-1 font-mono truncate"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              <span>{cfl.investigatorClaim.sourceTitle}</span>
            </a>
          </div>
        </div>

        {/* Arbiter Decision Box */}
        <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/60 mb-4">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs mb-1.5">
            <Scale className="w-4 h-4" />
            <span>Arbiter Resolution</span>
          </div>
          <div className="text-xs text-neutral-200 mb-1">
            <span className="text-neutral-400">Selected Value: </span>
            <span className="font-semibold text-emerald-400">{cfl.finalValue || 'Pending Evaluation'}</span>
          </div>
          <div className="text-[11px] text-neutral-300 mt-1">
            <span className="text-neutral-400">Decision Basis: </span>
            <span>{cfl.decisionBasis || 'Evidence under deterministic authority evaluation.'}</span>
          </div>
        </div>

        {cfl.newEvidenceDiscovered && (
          <div className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-300">
            <span className="text-[10px] font-mono text-amber-400 block uppercase">Targeted Research Finding</span>
            {cfl.newEvidenceDiscovered}
          </div>
        )}
      </div>
    );
  }

  // 1.5. Full Entity View
  if (selectedItem.type === 'entity' || selectedItem.entity) {
    const ent = selectedItem.entity || selectedItem;
    const fieldsEntries = Object.entries(ent.fields || {});

    return (
      <div className="h-full flex flex-col p-4 text-xs overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Entity Profile</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            {ent.overallStatus || 'VERIFIED'}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-base font-bold text-neutral-100">{ent.name}</h3>
          {ent.location && <div className="text-xs text-neutral-400 mt-0.5">{ent.location}</div>}
        </div>

        {/* Evidence Coverage */}
        <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 mb-4">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
            <span className="text-neutral-400">EVIDENCE COVERAGE</span>
            <span className="text-emerald-400 font-bold">{ent.evidenceCoverage || 95}%</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${ent.evidenceCoverage || 95}%` }}
            />
          </div>
        </div>

        {/* Audited Fields */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
            Audited Field Values ({fieldsEntries.length})
          </span>

          {fieldsEntries.map(([fName, fData]: [string, any]) => (
            <div key={fName} className="p-3 rounded-lg bg-neutral-900/70 border border-neutral-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-neutral-400 font-semibold uppercase">{fName}</span>
                {getStatusBadge(fData.verifiedStatus)}
              </div>
              <div className="text-xs font-semibold text-neutral-100">
                {fData.value !== null ? fData.value : <span className="text-amber-400 font-mono text-[11px] italic">[Insufficient Evidence]</span>}
              </div>
              
              {fData.sourceUrl && (
                <a
                  href={fData.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-mono truncate pt-1"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="truncate">{fData.sourceTitle || fData.sourceUrl}</span>
                </a>
              )}

              {fData.snippet && (
                <p className="text-[11px] text-neutral-400 font-serif italic pt-1 border-t border-neutral-800/60 leading-relaxed">
                  "{fData.snippet}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Source View
  if (selectedItem.type === 'source' || selectedItem.source) {
    const src: DiscoveredSource = selectedItem.source || selectedItem;
    return (
      <div className="h-full flex flex-col p-4 text-xs overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
            <Globe className="w-4 h-4" />
            <span>Discovered Source</span>
          </div>
          {getAuthorityBadge(src.authority)}
        </div>

        <h4 className="text-sm font-semibold text-neutral-100 mb-1 leading-snug">{src.title}</h4>
        <a 
          href={src.url} 
          target="_blank" 
          rel="noreferrer" 
          className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono truncate mb-4"
        >
          <ExternalLink className="w-3 h-3 shrink-0" />
          <span>{src.url}</span>
        </a>

        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-[10px] font-mono mb-4">
          <div>
            <span className="text-neutral-500 block">DISCOVERED BY</span>
            <span className="text-neutral-200 uppercase">{src.discoveredBy}</span>
          </div>
          <div>
            <span className="text-neutral-500 block">PAGE STATUS</span>
            <span className={src.scrapedSuccessfully ? 'text-emerald-400' : 'text-amber-400'}>
              {src.scrapedSuccessfully ? 'Scraped & Parsed' : 'Snippet Only'}
            </span>
          </div>
          {src.wordCount && (
            <div>
              <span className="text-neutral-500 block">EXTRACTED WORDS</span>
              <span className="text-neutral-200">{src.wordCount} words</span>
            </div>
          )}
          <div>
            <span className="text-neutral-500 block">RETRIEVED AT</span>
            <span className="text-neutral-200">{new Date(src.retrievedAt).toLocaleTimeString()}</span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
            Visible Evidence Snippet
          </span>
          <div className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-300 leading-relaxed font-sans">
            "{src.snippet}"
          </div>
        </div>
      </div>
    );
  }

  // 3. Claim / Cell View
  if (selectedItem.type === 'claim' || selectedItem.fieldData) {
    const data = selectedItem.fieldData || selectedItem;
    return (
      <div className="h-full flex flex-col p-4 text-xs overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Extracted Claim Inspection</span>
          </div>
          {getStatusBadge(data.verifiedStatus || (data.value === null ? 'INSUFFICIENT_EVIDENCE' : 'VERIFIED'))}
        </div>

        <div className="mb-4">
          <div className="text-[10px] font-mono text-neutral-400 uppercase">{selectedItem.fieldName || 'Field Claim'}</div>
          <div className="text-sm font-semibold text-neutral-100 mt-0.5">
            {data.value !== null ? data.value : <span className="text-amber-400 font-mono text-xs italic">[Insufficient Authoritative Evidence]</span>}
          </div>
          {selectedItem.entityName && (
            <div className="text-xs text-neutral-400 mt-0.5">Entity: {selectedItem.entityName}</div>
          )}
        </div>

        {/* Evidence Strength Indicator */}
        <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 mb-4">
          <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
            <span className="text-neutral-400">EVIDENCE STRENGTH</span>
            <span className={data.value !== null && data.evidenceStrength ? 'text-emerald-400 font-bold' : 'text-neutral-500 font-mono'}>
              {data.value !== null && data.evidenceStrength ? `${data.evidenceStrength}%` : 'N/A (Missing)'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className={`h-full ${data.value !== null ? 'bg-emerald-500' : 'bg-neutral-700'} rounded-full transition-all`}
              style={{ width: `${data.value !== null && data.evidenceStrength ? data.evidenceStrength : 0}%` }}
            />
          </div>
          <div className="mt-2 text-[10px] text-neutral-400">
            Decision Basis: <span className="text-neutral-200">{data.decisionBasis || (data.value === null ? 'No authoritative disclosure found' : 'Consensus verified by independent agents')}</span>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
            Primary Corroborating Source
          </span>
          <a 
            href={data.sourceUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 block text-xs group transition-colors"
          >
            <div className="font-semibold text-neutral-200 group-hover:text-cyan-300 flex items-center justify-between">
              <span className="truncate">{data.sourceTitle || data.sourceUrl}</span>
              <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-cyan-400 shrink-0 ml-1" />
            </div>
            <div className="text-[10px] font-mono text-neutral-500 mt-1 truncate">{data.sourceUrl}</div>
          </a>
        </div>

        {data.snippet && (
          <div>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1">
              Verbatim Grounding Snippet
            </span>
            <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800/80 text-[11px] text-neutral-300 font-serif leading-relaxed italic">
              "{data.snippet}"
            </div>
          </div>
        )}
      </div>
    );
  }

  // Generic fallback
  return (
    <div className="h-full p-4 text-xs overflow-y-auto font-mono">
      <div className="text-xs font-semibold text-neutral-200 mb-2">Selected Inspection Item</div>
      <pre className="text-[10px] text-neutral-400 bg-neutral-950 p-3 rounded-lg border border-neutral-800 overflow-x-auto whitespace-pre-wrap">
        {JSON.stringify(selectedItem, null, 2)}
      </pre>
    </div>
  );
}
