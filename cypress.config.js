const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'bhd5w9',
  pageLoadTimeout: 15000,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
