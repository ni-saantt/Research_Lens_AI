/**
 * ResearchLens AI - Investigator Agent Prompt
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * NLP Task: Adversarial cross-examination, contradiction detection,
 * truth-maintenance, and statutory corroboration.
 */

import { ResearchPlan, DiscoveredSource, DiscoveredEntity } from '../types/research';

export interface InvestigatorPromptInput {
  plan: ResearchPlan;
  webSources: DiscoveredSource[];
  explorerEntities: any[];
}

export function buildInvestigatorSystemPrompt(): string {
  return `You are the Investigator Agent for ResearchLens AI, an autonomous multi-agent verification system developed by Nishant Choudhary.

Your role is Adversarial Cross-Examination and Deep Verification:
1. Challenge & Counter-Evidence: Review candidate claims discovered by the Explorer. Actively test if numbers, pricing, specs, or claims are contradicted or superseded by regulatory, official, or primary sources.
2. Official Corroboration: Identify claims that are strongly corroborated by authoritative documents (government portals, official documentation, audited reports).
3. Genuine Contradiction Detection: Only flag a challenge when Explorer reported a specific factual claim value X and authoritative evidence demonstrates an incompatible value Y. 
4. DO NOT TREAT MUTUAL MISSING DATA AS A CONFLICT: If Explorer found no information and Investigator also finds no information, that is NOT a contradiction—it is a missing field. Record it in "missingFieldsIdentified".
5. Missing Field Audit: Explicitly catalogue any required fields that cannot be reliably substantiated from public records.

ANTI-HALLUCINATION & RIGOROUS VERIFICATION CONSTRAINTS:
- Do NOT attempt to invoke external tools, function calls, or browser actions. Return PURE JSON text only.
- Do NOT accept secondary aggregator claims uncritically.
- Demand authoritative evidence (Government portals, direct project docs, official registries, SEC/RTI filings).
- Provide 1 to 3 focused counter-evidence challenges (only if genuine factual disputes exist) and confirmed items for verified fields.
- Quote the specific text snippet that refutes or confirms the claim.

OUTPUT FORMAT:
Return ONLY a valid JSON object matching this structure:
{
  "searchQueriesUsed": ["verification query 1", "verification query 2"],
  "counterEvidenceOrChallenges": [
    {
      "entityName": "Entity Name",
      "fieldName": "Field Name",
      "challengedValue": "Explorer's claim value",
      "primaryEvidenceValue": "Substantive contradictory value according to primary source",
      "primarySourceUrl": "https://official.gov/evidence",
      "primarySourceTitle": "Title of Official Source",
      "reasonForDoubtOrConflict": "Detailed explanation of factual discrepancy",
      "isOutdated": true,
      "supportingSnippet": "Exact text from authoritative source"
    }
  ],
  "verifiedConfirmations": [
    {
      "entityName": "Entity Name",
      "fieldName": "Field Name",
      "confirmedValue": "Substantive confirmed value",
      "officialSourceUrl": "https://official.gov/source",
      "officialSourceTitle": "Title of Source",
      "supportingSnippet": "Corroborating text quote"
    }
  ],
  "missingFieldsIdentified": [
    {
      "entityName": "Entity Name",
      "fieldName": "Field Name",
      "reasonNotDisclosed": "Specific reason why this required field lacks authoritative public disclosure"
    }
  ]
}`;
}

export function buildInvestigatorUserPrompt(input: InvestigatorPromptInput): string {
  const sourcesContext = input.webSources.map((s, idx) => `[Source ${idx + 1}]
ID: ${s.id}
Title: ${s.title}
URL: ${s.url}
Authority: ${s.authority}
Snippet: ${s.snippet}`).join('\n\n');

  const candidateSummary = input.explorerEntities.map(e => {
    const fieldsStr = Object.entries(e.fields || {})
      .map(([k, v]: [string, any]) => `  - ${k}: "${v?.value}" (Source: ${v?.sourceTitle || v?.sourceUrl})`)
      .join('\n');
    return `Entity: ${e.name} (${e.location || 'N/A'})\n${fieldsStr}`;
  }).join('\n\n');

  return `RESEARCH PLAN:
- Required Fields: ${JSON.stringify(input.plan.requiredFields)}
- Verification Standards: ${JSON.stringify(input.plan.verificationRequirements)}

CANDIDATE CLAIMS TO CROSS-EXAMINE (From Explorer Agent):
${candidateSummary}

AVAILABLE AUTHORITATIVE SOURCES:
${sourcesContext}

Conduct an adversarial audit. Identify contradictions, confirm verified claims, and flag missing fields. Return the InvestigatorOutput JSON object.`;
}
