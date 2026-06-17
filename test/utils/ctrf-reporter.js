const fs = require('fs');
const path = require('path');

class CtrfReporter {
  constructor(globalConfig, options) {
    this.outputDir = options.outputDir || 'ctrf-report';
    this.outputFile = options.outputFile || 'ctrf-report.json';
  }

  onRunStart() {
    this.startTime = Date.now();
    this.results = { tests: [], passed: 0, failed: 0, skipped: 0, pending: 0, other: 0 };
  }

  onTestResult(test, testResult) {
    for (const t of testResult.testResults) {
      const status = this.mapStatus(t.status);
      this.results[status]++;
      this.results.tests.push({
        name: t.fullName,
        status,
        duration: t.duration || 0,
        suite: path.basename(testResult.testFilePath),
        message: t.failureMessages?.join('\n') || undefined,
        trace: t.failureDetails?.join('\n') || undefined
      });
    }
  }

  onRunComplete() {
    const total = this.results.tests.length;
    const report = {
      reportFormat: 'CTRF',
      specVersion: '1.0.0',
      generatedBy: 'jest-ctrf-custom-reporter',
      results: {
        tool: { name: 'jest' },
        summary: {
          tests: total,
          passed: this.results.passed,
          failed: this.results.failed,
          skipped: this.results.skipped,
          pending: this.results.pending,
          other: this.results.other,
          start: this.startTime,
          stop: Date.now()
        },
        tests: this.results.tests
      }
    };

    const dir = path.resolve(process.cwd(), this.outputDir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, this.outputFile), JSON.stringify(report, null, 2));
    console.log(`Relatorio CTRF salvo em ${this.outputDir}/${this.outputFile}`);
  }

  mapStatus(s) {
    if (s === 'passed') return 'passed';
    if (s === 'failed') return 'failed';
    if (s === 'skipped') return 'skipped';
    if (s === 'pending' || s === 'todo') return 'pending';
    return 'other';
  }
}

module.exports = CtrfReporter;
