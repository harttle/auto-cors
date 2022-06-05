const {createReporter} = require('istanbul-api');
const istanbulCoverage = require('istanbul-lib-coverage');
const coverageNode = require('../coverage/node/coverage-final.json');
const coverageBrowser = require('../coverage/browser/coverage-final.json');

const map = istanbulCoverage.createCoverageMap();
map.merge(coverageBrowser);
map.merge(coverageNode);
const reporter = createReporter();

const summary = istanbulCoverage.createCoverageSummary();

map.files().forEach((f) => {
  const fc = map.fileCoverageFor(f);
  const s = fc.toSummary();
  summary.merge(s);
});

reporter.addAll(['json', 'text', 'cobertura']);
reporter.write(map);
