import { IProduct } from "../../types/index.ts";

export class ShoppingCart {
  private productsInCart: IProduct[] = [];

  constructor() {}

  getProductsInCart(): IProduct[] {
    return this.productsInCart;
  }

  addProductInCart(product: IProduct): void {
    this.productsInCart.push(product);
  }

  deleteProductFromCart(product: IProduct): void {
    const productId = product.id;
    this.productsInCart = this.productsInCart.filter((p) => p.id != productId);
  }

  clearCart(): void {
    this.productsInCart = [];
  }

  getTotalCost(): number {
    return this.productsInCart.reduce((sum, product) => {
      if (typeof product.price !== "number") {
        return sum;
      }
      return sum + product.price;
    }, 0);
  }

  getQuantityProductsInCart(): number {
    return this.productsInCart.length;
  }

  checkProductAvailability(id: IProduct["id"]): boolean {
    return this.productsInCart.some((p) => p.id === id);
  }
}
