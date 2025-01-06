const SELECTORS = {
    popupContainer: 'div.ltkpopup-clearfix',
    popupCloseButton: 'button.ltkpopup-close',
    countryDropdown: '#gle_selectedCountry',
    saveAndCloseButton: 'input[data-action="SaveAndClose"]',
};

class HomePage {
    /**
     * Visits the Uniform Advantage homepage.
     */
    visit() {
        cy.visit('https://www.uniformadvantage.com');
        cy.wait(5000); //wait for page stability
    }

    /**
     * Closes the popup if it is visible.
     */
    closePopupIfVisible() {
        cy.log('Checking for popup visibility...');

        cy.get('body').then(($body) => {
            if ($body.find(SELECTORS.popupContainer).length > 0) {
                // If the popup exists, ensure it's visible
                cy.get(SELECTORS.popupContainer, { timeout: 36000 })
                    .should('be.visible')
                    .then(() => {
                        cy.get(SELECTORS.popupCloseButton).first().click({ force: true });
                        cy.log('Popup closed successfully.');
                        cy.wait(1000); // Small wait to ensure popup is dismissed
                    });
            } else {
                cy.log('Popup not found. Proceeding...');
            }
        });
    }

    /**
     * Changes the country dynamically after ensuring no popup is blocking the UI.
     * @param {string} countryCode - The country code to select (e.g., 'US').
     */
    changeCountry(countryCode) {
        this.closePopupIfVisible();
        cy.log(`Changing country to ${countryCode}...`);
        cy.get(SELECTORS.countryDropdown, { timeout: 20000 })
            .should('be.visible')
            .then(($dropdown) => {
                if ($dropdown.is(':disabled')) {
                    throw new Error('Country dropdown is disabled.');
                }
            })
            .select(countryCode);
            cy.wait(1000);
            this.closePopupIfVisible();
      
        cy.get(SELECTORS.saveAndCloseButton)
            .should('be.visible')
            .click();
        cy.log(`Country successfully changed to ${countryCode}.`);
    }
}

export default HomePage;







