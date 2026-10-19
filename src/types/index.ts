export type ApiPostMethods = "POST" | "PUT" | "DELETE";
export type TPayment = "online" | "cash" | null;
export type BuyerValidate = Partial<
  Record<keyof Pick<IBuyer, "payment" | "address" | "email" | "phone">, string>
>;

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

export type ICreateOrderItem = string;

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
}
export interface IBasket {
  basketList: HTMLElement[];
  price: string;
}

export interface ICard extends ICardBase {
  category: string;
  image: string;
}

export interface ICardBase {
  id: string;
  title: string;
  price: number | null;
}

export interface ICardBasket extends ICardBase {
  index: number;
}

export interface ICardPreview extends ICard {
  description: string;
  buttonText: string;
}

export interface IContactForm {
  phone: string;
  email: string;
  errors: BuyerValidate;
}

export interface IGallery {
  catalog: HTMLElement[];
}

export interface IHeader {
  counter: number;
}

export interface IModal {
  content: HTMLElement[];
}

export interface IOrderForm {
  payment: TPayment;
  address: string;
  errors: BuyerValidate;
}

export interface ISuccess {
  orderDescription: string;
}