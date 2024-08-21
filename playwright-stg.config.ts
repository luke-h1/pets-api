import type { PlaywrightTestConfig } from '@playwright/test';
import baseConfig from './playwright-base.config';

const stagingConfig: PlaywrightTestConfig = {
  ...baseConfig,
  use: {
    baseURL: 'https://pets-staging.lhowsam.com',
  },
};

export default stagingConfig;
