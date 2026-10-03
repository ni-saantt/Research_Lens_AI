/**
 * ResearchLens AI - Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * Pipeline:
 * User Query -> Planner Agent -> Explorer & Investigator (Parallel) -> Conflict Detection -> Arbiter Judge -> Final Synthesis -> Dashboard
 */
import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  PanelRightClose, 
  ArrowRight,
  ShieldCheck,
  Compass,
  Workflow,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Info
} from 'lucide-react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar, ActiveTab } from './components/layout/TopBar';
import { CounterBar } from './components/arena/CounterBar';
import { PlanDisplay } from './components/arena/PlanDisplay';
import { ResearchGraph } from './components/graph/ResearchGraph';
import { ActivityFeed } from './components/arena/ActivityFeed';
import { AdaptiveDashboard } from './components/dashboard/AdaptiveDashboard';
import { NlpPipelineView } from './components/pipeline/NlpPipelineView';
import { ProvenanceView } from './components/provenance/ProvenanceView';
import { CompareAgentsView } from './components/compare/CompareAgentsView';
import { SourcesView } from './components/sources/SourcesView';
import { ResearchTimeline } from './components/timeline/ResearchTimeline';
import { EvidenceInspector } from './components/inspector/EvidenceInspector';
import { ResearchState, ResearchEvent, SystemStatus } from './types/research';
import { generateClientFallbackResearch } from './services/clientFallback';

const INITIAL_STATE: ResearchState = {
  sessionId: `session-${Date.now()}`,
  query: '',
  status: 'idle',
  isDemoMode: false,
  plan: null,
  sources: [],
  entities: [],
  claims: [],
  conflicts: [],
  dashboardSpec: null,
  events: [],
  stats: {
    sourcesCount: 0,
    pagesScraped: 0,
    entitiesCount: 0,
    claimsCount: 0,
    verifiedCount: 0,
    conflictsCount: 0,
    missingCount: 0,
    evidenceCoverage: 0,
  },
};

