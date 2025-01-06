// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands');

// ***********************************************************
// Global configurations and behaviors for Cypress
  

before(() => {
    cy.log('🚀 Test suite starting!');
    cy.intercept({ resourceType: /xhr|fetch/ }, { log: false });
    cy.intercept('POST', '**/recaptcha/**', {
        statusCode: 200,
        body: { success: true },
      }).as('recaptcha');
    cy.clearLocalStorage();
    cy.clearCookies();
});

after(() => {
    cy.log('✅ Test suite completed!');
});

// Ignore specific errors (like "Failed to fetch & pagePrefetched")
Cypress.on('uncaught:exception', (err, runnable) => {
    // Ignore specific known errors
    if (
        err.message.includes('pagePrefetched') ||
        err.message.includes('Failed to fetch') ||
        err.message.includes('removeChild')||
        err.message.includes("Cannot read properties of undefined (reading 'focus')")||
        err.message.includes("parámetro(s) de la API no válido(s)")
    ) {
        console.warn('Ignoring known error:', err.message);
        return false; // Prevent Cypress from failing the test
    }
    // Allow other errors to fail the test
    return true;
});


