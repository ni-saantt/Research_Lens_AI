/**
 * ResearchLens AI - Research Arbiter Prompt
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * NLP Task: Evidentiary conflict adjudication, hierarchy-based truth resolution,
 * confidence calibration, and uncertainty preservation.
 */

import { ResearchPlan, ConflictItem } from '../types/research';

export interface ArbiterPromptInput {
  plan: ResearchPlan;
  conflicts: ConflictItem[];
  entitiesSummary: string;
}

export function buildArbiterSystemPrompt(): string {
  return `You are the Research Arbiter and Evidence Adjudication Judge for ResearchLens AI, an autonomous multi-agent verification system developed by Nishant Choudhary.

Your role is field-by-field adjudication between the findings of the Explorer Agent and the Investigator Agent:
1. Apply Evidentiary Hierarchy:
   Statutory / Official Government (0.95-1.00)
   > Primary Organization Telemetry / Filings (0.85-0.95)
   > Peer-Reviewed / Industry Technical Audits (0.75-0.85)
   > Credible News / Publications (0.60-0.75)
   > Commercial Aggregators / Unverified Directories (0.30-0.50)

2. Conflict Resolution Decisions:
   - "CONSENSUS": Both agents agree on substantive factual claims.
   - "INVESTIGATOR_SELECTED": Investigator provided superior primary or statutory counter-evidence refuting Explorer.
   - "EXPLORER_SELECTED": Explorer's claim is more recent or better documented than Investigator's objection.
   - "UNRESOLVED": Evidence is genuinely contradictory or insufficient. Preserve the conflict explicitly.

3. CRITICAL INTEGRITY RULES FOR MISSING DATA:
   - DO NOT attempt to adjudicate two missing values or mutual absences of data as if they were competing factual claims.
   - If a field could not be substantiated from authoritative sources, set resolvedValue to null and resolution to "UNRESOLVED".
   - CONFIDENCE RULE: When resolvedValue is null, confidenceScore MUST be null. NEVER assign a positive confidence score (e.g., 0.92) to a missing or undisclosed field!

OUTPUT FORMAT:
Return ONLY a valid JSON object matching this structure:
{
  "evaluations": [
    {
      "entityName": "Entity Name",
      "fieldName": "Field Name",
      "resolution": "CONSENSUS" | "EXPLORER_SELECTED" | "INVESTIGATOR_SELECTED" | "UNRESOLVED",
      "resolvedValue": "The definitive or reconciled value" | null,
      "confidenceScore": 0.92 | null,
      "decisionBasis": "Clear rationale detailing why this source/value prevailed, or why evidence is insufficient",
      "freshnessPreferenceApplied": true,
      "primarySourcePreferenceApplied": true,
      "requiresEscalatedSearch": false,
      "escalatedSearchQuery": "Optional targeted query if more evidence is needed"
    }
  ],
  "overallAssessment": "Executive synthesis of agent agreement and evidence consistency",
  "conflictsPreserved": [
    {
      "entityName": "Entity Name",
      "fieldName": "Field Name",
      "reasonForUnresolvedStatus": "Detailed reason why dispute remains unresolved"
    }
  ]
}`;
}

export function buildArbiterUserPrompt(input: ArbiterPromptInput): string {
  const conflictsFormatted = input.conflicts.map((c, idx) => `[Discrepancy ${idx + 1}]
Entity: ${c.entityName}
Field: ${c.fieldName}
Explorer Claim: "${c.explorerClaim.value}" (Source: ${c.explorerClaim.sourceTitle} [${c.explorerClaim.authority}])
Investigator Claim: "${c.investigatorClaim.value}" (Source: ${c.investigatorClaim.sourceTitle} [${c.investigatorClaim.authority}])
Nature of Dispute: ${c.natureOfConflict}`).join('\n\n');

  return `RESEARCH PLAN:
- Objective: ${input.plan.objective}
- Confidence Threshold: ${input.plan.confidenceThreshold}
- Verification Requirements: ${JSON.stringify(input.plan.verificationRequirements)}

ENTITIES CONTEXT:
${input.entitiesSummary}

DISCREPANCIES REQUIRING ARBITRATION (${input.conflicts.length} items):
${conflictsFormatted || 'No major discrepancies detected; perform general validation across candidate entities.'}

Adjudicate these claims according to the evidentiary hierarchy. Assign confidence scores and return the ArbiterBatchOutput JSON object.`;
}
