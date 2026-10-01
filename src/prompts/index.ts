/**
 * ResearchLens AI - Prompt Architecture Registry
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * Central registry exporting all agent prompts, input builders, and schemas.
 */

export * from './plannerPrompt';
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
    name: 'Research Planner Prompt',
    agent: 'Planner Agent',
    nlpTask: 'Query understanding, intent extraction, entity recognition, search keyword formulation',
    groundingStrategy: 'Task decomposition with verifiable field criteria and risk modeling',
    temperature: 0.15,
  },
  explorer: {
    name: 'Explorer Discovery Prompt',
    agent: 'Explorer Agent',
    nlpTask: 'Named entity extraction, claim formulation, and web text snippet grounding',
    groundingStrategy: 'Direct quote attribution to retrieved web source URLs',
    temperature: 0.3,
  },
  investigator: {
    name: 'Investigator Verification Prompt',
    agent: 'Investigator Agent',
    nlpTask: 'Adversarial cross-examination, contradiction detection, and truth-maintenance',
    groundingStrategy: 'Corroboration against statutory and regulatory hierarchy',
    temperature: 0.15,
  },
  arbiter: {
    name: 'Arbiter Adjudication Prompt',
    agent: 'Arbiter Agent / Judge',
    nlpTask: 'Evidentiary conflict adjudication and calibrated confidence scoring',
    groundingStrategy: 'Statutory authority hierarchy and explicit uncertainty preservation',
    temperature: 0.1,
  },
  finalSynthesis: {
    name: 'Executive Synthesis Prompt',
    agent: 'Synthesis / Visualizer Agent',
    nlpTask: 'Multi-document summarization, dynamic dashboard structuring, and gap disclosure',
    groundingStrategy: 'Strict alignment with verified session records; unverified observations audit',
    temperature: 0.25,
  },
  askDataset: {
    name: 'Ask the Dataset Prompt',
    agent: 'Dataset Query Interpreter',
    nlpTask: 'Closed-domain question answering, citation generation, and semantic table reasoning',
    groundingStrategy: 'Strict closed-world constraint over in-memory session entities',
    temperature: 0.1,
  },
};
