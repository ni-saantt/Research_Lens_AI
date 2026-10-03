/**
 * ResearchLens AI - Ask the Dataset Prompt
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * NLP Task: Closed-domain question answering, retrieval grounding,
 * semantic table reasoning, and citation synthesis.
 */

import { DiscoveredEntity } from '../types/research';

export interface DatasetPromptInput {
  question: string;
  entities: DiscoveredEntity[];
}

export function buildDatasetSystemPrompt(): string {
  return `You are the Grounded Dataset Query Interpreter for ResearchLens AI, developed by Nishant Choudhary.

Your sole purpose is to answer natural-language analyst questions based EXCLUSIVELY on the verified session entities and evidence provided in the user prompt.

STRICT GROUNDING & ANTI-HALLUCINATION RULES:
1. CLOSED WORLD ASSUMPTION: Answer using ONLY the entities, fields, values, sources, and verification statuses provided in the current dataset.
2. NO EXTERNAL KNOWLEDGE: Do not bring in facts, entities, numbers, or dates from outside the provided records.
3. INSUFFICIENT DATA TRANSPARENCY: If the dataset does not contain enough information to fully answer the question, explicitly state: "The current research dataset does not contain sufficient verified evidence to answer this question." Then explain what is missing.
4. HIGHEST CONFIDENCE QUERY RULE: When asked which findings have highest confidence, return ONLY actual substantiated claims with high evidence scores. NEVER present missing fields, null values, or unverified disclosures as high-confidence findings!
5. CITATION REQUIREMENT: Whenever referencing a value or fact, cite the entity name and the supporting source URL or authority.
6. CONCISE & FACTUAL: Keep the answer clear, structured, and free of speculative language.

OUTPUT FORMAT:
Return ONLY a valid JSON object matching this structure:
{
  "answer": "Concise, grounded answer referencing specific entities and values",
  "highlightEntities": ["Entity Name 1", "Entity Name 2"],
  "filteredCount": 2,
  "provenanceNote": "Citing primary sources from [Source Domain] verified by Arbiter Agent"
}`;
}

export function buildDatasetUserPrompt(input: DatasetPromptInput): string {
  // Compress entity records to essential fields for token efficiency
  const formattedEntities = input.entities.map(e => {
    const fieldsFormatted: Record<string, any> = {};
    for (const [k, v] of Object.entries(e.fields || {})) {
      fieldsFormatted[k] = {
        value: v.value !== null ? v.value : '[INSUFFICIENT EVIDENCE / ABSENT]',
        status: v.verifiedStatus,
        source: v.sourceTitle || v.sourceUrl,
        authority: v.authority,
        confidence: v.value !== null ? v.evidenceStrength : null,
      };
    }
    return {
      name: e.name,
      category: e.category,
      location: e.location,
      status: e.overallStatus,
      coverage: `${e.evidenceCoverage}%`,
      fields: fieldsFormatted,
    };
  });

  return `USER QUESTION:
"${input.question}"

AVAILABLE VERIFIED DATASET (${input.entities.length} records in session memory):
${JSON.stringify(formattedEntities, null, 2)}

Answer the question strictly according to the Grounding Rules and return the AskDatasetResponse JSON object.`;
}
