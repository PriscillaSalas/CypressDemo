const SELECTORS = {
    addToCartModal: '#addToCartModal.modal',
    proceedToCheckoutButton: 'a.btn.btn-primary.px-2 > span.d-none.d-md-inline',
    cartContainer: '.cart-card.cart-lineitem',
    quantityInput: '#qtyselectid1'
};

class CartPage {
    /**
     * Navigate to the cart page by clicking "Proceed to Checkout".
     * Ensures the "Add to Cart" modal is visible before proceeding.
     */
    continueToCheckout() {
        cy.log('Proceeding to checkout...');

        // Ensure the "Add to Cart" modal is visible
        cy.get(SELECTORS.addToCartModal)
            .should('exist')
            .and('be.visible');

        // Click the visible "Proceed to checkout" button
        cy.get(SELECTORS.proceedToCheckoutButton)
            .filter(':visible') // Interact only with visible buttons
            .should('be.visible')
            .click();

        // Validate the cart container is displayed
        cy.get(SELECTORS.cartContainer, { timeout: 10000 })
            .should('be.visible')
            .and('exist');

        cy.log('Successfully navigated to the cart page.');
    }

    /**
     * Increases the quantity of an item in the cart.
     * @param {number} quantity - Desired quantity to set.
     */
    increaseQuantity(quantity) {
        cy.log(`Increasing item quantity to ${quantity}...`);
        cy.get(SELECTORS.quantityInput)
            .should('be.visible')
            .clear()
            .type(quantity.toString(), { delay: 50 }) // Add delay to mimic user typing

        // Validate the updated quantity reflects in the input field
        cy.get(SELECTORS.quantityInput)
            .should('have.value', quantity.toString());

        cy.log('Item quantity updated successfully.');
    }
}

export default CartPage;

