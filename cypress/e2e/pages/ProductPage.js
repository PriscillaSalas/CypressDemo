const SELECTORS = {
    productItem: '.product-grid .product-tile',
    sizeSelectable: '.size-value.selectable',
    sizeCrossedOut: '.size-value.unselectable',
    addToCartButton: 'button.add-to-cart',
    productName: '.product-name',
    productPrice: '.price',
    productColorDropdown: 'select#color-1',
    colorOptions: 'select#color-1 option'
};

class ProductPage {
    /**
 * Navigate to a specific category and subcategory under Women.
 * @param {string} mainCategory - The main category (e.g., 'Women').
 * @param {string} subCategory - The subcategory (e.g., 'Solid Tops', 'Pants').
 * @param {string} expectedTitle - The expected title of the page.
 * @param {string} expectedURL - The expected part of the URL.
 */
    navigateToCategory(mainCategory, subCategory, expectedTitle, expectedURL) {
        cy.log(`Navigating to ${subCategory} under ${mainCategory}...`);

        // Hover over the main category
        cy.get('a.nav-link.dropdown-toggle', { timeout: 20000 })
            .contains(mainCategory)
            .should('be.visible')
            .trigger('mouseover');

        // Click on the subcategory
        cy.get('a.dropdown-link')
            .contains(subCategory)
            .should('be.visible')
            .click({ force: true });

        // Validate the URL and the page title
        cy.url().should('include', expectedURL);
        cy.contains('h1', expectedTitle).should('be.visible');

        cy.log(`Successfully navigated to ${subCategory} page.`);
    }
    /**
     * Select the first product from the product grid on the category page.
     * Validates navigation to Product Details Page (PDP) with assertions.
     */
    selectFirstProduct() {
        cy.log('Selecting the first product...');
        cy.get('img.tile-image')
            .should('be.visible')
            .first()
            .scrollIntoView()
            .click();
        cy.log('Validating Product Details Page (PDP)...');
        cy.get(SELECTORS.productName).should('be.visible');
        cy.get(SELECTORS.productPrice).should('be.visible');
        cy.get(SELECTORS.productColorDropdown).should('be.visible');
        cy.log('Successfully validated Product Details Page.');
    }
    /**
     * Ensure all available color options in the dropdown are visible and selectable.
     */
    ensureAllColorsVisible() {
        cy.log('Ensuring all color variants are visible...');
        cy.get(SELECTORS.productColorDropdown)
            .should('be.visible')
            .as('colorDropdown');
        cy.get(SELECTORS.colorOptions).each(($option) => {
            const colorName = $option.text().trim();
            const isDisabled = $option.prop('disabled');

            cy.wrap($option).should('be.visible');
            if (isDisabled) {
                cy.log(`Skipping disabled color: ${colorName}`);
            } else {
                expect(isDisabled).to.be.false;
                cy.log(`Verified color: ${colorName} is visible and selectable.`);
            }
        });
        cy.log('All color variants are visible and selectable.');
    }
    /**
     * Select a color from the dropdown that is not the default.
     * Updates the dropdown to select the first non-default color.
     */
    pickNonDefaultColor() {
        cy.log('Picking a random non-default color...');

        cy.get(SELECTORS.productColorDropdown)
            .should('be.visible')
            .then(($dropdown) => {
                const defaultColor = $dropdown.val(); // Get the default selected color
                cy.log(`Default color: ${defaultColor}`);

                cy.get(SELECTORS.colorOptions)
                    .not(`[value="${defaultColor}"]`) // Exclude the default color
                    .then(($options) => {
                        const randomIndex = Math.floor(Math.random() * $options.length); // Select a random color
                        const $option = $options.eq(randomIndex);
                        const newColor = $option.text().trim();
                        const newColorValue = $option.attr('value');

                        cy.get(SELECTORS.productColorDropdown).select(newColorValue);
                        cy.log(`Selected non-default color: ${newColor}`);

                        cy.wait(2000);

                        // verify that the color dropdown reflects the selected value
                        cy.get(SELECTORS.productColorDropdown)
                            .find('option:selected')
                            .should('have.attr', 'data-attr-value')
                            .and('not.equal', defaultColor);
                        cy.log('Non-default color successfully selected.');
                    });
            });
    }


    /**
    * Select the first available size. If no sizes are available, switch to a different color and retry.
    */
    selectAvailableSize() {
        cy.log('Selecting an available size...');

        // Check for any selectable sizes
        cy.get(SELECTORS.sizeSelectable, { timeout: 10000 })
            .then(($sizes) => {
                if ($sizes.length > 0) {
                    let sizeSelected = false;

                    // Iterate over selectable sizes to find one that is not marked as unavailable
                    $sizes.each((index, size) => {
                        const isUnavailable = Cypress.$(size).attr('data-original-title') === 'This item is no longer available.';
                        if (!isUnavailable && !sizeSelected) {
                            cy.wrap(size).scrollIntoView().click();
                            cy.log(`Selected size: ${Cypress.$(size).text().trim()}`);
                            sizeSelected = true;
                        }
                    });

                    // If no size was selected, switch to another color
                    if (!sizeSelected) {
                        cy.log('No selectable size is available. Switching to a different color...');
                        this.pickNonDefaultColor(); // Switch to another color
                        this.selectAvailableSize(); // Retry selecting a size
                    }
                } else {
                    // If no selectable sizes exist, switch to another color
                    cy.log('No sizes are selectable. Switching to a different color...');
                    this.pickNonDefaultColor(); // Switch to another color
                    this.selectAvailableSize(); // Retry selecting a size
                }
            });
    }
    /**
     * Add the selected product to the cart and validate the action with assertions.
     */
    addToCart() {
        cy.log('Adding the product to the cart...');
        cy.get(SELECTORS.addToCartButton)
            .should('be.visible')
            .and('not.be.disabled')
            .click();
        cy.contains('h2', '1 Item Added to Bag')
            .should('be.visible');
        cy.log('Product successfully added to the cart.');
    }
}
export default ProductPage;




