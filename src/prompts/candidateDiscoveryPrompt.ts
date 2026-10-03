/**
 * ResearchLens AI - Candidate Discovery Agent Prompt
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * NLP Task: Entity recognition, directory surfacing, and candidate extraction
 * from broad search results before deep attribute-level verification.
 */
import { ResearchContract, DiscoveredSource } from '../types/research';

export interface CandidateDiscoveryPromptInput {
  userQuery: string;
  contract: ResearchContract;
  webSources: DiscoveredSource[];
}

export function buildCandidateDiscoverySystemPrompt(): string {
  return `You are the Candidate Discovery Specialist for ResearchLens AI, an autonomous multi-agent verification system developed by Nishant Choudhary.

Your sole role is Candidate Identification & Normalization:
1. Examine the broad search results provided to identify candidate entities that fit the user's research request.
2. Aim to discover 4 to 8 viable, diverse candidates where evidence permits (minimum 3 candidates unless the target universe is strictly smaller).
3. Do NOT prematurely commit to only the first entity mentioned.
4. Normalize candidate names (e.g., standard recognized institution, company, or tool names).
5. Exclude obviously irrelevant entities or entities outside the target geography/scope.
6. Provide a 1-sentence rationale for why each candidate is a plausible option for this inquiry.

OUTPUT FORMAT:
Return ONLY a valid JSON object matching this structure:
{
  "searchQueriesUsed": ["query 1", "query 2"],
  "candidates": [
    {
      "name": "Standardized Entity Name",
      "category": "Domain Category",
      "location": "Geographic Location",
      "briefRationale": "Plausible candidate matching the ranking/discovery criteria",
      "initialSourceUrl": "https://source.com/page"
    }
  ],
  "summary": "Summary of candidates surfaced across public web evidence."
}`;
}

export function buildCandidateDiscoveryUserPrompt(input: CandidateDiscoveryPromptInput): string {
  const sourcesContext = input.webSources.map((s, idx) => `[Source ${idx + 1}]
Domain: ${s.domain}
Title: ${s.title}
URL: ${s.url}
Snippet: ${s.snippet}`).join('\n\n');

  return `RESEARCH QUERY: "${input.userQuery}"
TARGET INTENT: ${input.contract.intent}
TOPIC: ${input.contract.topic}
GEOGRAPHY / SCOPE: ${input.contract.scope?.geography || 'As specified'}
TARGET CANDIDATE COUNT: ${input.contract.targetCandidateCount || 5}

BROAD SEARCH EVIDENCE (${input.webSources.length} sources):
${sourcesContext}

Identify and normalize 4 to 8 plausible candidate entities for this research inquiry. Return the CandidateDiscoveryOutput JSON object.`;
}
