import HomePage from '../pages/HomePage';
import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';

const homePage = new HomePage();
const productPage = new ProductPage();
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

describe('Uniform Advantage -  Checkout Automation', () => {
  before(() => {
    homePage.visit();
    homePage.closePopupIfVisible();
    homePage.changeCountry('US');
  });

  it('Completes checkout process for Solid Tops and Pants', () => {
    // Step 3: Navigate to Solid Tops
    productPage.navigateToCategory(
      'Women',
      'Solid Tops',
      'Solid Scrub Tops',
      '/women-all-tops/women-solid-tops/'
    );
    // Step 4. Click on any item to go to PDP
    productPage.selectFirstProduct();
    //Step 5. In the color variants section, make sure all colors are visible
    productPage.ensureAllColorsVisible();
    //Step 6. Pick a color that is not the default color
    productPage.pickNonDefaultColor();
    //Step 7. Pick a size not crossed out
    productPage.selectAvailableSize();
    //Step 8. Click on Add to cart
    productPage.addToCart();
    // Step 9: Go to checkout modal
    cartPage.continueToCheckout();
    // Step 10: Increase quantity
    cartPage.increaseQuantity(2);
    // Repeat Steps 4-7 for Pants
    productPage.navigateToCategory(
      'Women',
      'Regular Pants',
      'Regular Scrub Pants',
      '/women-all-pants/women-regular-pants/'
    );
    productPage.selectFirstProduct();
    productPage.ensureAllColorsVisible();
    productPage.pickNonDefaultColor();
    productPage.selectAvailableSize();
    productPage.addToCart();

    // Step 13: Continue to checkout
    cartPage.continueToCheckout();

    // Step 16-20: Complete checkout flowF
    checkoutPage.login();
    checkoutPage.proceedToCheckout();
    checkoutPage.fillRequiredFields();
    checkoutPage.selectShippingMethod('Fast Ground');
    checkoutPage.clickContinueToPaymentButton();
    checkoutPage.enterPaymentDetails();
    checkoutPage.verifyOrderReviewPage();

    cy.log('Test completed successfully - Order not placed.');
  });
});

