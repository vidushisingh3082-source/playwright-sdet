// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const UI_BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com';
const API_BASE_URL = process.env.API_URL || 'https://restful-booker.herokuapp.com';

// E-Kart projects are enabled only when EKART_URL is set, so `npm test` keeps
// running just the public-demo tests until you point it at your own app.
const ekartProjects = process.env.EKART_URL
  ? [
      {
        name: 'ekart-ui',
        testDir: './tests/ekart',
        timeout: 60_000, // free hosting can be slow on first request
        use: { ...devices['Desktop Chrome'], baseURL: process.env.EKART_URL },
      },
      ...(process.env.EKART_API
        ? [
            {
              name: 'ekart-api',
              testDir: './tests/ekart-api',
              timeout: 60_000,
              use: { baseURL: process.env.EKART_API },
            },
          ]
        : []),
    ]
  : [];

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: { ...devices['Desktop Chrome'], baseURL: UI_BASE_URL },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: { baseURL: API_BASE_URL },
    },
    ...ekartProjects,
  ],
});
