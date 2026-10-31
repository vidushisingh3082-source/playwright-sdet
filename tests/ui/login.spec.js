const { test, expect } = require('../../fixtures/testFixtures');
const users = require('../../test-data/users.json');
const negativeCases = require('../../test-data/loginNegative.json');

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid user can login @smoke', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.valid.username, users.valid.password);
    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.title).toHaveText('Products');
  });

  // Data-driven negative tests: one test generated per row in loginNegative.json
  for (const c of negativeCases) {
    test(`login fails: ${c.name}`, async ({ page, loginPage }) => {
      await loginPage.login(c.username, c.password);
      await expect(loginPage.error).toContainText(c.error);
      await expect(page).not.toHaveURL(/inventory/);
    });
  }

  test('cannot open inventory without login', async ({ page }) => {
    await page.goto('/inventory.html');
    await expect(page.locator('[data-test="error"]')).toContainText('only access');
  });
});
