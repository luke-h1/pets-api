/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest/presets/default-esm', // or other ESM presets
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  verbose: true,
  setupFiles: ['dotenv/config'],
  resetMocks: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/', 'e2e'],
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.js'],
  coverageThreshold: {
    global: {
      statements: 93.8,
      branches: 85,
      lines: 95,
      functions: 96,
    },
  },
};
module.exports = config;
