const { test, expect } = require('@playwright/test');

test.describe('E-Kart API smoke', () => {
  test('backend server responds (no 5xx)', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBeLessThan(500);
  });

  test('unknown route does not crash the server', async ({ request }) => {
    const res = await request.get('/api/this-route-does-not-exist');
    expect(res.status()).toBeLessThan(500);
  });
});

// TODO (tomorrow): add login / products / cart API tests using the real route
// paths from your server/routes folder.
