import { defineConfig } from "cypress";
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

export default defineConfig({
  e2e: {
    baseUrl: "https://fufelka.ru",
    specPattern: "cypress/e2e/**/*.cy.{ts,js}",
    excludeSpecPattern: process.env.CI ? ['**/sandbox/**', '**/*.sandbox.cy.ts'] : [],
    supportFile: "cypress/support/e2e.ts",
    video: true,
    retries: { runMode: 2, openMode: 0 },
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 60000,
    setupNodeEvents(on, config) {
      allureWriter(on, config);
      return config;
    }
  },
  env: {
    // включение подробного логгирования шагов в Allure (по умолчанию true)
    allureLogCypress: true,
  }
});