const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: true,
  workers: 4,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
