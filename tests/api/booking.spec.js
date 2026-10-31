const { test, expect } = require('@playwright/test');

const newBooking = () => ({
  firstname: 'Vidushi',
  lastname: 'Singh',
  totalprice: 1500,
  depositpaid: true,
  bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
  additionalneeds: 'Breakfast',
});

let token;

test.beforeAll(async ({ playwright, baseURL }) => {
  const ctx = await playwright.request.newContext({ baseURL });
  const res = await ctx.post('/auth', { data: { username: 'admin', password: 'password123' } });
  expect(res.status()).toBe(200);
  token = (await res.json()).token;
  expect(token).toBeTruthy();
  await ctx.dispose();
});

test.describe('Auth API', () => {
  test('valid credentials return a token', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin', password: 'password123' } });
    expect(res.ok()).toBeTruthy();
    expect(await res.json()).toHaveProperty('token');
  });

  test('invalid credentials return Bad credentials', async ({ request }) => {
    const res = await request.post('/auth', { data: { username: 'admin', password: 'wrong' } });
    // This API returns 200 with a reason field, so we assert on the body
    expect(await res.json()).toEqual({ reason: 'Bad credentials' });
  });
});

test.describe('Booking CRUD', () => {
  test('health check', async ({ request }) => {
    const res = await request.get('/ping');
    expect(res.status()).toBe(201);
  });

  test('list bookings returns array of ids', async ({ request }) => {
    const res = await request.get('/booking');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body[0]).toHaveProperty('bookingid');
  });

  test('create -> read -> update -> delete flow @smoke', async ({ request }) => {
    // CREATE
    const created = await request.post('/booking', { data: newBooking() });
    expect(created.status()).toBe(200);
    const { bookingid, booking } = await created.json();
    expect(bookingid).toBeGreaterThan(0);
    expect(booking).toMatchObject({ firstname: 'Vidushi', lastname: 'Singh', totalprice: 1500 });

    // READ
    const read = await request.get(`/booking/${bookingid}`, { headers: { Accept: 'application/json' } });
    expect(read.status()).toBe(200);
    expect((await read.json()).firstname).toBe('Vidushi');

    // UPDATE (full)
    const updated = await request.put(`/booking/${bookingid}`, {
      headers: { Cookie: `token=${token}`, Accept: 'application/json' },
      data: { ...newBooking(), firstname: 'Updated', totalprice: 2000 },
    });
    expect(updated.status()).toBe(200);
    const upBody = await updated.json();
    expect(upBody.firstname).toBe('Updated');
    expect(upBody.totalprice).toBe(2000);

    // PARTIAL UPDATE
    const patched = await request.patch(`/booking/${bookingid}`, {
      headers: { Cookie: `token=${token}`, Accept: 'application/json' },
      data: { lastname: 'Patched' },
    });
    expect(patched.status()).toBe(200);
    expect((await patched.json()).lastname).toBe('Patched');

    // DELETE
    const del = await request.delete(`/booking/${bookingid}`, { headers: { Cookie: `token=${token}` } });
    expect(del.status()).toBe(201);

    // VERIFY DELETED
    const gone = await request.get(`/booking/${bookingid}`);
    expect(gone.status()).toBe(404);
  });
});

test.describe('API negative cases', () => {
  test('get non-existent booking returns 404', async ({ request }) => {
    const res = await request.get('/booking/99999999');
    expect(res.status()).toBe(404);
  });

  test('delete without token is forbidden (403)', async ({ request }) => {
    const created = await request.post('/booking', { data: newBooking() });
    const { bookingid } = await created.json();
    const res = await request.delete(`/booking/${bookingid}`);
    expect(res.status()).toBe(403);
  });

  test('update without token is forbidden (403)', async ({ request }) => {
    const created = await request.post('/booking', { data: newBooking() });
    const { bookingid } = await created.json();
    const res = await request.put(`/booking/${bookingid}`, {
      headers: { Accept: 'application/json' },
      data: newBooking(),
    });
    expect(res.status()).toBe(403);
  });

  test('create with missing required fields fails', async ({ request }) => {
    const res = await request.post('/booking', { data: { firstname: 'OnlyName' } });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
