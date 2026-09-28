/**
 * ResearchLens AI - Core Domain Types
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 */

export type AgentRole = 'planner' | 'explorer' | 'investigator' | 'arbiter' | 'visualizer';

export type NodeStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'WARNING' | 'CONFLICT' | 'FAILED';

export type ClaimVerificationStatus = 
  | 'VERIFIED' 
  | 'CONFLICTING' 
  | 'INCOMPLETE' 
  | 'NOT_FOUND' 
  | 'UNRESOLVED';

export type ArbiterResolution = 
  | 'CONSENSUS' 
  | 'EXPLORER_SELECTED' 
  | 'INVESTIGATOR_SELECTED' 
  | 'UNRESOLVED';

export type SourceAuthority = 'OFFICIAL_GOV' | 'PRIMARY_COMPANY' | 'ACADEMIC_INDUSTRY' | 'SECONDARY_MEDIA' | 'AGGREGATOR' | 'UNVERIFIED';

export interface ResearchPlan {
  objective: string;
  targetEntitiesDescription: string;
  geographyScope: string;
  requiredFields: string[];
  searchStrategies: {
    explorerFocus: string[];
    investigatorFocus: string[];
  };
  sourcePreferences: string[];
  verificationRequirements: string[];
  freshnessRequirements: string;
  expectedOutputFormat: string;
  potentialResearchRisks: string[];
  confidenceThreshold: number;
}

export interface DiscoveredSource {
  id: string;
  url: string;
  domain: string;
  title: string;
  discoveredBy: 'explorer' | 'investigator' | 'arbiter';
  authority: SourceAuthority;
  retrievedAt: string;
  publishedDate?: string;
  snippet: string;
  headings?: string[];
  scrapedSuccessfully: boolean;
  httpStatus?: number;
  wordCount?: number;
}

export interface ExtractedClaim {
  id: string;
  entityName: string;
  fieldName: string;
  value: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceAuthority: SourceAuthority;
  supportingSnippet: string;
  discoveredBy: 'explorer' | 'investigator' | 'arbiter';
  confidenceScore: number; // 0 to 1
  retrievedAt: string;
  verificationStatus: ClaimVerificationStatus;
}

export interface DiscoveredEntity {
  id: string;
  name: string;
  category?: string;
  location?: string;
  fields: Record<string, {
    value: string;
    verifiedStatus: ClaimVerificationStatus;
    sourceUrl: string;
    sourceTitle: string;
    authority: SourceAuthority;
    evidenceStrength: number; // 0 - 100
    snippet: string;
    resolvedBy?: ArbiterResolution;
    decisionBasis?: string;
  }>;
  overallStatus: ClaimVerificationStatus;
  evidenceCoverage: number; // 0 to 100 percentage
}

export interface ConflictItem {
  id: string;
  entityName: string;
  fieldName: string;
  explorerClaim: {
    value: string;
    sourceUrl: string;
    sourceTitle: string;
    authority: SourceAuthority;
    snippet: string;
  };
  investigatorClaim: {
    value: string;
    sourceUrl: string;
    sourceTitle: string;
    authority: SourceAuthority;
    snippet: string;
  };
  natureOfConflict: string;
  escalatedToWebSearch: boolean;
  targetedQuery?: string;
  newEvidenceDiscovered?: string;
  arbiterDecision?: ArbiterResolution;
  finalValue?: string;
  decisionBasis?: string;
  resolutionStatus: 'PENDING' | 'RESOLVED' | 'UNRESOLVED';
}

export interface ArbiterEvaluation {
  entityName: string;
  fieldName: string;
  resolution: ArbiterResolution;
  selectedSourceUrl?: string;
  decisionBasis: string;
  confidenceScore: number;
  freshnessPreferenceApplied: boolean;
  primarySourcePreferenceApplied: boolean;
}

export interface DashboardMetricWidget {
  label: string;
  value: string | number;
  description: string;
  tone?: 'positive' | 'warning' | 'alert' | 'neutral';
}

export interface DashboardChartWidget {
  id: string;
  title: string;
  chartType: 'bar' | 'pie' | 'line';
  dataKey: string;
  xAxisKey: string;
  description: string;
  data: Array<Record<string, string | number>>;
}

export interface DashboardTableColumn {
  key: string;
  label: string;
  type: 'text' | 'status' | 'number' | 'link';
}

export interface DashboardSpec {
  headline: string;
  summary: string;
  metrics: DashboardMetricWidget[];
  charts: DashboardChartWidget[];
  tableColumns: DashboardTableColumn[];
  unverifiedObservations: string[];
}

export type ResearchEventType = 
  | 'planner_started'
  | 'planner_completed'
  | 'agent_started'
  | 'search_started'
  | 'search_query'
  | 'source_found'
  | 'source_opened'
  | 'scrape_started'
  | 'scrape_completed'
  | 'claim_found'
  | 'entity_found'
  | 'verification_started'
  | 'conflict_detected'
  | 'arbiter_started'
  | 'escalation_started'
  | 'escalation_completed'
  | 'arbiter_decision'
  | 'visualizer_started'
  | 'dashboard_generated'
  | 'research_completed'
  | 'research_error';

export interface ResearchEvent {
  id: string;
  timestamp: string;
  type: ResearchEventType;
  agent?: AgentRole;
  message: string;
  details?: Record<string, any>;
  targetNodeId?: string;
  stats?: {
    sourcesCount: number;
    pagesScraped: number;
    entitiesCount: number;
    claimsCount: number;
    verifiedCount: number;
    conflictsCount: number;
    missingCount: number;
  };
}

export interface ResearchState {
  sessionId: string;
  query: string;
  status: 'idle' | 'planning' | 'investigating' | 'arbitrating' | 'visualizing' | 'completed' | 'error';
  isDemoMode: boolean;
  plan: ResearchPlan | null;
  sources: DiscoveredSource[];
  entities: DiscoveredEntity[];
  claims: ExtractedClaim[];
  conflicts: ConflictItem[];
  dashboardSpec: DashboardSpec | null;
  events: ResearchEvent[];
  stats: {
    sourcesCount: number;
    pagesScraped: number;
    entitiesCount: number;
    claimsCount: number;
    verifiedCount: number;
    conflictsCount: number;
    missingCount: number;
    evidenceCoverage: number;
  };
  errorMessage?: string;
}

export interface SystemStatus {
  groqConfigured: boolean;
  groqModel: string;
  searchEngine: string;
  scraperActive: boolean;
  environment: string;
  timestamp: string;
}
