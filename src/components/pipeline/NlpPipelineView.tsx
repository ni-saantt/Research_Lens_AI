/**
 * ResearchLens AI - Intelligence Pipeline Visualizer
 * Multi-Agent Research & Evidence Intelligence Platform
 * Developer: Nishant Choudhary
 * 
 * Demonstrates the 11-stage NLP processing pipeline with technical foundations,
 * prompt references, and live state inspection.
 */
import React, { useState } from 'react';
import { 
  FileText, 
  Target, 
  Layers, 
  Split, 
  Code, 
  Cpu, 
  Search, 
  FileCheck, 
  AlertTriangle, 
  Scale, 
  LayoutDashboard,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Sparkles,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { ResearchState } from '../../types/research';

interface NlpPipelineViewProps {
  state: ResearchState;
}

interface PipelineStage {
  id: number;
  title: string;
  nlpSubdiscipline: string;
  agent: string;
  promptFile: string;
  description: string;
  technicalRationale: string;
  icon: React.ReactNode;
  activeDataPreview: (state: ResearchState) => React.ReactNode;
}

export function NlpPipelineView({ state }: NlpPipelineViewProps) {
  const [selectedStageId, setSelectedStageId] = useState<number>(1);

  const stages: PipelineStage[] = [
    {
      id: 1,
      title: 'Natural Language Input',
      nlpSubdiscipline: 'Unstructured Human Language Processing',
      agent: 'User Interface / Dispatcher',
      promptFile: 'src/App.tsx',
      description: 'Accepts arbitrary natural-language research questions with complex constraints, temporal bounds, and domain specifications.',
      technicalRationale: 'Real-world research questions contain ambiguous phrasing, implicit requirements, and multi-faceted requests that cannot be handled by simple SQL queries.',
      icon: <FileText className="w-4 h-4 text-cyan-400" />,
      activeDataPreview: (s) => (
        <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-200">
          "{s.query || 'Enter a query or select a benchmark to view live execution context.'}"
        </div>
      ),
    },
    {
      id: 2,
      title: 'Intent Analysis & Classification',
      nlpSubdiscipline: 'Semantic Intent Classification',
      agent: 'Planner Agent',
      promptFile: 'src/prompts/plannerPrompt.ts',
      description: 'Classifies the core research intent: comparative benchmarking, fact-checking, regulatory tariff auditing, or directory synthesis.',
      technicalRationale: 'Determines whether the research requires cross-entity numeric comparison, adversarial debunking, or multi-field attribute extraction.',
      icon: <Target className="w-4 h-4 text-indigo-400" />,
      activeDataPreview: (s) => (
        <div className="text-xs space-y-1">
          <div className="text-neutral-400">Classified Objective:</div>
          <div className="text-cyan-300 font-medium">{s.plan?.objective || 'Awaiting query execution'}</div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Named Entity Recognition & Scope',
      nlpSubdiscipline: 'NER & Geographic Boundary Extraction',
      agent: 'Planner Agent',
      promptFile: 'src/prompts/plannerPrompt.ts',
      description: 'Identifies target named entities, organizations, hardware standards, and geographic scopes.',
      technicalRationale: 'Extracts spatial parameters (e.g. "Rajasthan, India") and organizational categories to prevent out-of-scope web crawling.',
      icon: <Layers className="w-4 h-4 text-purple-400" />,
      activeDataPreview: (s) => (
        <div className="text-xs space-y-1">
          <div className="text-neutral-400">Target Entities: <span className="text-neutral-200">{s.plan?.targetEntitiesDescription || 'Pending'}</span></div>
          <div className="text-neutral-400">Geographic Scope: <span className="text-cyan-300 font-mono">{s.plan?.geographyScope || 'Pending'}</span></div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Query Decomposition & Task Generation',
      nlpSubdiscipline: 'Sub-Goal Planning & Query Reformulation',
      agent: 'Planner Agent',
      promptFile: 'src/prompts/plannerPrompt.ts',
      description: 'Decomposes complex requests into 3-5 audited attribute fields and formulates orthogonal search keyword vectors.',
      technicalRationale: 'Search engines fail on conversational prompts. The planner converts natural language into search engine keywords for Explorer and Investigator.',
      icon: <Split className="w-4 h-4 text-emerald-400" />,
      activeDataPreview: (s) => (
        <div className="space-y-2 text-xs">
          <div className="text-neutral-400">Required Audited Fields ({s.plan?.requiredFields.length || 0}):</div>
          <div className="flex flex-wrap gap-1">
            {s.plan?.requiredFields.map((f, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-[10px]">
                {f}
              </span>
            )) || <span className="text-neutral-500">None yet</span>}
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Prompt Construction & Grounding',
      nlpSubdiscipline: 'Context Grounding & Prompt Engineering',
      agent: 'Orchestrator Layer',
      promptFile: 'src/prompts/index.ts',
      description: 'Dynamically formats few-shot context, injected web sources, and strict Zod JSON schemas for downstream agent execution.',
      technicalRationale: 'Eliminates conversational hallucination by binding the LLM to closed-context citations and schema-constrained JSON output mode.',
      icon: <Code className="w-4 h-4 text-amber-400" />,
      activeDataPreview: () => (
        <div className="text-xs text-neutral-300 font-mono space-y-1">
          <div className="text-emerald-400">✓ Strict JSON Object Mode Enforced</div>
          <div className="text-emerald-400">✓ Source URL and Snippet Provenance Required</div>
          <div className="text-emerald-400">✓ Calibrated Temperature (0.10 - 0.30)</div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Multi-Agent LLM Processing',
      nlpSubdiscipline: 'Parallel Dual-Vector Agent Execution',
      agent: 'Explorer & Investigator Agents',
      promptFile: 'src/prompts/explorerPrompt.ts & investigatorPrompt.ts',
      description: 'Concurrently runs two specialized agents: Explorer maximizes breadth, while Investigator executes adversarial cross-examination.',
      technicalRationale: 'Prevents confirmation bias. A single agent tends to accept its first found source; two adversarial agents create genuine checks and balances.',
      icon: <Cpu className="w-4 h-4 text-cyan-400" />,
      activeDataPreview: (s) => (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded bg-cyan-950/30 border border-cyan-900/40">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-semibold block">Explorer Vector</span>
            <span className="text-neutral-300">{s.claims.filter(c => c.discoveredBy === 'explorer').length} Claims Discovered</span>
          </div>
          <div className="p-2 rounded bg-indigo-950/30 border border-indigo-900/40">
            <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold block">Investigator Vector</span>
            <span className="text-neutral-300">{s.claims.filter(c => c.discoveredBy === 'investigator').length} Primary Verifications</span>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'Evidence Retrieval & Scraping',
      nlpSubdiscipline: 'Information Retrieval & Web Scraping',
      agent: 'Web Engine & Cheerio Scraper',
      promptFile: 'src/services/webSearch.ts & scraper.ts',
      description: 'Executes live multi-provider search (DuckDuckGo, Wikipedia, Direct Web) and extracts clean text with DOM noise removal.',
      technicalRationale: 'Transforms raw, noisy HTML into clean, semantically dense text blocks suitable for LLM context windows.',
      icon: <Search className="w-4 h-4 text-blue-400" />,
      activeDataPreview: (s) => (
        <div className="text-xs space-y-1">
          <div className="text-neutral-400">Web Sources Audited: <span className="text-cyan-300 font-mono font-semibold">{s.sources.length}</span></div>
          <div className="text-neutral-400">Successfully Scraped Pages: <span className="text-emerald-400 font-mono font-semibold">{s.sources.filter(src => src.scrapedSuccessfully).length}</span></div>
        </div>
      ),
    },
    {
      id: 8,
      title: 'Claim & Fact Extraction',
      nlpSubdiscipline: 'Information Extraction (IE) & Slot Filling',
      agent: 'Explorer Agent',
      promptFile: 'src/prompts/explorerPrompt.ts',
      description: 'Extracts discrete claims (Entity, Attribute, Value) and links each to verbatim supporting text snippets and authentic URLs.',
      technicalRationale: 'Converts unstructured natural-language web documents into structured knowledge triples with traceable evidentiary provenance.',
      icon: <FileCheck className="w-4 h-4 text-emerald-400" />,
      activeDataPreview: (s) => (
        <div className="text-xs space-y-1">
          <div className="text-neutral-400">Total Extracted Claims: <span className="text-neutral-200 font-mono font-semibold">{s.claims.length}</span></div>
          <div className="text-neutral-400">Entities Identified: <span className="text-cyan-300 font-mono font-semibold">{s.entities.length}</span></div>
        </div>
      ),
    },
    {
      id: 9,
      title: 'Contradiction Detection',
      nlpSubdiscipline: 'Natural Language Inference (NLI) & Truth Maintenance',
      agent: 'Investigator Agent',
      promptFile: 'src/prompts/investigatorPrompt.ts',
      description: 'Cross-examines Explorer claims against regulatory documents to identify numerical, pricing, or temporal contradictions.',
      technicalRationale: 'Solves the core NLP problem of cross-document inconsistency detection (e.g. recognizing that ₹16.00/kWh in a 2022 blog conflicts with ₹14.50/kWh in a 2026 tariff order).',
      icon: <AlertTriangle className="w-4 h-4 text-rose-400" />,
      activeDataPreview: (s) => (
        <div className="text-xs space-y-1">
          <div className="text-neutral-400">Detected Discrepancies: <span className="text-rose-400 font-mono font-semibold">{s.conflicts.length}</span></div>
          <div className="text-neutral-400">Targeted Escalations: <span className="text-amber-300 font-mono font-semibold">{s.conflicts.filter(c => c.escalatedToWebSearch).length}</span></div>
        </div>
      ),
    },
    {
      id: 10,
      title: 'Arbitration & Adjudication',
      nlpSubdiscipline: 'Evidentiary Adjudication & Confidence Calibration',
      agent: 'Arbiter Agent / Judge',
      promptFile: 'src/prompts/arbiterPrompt.ts',
      description: 'Resolves disputes using a statutory authority hierarchy (Gov > Company > Study > News > Directory) and assigns calibrated confidence.',
      technicalRationale: 'Formalizes epistemic uncertainty: rather than guessing, the Arbiter either justifies why one source prevails or explicitly preserves the conflict.',
      icon: <Scale className="w-4 h-4 text-amber-400" />,
      activeDataPreview: (s) => (
        <div className="text-xs space-y-1">
          <div className="text-neutral-400">Resolved Conflicts: <span className="text-emerald-400 font-mono font-semibold">{s.conflicts.filter(c => c.resolutionStatus === 'RESOLVED').length}</span></div>
          <div className="text-neutral-400">Preserved Ambiguities: <span className="text-amber-300 font-mono font-semibold">{s.conflicts.filter(c => c.resolutionStatus === 'UNRESOLVED').length}</span></div>
        </div>
      ),
    },
    {
      id: 11,
      title: 'Final Synthesis & Grounded Q&A',
      nlpSubdiscipline: 'Multi-Document Summarization & Constrained RAG',
      agent: 'Synthesis Agent & Dataset Interpreter',
      promptFile: 'src/prompts/finalSynthesisPrompt.ts & datasetPrompt.ts',
      description: 'Produces an executive briefing, dynamic dashboard specification, and answers natural-language queries strictly grounded in session data.',
      technicalRationale: 'Implements closed-world semantic question answering over in-memory verified tables with zero out-of-context hallucination.',
      icon: <LayoutDashboard className="w-4 h-4 text-cyan-400" />,
      activeDataPreview: (s) => (
        <div className="text-xs space-y-1">
          <div className="text-neutral-400">Average Evidence Coverage: <span className="text-emerald-400 font-mono font-semibold">
            {s.entities.length > 0 ? Math.round(s.entities.reduce((a, b) => a + b.evidenceCoverage, 0) / s.entities.length) : 0}%
          </span></div>
          <div className="text-neutral-400">Dashboard Visualizations: <span className="text-neutral-200 font-mono font-semibold">{s.dashboardSpec?.charts.length || 0} charts</span></div>
        </div>
      ),
    },
  ];

  const currentStage = stages.find(s => s.id === selectedStageId) || stages[0];

  return (
    <div className="space-y-6 pb-12 font-sans select-none">
      {/* Header & Theoretical Justification */}
      <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-semibold">
                Architecture Specification
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">Production Engine Ready</span>
            </div>
            <h2 className="text-lg font-bold text-neutral-100 tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Multi-Stage Intelligence & Evidence Verification Pipeline</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1 max-w-3xl leading-relaxed">
              ResearchLens AI demonstrates that LLMs provide genuine value when structured as formal NLP pipeline components (NER, Slot Filling, Natural Language Inference, and Epistemic Arbitration) rather than generic unconstrained chatbots.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-neutral-950/80 border border-neutral-800 text-right shrink-0">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">Pipeline Depth</span>
            <div className="text-xl font-bold font-mono text-cyan-300">11 Stages</div>
            <span className="text-[10px] text-emerald-400 font-mono">Zero Blind Trust</span>
          </div>
        </div>

        {/* NLP Sub-Discipline Pills */}
        <div className="flex flex-wrap gap-2 mt-4 pt-1">
          {['Intent Classification', 'Named Entity Recognition (NER)', 'Information Extraction (IE)', 'Natural Language Inference (NLI)', 'Adversarial Verification', 'Epistemic Arbitration', 'Constrained RAG'].map((tag, idx) => (
            <span key={idx} className="px-2.5 py-1 rounded-md bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive 11-Stage Pipeline Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Step Ladder (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-1 mb-2">
            Execution Stages (Click to Inspect)
          </div>
          <div className="space-y-1.5 max-h-[620px] overflow-y-auto pr-1">
            {stages.map((stage) => {
              const isSelected = stage.id === selectedStageId;
              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStageId(stage.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-neutral-800/90 border-cyan-500/80 shadow-[0_0_12px_rgba(6,182,212,0.15)] text-neutral-100'
                      : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800/80 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs shrink-0 ${
                      isSelected ? 'bg-cyan-500 text-neutral-950 font-bold' : 'bg-neutral-950 border border-neutral-800 text-neutral-400'
                    }`}>
                      {stage.id}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                        <span>{stage.title}</span>
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500 truncate">
                        {stage.nlpSubdiscipline}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-neutral-600'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Stage Inspection (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-5">
            {/* Stage Title & Metadata */}
            <div className="border-b border-neutral-800/80 pb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold flex items-center gap-1.5">
                  {currentStage.icon}
                  <span>Stage {currentStage.id} of 11</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-300">
                  {currentStage.agent}
                </span>
              </div>
              <h3 className="text-lg font-bold text-neutral-100 tracking-tight">
                {currentStage.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {currentStage.description}
              </p>
            </div>

            {/* NLP Sub-Discipline & Technical Rationale */}
            <div className="p-3.5 rounded-lg bg-neutral-950/70 border border-neutral-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-indigo-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>NLP Sub-Discipline & Technical Rationale</span>
              </div>
              <div className="text-xs font-mono text-indigo-200">
                {currentStage.nlpSubdiscipline}
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed pt-1">
                {currentStage.technicalRationale}
              </p>
            </div>

            {/* Code & Prompt Binding */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950/50 border border-neutral-800 text-xs font-mono">
              <span className="text-neutral-400">Dedicated Prompt / Module:</span>
              <span className="text-cyan-300">{currentStage.promptFile}</span>
            </div>

            {/* Active Session Data Live Preview */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Current Session Live Data Extraction
              </div>
              {currentStage.activeDataPreview(state)}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800/80 mt-6 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
            <span>ResearchLens AI Intelligence Engine</span>
            <span>Developed by Nishant Choudhary</span>
          </div>
        </div>
      </div>
    </div>
  );
}
