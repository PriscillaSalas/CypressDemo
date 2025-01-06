const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    pageLoadTimeout: 45000,
    responseTimeout: 15000,

    retries: {
      runMode: 2,
      openMode: 0,
    },

    video: true,
    screenshotOnRunFailure: true,
  },
  reporterOptions: {
    output: "min",
  },
  numTestsKeptInMemory: 0,
  "chromeWebSecurity": false,
  experimentalMemoryManagement:true
  /*
    // Viewport settings for mobile emulation
    viewportWidth: 393, // iPhone 15 width
    viewportHeight: 852, // iPhone 15 heightF*/


});

