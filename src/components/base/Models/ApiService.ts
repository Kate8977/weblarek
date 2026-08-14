import {
  ICreateOrderRequest,
  IOrderResponse,
  IApi,
  IProductResponse,
  IProduct,
  IBuyer,
} from "../../../types/index.ts";
import { ShoppingCart } from "./ShoppingCart.ts";

export class ApiService {
  private apiClient: IApi;

  constructor(apiClient: IApi) {
    this.apiClient = apiClient;
  }

  async fetchProducts(): Promise<IProduct[]> {
    try {
      const response = await this.apiClient.get<IProductResponse>("/product/");
      return response.items;
    } catch (error) {
      console.error("error:", error);
      throw new Error("NotFound");
    }
  }

  async createOrder(
    cartModel: ShoppingCart,
    buyerData: IBuyer,
  ): Promise<IOrderResponse> {
    try {
      const orderPayload: ICreateOrderRequest = {
        payment: buyerData.payment,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: cartModel.getTotalCost(),
        // 🔹 Ключевой момент! Передаем все товары из корзины
        items: cartModel.getProductsInCart().map((item) => ({
          id: item.id,
        })),
      };

      return await this.apiClient.post<IOrderResponse>("/order/", orderPayload);
    } catch (err) {
      console.error("error:", err);
      throw new Error();
    }
  }
}
