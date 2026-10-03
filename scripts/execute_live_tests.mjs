import { runResearch, testAskDataset } from './run_regression_suite.mjs';
import fs from 'fs';
import path from 'path';

const testName = process.argv[2] || 'test4';

const TEST_QUERIES = {
  test1: {
    name: 'TEST 1 - COMPARISON',
    query: 'Compare Python and JavaScript for backend development',
  },
  test2: {
    name: 'TEST 2 - RANKING / DISCOVERY',
    query: 'Find the best BTech colleges in Rajasthan',
  },
  test3: {
    name: 'TEST 3 - CROSS-DOMAIN ISOLATION',
    query: 'Compare solar and wind energy for large-scale electricity generation in India',
  },
  test4: {
    name: 'TEST 4 - FACT LOOKUP',
    query: 'When was Python 3.11 officially released?',
  },
  test5: {
    name: 'TEST 5 - MISSING EVIDENCE HANDLING',
    query: 'What is the proprietary internal server count of Cursor AI in 2026?',
  }
};

async function main() {
  const t = TEST_QUERIES[testName];
  if (!t) {
    console.error('Unknown test:', testName);
    process.exit(1);
  }

  console.log(`Starting ${t.name}: "${t.query}"`);
  const result = await runResearch(t.query, `session-${testName}-${Date.now()}`);

  if (result.success) {
    const outDir = path.resolve('scratch');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${testName}_result.json`);
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
    console.log(`Saved result to ${outPath}`);

    // If Test 1, run Ask the Dataset tests
    if (testName === 'test1' || testName === 'test4') {
      console.log('\n--- Testing Ask the Dataset on this session ---');
      await testAskDataset(result.sessionId, 'Which findings have the highest confidence?', result.raw.entities);
      await testAskDataset(result.sessionId, 'Which fields have insufficient evidence?', result.raw.entities);
      await testAskDataset(result.sessionId, 'What sources were used?', result.raw.entities);
    }
  } else {
    console.error('Test execution failed:', result.error);
  }
}

main().catch(console.error);
