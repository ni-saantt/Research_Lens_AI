/**
 * ResearchLens AI - Adaptive Intelligence Dashboard
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * Features:
 * 1. Research Overview (Query, Intent, Entities, Scope, Execution status)
 * 2. 6 Verified Real KPI Cards (100% derived from actual session state)
 * 3. Multi-Agent Activity Status (Planner, Explorer, Investigator, Arbiter)
 * 4. Data Visualizations (Recharts: Verification Distribution, Source Authority, Custom Specs)
 * 5. Detailed Evidence Table (Sortable, Searchable, Filterable, CSV export)
 * 6. Conflict & Discrepancy Adjudication Matrix
 * 7. "What We Could Not Statutorily Verify" Transparency Audit
 * 8. Grounded "Ask the Dataset" RAG Engine with Quick Query Pills
 */
import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  Search, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Cpu,
  Layers,
  HelpCircle,
  FileText,
  Filter,
  ArrowRight,
  Info
} from 'lucide-react';
import { ResearchState, DiscoveredEntity, ConflictItem } from '../../types/research';
import { computeCanonicalMetrics, getStatusBadgeConfig } from '../../utils/statusHelpers';

interface AdaptiveDashboardProps {
  state: ResearchState;
  onSelectCell: (item: any) => void;
}

const PIE_COLORS = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'];

