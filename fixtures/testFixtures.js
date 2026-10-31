const base = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const users = require('../test-data/users.json');

const test = base.test.extend({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),

  // Already logged-in state, so each test does not repeat login steps
  loggedInPage: async ({ page, loginPage }, use) => {
    await loginPage.goto();
    await loginPage.login(users.valid.username, users.valid.password);
    await base.expect(page).toHaveURL(/inventory/);
    await use(page);
  },
});

module.exports = { test, expect: base.expect };
