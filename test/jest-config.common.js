module.exports = {
  "verbose": true,
  "rootDir": "../",
  "collectCoverage": true,
  "collectCoverageFrom": [
    "!**/node_modules/**",
    "<rootDir>/**/*.spec.mjs"
  ],
  "coverageReporters": [
    "json"
  ],
};
