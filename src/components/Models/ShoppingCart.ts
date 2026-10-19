import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class ShoppingCart {
  private productsInCart: IProduct[] = [];

  constructor(private events: IEvents) {}

  getProductsInCart(): IProduct[] {
    return this.productsInCart;
  }

  addProductInCart(product: IProduct): void {
    this.productsInCart.push(product);
    this.events.emit("basket:changed");
  }

  deleteProductFromCart(product: IProduct): void {
    const productId = product.id;
    this.productsInCart = this.productsInCart.filter((p) => p.id != productId);
    this.events.emit("basket:changed");
  }

  clearCart(): void {
    this.productsInCart = [];
    this.events.emit("basket:changed");
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
