/** True when the admin can run: always in development, and in production only once the GitHub App env vars exist. */
export const keystaticReady =
  process.env.NODE_ENV !== 'production' ||
  Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_ID && process.env.KEYSTATIC_GITHUB_CLIENT_SECRET && process.env.KEYSTATIC_SECRET);
