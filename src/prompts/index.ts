/**
 * ResearchLens AI - Prompt Architecture Registry
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * Central registry exporting all agent prompts, input builders, and schemas.
 */

export * from './plannerPrompt';
export * from './candidateDiscoveryPrompt';
export * from './researchRepairPrompt';
export * from './explorerPrompt';
export * from './investigatorPrompt';
export * from './arbiterPrompt';
export * from './finalSynthesisPrompt';
export * from './datasetPrompt';

export interface PromptMetadata {
  name: string;
  agent: string;
  nlpTask: string;
  groundingStrategy: string;
  temperature: number;
}

export const PROMPT_REGISTRY: Record<string, PromptMetadata> = {
  planner: {
    name: 'Research Planner & Intent Classifier Prompt',
    agent: 'Planner Agent',
    nlpTask: 'Query understanding, semantic intent classification, research contract definition, entity scope, search keyword formulation',
    groundingStrategy: 'Task decomposition with verifiable field criteria, candidate discovery gating, and risk modeling',
    temperature: 0.15,
  },
  candidateDiscovery: {
    name: 'Candidate Discovery Prompt',
    agent: 'Candidate Discovery Specialist',
    nlpTask: 'Entity candidate extraction, directory discovery, normalization, and deduplication',
    groundingStrategy: 'Multi-candidate broad retrieval avoiding premature single-entity lock-in',
    temperature: 0.2,
  },
  researchRepair: {
    name: 'Research Self-Correction & Repair Prompt',
    agent: 'Research Repair Specialist',
    nlpTask: 'Query reformulation, missing entity targeted retrieval, and research gap resolution',
    groundingStrategy: 'Quality Gate feedback-driven precision query generation',
    temperature: 0.15,
  },
  explorer: {
    name: 'Explorer Discovery Prompt',
    agent: 'Explorer Agent',
    nlpTask: 'Named entity extraction, claim formulation, and web text snippet grounding',
    groundingStrategy: 'Direct quote attribution to retrieved web source URLs with strict nulls for missing data',
    temperature: 0.25,
  },
  investigator: {
    name: 'Investigator Verification Prompt',
    agent: 'Investigator Agent',
    nlpTask: 'Adversarial cross-examination, genuine contradiction detection, and statutory corroboration',
    groundingStrategy: 'Corroboration against statutory and regulatory hierarchy; separation of missing data from conflicts',
    temperature: 0.15,
  },
  arbiter: {
    name: 'Arbiter Adjudication Prompt',
    agent: 'Arbiter Agent / Judge',
    nlpTask: 'Evidentiary conflict adjudication and calibrated confidence scoring',
    groundingStrategy: 'Statutory authority hierarchy, null-confidence for missing fields, and explicit uncertainty preservation',
    temperature: 0.1,
  },
  finalSynthesis: {
    name: 'Executive Synthesis Prompt',
    agent: 'Synthesis / Visualizer Agent',
    nlpTask: 'Multi-document summarization, dynamic dashboard structuring, and gap disclosure',
    groundingStrategy: 'Strict alignment with current session verified records; unverified observations audit',
    temperature: 0.2,
  },
  askDataset: {
    name: 'Ask the Dataset Prompt',
    agent: 'Dataset Query Interpreter',
    nlpTask: 'Closed-domain question answering and semantic table reasoning',
    groundingStrategy: 'Bounded RAG on current session entities; exclusion of missing values from high-confidence answers',
    temperature: 0.1,
  },
};

