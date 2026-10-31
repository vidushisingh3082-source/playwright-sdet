const { test, expect } = require('@playwright/test');

// These tests need no selectors, so they work as soon as EKART_URL is set.
test.describe('E-Kart smoke', () => {
  test('home page loads @smoke', async ({ page }) => {
    const res = await page.goto('/');
    expect(res.status()).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  });

  test('page has a title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
  });

  test('admin dashboard is not accessible without login', async ({ page }) => {
    await page.goto('/admin/dashboard');
    // An unauthenticated visitor must be redirected away from the admin page
  await expect(page).not.toHaveURL(/admin\/dashboard/, { timeout: 40_000 });
  });
});

// TODO (tomorrow, after codegen): login valid/invalid, search, add to cart,
// remove from cart, checkout with Cash on Delivery ONLY (never Razorpay).
