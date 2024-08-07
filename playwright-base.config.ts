import type { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({
  path: '.env.e2e',
});

const baseConfig: PlaywrightTestConfig = {
  testDir: './src/e2e',
  timeout: 30 * 1000,
  name: `pets-api ${process.env.ENVIRONMENT} E2E Tests`,
  expect: {
    timeout: 30000,
  },
  reporter: [['list']],
  use: {
    baseURL: process.env.API_BASE_URL,
    extraHTTPHeaders: {},
  },
  outputDir: 'test-results/',
};

export default baseConfig;
