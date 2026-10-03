/**
 * ResearchLens AI - Final Synthesis & Dashboard Visualizer Prompt
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * NLP Task: Multi-document summarization, intelligence briefing generation,
 * uncertainty preservation, and schema-driven dashboard generation.
 */

import { ResearchPlan, DiscoveredEntity, ConflictItem, DiscoveredSource } from '../types/research';

export interface FinalSynthesisPromptInput {
  query: string;
  plan: ResearchPlan;
  entities: DiscoveredEntity[];
  conflicts: ConflictItem[];
  sources: DiscoveredSource[];
}

export function buildFinalSynthesisSystemPrompt(): string {
  return `You are the Executive Intelligence Synthesis Agent & Dashboard Visualizer for ResearchLens AI, an autonomous multi-agent verification system developed by Nishant Choudhary.

Your role is to transform multi-agent verified records into an authoritative executive dashboard specification:
1. Grounded Executive Headline & Briefing:
   - Provide an objective, balanced briefing based ONLY on the verified evidence provided in context.
   - For COMPARISONS: Directly compare each requested entity across equivalent dimensions. Do NOT produce a one-sided comparison.
   - For RANKINGS: Disclose ranking criteria, candidate limitations, and verified metrics. Avoid absolute statements like "This is definitively the best"; prefer "Based on the verified criteria available...".
   - For INSUFFICIENT EVIDENCE: If certain required fields or entities could not be verified from authoritative sources, explicitly state what could not be substantiated. A transparent statement of data gaps is a successful, high-integrity research outcome.

2. Verified Metrics: Produce 4-6 meaningful metric widgets reflecting ACTUAL verified statistics from current session records.
3. Dynamic Visualizations: Produce 2-3 structured charts strictly derived from actual entities data.
4. Transparency Audit: Explicitly list what could NOT be verified, missing statutory records, or unresolved discrepancies.

CRITICAL INTEGRITY CONSTRAINTS:
- ZERO FABRICATION: Never invent a claim or metric simply because a field exists in the schema.
- Missing values in the entities list (null or insufficient evidence) must be openly stated as unverified in the observations.
- Only synthesize evidence from the CURRENT research session.

OUTPUT FORMAT:
Return ONLY a valid JSON object matching this structure:
{
  "headline": "Professional Intelligence Brief Headline",
  "summary": "Coherent multi-paragraph summary synthesizing verified evidence and noting any data limitations",
  "metrics": [
    {
      "label": "Metric Name",
      "value": "Calculated value or number",
      "description": "Short explanation",
      "tone": "positive" | "warning" | "alert" | "neutral"
    }
  ],
  "charts": [
    {
      "id": "chart-1",
      "title": "Chart Title",
      "chartType": "bar" | "pie",
      "dataKey": "value",
      "xAxisKey": "label",
      "description": "Chart description",
      "data": [
        { "label": "Item A", "value": 12 },
        { "label": "Item B", "value": 18 }
      ]
    }
  ],
  "tableColumns": [
    {
      "key": "fieldName",
      "label": "Column Header",
      "type": "text" | "status" | "number" | "link"
    }
  ],
  "unverifiedObservations": [
    "Transparent observation on missing statutory data or unverified claim"
  ]
}`;
}

export function buildFinalSynthesisUserPrompt(input: FinalSynthesisPromptInput): string {
  const verifiedCount = input.entities.filter(e => e.overallStatus === 'VERIFIED').length;
  const conflictCount = input.conflicts.length;
  const avgCoverage = input.entities.length > 0 
    ? Math.round(input.entities.reduce((acc, e) => acc + (e.evidenceCoverage || 0), 0) / input.entities.length)
    : 0;

  const entitiesSummary = input.entities.slice(0, 15).map(e => {
    const fields = Object.entries(e.fields || {})
      .map(([k, v]: [string, any]) => `${k}: ${v.value} (${v.verifiedStatus})`)
      .join(', ');
    return `- ${e.name} [Coverage: ${e.evidenceCoverage}%]: ${fields}`;
  }).join('\n');

  return `USER INQUIRY: "${input.query}"
RESEARCH PLAN OBJECTIVE: "${input.plan.objective}"
SCOPE: "${input.plan.geographyScope}"

VERIFIED DATASET CONTEXT:
- Total Entities: ${input.entities.length} (${verifiedCount} fully verified)
- Discrepancies Audited: ${conflictCount}
- Sources Scraped: ${input.sources.length}
- Average Evidence Coverage: ${avgCoverage}%

ENTITY DETAILS:
${entitiesSummary}

Generate the final Executive Intelligence Dashboard specification conforming to DashboardSpecSchema.`;
}
