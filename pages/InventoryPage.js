class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('[data-test="title"]');
    this.items = page.locator('[data-test="inventory-item"]');
    this.prices = page.locator('[data-test="inventory-item-price"]');
    this.names = page.locator('[data-test="inventory-item-name"]');
    this.sort = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  // "Sauce Labs Backpack" -> "add-to-cart-sauce-labs-backpack"
  slug(productName) {
    return productName.toLowerCase().replace(/\s+/g, '-');
  }

  async addToCart(productName) {
    await this.page.locator(`[data-test="add-to-cart-${this.slug(productName)}"]`).click();
  }

  async removeFromCart(productName) {
    await this.page.locator(`[data-test="remove-${this.slug(productName)}"]`).click();
  }

  async sortBy(value) {
    await this.sort.selectOption(value); // az | za | lohi | hilo
  }

  async getPrices() {
    const texts = await this.prices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async openCart() {
    await this.cartLink.click();
  }
}
module.exports = { InventoryPage };
