/** @type {import("@jest/types").Config.InitialOptions} */
const config = {
  testMatch: [
    "**/tests/**/*.[jt]s?(x)",
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)",
  ],
  testPathIgnorePatterns: ["/node_modules/", "tests/config.ts"],
};

module.exports = config;
