const { test, expect } = require('../../fixtures/testFixtures');

const PRODUCT = 'Sauce Labs Backpack';
const PRODUCT_2 = 'Sauce Labs Bike Light';

test.describe('Product listing, sorting and cart', () => {
  test.beforeEach(async ({ loggedInPage }) => {});

  test('inventory shows 6 products @smoke', async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('sort price low to high', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort price high to low', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('hilo');
    const prices = await inventoryPage.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('sort name Z to A', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.names.allTextContents();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('add one product updates cart badge @smoke', async ({ inventoryPage }) => {
    await inventoryPage.addToCart(PRODUCT);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('add two products, both appear in cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCT);
    await inventoryPage.addToCart(PRODUCT_2);
    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.names).toContainText([PRODUCT, PRODUCT_2]);
  });

  test('remove product from cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCart(PRODUCT);
    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(1);
    await inventoryPage.removeFromCart(PRODUCT);
    await expect(cartPage.items).toHaveCount(0);
  });

  test('cart persists after page reload', async ({ page, inventoryPage }) => {
    await inventoryPage.addToCart(PRODUCT);
    await page.reload();
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });
});