export function AdaptiveDashboard({ state, onSelectCell }: AdaptiveDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<string>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [askQuery, setAskQuery] = useState('');
  const [askLoading, setAskLoading] = useState(false);
  const [askResponse, setAskResponse] = useState<any>(null);
  const [showConflictsOnly, setShowConflictsOnly] = useState(false);

  const spec = state.dashboardSpec;
  const entities = state.entities;
  const conflicts = state.conflicts;
  const sources = state.sources;
  const claims = state.claims;

  // 1. Compute Authentic Canonical KPIs directly from state (Separating Confidence from Coverage from Completeness)
  const canonicalMetrics = useMemo(() => computeCanonicalMetrics(entities), [entities]);
  const totalEntities = entities.length;
  const totalSources = sources.length;
  const totalConflicts = conflicts.length;
  const resolvedConflicts = conflicts.filter(c => c.resolutionStatus === 'RESOLVED').length;

  // 2. Verification Status Distribution Chart Data
  const verificationDistributionData = useMemo(() => {
    let verified = 0;
    let conflicting = 0;
    let incomplete = 0;

    entities.forEach(e => {
      if (e.overallStatus === 'VERIFIED') verified++;
      else if (e.overallStatus === 'CONFLICTING') conflicting++;
      else incomplete++;
    });

    return [
      { name: 'Verified', value: verified, color: '#10b981' },
      { name: 'Disputed/Conflicts', value: conflicting, color: '#f43f5e' },
      { name: 'Incomplete/Pending', value: incomplete, color: '#f59e0b' },
    ].filter(d => d.value > 0);
  }, [entities]);

  // 3. Source Authority Distribution Chart Data
  const sourceAuthorityData = useMemo(() => {
    const counts: Record<string, number> = {};
    sources.forEach(src => {
      const auth = src.authority || 'UNVERIFIED';
      counts[auth] = (counts[auth] || 0) + 1;
    });

    const labelMap: Record<string, string> = {
      OFFICIAL_GOV: 'Government / Statutory',
      PRIMARY_COMPANY: 'Primary Entity Portal',
      ACADEMIC_INDUSTRY: 'Academic / Technical',
      SECONDARY_MEDIA: 'Journalistic Publication',
      AGGREGATOR: 'Directory / Aggregator',
      UNVERIFIED: 'Other Web Sources',
    };

    return Object.entries(counts).map(([k, v]) => ({
      name: labelMap[k] || k,
      count: v,
    }));
  }, [sources]);

  // 4. Distinct Field Keys for table
  const allFieldKeys = useMemo(() => {
    const keys = new Set<string>();
    entities.forEach(e => {
      Object.keys(e.fields).forEach(k => keys.add(k));
    });
    return Array.from(keys);
  }, [entities]);

  // 5. Filtered & Sorted Entities
  const filteredEntities = useMemo(() => {
    return entities
      .filter((e) => {
        if (statusFilter !== 'ALL' && e.overallStatus !== statusFilter) return false;
        if (!searchTerm) return true;
        const q = searchTerm.toLowerCase();
        const fieldsStr = Object.values(e.fields).map(f => f.value).join(' ').toLowerCase();
        return e.name.toLowerCase().includes(q) || (e.location && e.location.toLowerCase().includes(q)) || fieldsStr.includes(q);
      })
      .sort((a, b) => {
        const valA = sortField === 'name' ? a.name : (sortField === 'coverage' ? String(a.evidenceCoverage) : (a.fields[sortField]?.value || ''));
        const valB = sortField === 'name' ? b.name : (sortField === 'coverage' ? String(b.evidenceCoverage) : (b.fields[sortField]?.value || ''));
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
  }, [entities, searchTerm, statusFilter, sortField, sortAsc]);

  // 6. CSV Export Function
  const handleExportCsv = () => {
    if (entities.length === 0) return;
    const headers = ['Entity Name', 'Location', 'Overall Status', 'Evidence Coverage %', ...allFieldKeys];
    
    const rows = entities.map(e => {
      const fieldValues = allFieldKeys.map(k => {
        const f = e.fields[k];
        const val = f && f.value !== null ? String(f.value) : 'INSUFFICIENT_EVIDENCE';
        return `"${val.replace(/"/g, '""')}"`;
      });
      return [`"${e.name}"`, `"${e.location || ''}"`, `"${e.overallStatus}"`, `"${e.evidenceCoverage}%"`, ...fieldValues].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `researchlens_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 7. Ask the Dataset API Call
  const handleAskDataset = async (queryText?: string) => {
    const finalQ = (queryText || askQuery).trim();
    if (!finalQ || askLoading) return;

    setAskLoading(true);
    setAskResponse(null);
    setAskQuery(finalQ);

    try {
      const res = await fetch('/api/ask-dataset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: finalQ,
          entities: state.entities,
        }),
      });
      const data = await res.json();
      setAskResponse(data);
    } catch {
      setAskResponse({
        answer: 'Failed to process dataset query. Please check server connectivity.',
        provenanceNote: 'Client network error.',
      });
    } finally {
      setAskLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    'Which findings have the highest confidence?',
    'Show unresolved conflicts and discrepancies.',
    'Which sources were used most?',
    'Summarize the verified findings.',
    'Which claims have insufficient evidence?',
  ];

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* 1. Research Overview Header */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-semibold">
                Intelligence Specification
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                Status: <span className="text-emerald-400 font-medium capitalize">{state.status}</span>
              </span>
            </div>
            <h2 className="text-lg font-bold text-neutral-100 tracking-tight">
              {spec?.headline || `Verified Intelligence Briefing: "${state.query || 'Research Overview'}"`}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl leading-relaxed">
              {spec?.summary || 'Normalized multi-agent dataset cross-examined by Explorer and Investigator agents and reconciled by the ResearchLens AI Arbiter.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700/80 border border-neutral-700 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Research Overview Parameters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
            <span className="text-[10px] text-neutral-500 uppercase block">Research Objective</span>
            <span className="text-neutral-200 line-clamp-2 mt-0.5">{state.plan?.objective || state.query || 'General Intelligence Verification'}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
            <span className="text-[10px] text-neutral-500 uppercase block">Audited Geographic Scope</span>
            <span className="text-cyan-300 font-semibold mt-0.5 block truncate">{state.plan?.geographyScope || 'National / As Specified'}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
            <span className="text-[10px] text-neutral-500 uppercase block">Tracked Attributes</span>
            <span className="text-indigo-300 font-semibold mt-0.5 block truncate">
              {state.plan?.requiredFields.join(', ') || 'Core Specifications'}
            </span>
          </div>
        </div>

        {/* 2. Six Real KPI Cards (Directly from State) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          <div className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block truncate" title="Total web domains audited">Sources Analyzed</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">{totalSources}</div>
            <span className="text-[10px] text-neutral-500 block truncate">Audited web portals</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block truncate" title="Candidate entities investigated in current session">Entities Evaluated</span>
            <div className="text-xl font-bold font-mono text-neutral-100 mt-1 tabular-nums">{totalEntities}</div>
            <span className="text-[10px] text-neutral-500 block truncate">Audited candidates</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block truncate" title="Fields substantiated by primary or regulatory authority sources">Verified Claims</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">{canonicalMetrics.verifiedCount}</div>
            <span className="text-[10px] text-neutral-500 block truncate">{canonicalMetrics.supportedCount} supported</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800/80">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block truncate" title="Substantive factual discrepancies adjudicated by Arbiter">Conflicts Audited</span>
            <div className="text-xl font-bold font-mono text-rose-400 mt-1 tabular-nums">{totalConflicts}</div>
            <span className="text-[10px] text-neutral-500 block truncate">{resolvedConflicts} resolved • {totalConflicts - resolvedConflicts} preserved</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800/80" title="Average authority strength of verified claims only. Missing values do not inflate confidence score.">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block truncate">Verified Confidence</span>
            <div className="text-xl font-bold font-mono text-indigo-400 mt-1 tabular-nums">
              {canonicalMetrics.averageConfidence !== null ? `${canonicalMetrics.averageConfidence}%` : 'N/A'}
            </div>
            <span className="text-[10px] text-neutral-500 block truncate">Excludes missing fields</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950/70 border border-neutral-800/80" title="Percentage of required criteria substantiated with evidence across candidates. Coverage ≠ Confidence.">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block truncate">Evidence Coverage</span>
            <div className="text-xl font-bold font-mono text-teal-400 mt-1 tabular-nums">{canonicalMetrics.evidenceCoverage}%</div>
            <span className="text-[10px] text-neutral-500 block truncate">Completeness: {canonicalMetrics.researchCompleteness}%</span>
          </div>
        </div>
      </div>

      {/* 3. Multi-Agent Activity Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-neutral-200">Planner Agent</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              Completed
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Formulated {state.plan?.requiredFields.length || 0} audited fields with dual search strategies for Explorer & Investigator.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-neutral-200">Explorer Agent</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              {claims.some(c => c.discoveredBy === 'explorer') ? 'Completed' : 'Ready'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Discovered {claims.filter(c => c.discoveredBy === 'explorer').length} candidate claims and mapped initial web entities.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-neutral-200">Investigator Agent</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800/60">
              {claims.some(c => c.discoveredBy === 'investigator') ? 'Completed' : 'Ready'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Cross-examined regulatory filings, resulting in {conflicts.length} conflict detections and statutory verifications.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-neutral-200">Research Arbiter</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800/60">
              {conflicts.length > 0 ? 'Adjudicated' : 'Consensus'}
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Applied statutory hierarchy (Gov &gt; Primary &gt; Aggregator), resolving {resolvedConflicts} of {totalConflicts} discrepancies.
          </p>
        </div>
      </div>

      {/* 4. Data Visualizations (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Verification Status Distribution */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-neutral-200">Verification Status Breakdown</h4>
            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Distribution of audited entity verification statuses</p>
          </div>

          <div className="h-52 w-full text-xs font-mono">
            {verificationDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', fontSize: '11px' }} 
                    itemStyle={{ color: '#e5e5e5' }}
                  />
                  <Pie
                    data={verificationDistributionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={35}
                    paddingAngle={4}
                  >
                    {verificationDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={24}
                    formatter={(value) => <span className="text-[10px] text-neutral-300">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-neutral-500 font-mono">
                Awaiting research execution data
              </div>
            )}
          </div>
        </div>

        {/* Source Authority Classification Breakdown */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-neutral-200">Audited Source Authority Distribution</h4>
            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Classification of web sources according to evidentiary hierarchy</p>
          </div>

          <div className="h-52 w-full text-xs font-mono">
            {sourceAuthorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceAuthorityData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis 
                    dataKey="name" 
                    stroke="#737373" 
                    fontSize={9} 
                    tickLine={false} 
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis stroke="#737373" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', fontSize: '11px' }} 
                    itemStyle={{ color: '#06b6d4' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-neutral-500 font-mono">
                Awaiting web source discovery
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Visualizations from DashboardSpec (if available) */}
      {spec?.charts && spec.charts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {spec.charts.map((chart) => {
            const chartData = (chart.data || []).map((row: any) => {
              const keys = Object.keys(row);
              const xKey = chart.xAxisKey in row ? chart.xAxisKey : (keys.find(k => typeof row[k] === 'string') || keys[0] || 'label');
              const yKey = chart.dataKey in row ? chart.dataKey : (keys.find(k => typeof row[k] === 'number') || keys[1] || 'value');
              return {
                ...row,
                __x: String(row[xKey] ?? row[keys[0]] ?? ''),
                __y: typeof row[yKey] === 'number' ? row[yKey] : (parseFloat(row[yKey]) || 0),
              };
            });

            return (
              <div key={chart.id} className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md">
                <div className="mb-3">
                  <h4 className="text-xs font-semibold text-neutral-200">{chart.title}</h4>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{chart.description}</p>
                </div>

                <div className="h-56 w-full text-xs font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                      <XAxis 
                        dataKey="__x" 
                        stroke="#737373" 
                        fontSize={10} 
                        tickLine={false} 
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                      />
                      <YAxis stroke="#737373" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '8px', fontSize: '11px' }} 
                        itemStyle={{ color: '#06b6d4' }}
                      />
                      <Bar dataKey="__y" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Conflict Analysis Section */}
      {conflicts.length > 0 && (
        <div className="bg-neutral-900/70 border border-rose-900/50 rounded-xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-semibold text-neutral-200">
                Audited Discrepancies & Arbiter Resolutions ({conflicts.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {resolvedConflicts} resolved • {conflicts.length - resolvedConflicts} preserved
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {conflicts.map((cfl) => (
              <div
                key={cfl.id}
                onClick={() => onSelectCell({ type: 'conflict', conflict: cfl })}
                className="p-3.5 rounded-lg bg-neutral-950/80 border border-neutral-800 hover:border-rose-500/60 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className="text-neutral-100 font-semibold">{cfl.entityName}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-950/80 text-rose-300 border border-rose-800/60">
                    {cfl.fieldName}
                  </span>
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

                <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-amber-300">
                    Verdict: <span className="text-neutral-200 font-semibold">{cfl.arbiterDecision || 'ESCALATED'}</span>
                  </span>
                  <span className="text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Filterable, Sortable Evidence Table */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl overflow-hidden backdrop-blur-md">
        <div className="p-4 border-b border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-semibold text-neutral-200">Verified Evidence Matrix</h3>
            <span className="text-[10px] font-mono text-neutral-400">({filteredEntities.length} of {entities.length} records)</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="VERIFIED">Verified Only</option>
              <option value="CONFLICTING">Conflicting Only</option>
              <option value="INCOMPLETE">Incomplete Only</option>
            </select>

            {/* Search Input */}
            <div className="relative w-48 sm:w-60">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-neutral-950/90 sticky top-0 z-10 border-b border-neutral-800 text-[10px] font-mono uppercase text-neutral-400">
              <tr>
                <th 
                  onClick={() => { setSortField('name'); setSortAsc(!sortAsc); }}
                  className="py-3 px-4 font-semibold cursor-pointer hover:text-neutral-200 whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    <span>Target Entity</span>
                    {sortField === 'name' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold whitespace-nowrap">Status</th>
                {allFieldKeys.map((k) => (
                  <th key={k} className="py-3 px-4 font-semibold whitespace-nowrap">
                    {k}
                  </th>
                ))}
                <th 
                  onClick={() => { setSortField('coverage'); setSortAsc(!sortAsc); }}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-neutral-200 whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Coverage</span>
                    {sortField === 'coverage' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {filteredEntities.map((ent) => (
                <tr key={ent.id} className="hover:bg-neutral-800/40 transition-colors group">
                  <td 
                    onClick={() => onSelectCell({ type: 'entity', entity: ent })}
                    className="py-3 px-4 font-semibold text-neutral-100 whitespace-nowrap cursor-pointer hover:text-cyan-300"
                    title="Click to inspect entity evidence profile"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        ent.overallStatus === 'VERIFIED' ? 'bg-emerald-400' : (ent.overallStatus === 'CONFLICTING' ? 'bg-rose-400' : 'bg-amber-400')
                      }`} />
                      <span>{ent.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                      ent.overallStatus === 'VERIFIED' 
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60' 
                        : (ent.overallStatus === 'CONFLICTING' 
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60' 
                            : 'bg-amber-950/60 text-amber-300 border border-amber-800/60')
                    }`}>
                      {ent.overallStatus}
                    </span>
                  </td>
                  {allFieldKeys.map((k) => {
                    const f = ent.fields[k];
                    return (
                      <td 
                        key={k} 
                        onClick={() => f && onSelectCell({ type: 'field', entity: ent, fieldName: k, fieldData: f })}
                        className={`py-3 px-4 whitespace-nowrap ${f ? 'cursor-pointer hover:text-cyan-300' : 'text-neutral-600'}`}
                        title={f?.snippet || 'No data'}
                      >
                        {f ? (
                          <div className="flex items-center gap-1.5">
                            {f.value !== null ? (
                              <>
                                <span className="truncate max-w-[200px] text-neutral-100">{f.value}</span>
                                {f.verifiedStatus === 'VERIFIED' && (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                )}
                                {f.verifiedStatus === 'SUPPORTED' && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" title="Supported by web evidence" />
                                )}
                                {f.verifiedStatus === 'CONFLICTING' && (
                                  <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                                )}
                              </>
                            ) : (
                              <span className="text-amber-400 font-mono text-[11px] italic">[Insufficient Evidence]</span>
                            )}
                          </div>
                        ) : (
                          <span className="font-mono text-[11px] text-neutral-600">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-3 px-4 text-right font-mono font-semibold text-neutral-200">
                    <div className="flex items-center justify-end gap-1.5">
                      <div className="w-12 h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                        <div 
                          className={`h-full ${ent.evidenceCoverage > 80 ? 'bg-emerald-400' : (ent.evidenceCoverage > 50 ? 'bg-cyan-400' : 'bg-amber-400')}`}
                          style={{ width: `${ent.evidenceCoverage}%` }}
                        />
                      </div>
                      <span>{ent.evidenceCoverage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. "What We Could Not Statutorily Verify" Transparency Audit */}
      {spec?.unverifiedObservations && spec.unverifiedObservations.length > 0 && (
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 backdrop-blur-md space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Transparency Audit: What ResearchLens AI Could Not Statutorily Verify</span>
          </div>
          <ul className="space-y-1.5 text-xs text-neutral-400 list-disc pl-5 leading-relaxed">
            {spec.unverifiedObservations.map((obs, idx) => (
              <li key={idx}>{obs}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 8. Interactive "Ask the Dataset" Section */}
      <div className="p-5 rounded-xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
          <div>
            <h3 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Ask the Dataset (Retrieval-Grounded Engine)</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Ask natural-language questions strictly constrained to the verified {entities.length} records in current session memory.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60 self-start sm:self-auto">
            Zero Hallucination Bounded RAG
          </span>
        </div>

        {/* Quick Question Pills */}
        <div className="flex flex-wrap gap-1.5">
          {QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskDataset(q)}
              disabled={askLoading}
              className="text-[11px] px-2.5 py-1 rounded-md bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Query Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleAskDataset(); }} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask a question about the verified entities, pricing, or sources..."
            value={askQuery}
            onChange={(e) => setAskQuery(e.target.value)}
            disabled={askLoading}
            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={askLoading || !askQuery.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{askLoading ? 'Querying...' : 'Ask'}</span>
          </button>
        </form>

        {/* Answer Output */}
        {askResponse && (
          <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800/90 space-y-2 animate-in fade-in duration-200">
            <div className="text-xs text-neutral-200 leading-relaxed font-sans">
              {askResponse.answer}
            </div>
            {askResponse.provenanceNote && (
              <div className="text-[10px] font-mono text-cyan-400/90 pt-2 border-t border-neutral-800/60 flex items-center justify-between">
                <span>Basis: {askResponse.provenanceNote}</span>
                {askResponse.highlightEntities && askResponse.highlightEntities.length > 0 && (
                  <span className="text-neutral-400">
                    Matches: {askResponse.highlightEntities.join(', ')}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
