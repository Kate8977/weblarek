import {
  ICreateOrderRequest,
  IOrderResponse,
  IApi,
  IProductResponse,
} from "../../types/index.ts";

export class ApiService {
  private apiClient: IApi;

  constructor(apiClient: IApi) {
    this.apiClient = apiClient;
  }

  async fetchProducts(): Promise<IProductResponse> {
    const response = await this.apiClient.get<IProductResponse>("/product/");
    return response;
  }

  async createOrder(
    orderPayload: ICreateOrderRequest,
  ): Promise<IOrderResponse> {
    return await this.apiClient.post<IOrderResponse>("/order/", orderPayload);
  }
}
