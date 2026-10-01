/**
 * ResearchLens AI - Express Server Application Core
 * Multi-Agent NLP Research & Evidence Verification System
 * Developer: Nishant Choudhary
 * 
 * Can be mounted by Vite / Node local server (server.ts)
 * OR exported as a Vercel Serverless Function (api/index.ts).
 */
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { ResearchOrchestrator } from './services/orchestrator';
import { isGroqConfigured, MODEL_CONFIG, callGroqStructured } from './services/groqClient';
import { AskDatasetResponseSchema } from './services/schemas';
import { SystemStatus } from './types/research';
import { buildDatasetSystemPrompt, buildDatasetUserPrompt } from './prompts';

// Load environment variables (.env.local and .env)
dotenv.config({ path: '.env.local' });
dotenv.config();

export const app = express();

app.use(express.json({ limit: '2mb' }));

// CORS headers to ensure seamless deployments across custom domains
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// In-memory active research sessions
const activeSessions = new Map<string, ResearchOrchestrator>();

// 1. System Status Endpoint
app.get('/api/system/status', (req: Request, res: Response) => {
  const configured = isGroqConfigured();
  const status: SystemStatus = {
    groqConfigured: configured,
    groqModel: configured
      ? `${MODEL_CONFIG.FLAGSHIP} (Primary) / ${MODEL_CONFIG.FAST} (Planner)`
      : 'Ready (Awaiting GROQ_API_KEY)',
    searchEngine: 'Live Multi-Vector Search & Cheerio Crawler',
    scraperActive: true,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  };
  res.json(status);
});

// 2. Real-Time Research Execution SSE Stream
app.get('/api/research/stream', async (req: Request, res: Response) => {
  const query = (req.query.query as string || '').trim();
  const sessionId = (req.query.sessionId as string) || `session-${Date.now()}`;

  if (!query) {
    res.status(400).json({ error: 'Research query is required' });
    return;
  }

  // Set SSE Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform, no-store',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  if (typeof (res as any).flushHeaders === 'function') {
    (res as any).flushHeaders();
  }

  const sendEvent = (eventData: any) => {
    try {
      res.write(`data: ${JSON.stringify(eventData)}\n\n`);
      if (typeof (res as any).flush === 'function') {
        (res as any).flush();
      }
    } catch {
      // client may have disconnected
    }
  };

  const orchestrator = new ResearchOrchestrator(sessionId, (evt) => {
    sendEvent({ type: 'event', event: evt });
  });

  activeSessions.set(sessionId, orchestrator);

  req.on('close', () => {
    orchestrator.cancel();
    activeSessions.delete(sessionId);
  });

  try {
    const finalData = await orchestrator.runResearch(query);
    sendEvent({ type: 'final_payload', data: finalData });
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err: any) {
    sendEvent({ type: 'fatal_error', message: err.message || 'Pipeline crashed' });
    res.end();
  } finally {
    activeSessions.delete(sessionId);
  }
});

// 2b. Standard JSON Fallback Endpoint for Environments where SSE is buffered
app.post('/api/research/run', async (req: Request, res: Response) => {
  const query = (req.body?.query as string || '').trim();
  const sessionId = (req.body?.sessionId as string) || `session-${Date.now()}`;

  if (!query) {
    res.status(400).json({ error: 'Research query is required' });
    return;
  }

  const events: any[] = [];
  const orchestrator = new ResearchOrchestrator(sessionId, (evt) => {
    events.push(evt);
  });

  try {
    const finalData = await orchestrator.runResearch(query);
    res.json({
      success: true,
      events,
      data: finalData,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message || 'Research pipeline failed',
    });
  }
});

// 3. Ask the Dataset (Deterministic aggregation + Grounded LLM Query)
app.post('/api/ask-dataset', async (req: Request, res: Response) => {
  const { question, entities } = req.body;
  if (!question || !Array.isArray(entities)) {
    res.status(400).json({ error: 'question and entities array required' });
    return;
  }

  const qLower = question.toLowerCase();
  
  // Deterministic checks first to eliminate math/count hallucinations
  if (qLower.includes('how many') || qLower.includes('total count')) {
    res.json({
      answer: `There are currently ${entities.length} fully indexed and audited entities in the current session dataset.`,
      highlightEntities: entities.map((e: any) => e.name),
      filteredCount: entities.length,
      provenanceNote: 'Calculated deterministically from in-memory session state.',
    });
    return;
  }

  if (isGroqConfigured()) {
    try {
      const askPrompt = buildDatasetSystemPrompt();
      const userContent = buildDatasetUserPrompt({ question, entities });

      const { data } = await callGroqStructured({
        systemPrompt: askPrompt,
        userPrompt: userContent,
        schema: AskDatasetResponseSchema,
        agentRole: 'askDataset',
      });

      res.json(data);
      return;
    } catch (err: any) {
      console.warn('[AskDataset] LLM query failed, using deterministic keyword search fallback:', err.message);
    }
  }

  // Graceful deterministic search over entity fields
  const matches = entities.filter((e: any) => {
    const searchString = (e.name + ' ' + JSON.stringify(e.fields)).toLowerCase();
    return qLower.split(' ').some((word: string) => word.length > 2 && searchString.includes(word));
  });

  res.json({
    answer: matches.length > 0 
      ? `Found ${matches.length} matching entities matching "${question}": ${matches.map((m: any) => m.name).join(', ')}.`
      : `No direct matches found in current dataset for "${question}". Try querying for specific entities, pricing, or locations.`,
    highlightEntities: matches.map((m: any) => m.name),
    filteredCount: matches.length,
    provenanceNote: 'Computed via deterministic client-session filtering.',
  });
});

export default app;
