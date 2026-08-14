export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type TPayment = "cash" | "card" | null;

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export interface IProductResponse {
  total: number;
  items: IProduct[];
}

export interface ICreateOrderItem {
  id: string;
}

export interface ICreateOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: ICreateOrderItem[];
  total: number;
}

export interface IOrderResponse {
  id: string;
  total: number;
  error: string;
}
