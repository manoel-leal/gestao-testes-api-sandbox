const fs = require('fs');
const path = require('path');

const outputDir = './ctrf-report';
const inputFile = path.join(outputDir, 'jest-output.json');
const outputFile = path.join(outputDir, 'ctrf-report.json');

if (!fs.existsSync(inputFile)) {
  console.error('Arquivo de resultados do Jest nao encontrado:', inputFile);
  process.exit(0);
}

const jestData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

const tests = [];
let startTime = Infinity;
let stopTime = 0;

for (const suite of jestData.testResults || []) {
  for (const t of suite.assertionResults || []) {
    const duration = t.duration || 0;
    const status = (t.status || 'unknown').toLowerCase();

    tests.push({
      name: t.fullName || t.title || 'unknown',
      status: ['passed', 'failed', 'skipped', 'pending'].includes(status) ? status : 'other',
      duration,
      suite: suite.name || path.basename(suite.file || ''),
      message: t.failureMessages?.join('\n') || undefined,
      trace: t.failureDetails?.join('\n') || undefined
    });

    if (suite.startTime && suite.startTime < startTime) startTime = suite.startTime;
    if (suite.endTime && suite.endTime > stopTime) stopTime = suite.endTime;
  }
}

const report = {
  reportFormat: 'CTRF',
  specVersion: '1.0.0',
  generatedBy: 'jest-ctrf-converter',
  results: {
    tool: { name: 'jest' },
    summary: {
      tests: tests.length,
      passed: jestData.numPassedTests || tests.filter(t => t.status === 'passed').length,
      failed: jestData.numFailedTests || tests.filter(t => t.status === 'failed').length,
      skipped: jestData.numPendingTests || tests.filter(t => t.status === 'skipped').length,
      pending: tests.filter(t => t.status === 'pending').length,
      other: tests.filter(t => t.status === 'other').length,
      start: startTime === Infinity ? 0 : startTime,
      stop: stopTime || 0
    },
    tests
  }
};

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
console.log(`CTRF report gerado: ${outputFile} (${tests.length} testes)`);