export default function App() {
  const [state, setState] = useState<ResearchState>(INITIAL_STATE);
  const [inputQuery, setInputQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('graph');
  const [selectedInspectorItem, setSelectedInspectorItem] = useState<any>(null);
  const [inspectorOpen, setInspectorOpen] = useState(true);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [recentSessions, setRecentSessions] = useState<Array<{ id: string; query: string; timestamp: string }>>([]);
  const [pipelineError, setPipelineError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Fetch initial system status safely
  useEffect(() => {
    fetch('/api/system/status')
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const cType = res.headers.get('content-type') || '';
        if (!cType.includes('application/json')) throw new Error('Non-JSON response');
        return res.json();
      })
      .then(data => setSystemStatus(data))
      .catch(err => {
        console.warn('Backend /api/system/status unreachable, assuming development status:', err);
        setSystemStatus({
          groqConfigured: false,
          groqModel: 'llama-3.3-70b-versatile (Primary) / llama-3.1-8b-instant (Fast)',
          searchEngine: 'Live Multi-Vector Search & Cheerio Crawler',
          scraperActive: true,
          environment: 'development',
          timestamp: new Date().toISOString(),
        });
      });
  }, []);

  // Handle + New Research: completely resets in-memory React state
  const handleNewResearch = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setState({
      ...INITIAL_STATE,
      sessionId: `session-${Date.now()}`,
    });
    setInputQuery('');
    setActiveTab('graph');
    setSelectedInspectorItem(null);
    setPipelineError(null);
  };

  // Run Benchmark / Showcase mode with explicit label
  const runShowcaseDemo = (query: string) => {
    setPipelineError(null);
    const newSessionId = `session-showcase-${Date.now()}`;
    const data = generateClientFallbackResearch(query);

    setState(prev => ({
      ...prev,
      sessionId: newSessionId,
      query,
      status: 'planning',
      isDemoMode: true,
      events: [
        {
          id: `evt-${Date.now()}-demo-start`,
          timestamp: new Date().toISOString(),
          type: 'planner_started',
          agent: 'planner',
          message: `[DEMO / SHOWCASE DATA] Loading verified benchmark intelligence dataset for "${query}"`,
        }
      ],
    }));

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        plan: data.plan,
        status: 'investigating',
        events: [
          ...prev.events,
          {
            id: `evt-${Date.now()}-plan`,
            timestamp: new Date().toISOString(),
            type: 'planner_completed',
            agent: 'planner',
            message: `Research plan locked: ${data.plan.requiredFields.length} target fields identified`,
            details: { plan: data.plan },
          }
        ],
      }));
    }, 400);

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        status: 'arbitrating',
        sources: data.sources,
        conflicts: data.conflicts,
        events: [
          ...prev.events,
          {
            id: `evt-${Date.now()}-agents`,
            timestamp: new Date().toISOString(),
            type: 'agent_started',
            agent: 'explorer',
            message: 'Explorer Agent and Investigator Agent completed dual-vector crawl',
          },
          {
            id: `evt-${Date.now()}-arb`,
            timestamp: new Date().toISOString(),
            type: 'arbiter_started',
            agent: 'arbiter',
            message: 'Research Arbiter cross-examining candidate claims and evaluating evidence hierarchy',
          }
        ],
      }));
    }, 800);

    setTimeout(() => {
      setState(prev => ({
        ...prev,
        status: 'completed',
        entities: data.entities,
        conflicts: data.conflicts,
        dashboardSpec: data.dashboardSpec,
        events: [
          ...prev.events,
          {
            id: `evt-${Date.now()}-vis`,
            timestamp: new Date().toISOString(),
            type: 'dashboard_generated',
            agent: 'visualizer',
            message: 'Verified intelligence matrix and evidence dashboard assembled [SHOWCASE MODE]',
          },
          {
            id: `evt-${Date.now()}-done`,
            timestamp: new Date().toISOString(),
            type: 'research_completed',
            agent: 'arbiter',
            message: `Research complete: ${data.entities.length} entities verified, ${data.conflicts.length} conflicts resolved`,
          }
        ],
      }));

      setActiveTab('dashboard');
      if (data.entities.length > 0) {
        setSelectedInspectorItem({ type: 'entity', entity: data.entities[0] });
        setInspectorOpen(true);
      }
    }, 1200);
  };

  // Run Research via Server-Sent Events (SSE)
  const handleRunResearch = (queryToRun?: string) => {
    const finalQuery = (queryToRun || inputQuery).trim();
    if (!finalQuery) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setPipelineError(null);
    const newSessionId = `session-${Date.now()}`;
    const initialEvents: ResearchEvent[] = [
      {
        id: `evt-${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'planner_started',
        agent: 'planner',
        message: `Dispatching ResearchLens AI autonomous orchestrator for "${finalQuery}"`,
      }
    ];

    setState({
      sessionId: newSessionId,
      query: finalQuery,
      status: 'planning',
      isDemoMode: false,
      plan: null,
      sources: [],
      entities: [],
      claims: [],
      conflicts: [],
      dashboardSpec: null,
      events: initialEvents,
      stats: INITIAL_STATE.stats,
    });

    setInputQuery(finalQuery);
    setActiveTab('graph');

    // Add to in-memory recent sessions
    setRecentSessions(prev => [
      { id: newSessionId, query: finalQuery, timestamp: new Date().toISOString() },
      ...prev.slice(0, 4),
    ]);

    let receivedEvents = false;

    // Connect SSE Stream
    const sseUrl = `/api/research/stream?query=${encodeURIComponent(finalQuery)}&sessionId=${newSessionId}`;
    const es = new EventSource(sseUrl);
    eventSourceRef.current = es;

    es.onmessage = (e) => {
      receivedEvents = true;

      if (e.data === '[DONE]') {
        es.close();
        setState(prev => ({
          ...prev,
          status: 'completed',
        }));
        return;
      }

      try {
        const payload = JSON.parse(e.data);

        if (payload.type === 'event' && payload.event) {
          const evt: ResearchEvent = payload.event;
          setState(prev => {
            const nextEvents = [...prev.events, evt];
            let nextStatus = prev.status;

            if (evt.type === 'planner_completed' && evt.details?.plan) {
              nextStatus = 'investigating';
              return {
                ...prev,
                plan: evt.details.plan,
                status: nextStatus,
                events: nextEvents,
              };
            }

            if (evt.type === 'source_found' && evt.details?.source) {
              const newSrc = evt.details.source;
              const exists = prev.sources.some(s => s.url === newSrc.url);
              const updatedSources = exists ? prev.sources : [...prev.sources, newSrc];
              return {
                ...prev,
                sources: updatedSources,
                events: nextEvents,
              };
            }

            if (evt.type === 'arbiter_started') {
              nextStatus = 'arbitrating';
            }

            if (evt.type === 'conflict_detected' && evt.details?.conflict) {
              const newCfl = evt.details.conflict;
              const exists = prev.conflicts.some(c => c.id === newCfl.id);
              const updatedConflicts = exists ? prev.conflicts : [...prev.conflicts, newCfl];
              return {
                ...prev,
                conflicts: updatedConflicts,
                events: nextEvents,
              };
            }

            if (evt.type === 'visualizer_started') {
              nextStatus = 'visualizing';
            }

            if (evt.type === 'research_error') {
              setPipelineError(evt.message);
            }

            return {
              ...prev,
              status: nextStatus,
              events: nextEvents,
            };
          });
        } else if (payload.type === 'final_payload' && payload.data) {
          const d = payload.data;
          setState(prev => ({
            ...prev,
            status: 'completed',
            plan: d.plan || prev.plan,
            contract: d.plan?.contract || d.contract || prev.contract,
            candidates: d.candidates || prev.candidates,
            qualityGate: d.qualityGate || prev.qualityGate,
            sources: d.sources || prev.sources,
            entities: d.entities || prev.entities,
            claims: d.claims || prev.claims,
            conflicts: d.conflicts || prev.conflicts,
            dashboardSpec: d.dashboardSpec || prev.dashboardSpec,
            isDemoMode: Boolean(d.isDemoMode),
          }));
          setActiveTab('dashboard');
          if (d.entities && d.entities.length > 0) {
            setSelectedInspectorItem({ type: 'entity', entity: d.entities[0] });
            setInspectorOpen(true);
          }
        } else if (payload.type === 'fatal_error') {
          console.warn('[ResearchLens AI] SSE fatal error:', payload.message);
          es.close();
          setPipelineError(payload.message || 'Pipeline execution failed.');
          setState(prev => ({ ...prev, status: 'error', errorMessage: payload.message }));
        }
      } catch (err) {
        console.warn('Error parsing SSE event:', err);
      }
    };

    es.onerror = async (err) => {
      console.warn('SSE connection interrupted or unsupported:', err);
      es.close();

      if (receivedEvents) {
        setState(prev => ({
          ...prev,
          status: prev.entities.length > 0 ? 'completed' : prev.status,
        }));
        return;
      }

      // Attempt fallback to POST /api/research/run
      try {
        const resp = await fetch('/api/research/run', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: finalQuery, sessionId: newSessionId }),
        });

        if (resp.ok) {
          const result = await resp.json();
          if (result.success && result.data) {
            const d = result.data;
            setState(prev => ({
              ...prev,
              status: 'completed',
              plan: d.plan || prev.plan,
              contract: d.plan?.contract || d.contract || prev.contract,
              candidates: d.candidates || prev.candidates,
              qualityGate: d.qualityGate || prev.qualityGate,
              sources: d.sources || prev.sources,
              entities: d.entities || prev.entities,
              claims: d.claims || prev.claims,
              conflicts: d.conflicts || prev.conflicts,
              dashboardSpec: d.dashboardSpec || prev.dashboardSpec,
              events: result.events || prev.events,
              isDemoMode: Boolean(d.isDemoMode),
            }));
            setActiveTab('dashboard');
            if (d.entities && d.entities.length > 0) {
              setSelectedInspectorItem({ type: 'entity', entity: d.entities[0] });
              setInspectorOpen(true);
            }
            return;
          }
        } else {
          const errPayload = await resp.json().catch(() => ({}));
          const errMsg = errPayload.error || `HTTP error ${resp.status}`;
          setPipelineError(errMsg);
          setState(prev => ({ ...prev, status: 'error', errorMessage: errMsg }));
          return;
        }
      } catch (fetchErr: any) {
        console.warn('[ResearchLens AI] POST fallback failed:', fetchErr);
        const errMsg = fetchErr?.message || 'Server connection failed';
        setPipelineError(`Live research connection interrupted: ${errMsg}`);
        setState(prev => ({ ...prev, status: 'error', errorMessage: errMsg }));
        return;
      }
    };
  };

  const isResearching = ['planning', 'investigating', 'arbitrating', 'visualizing'].includes(state.status);
  const hasResults = state.entities.length > 0 || Boolean(state.dashboardSpec);

  return (
    <div className="flex h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        onNewResearch={handleNewResearch}
        onSelectPrompt={(p) => {
          setInputQuery(p);
          handleRunResearch(p);
        }}
        systemStatus={systemStatus}
        activeSessionId={state.sessionId}
        recentSessions={recentSessions}
        onSelectSession={(id) => {
          const sess = recentSessions.find(s => s.id === id);
          if (sess) handleRunResearch(sess.query);
        }}
      />

      {/* 2. Main Application Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navigation Bar */}
        <TopBar
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          isDemoMode={state.isDemoMode}
          hasResults={hasResults}
          onExportCsv={() => {
            setActiveTab('dashboard');
          }}
        />

        {/* Live Metrics Counter Bar */}
        <div className="px-6 pt-3 pb-1 shrink-0">
          <CounterBar state={state} />
        </div>

        {/* Primary Content Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Query Bar */}
          <div className="relative">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleRunResearch();
              }}
              className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 rounded-xl p-1.5 backdrop-blur-md shadow-sm focus-within:border-cyan-500/80 transition-all"
            >
              <div className="pl-3 text-neutral-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask any research question (e.g., 'Find EV charging companies in Rajasthan, verify tariffs and charger types')..."
                disabled={isResearching}
                className="flex-1 bg-transparent border-none text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isResearching || !inputQuery.trim()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors cursor-pointer shrink-0"
              >
                {isResearching ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Investigating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Start Research</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Error Banner (if error occurred) */}
          {pipelineError && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5 text-rose-300">Live Research Pipeline Notice:</span>
                  <p className="text-[11px] text-rose-200/90 leading-relaxed">{pipelineError}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => handleRunResearch(state.query || inputQuery)}
                  className="px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 border border-rose-700/80 text-rose-100 text-xs font-semibold cursor-pointer transition-colors"
                >
                  Retry Live Research
                </button>
                <button
                  onClick={() => runShowcaseDemo(state.query || inputQuery)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  View Benchmark Data
                </button>
                <button
                  onClick={() => setPipelineError(null)}
                  className="text-neutral-400 hover:text-neutral-200 text-xs font-mono cursor-pointer ml-1"
                  title="Dismiss notice"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Mode Banner if Running in Benchmark / Demo Mode */}
          {state.isDemoMode && (
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>DEMO / SHOWCASE MODE:</strong> Displaying authentic benchmark evidence. Configure <code className="text-cyan-300 font-mono">GROQ_API_KEY</code> in <code className="text-cyan-300 font-mono">.env.local</code> for live autonomous web execution.
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/60 border border-amber-700/60 text-amber-300 shrink-0">
                Sample Showcase
              </span>
            </div>
          )}

          {/* Initial Welcome & Landing Hero (When Idle) */}
          {state.status === 'idle' && (
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-8 backdrop-blur-md text-center max-w-4xl mx-auto my-6 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(6,182,212,0.3)]">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-[11px] font-mono text-cyan-300 mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Multi-Agent Research & Evidence Intelligence Platform</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-100 sm:text-3xl">
                  ResearchLens AI
                </h1>
                <p className="text-xs text-cyan-400 font-mono mt-1 uppercase tracking-wider">
                  Multi-Agent Research & Evidence Intelligence Platform
                </p>
                <p className="text-xs text-neutral-400 mt-3 max-w-2xl mx-auto leading-relaxed">
                  Turn complex questions into structured, evidence-backed intelligence using specialized AI research agents. ResearchLens AI independently investigates information, compares findings across sources, flags contradictions, and synthesizes results with transparent confidence and source attribution.
                </p>
                <div className="text-xs text-neutral-500 font-mono pt-2">
                  Developed by <span className="text-neutral-200 font-medium font-sans">Nishant Choudhary</span>
                </div>
              </div>

              {/* High-Level 6-Stage Intelligence Workflow */}
              <div className="pt-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-3">
                  Intelligence Workflow
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
                  <div className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Ask</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-neutral-600 hidden sm:inline" />
                  <div className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-cyan-300 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Plan</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-neutral-600 hidden sm:inline" />
                  <div className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-indigo-300 flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    <span>Investigate</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-neutral-600 hidden sm:inline" />
                  <div className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-purple-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Cross-Verify</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-neutral-600 hidden sm:inline" />
                  <div className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-amber-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolve</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-neutral-600 hidden sm:inline" />
                  <div className="px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-emerald-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Synthesize</span>
                  </div>
                </div>
              </div>

              {/* 3 Core Architecture Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left pt-2">
                <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs font-mono">
                    <span>01. Explorer Agent</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Broad discovery vector querying live search engines, extracting candidate entities and raw claims with URL citations.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs font-mono">
                    <span>02. Investigator Agent</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Adversarial validator auditing official statutory portals, regulatory filings, and domain sources to detect discrepancies.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs font-mono">
                    <span>03. Research Arbiter</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Adjudicates disputes using a statutory authority hierarchy (Gov &gt; Primary &gt; Aggregator), resolving conflicts and preserving uncertainty.
                  </p>
                </div>
              </div>

              {/* Prominent Quick Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => handleRunResearch('Find EV charging companies operating in Rajasthan, compare cities served, charger types, tariff pricing and official contact information, verify important claims and flag contradictions')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Research</span>
                </button>
                <button
                  onClick={() => setActiveTab('pipeline')}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Workflow className="w-4 h-4 text-indigo-400" />
                  <span>Explore Architecture</span>
                </button>
              </div>
            </div>
          )}

          {/* Research Plan Display (if active plan exists) */}
          {state.plan && <PlanDisplay plan={state.plan} />}

          {/* Active View Switching */}
          {activeTab === 'graph' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[620px]">
              <div className="lg:col-span-2 h-full">
                <ResearchGraph
                  state={state}
                  onSelectItem={(item) => {
                    setSelectedInspectorItem(item);
                    setInspectorOpen(true);
                  }}
                />
              </div>
              <div className="lg:col-span-1 h-full">
                <ActivityFeed
                  events={state.events}
                  onSelectEvent={(evt) => {
                    setSelectedInspectorItem({ type: 'event', event: evt });
                    setInspectorOpen(true);
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <AdaptiveDashboard
              state={state}
              onSelectCell={(cellData) => {
                setSelectedInspectorItem(cellData);
                setInspectorOpen(true);
              }}
            />
          )}

          {activeTab === 'pipeline' && (
            <NlpPipelineView state={state} />
          )}

          {activeTab === 'compare' && (
            <CompareAgentsView
              state={state}
              onSelectConflict={(cfl) => {
                setSelectedInspectorItem({ type: 'conflict', conflict: cfl });
                setInspectorOpen(true);
              }}
            />
          )}

          {activeTab === 'sources' && (
            <SourcesView
              sources={state.sources}
              onSelectSource={(src) => {
                setSelectedInspectorItem({ type: 'source', source: src });
                setInspectorOpen(true);
              }}
            />
          )}

          {activeTab === 'provenance' && (
            <ProvenanceView
              state={state}
              onSelectEvidence={(evidence) => {
                setSelectedInspectorItem(evidence);
                setInspectorOpen(true);
              }}
            />
          )}

          {activeTab === 'feed' && (
            <div className="h-[600px]">
              <ActivityFeed
                events={state.events}
                onSelectEvent={(evt) => {
                  setSelectedInspectorItem({ type: 'event', event: evt });
                  setInspectorOpen(true);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 3. Right Evidence Inspector Panel */}
      {inspectorOpen && (
        <aside className="w-80 h-full bg-neutral-950/95 border-l border-neutral-800/80 flex flex-col shrink-0">
          <div className="p-3 border-b border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">Evidence Inspector</span>
            <button
              onClick={() => setInspectorOpen(false)}
              className="text-neutral-500 hover:text-neutral-300 p-1 rounded hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <EvidenceInspector
              selectedItem={selectedInspectorItem}
              onClose={() => setSelectedInspectorItem(null)}
            />
          </div>
        </aside>
      )}
    </div>
  );
}
