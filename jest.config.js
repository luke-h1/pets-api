/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
  verbose: true,
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  resetMocks: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
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
