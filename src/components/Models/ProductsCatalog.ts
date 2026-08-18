import { IProduct } from "../../types/index.ts";

export class ProductsCatalog {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | undefined = undefined;

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProduct(id: IProduct["id"]): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  setProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | undefined {
    return this.selectedProduct;
  }
}
