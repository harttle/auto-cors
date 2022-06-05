const common = require('../jest-config.common');
module.exports = Object.assign({}, common, {
  "coverageDirectory": "<rootDir>/coverage/browser",
  "testMatch": [
    "**/*.web.spec.mjs"
  ],
  "setupFiles": [
    "<rootDir>/test/browser/setup.js"
  ]
});
