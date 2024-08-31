export const isDeployed =
  process.env.GIT_SHA !== 'undefined' && process.env.NODE_ENV === 'production';
