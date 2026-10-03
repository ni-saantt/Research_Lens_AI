/**
 * ResearchLens AI - Sources Directory View
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 */
import React, { useState, useMemo } from 'react';
import { Globe, Search, ExternalLink, ShieldCheck, Filter, Award, CheckCircle2 } from 'lucide-react';
import { DiscoveredSource, SourceAuthority } from '../../types/research';
import { getAuthorityBadgeConfig } from '../../utils/statusHelpers';

interface SourcesViewProps {
  sources: DiscoveredSource[];
  onSelectSource: (source: DiscoveredSource) => void;
}

export function SourcesView({ sources, onSelectSource }: SourcesViewProps) {
  const [filterDomain, setFilterDomain] = useState('');
  const [selectedAuthority, setSelectedAuthority] = useState<string>('ALL');

  const filtered = useMemo(() => {
    return sources.filter(s => {
      if (selectedAuthority !== 'ALL') {
        if (selectedAuthority === 'GOVERNMENT' && s.authority !== 'GOVERNMENT_STATUTORY' && s.authority !== 'OFFICIAL_GOV' && s.authority !== 'REGULATOR') return false;
        if (selectedAuthority === 'PRIMARY' && s.authority !== 'PRIMARY_ENTITY' && s.authority !== 'PRIMARY_COMPANY') return false;
        if (selectedAuthority === 'ACADEMIC' && s.authority !== 'ACADEMIC_PRIMARY' && s.authority !== 'ACADEMIC_SECONDARY' && s.authority !== 'ACADEMIC_INDUSTRY') return false;
        if (selectedAuthority === 'MEDIA' && s.authority !== 'REPUTABLE_PUBLICATION' && s.authority !== 'SECONDARY_MEDIA') return false;
        if (selectedAuthority === 'DIRECTORY' && s.authority !== 'SECONDARY_DIRECTORY' && s.authority !== 'AGGREGATOR') return false;
      }
      if (!filterDomain) return true;
      const q = filterDomain.toLowerCase();
      return s.domain.toLowerCase().includes(q) || s.title.toLowerCase().includes(q) || s.snippet.toLowerCase().includes(q);
    });
  }, [sources, filterDomain, selectedAuthority]);

  const authorityCounts = useMemo(() => {
    let gov = 0, pri = 0, aca = 0, med = 0, dir = 0;
    sources.forEach(s => {
      const a = s.authority;
      if (a === 'GOVERNMENT_STATUTORY' || a === 'OFFICIAL_GOV' || a === 'REGULATOR') gov++;
      else if (a === 'PRIMARY_ENTITY' || a === 'PRIMARY_COMPANY') pri++;
      else if (a === 'ACADEMIC_PRIMARY' || a === 'ACADEMIC_SECONDARY' || a === 'ACADEMIC_INDUSTRY') aca++;
      else if (a === 'REPUTABLE_PUBLICATION' || a === 'SECONDARY_MEDIA') med++;
      else if (a === 'SECONDARY_DIRECTORY' || a === 'AGGREGATOR') dir++;
    });
    return { ALL: sources.length, GOVERNMENT: gov, PRIMARY: pri, ACADEMIC: aca, MEDIA: med, DIRECTORY: dir };
  }, [sources]);

  const renderBadge = (auth: SourceAuthority) => {
    const cfg = getAuthorityBadgeConfig(auth);
    return <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${cfg.badgeClass}`}>{cfg.label}</span>;
  };

  return (
    <div className="space-y-4 pb-12 font-sans select-none">
      {/* Header */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold">
              Source Intelligence Index
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">
              Hierarchy Ranked
            </span>
          </div>
          <h2 className="text-lg font-bold text-neutral-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>Audited Web Sources & Provenance Index</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Every web domain discovered, crawled, and parsed during the multi-agent investigation, classified according to the ResearchLens AI statutory hierarchy.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search domain, title, snippet..."
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="w-full bg-neutral-950/80 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Authority Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-neutral-900/60 border border-neutral-800/80 rounded-lg">
        {[
          { id: 'ALL', label: 'All Sources', count: authorityCounts.ALL },
          { id: 'GOVERNMENT', label: 'Government / Regulator', count: authorityCounts.GOVERNMENT },
          { id: 'PRIMARY', label: 'Primary Entity', count: authorityCounts.PRIMARY },
          { id: 'ACADEMIC', label: 'Academic / Technical', count: authorityCounts.ACADEMIC },
          { id: 'MEDIA', label: 'Publications', count: authorityCounts.MEDIA },
          { id: 'DIRECTORY', label: 'Directories & Aggregators', count: authorityCounts.DIRECTORY },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedAuthority(tab.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              selectedAuthority === tab.id
                ? 'bg-neutral-800 text-cyan-300 shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] font-mono px-1 rounded bg-neutral-950 text-neutral-400">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((src) => (
          <div
            key={src.id}
            onClick={() => onSelectSource(src)}
            className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-cyan-500/50 cursor-pointer transition-all group backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-xs font-mono font-semibold text-neutral-200 group-hover:text-cyan-300 transition-colors truncate">
                  {src.domain}
                </span>
              </div>
              {renderBadge(src.authority)}
            </div>

            <div className="text-xs font-medium text-neutral-200 line-clamp-1 mb-2">
              {src.title}
            </div>

            <p className="text-[11px] text-neutral-400 line-clamp-2 italic mb-3 font-serif leading-relaxed">
              "{src.snippet}"
            </p>

            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-800/80">
              <span className="uppercase">Discovered By: <span className="text-neutral-300 font-semibold">{src.discoveredBy}</span></span>
              <span className="flex items-center gap-1 text-cyan-400 group-hover:underline">
                Inspect Evidence <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="p-8 text-center text-neutral-500 font-mono text-xs bg-neutral-900/40 rounded-xl border border-neutral-800/60">
          No sources match the selected criteria.
        </div>
      )}
    </div>
  );
}
