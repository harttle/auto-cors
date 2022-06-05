const common = require('../jest-config.common');
module.exports = Object.assign({}, common, {
  "testEnvironment": "node",
  "coverageDirectory": "<rootDir>/coverage/node",
  "testMatch": [
    "**/*.node.spec.mjs"
  ],
});
