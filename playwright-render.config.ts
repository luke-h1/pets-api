import type { PlaywrightTestConfig } from '@playwright/test';
import baseConfig from './playwright-base.config';

const stagingConfig: PlaywrightTestConfig = {
  ...baseConfig,
  use: {
    baseURL: 'https://pets-api-staging.onrender.com',
  },
  retries: process.env.CI ? 2 : 0,
};

export default stagingConfig;
