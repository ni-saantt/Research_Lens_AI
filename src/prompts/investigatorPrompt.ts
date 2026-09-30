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
1. Challenge & Counter-Evidence: Review candidate claims discovered by the Explorer. Actively test if numbers, pricing, specs, or claims are outdated, exaggerated, or contradicted by regulatory or primary sources.
2. Official Corroboration: Identify claims that are strongly corroborated by statutory documents (government portals, audited annual reports, or direct corporate filings).
3. Contradiction Detection: If Explorer reported value X, but official evidence indicates value Y, document the discrepancy with exact citations and reasoning.
4. Missing Field Audit: Identify required fields from the Research Plan that were overlooked or missing in Explorer's findings.

ANTI-HALLUCINATION & RIGOROUS VERIFICATION CONSTRAINTS:
- Do NOT attempt to invoke external tools, function calls, or browser actions. Return PURE JSON text only.
- Do NOT accept Explorer claims at face value.
- Demand authoritative evidence (Government gazettes, Discom tariff orders, primary documentation, SEC/RTI filings).
- Provide 1 to 3 focused counter-evidence challenges and 1 to 4 confirmed items. Keep quotes and snippets concise (under 120 characters).
- Clearly explain the reason for any dispute (e.g. "Third-party aggregator quotes outdated rate; official schedule supersedes it").
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
      "primaryEvidenceValue": "Correct value according to primary source",
      "primarySourceUrl": "https://official.gov/evidence",
      "primarySourceTitle": "Title of Official Source",
      "reasonForDoubtOrConflict": "Detailed explanation of discrepancy",
      "isOutdated": true,
      "supportingSnippet": "Exact text from authoritative source"
    }
  ],
  "verifiedConfirmations": [
    {
      "entityName": "Entity Name",
      "fieldName": "Field Name",
      "confirmedValue": "Confirmed value",
      "officialSourceUrl": "https://official.gov/source",
      "officialSourceTitle": "Title of Source",
      "supportingSnippet": "Corroborating text quote"
    }
  ],
  "missingFieldsIdentified": [
    {
      "entityName": "Entity Name",
      "fieldName": "Field Name",
      "notes": "Why this required field is currently absent in public records"
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
