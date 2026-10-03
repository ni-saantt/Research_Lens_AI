/**
 * ResearchLens AI - Centralized Model & Inference Configuration
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 */

export interface AgentModelSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  timeoutMs: number;
  description: string;
}

export const GROQ_MODELS = {
  // High-performance available model with ample quota and JSON capability
  FLAGSHIP: process.env.GROQ_HEAVY_MODEL || 'qwen/qwen3.8-27b',
  FAST: process.env.GROQ_LIGHT_MODEL || 'qwen/qwen3.8-27b',
  FALLBACK_FAST: 'openai/gpt-oss-20b',
  FALLBACK_FLAGSHIP: 'openai/gpt-oss-120b',
  FALLBACK_ALT: 'openai/gpt-oss-20b',
};

export const AGENT_CONFIG: Record<string, AgentModelSettings> = {
  planner: {
    model: GROQ_MODELS.FAST,
    temperature: 0.15,
    maxTokens: 2048,
    timeoutMs: 60000, // 60s
    description: 'Decomposes user query into intent, target entities, and dual search strategies.',
  },
  explorer: {
    model: GROQ_MODELS.FAST,
    temperature: 0.25,
    maxTokens: 3072,
    timeoutMs: 75000, // 75s
    description: 'Discovers candidate entities, extracts initial claims, and surfaces primary URLs.',
  },
  investigator: {
    model: GROQ_MODELS.FAST,
    temperature: 0.15,
    maxTokens: 3072,
    timeoutMs: 75000, // 75s
    description: 'Conducts adversarial verification, checks official registries, and identifies contradictions.',
  },
  arbiter: {
    model: GROQ_MODELS.FLAGSHIP,
    temperature: 0.10,
    maxTokens: 3072,
    timeoutMs: 90000, // 90s
    description: 'Reconciles conflicting claims using statutory source hierarchy and assigns calibrated confidence.',
  },
  synthesis: {
    model: GROQ_MODELS.FAST,
    temperature: 0.20,
    maxTokens: 3072,
    timeoutMs: 75000, // 75s
    description: 'Synthesizes executive intelligence brief and structures dynamic dashboard specification.',
  },
  askDataset: {
    model: GROQ_MODELS.FAST,
    temperature: 0.10,
    maxTokens: 1500,
    timeoutMs: 45000, // 45s
    description: 'Answers researcher questions grounded exclusively in verified session entities.',
  },
};

export const API_TIMEOUT_MS = 75000; // 75 seconds default fallback
export const MAX_RETRY_ATTEMPTS = 1; // Controlled single retry with backoff
