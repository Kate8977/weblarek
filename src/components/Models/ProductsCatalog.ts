import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class ProductsCatalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | undefined = undefined;

  constructor(private events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("catalog:changed")
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProduct(id: IProduct["id"]): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  setProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("product:changed");
  }

  getSelectedProduct(): IProduct | undefined {
    return this.selectedProduct;
  }
}
