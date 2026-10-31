# Playwright Web & API Test Automation Framework

End-to-end UI and API test automation framework built with **Playwright (JavaScript)**, Page Object Model, data-driven tests and GitHub Actions CI.

## Tech stack
JavaScript, Playwright Test, REST API testing (Playwright `request`), Page Object Model, GitHub Actions

## Applications under test
| Layer | System | URL |
|-------|--------|-----|
| UI | SauceDemo (e-commerce demo) | https://www.saucedemo.com |
| API | Restful-Booker (booking REST API) | https://restful-booker.herokuapp.com |

## What is covered
- **Login:** valid login, 7 data-driven negative cases (wrong/empty credentials, locked user, SQL injection attempt), direct URL access without login
- **Products & cart:** listing, sorting (price/name), add/remove, cart badge, persistence after reload
- **Checkout:** end-to-end order, field validations, cancel flow
- **API:** auth token, full CRUD flow (create, read, update, patch, delete, verify 404), negative cases (403 without token, 404, invalid payload)

## Project structure
```
pages/          Page Objects (locators + actions)
fixtures/       Custom fixtures (page objects, logged-in state)
test-data/      JSON test data for data-driven tests
tests/ui/       UI specs
tests/api/      API specs
.github/        CI workflow
playwright.config.js
```

## Setup
```bash
npm install
npx playwright install chromium
```

## Run
```bash
npm test                 # everything
npm run test:ui          # UI only
npm run test:api         # API only
npm run test:headed      # watch the browser
npx playwright test --grep @smoke   # smoke tests only
npm run report           # open HTML report
```

## Run against your own app
```bash
BASE_URL=http://localhost:3000 npx playwright test --project=ui
API_URL=http://localhost:5000 npx playwright test --project=api
```
(Update locators in `pages/` to match your app.)

## E-Kart (own app) tests - starter
Extra tests for my own deployed MERN app. They run only when the URLs are set:
```bash
# Mac/Linux
EKART_URL=https://your-frontend.com EKART_API=https://your-backend.com npx playwright test --project=ekart-ui --project=ekart-api

# Windows PowerShell
$env:EKART_URL="https://your-frontend.com"; $env:EKART_API="https://your-backend.com"; npx playwright test --project=ekart-ui --project=ekart-api
```
Rules: use a separate test account, Cash on Delivery only (never Razorpay), no destructive admin actions.
Status: smoke tests done; login/search/cart/checkout tests in progress.

## Design decisions
- **Page Object Model** keeps locators out of tests so a UI change needs one edit.
- **Fixtures** give every test a clean page and an optional logged-in state.
- **Data-driven tests** generate one test per JSON row.
- **Traces, screenshots and video** are kept on failure for fast debugging.
- **CI** runs on every push and uploads the HTML report.
