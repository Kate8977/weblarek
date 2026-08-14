import { IProduct } from "../../../types/index.ts";

export class ShoppingCart {
  private productsInCart: IProduct[];

  constructor(productsInCart: IProduct[]) {
    this.productsInCart = productsInCart;
  }

  getProductsInCart(): IProduct[] {
    return this.productsInCart;
  }

  addProductInCart(product: IProduct): void {
    this.productsInCart.push(product);
  }

  deleteProductFromCart(product: IProduct): void {
    const index = this.productsInCart.indexOf(product);
    this.productsInCart.splice(index, 1);
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
    const product = this.productsInCart.find((p) => p.id === id);
    if (product === undefined) {
      return false;
    }
    return true;
  }
}
