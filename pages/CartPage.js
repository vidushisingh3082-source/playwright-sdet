class CartPage {
  constructor(page) {
    this.page = page;
    this.items = page.locator('[data-test="inventory-item"]');
    this.names = page.locator('[data-test="inventory-item-name"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShopping = page.locator('[data-test="continue-shopping"]');
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
module.exports = { CartPage };
