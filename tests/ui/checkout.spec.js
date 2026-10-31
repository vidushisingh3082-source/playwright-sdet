const { test, expect } = require('../../fixtures/testFixtures');
const data = require('../../test-data/checkout.json');

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedInPage, inventoryPage, cartPage }) => {
    await inventoryPage.addToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkout();
  });

  test('complete order end-to-end @smoke', async ({ page, checkoutPage }) => {
    await checkoutPage.fillInfo(data.valid);
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(checkoutPage.summaryTotal).toContainText('Total: $');
    await checkoutPage.finish();
    await expect(checkoutPage.confirmation).toHaveText('Thank you for your order!');
  });

  for (const key of ['missingFirstName', 'missingLastName', 'missingPostal']) {
    test(`checkout validation: ${key}`, async ({ checkoutPage }) => {
      await checkoutPage.fillInfo(data[key]);
      await expect(checkoutPage.error).toContainText(data[key].error);
    });
  }

  test('cancel checkout returns to cart', async ({ page }) => {
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(/cart/);
  });
});
