/**
 * ResearchLens AI - Groq AI Inference Client
 * Multi-Agent Research & Evidence Intelligence Platform
 * Developer: Nishant Choudhary
 * 
 * Handles structured JSON completions with per-agent timeouts, model fallbacks,
 * schema validation, rate-limit resilience, and strict error reporting.
 */
import Groq from 'groq-sdk';
import { z } from 'zod';
import dotenv from 'dotenv';
import { GROQ_MODELS, AGENT_CONFIG, API_TIMEOUT_MS, MAX_RETRY_ATTEMPTS } from '../config/modelConfig';

dotenv.config({ path: '.env.local' });
dotenv.config();

let groqInstance: Groq | null = null;

export function getGroqApiKey(): string {
  return process.env.GROQ_API_KEY?.trim() || '';
}

export function getGroqClient(): Groq | null {
  const key = getGroqApiKey();
  if (!key) {
    return null;
  }
  if (!groqInstance || (groqInstance as any).apiKey !== key) {
    groqInstance = new Groq({ apiKey: key });
  }
  return groqInstance;
}

export function isGroqConfigured(): boolean {
  const key = getGroqApiKey();
  return Boolean(key && key.length > 10 && !key.includes('your_key_here') && !key.includes('MY_'));
}

export type AgentRoleType = 'planner' | 'explorer' | 'investigator' | 'arbiter' | 'synthesis' | 'askDataset';

export interface CallGroqStructuredOptions<T> {
  systemPrompt: string;
  userPrompt: string;
  schema: z.ZodSchema<T>;
  preferredModel?: string;
  agentRole?: AgentRoleType;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface CallGroqResult<T> {
  data: T;
  modelUsed: string;
  isFallback: boolean;
  durationMs: number;
  promptTokens?: number;
  completionTokens?: number;
}

export async function callGroqStructured<T>(params: CallGroqStructuredOptions<T>): Promise<CallGroqResult<T>> {
  const client = getGroqClient();
  if (!client) {
    throw new Error('GROQ_API_KEY is not configured in the server environment. Please set GROQ_API_KEY in .env.local');
  }

  // Derive settings from agent role if provided
  const roleConfig = params.agentRole ? AGENT_CONFIG[params.agentRole] : undefined;
  const primaryModel = params.preferredModel || roleConfig?.model || GROQ_MODELS.FLAGSHIP;
  const temp = params.temperature ?? roleConfig?.temperature ?? 0.2;
  const maxTokens = params.maxTokens ?? roleConfig?.maxTokens ?? 1500;
  const timeoutMs = params.timeoutMs ?? roleConfig?.timeoutMs ?? API_TIMEOUT_MS;

  const agentLabel = params.agentRole ? params.agentRole.toUpperCase() : 'AGENT';
  const fallbackModel = (primaryModel === GROQ_MODELS.FAST) 
    ? GROQ_MODELS.FALLBACK_ALT 
    : GROQ_MODELS.FALLBACK_FAST;

  let lastError: Error | null = null;
  const overallStart = Date.now();

  for (let attempt = 0; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
    const currentModel = attempt === 0 ? primaryModel : fallbackModel;
    const isFallback = currentModel !== primaryModel;
    const callStart = Date.now();

    console.log(`[ResearchLens] [${agentLabel}] Started (attempt: ${attempt + 1}/${MAX_RETRY_ATTEMPTS + 1}, model: ${currentModel}, timeout: ${timeoutMs / 1000}s)`);

    try {
      if (attempt > 0) {
        // Backoff pause before retry
        await new Promise(r => setTimeout(r, attempt * 2000));
      }

      const { content, promptTokens, completionTokens } = await executeGroqCallWithTimeout(
        client,
        currentModel,
        params.systemPrompt,
        params.userPrompt,
        temp,
        maxTokens,
        timeoutMs
      );

      const parsed = parseAndValidate(content, params.schema);
      const callDuration = Date.now() - callStart;

      console.log(`[ResearchLens] [${agentLabel}] Completed in ${callDuration}ms (model: ${currentModel}, tokens: in ${promptTokens ?? 'N/A'} / out ${completionTokens ?? 'N/A'})`);

      return {
        data: parsed,
        modelUsed: currentModel,
        isFallback,
        durationMs: Date.now() - overallStart,
        promptTokens,
        completionTokens,
      };
    } catch (err: any) {
      lastError = err;
      const callDuration = Date.now() - callStart;
      const errMsg = err?.message || String(err);

      console.warn(`[ResearchLens] [${agentLabel}] Failed after ${callDuration}ms with model ${currentModel}: ${errMsg}`);

      // 401: Authentication error - no point retrying
      if (errMsg.includes('401') || errMsg.toLowerCase().includes('invalid api key')) {
        throw new Error(`Authentication failed with Groq API. Please verify that GROQ_API_KEY in .env.local is valid.`);
      }

      // 429: Rate-limiting - wait for rate-limit window
      if (errMsg.includes('429') || errMsg.toLowerCase().includes('rate limit')) {
        console.warn(`[ResearchLens] [${agentLabel}] Rate limit encountered on Groq. Waiting 4000ms before retry...`);
        await new Promise(r => setTimeout(r, 4000));
      }
    }
  }

  // If retries failed, provide an honest, actionable failure message
  const failureTime = Date.now() - overallStart;
  const specificReason = lastError?.message || 'Inference operation failed';
  console.error(`[ResearchLens] [${agentLabel}] Exceeded maximum retry attempts after ${failureTime}ms: ${specificReason}`);

  throw new Error(`[${agentLabel}] request failed: ${specificReason}`);
}

interface ExecuteResult {
  content: string;
  promptTokens?: number;
  completionTokens?: number;
}

async function executeGroqCallWithTimeout(
  client: Groq,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  temperature: number,
  maxTokens: number,
  timeoutMs: number
): Promise<ExecuteResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const completion = await client.chat.completions.create(
      {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
      },
      { signal: controller.signal }
    );

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error(`Empty response returned from model ${model}`);
    }

    return {
      content,
      promptTokens: completion.usage?.prompt_tokens,
      completionTokens: completion.usage?.completion_tokens,
    };
  } catch (err: any) {
    if (err.name === 'AbortError' || err.message?.includes('aborted')) {
      throw new Error(`Inference request timed out after ${timeoutMs / 1000} seconds`);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

function parseAndValidate<T>(rawJson: string, schema: z.ZodSchema<T>): T {
  let cleaned = rawJson.trim();

  // Strip markdown code fences
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '').trim();
  }

  // Extract outermost JSON block
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  let jsonObject: any;
  try {
    jsonObject = JSON.parse(cleaned);
  } catch (parseError: any) {
    // Basic repair for trailing commas
    try {
      const repaired = cleaned
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');
      jsonObject = JSON.parse(repaired);
    } catch {
      throw new Error(`Failed to parse LLM response as JSON: ${parseError.message}. Content preview: ${cleaned.substring(0, 120)}...`);
    }
  }

  try {
    return schema.parse(jsonObject);
  } catch (validationErr: any) {
    throw new Error(`Schema validation error on LLM output: ${validationErr.message}`);
  }
}

export { GROQ_MODELS as MODEL_CONFIG };
