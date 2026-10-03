/**
 * ResearchLens AI - Core Domain Types
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * Defines canonical epistemic schemas, research contracts, candidate entities,
 * source evaluation records, and strict multi-agent state models.
 */

export type AgentRole = 'planner' | 'explorer' | 'investigator' | 'arbiter' | 'visualizer';

export type NodeStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'WARNING' | 'CONFLICT' | 'FAILED';

/**
 * Epistemic Query Intent Classification
 */
export type ResearchQueryIntent = 
  | 'COMPARISON'
  | 'RANKING'
  | 'DISCOVERY'
  | 'FACT_LOOKUP'
  | 'EXPLORATORY_RESEARCH'
  | 'FACT_CHECK'
  | 'CURRENT_INFORMATION'
  | 'POLICY_OR_REGULATORY'
  | 'MULTI_ENTITY_ANALYSIS';

/**
 * Canonical Epistemic Evidence Status
 * Strictly distinguishes positive verification from lack of evidence.
 */
export type ClaimVerificationStatus = 
  | 'VERIFIED'                // Authoritatively confirmed by primary/statutory evidence
  | 'SUPPORTED'               // Documented and credible, but below strict statutory verification threshold
  | 'CONFLICTING'             // Substantive factual disagreement between independent authoritative sources
  | 'INSUFFICIENT_EVIDENCE'   // Explicitly searched across sources, but no adequate documentation disclosed
  | 'MISSING'                 // Mandatory field required by contract but not yet located in evidence sweep
  | 'UNVERIFIED'              // Preliminary claim awaiting adversarial cross-examination
  // Backward-compatibility aliases
  | 'INCOMPLETE'
  | 'NOT_FOUND'
  | 'UNRESOLVED';

export type ArbiterResolution = 
  | 'CONSENSUS' 
  | 'EXPLORER_SELECTED' 
  | 'INVESTIGATOR_SELECTED' 
  | 'UNRESOLVED'
  | 'MUTUAL_ABSENCE'; // When both agents report no data (not a conflict)

/**
 * Contextual Source Authority Classification
 */
export type SourceAuthority = 
  | 'GOVERNMENT_STATUTORY'  // Official government portals, gazettes, state registries, Discoms
  | 'REGULATOR'             // Statutory regulators (NIRF, AICTE, UGC, BEE, RBI, SEC)
  | 'PRIMARY_ENTITY'        // Official domain of the entity under investigation (e.g. python.org, bits-pilani.ac.in)
  | 'ACADEMIC_PRIMARY'      // Peer-reviewed papers, IEEE, ArXiv, university research repositories
  | 'ACADEMIC_SECONDARY'    // Academic reviews, university blogs, scholarly essays
  | 'REPUTABLE_PUBLICATION' // Established news agencies (Reuters, Bloomberg, The Hindu, Mint)
  | 'INDUSTRY_SOURCE'       // Tech whitepapers, developer portals, official engineering blogs
  | 'SECONDARY_DIRECTORY'   // Third-party portals & aggregators (CollegeDunia, Shiksha, G2, Capterra)
  | 'AGGREGATOR'            // Crunchbase, Tracxn, JustDial, directories
  | 'REFERENCE'             // Encyclopedias, Wikipedia, MDN Web Docs
  | 'UNKNOWN'               // Unclassified web records
  // Legacy aliases
  | 'OFFICIAL_GOV'
  | 'PRIMARY_COMPANY'
  | 'ACADEMIC_INDUSTRY'
  | 'SECONDARY_MEDIA'
  | 'UNVERIFIED';

/**
 * Structured Research Contract
 * Defines what must be satisfied before research can be declared complete.
 */
export interface ResearchContract {
  intent: ResearchQueryIntent;
  topic: string;
  scope: {
    geography?: string;
    timeframe?: string;
    domain?: string;
  };
  candidateDiscoveryRequired: boolean;
  targetCandidateCount: number;
  requiredEntities: string[];
  requiredFields: string[];
  minimumRelevantSourcesPerEntity: number;
  preferredSourceTypes: (SourceAuthority | string)[];
  freshnessRequirement: string;
  maximumResearchRounds: number;
}

/**
 * Discovered Candidate Entity (for Ranking, Recommendation, Discovery)
 */
export interface CandidateEntity {
  name: string;
  category?: string;
  location?: string;
  relevanceRationale?: string;
  briefRationale?: string;
  primaryDomainOrUrl?: string;
  initialSourceUrl?: string;
}

/**
 * Deconstructed Multi-Agent Research Plan
 */
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
  contract?: ResearchContract;
}

/**
 * Evaluated Web Evidence Source
 */
export interface DiscoveredSource {
  id: string;
  sessionId?: string;
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
  relevanceScore?: number; // 0 to 100
  accepted?: boolean;
  rejectionReason?: string;
  targetEntity?: string;
  targetField?: string;
}

/**
 * Normalized Extracted Claim
 */
