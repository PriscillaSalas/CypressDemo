const SELECTORS = {
    emailInput: 'input#login-form-email[name="loginEmail"]',
    passwordInput: 'input#login-form-password[name="loginPassword"]',
    loginButton: 'a.btn.btn-outline-primary.text-nowrap[aria-label="Sign in"]',
    submitButton: 'button.btn.btn-block.btn-primary',
    userName: 'span.user-message.dropdown-toggle.mr-2.hidden-sm-down',
    checkoutButton: 'a.btn.btn-primary.btn-block.checkout-btn',
    shippingMethodLabel: '.js-shipping-method .display-name.label',
    shippingMethodInput: '.js-shipping-method input[type="radio"]',
    continueToPaymentButton: '#checkout-submit-shipping',
    addressInput: '#shippingAddressOnedefault',
    cityInput: '#shippingAddressCitydefault',
    stateDropdown: '#shippingStatedefault',
    zipCodeInput: '#shippingZipCodedefault',
    continueButton: 'button.continue-shipping',
    cardNumber: '#cardNumber',
    expirationMonth: '#expirationMonth',
    expirationYear: '#expirationYear',
    securityCode: '#securityCode',
    submitPayment: '#checkout-submit-payment'

};

class CheckoutPage {
    /**
     * Logs into the system using credentials stored in cypress.env.json
     */
    login() {
        cy.log('Logging in...');


        cy.get(SELECTORS.loginButton)
            .should('be.visible')
            .click();
        cy.wait(1000);
        cy.url().should('include', 'login');


        const email = Cypress.env('email');
        const password = Cypress.env('password');

        if (!email || !password) {
            throw new Error('Email or password is not defined in Cypress environment variables.');
        }

        cy.get(SELECTORS.emailInput, { timeout: 10000 })
            .should('exist')
            .should('be.visible')
            .type(email, { delay: 100 });

        cy.get(SELECTORS.passwordInput, { timeout: 10000 })
            .should('exist')
            .should('be.visible')
            .type(password, { delay: 100 });

        cy.get(SELECTORS.submitButton)
            .first()
            .should('be.visible')
            .and('not.be.disabled')
            .click();
        cy.wait(1000);

        cy.get(SELECTORS.userName, { timeout: 15000 })
            .scrollIntoView()
            .should('be.visible')
            .and('contain.text', 'Priscilla');

        cy.log('Login completed.');
    }
    /**
    * Clicks on the "Checkout" button to proceed.
    */
    proceedToCheckout() {
        cy.log('Proceeding to checkout...');
        cy.get(SELECTORS.checkoutButton, { timeout: 10000 })
            .should('be.visible')
            .click();
        cy.wait(3000);
        cy.url({ timeout: 10000 }).should('include', '/checkout');
    }

    /**
     * Fill out the required fields on the checkout page using data from cypress.env.json.
    */
    fillRequiredFields() {
        cy.log('Filling out required fields on the checkout page...');

        // Fetch shipping data
        const shippingData = Cypress.env('shipping');
        if (!shippingData) {
            throw new Error('Shipping data is not defined in cypress.env.json');
        }

        // Fill address input
        cy.get(SELECTORS.addressInput, { timeout: 10000 })
            .should('be.visible')
            .click()
            .type(`${shippingData.address1}{enter}`, { delay: 50 });

        // Fill city input
        cy.get(SELECTORS.cityInput, { timeout: 10000 })
            .should('be.visible')
            .and('not.be.disabled')
            .type(shippingData.city, { delay: 50 });

        // Fill ZIP code with additional checks
        cy.get(SELECTORS.zipCodeInput, { timeout: 10000 })
            .scrollIntoView()
            .should('exist')
            .should('be.visible')
            .type(shippingData.zipCode, { delay: 100 });

        // Select state
        cy.get(SELECTORS.stateDropdown, { timeout: 10000 })
            .should('be.visible')
            .select(shippingData.state);

        cy.wait(500);
        cy.log('Required fields filled successfully.');
    }

    /**
   * Selects a shipping method by its ID or visible label text.
   * @param {string} method - The shipping method to select (e.g., 'Fast Ground').
   */

    selectShippingMethod(methodName) {
        //Make sure the dom is ready
        cy.document().its('body').then(() => {
            //Locate the container of shipping method 
            cy.contains('.shipping-method-list .js-shipping-method', methodName, { timeout: 10000 })
                .should('be.visible')
                .within(() => {
                    //Search and select the associated input  
                    cy.get('input[type="radio"]')
                        .check({ force: true })
                        .should('be.checked');
                });
        });

        cy.get('div.spinner', { timeout: 10000 }).should('not.exist');
    }

    clickContinueToPaymentButton() {
        cy.get(SELECTORS.continueToPaymentButton)
            .should('be.visible')
            .and('have.class', 'btn-primary')
            .click();
        cy.wait(3000);
    }
    enterPaymentDetails() {
        cy.log('Entering payment details and placing the order.');

        // Intercept the order placement API
        cy.intercept('POST', '/order/place/', {
            statusCode: 200,
            body: { success: true, orderId: '123456' }, // Mock response
        }).as('placeOrder');
        cy.get(SELECTORS.cardNumber).type('4111111111111111');
        cy.get(SELECTORS.expirationMonth).select('05');
        cy.get(SELECTORS.expirationYear).select('2028');
        cy.get(SELECTORS.securityCode).type('2354');
        cy.get(SELECTORS.submitPayment).click();
        cy.url().should('include', '/checkout/placeOrder');

        cy.log('Payment details entered');
    }

    verifyOrderReviewPage() {
        cy.contains('.card-header-custom', 'Order Summary').should('be.visible');
        cy.get('.shipping-method-title')
            .should('be.visible')
            .and('contain.text', 'Fast Ground');
    }

}
export default CheckoutPage;
