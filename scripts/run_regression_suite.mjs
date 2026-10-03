/**
 * Regression Test Suite for ResearchLens AI
 * Executes live research requests and asserts against canonical requirements.
 */
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function runResearch(query, customSessionId) {
  const sessionId = customSessionId || `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const startTime = Date.now();
  
  console.log(`\n======================================================`);
  console.log(`[TEST RUN] Query: "${query}"`);
  console.log(`[SESSION ID] ${sessionId}`);
  console.log(`======================================================`);

  try {
    const res = await fetch(`${BASE_URL}/api/research/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, sessionId }),
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const json = await res.json();

    if (!json.success) {
      console.error(`[FAILED] Pipeline error:`, json.error);
      return { success: false, error: json.error, elapsed };
    }

    const data = json.data;
    const sources = data.sources || [];
    const entities = data.entities || [];
    const claims = data.claims || [];
    const conflicts = data.conflicts || [];
    const qg = data.qualityGate;

    const acceptedSources = sources.filter(s => s.accepted !== false);
    const rejectedSources = sources.filter(s => s.accepted === false);
    const verifiedClaims = claims.filter(c => c.verificationStatus === 'VERIFIED');
    const supportedClaims = claims.filter(c => c.verificationStatus === 'SUPPORTED');
    const insufficientClaims = claims.filter(c => c.verificationStatus === 'INSUFFICIENT_EVIDENCE' || c.verificationStatus === 'MISSING');

    console.log(`[COMPLETED] Time: ${elapsed}s | Demo Mode: ${data.isDemoMode}`);
    console.log(`[PLAN] Intent: ${data.plan?.intent || data.contract?.intent || 'N/A'}`);
    console.log(`[ENTITIES] Count: ${entities.length} -> [${entities.map(e => e.name).join(', ')}]`);
    console.log(`[SOURCES] Total Evaluated: ${sources.length} | Accepted: ${acceptedSources.length} | Rejected: ${rejectedSources.length}`);
    console.log(`[CLAIMS] Total: ${claims.length} | Verified: ${verifiedClaims.length} | Supported: ${supportedClaims.length} | Insufficient: ${insufficientClaims.length}`);
    console.log(`[CONFLICTS] Total: ${conflicts.length} (Resolved: ${conflicts.filter(c => c.resolutionStatus === 'RESOLVED').length}, Unresolved: ${conflicts.filter(c => c.resolutionStatus === 'UNRESOLVED').length})`);
    console.log(`[QUALITY GATE] Passed: ${qg?.passed} | Issues: ${qg?.issues?.join('; ') || 'None'}`);
    console.log(`[SYNTHESIS] Headline: ${data.dashboardSpec?.headline}`);

    return {
      success: true,
      sessionId,
      query,
      elapsed,
      isDemoMode: data.isDemoMode,
      intent: data.plan?.intent,
      entities: entities.map(e => e.name),
      sourceCount: sources.length,
      acceptedSourceCount: acceptedSources.length,
      rejectedSourceCount: rejectedSources.length,
      verifiedCount: verifiedClaims.length,
      supportedCount: supportedClaims.length,
      insufficientCount: insufficientClaims.length,
      conflictCount: conflicts.length,
      qualityGate: qg,
      headline: data.dashboardSpec?.headline,
      summary: data.dashboardSpec?.summary,
      raw: data,
    };
  } catch (err) {
    console.error(`[EXCEPTION]`, err.message);
    return { success: false, error: err.message };
  }
}

async function testAskDataset(sessionId, question, entities) {
  console.log(`\n[ASK DATASET] Question: "${question}"`);
  try {
    const res = await fetch(`${BASE_URL}/api/ask-dataset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, entities, sessionId }),
    });
    const json = await res.json();
    console.log(`[ASK ANSWER]`, json.answer);
    console.log(`[HIGHLIGHTS]`, json.highlightEntities);
    return json;
  } catch (err) {
    console.error(`[ASK DATASET ERROR]`, err.message);
    return null;
  }
}

export { runResearch, testAskDataset };
