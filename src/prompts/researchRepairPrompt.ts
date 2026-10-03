/**
 * ResearchLens AI - Research Repair Agent Prompt
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * Formulates targeted query reformulations and self-correction search plans
 * when the deterministic Quality Gate detects missing entities, deficient candidates,
 * or insufficient evidence.
 */
import { ResearchContract, QualityGateResult } from '../types/research';

export interface ResearchRepairPromptInput {
  userQuery: string;
  contract: ResearchContract;
  qualityGateResult: QualityGateResult;
  roundNumber: number;
}

export function buildResearchRepairSystemPrompt(): string {
  return `You are the Research Self-Correction & Repair Specialist for ResearchLens AI, developed by Nishant Choudhary.

Your role is to diagnose research deficiencies identified by the Quality Gate and formulate high-precision, reformulated search queries to obtain the missing evidence:
1. Candidate Shortfalls: If candidate discovery yielded fewer than target candidates, formulate targeted queries to discover additional qualifying candidates.
2. Uncovered Entities: If a required comparison entity (e.g., "JavaScript" in a Python vs JavaScript comparison) has insufficient evidence, formulate targeted ecosystem queries for that specific entity.
3. Missing Fields: If critical fields (e.g., accreditation, ranking, fees, licensing) lack evidence, formulate targeted domain-specific or site-specific search queries (e.g., using "site:gov" or authoritative keywords).
4. Genuine Contradictions: If two substantive claims conflict, formulate a disambiguation query for primary authoritative records.

CONSTRAINTS:
- Keep queries concise (3 to 6 words each), suitable for web search engines.
- Do NOT repeat failed generic queries; use reformulated keywords or authoritative regulatory terms.
- Limit to 2 to 4 high-yield queries.

OUTPUT FORMAT:
Return ONLY a valid JSON object matching this structure:
{
  "needsRepair": true,
  "repairRound": 2,
  "reasons": ["Explanation of what needs repair"],
  "targetedQueries": ["query 1", "query 2"],
  "missingEntities": ["Entity Name"],
  "missingFields": [
    {
      "entityName": "Entity Name",
      "fieldName": "Field Name",
      "suggestedQuery": "focused search query"
    }
  ]
}`;
}

export function buildResearchRepairUserPrompt(input: ResearchRepairPromptInput): string {
  return `ORIGINAL INQUIRY: "${input.userQuery}"
INTENT: ${input.contract.intent}
CURRENT REPAIR ROUND: ${input.roundNumber} of ${input.contract.maximumResearchRounds}

QUALITY GATE DEFICIENCY REPORT:
- Passed: ${input.qualityGateResult.passed}
- Issues: ${input.qualityGateResult.issues?.join('; ') || input.qualityGateResult.failures?.join('; ') || 'None'}
- Missing Required Entities: ${input.qualityGateResult.missingEntities?.join(', ') || 'None'}
- Missing Required Fields: ${JSON.stringify(input.qualityGateResult.missingFields || [])}
- Candidate Count: ${input.qualityGateResult.candidateCount || 0} (Target: ${input.qualityGateResult.targetCandidateCount || 0})

Formulate an optimal Research Repair Plan with targeted search reformulations. Return the ResearchRepairPlan JSON object.`;
}