export interface ExtractedClaim {
  id: string;
  sessionId?: string;
  entityName: string;
  fieldName: string;
  value: string | null; // Missing values are explicitly null!
  sourceUrl: string;
  sourceTitle: string;
  sourceAuthority: SourceAuthority;
  supportingSnippet: string;
  discoveredBy: 'explorer' | 'investigator' | 'arbiter';
  confidenceScore: number | null; // Null for missing/insufficient evidence!
  retrievedAt: string;
  verificationStatus: ClaimVerificationStatus;
  reason?: string;
}

/**
 * Canonical Discovered Entity
 */
export interface DiscoveredEntity {
  id: string;
  sessionId?: string;
  name: string;
  category?: string;
  location?: string;
  fields: Record<string, {
    value: string | null;
    verifiedStatus: ClaimVerificationStatus;
    sourceUrl: string;
    sourceTitle: string;
    authority: SourceAuthority;
    evidenceStrength: number | null; // 0 - 100, null if missing
    snippet: string;
    resolvedBy?: ArbiterResolution;
    decisionBasis?: string;
    reason?: string;
  }>;
  overallStatus: ClaimVerificationStatus;
  evidenceCoverage: number; // 0 to 100 percentage
  verifiedFieldsCount?: number;
  insufficientFieldsCount?: number;
}

/**
 * Audited Conflict Item
 */
export interface ConflictItem {
  id: string;
  sessionId?: string;
  entityName: string;
  fieldName: string;
  explorerClaim: {
    value: string | null;
    sourceUrl: string;
    sourceTitle: string;
    authority: SourceAuthority;
    snippet: string;
  };
  investigatorClaim: {
    value: string | null;
    sourceUrl: string;
    sourceTitle: string;
    authority: SourceAuthority;
    snippet: string;
  };
  natureOfConflict: string;
  isSubstantiveContradiction?: boolean; // false if both are missing/uncertain
  escalatedToWebSearch: boolean;
  targetedQuery?: string;
  newEvidenceDiscovered?: string;
  arbiterDecision?: ArbiterResolution;
  finalValue?: string | null;
  decisionBasis?: string;
  resolutionStatus: 'PENDING' | 'RESOLVED' | 'UNRESOLVED';
}

/**
 * Deterministic Quality Gate Result
 */
export interface QualityGateResult {
  passed: boolean;
  evaluatedAt?: string;
  roundNumber?: number;
  score?: number; // 0 - 100
  qualityScore?: number;
  checks?: {
    requiredEntitiesCovered?: boolean;
    candidateCountAdequate?: boolean;
    minimumSourcesPerEntityMet?: boolean;
    noIrrelevantSourcesIncluded?: boolean;
    authoritativeSourcesPresent?: boolean;
    noMissingValuesMarkedVerified?: boolean;
    conflictsAdjudicated?: boolean;
  };
  failures?: string[];
  issues?: string[];
  repairActions?: string[];
  requiredEntitiesPassed?: boolean;
  candidateCountPassed?: boolean;
  fieldCoveragePassed?: boolean;
  candidateCount?: number;
  targetCandidateCount?: number;
  missingEntities?: string[];
  missingFields?: Array<{ entityName: string; fieldName: string }>;
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
  insufficientEvidenceDisclosures?: string[];
}

export type ResearchEventType = 
  | 'planner_started'
  | 'planner_completed'
  | 'contract_formed'
  | 'candidate_discovery_started'
  | 'candidate_discovered'
  | 'agent_started'
  | 'search_started'
  | 'search_query'
  | 'source_found'
  | 'source_rejected'
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
  | 'quality_gate_evaluating'
  | 'quality_gate_passed'
  | 'quality_gate_failed'
  | 'repair_round_started'
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
  stats?: Partial<ResearchStats>;
}

export interface ResearchStats {
  sourcesEvaluated?: number;
  sourcesAccepted?: number;
  sourcesRejected?: number;
  pagesScraped: number;
  entitiesEvaluated?: number;
  claimsCount: number;
  verifiedClaims?: number;
  supportedClaims?: number;
  conflictingClaims?: number;
  insufficientFields?: number;
  evidenceCoverage: number; // 0 to 100 percentage
  verifiedClaimConfidence?: number; // 0 to 100 percentage
  researchCompleteness?: number; // 0 to 100 percentage
  qualityGateScore?: number;
  researchRoundsCompleted?: number;
  // Legacy compatibility fields
  sourcesCount?: number;
  entitiesCount?: number;
  verifiedCount?: number;
  conflictsCount?: number;
  missingCount?: number;
}

export interface ResearchState {
  sessionId: string;
  query: string;
  status: 'idle' | 'planning' | 'discovering' | 'investigating' | 'arbitrating' | 'repairing' | 'visualizing' | 'completed' | 'error';
  isDemoMode: boolean;
  contract?: ResearchContract | null;
  plan: ResearchPlan | null;
  candidates?: CandidateEntity[];
  sources: DiscoveredSource[];
  rejectedSources?: DiscoveredSource[];
  entities: DiscoveredEntity[];
  claims: ExtractedClaim[];
  conflicts: ConflictItem[];
  dashboardSpec: DashboardSpec | null;
  qualityGate?: QualityGateResult | null;
  events: ResearchEvent[];
  stats: ResearchStats;
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
