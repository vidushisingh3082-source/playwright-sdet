// STARTER: fill these locators tomorrow using:  npx playwright codegen <your-ekart-url>
// Then replace the placeholders below with what codegen shows.
class EkartLoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.getByPlaceholder(/email/i);          // TODO: confirm with codegen
    this.password = page.getByPlaceholder(/password/i);    // TODO: confirm with codegen
    this.submit = page.getByRole('button', { name: /sign in|login/i }); // TODO: confirm
  }

  async goto() {
    await this.page.goto('/auth/login'); // TODO: change if your login route differs
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }
}
module.exports = { EkartLoginPage };
