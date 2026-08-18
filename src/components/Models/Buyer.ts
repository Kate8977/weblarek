import { IBuyer, TPayment, BuyerValidate } from "../../types/index.ts";
export class Buyer {
  private _payment: TPayment | undefined = undefined;
  private _email: string | undefined = "";
  private _phone: string | undefined = "";
  private _address: string | undefined = "";

  setBuyer(
    data: Partial<Pick<IBuyer, "payment" | "address" | "email" | "phone">>,
  ): void {
    if ("payment" in data && data.payment !== undefined)
      this._payment = data.payment;
    if ("address" in data && data.address !== undefined)
      this._address = data.address;
    if ("email" in data && data.email !== undefined) this._email = data.email;
    if ("phone" in data && data.phone !== undefined) this._phone = data.phone;
  }

  getBuyer(): IBuyer {
    return {
      payment: this._payment as TPayment,
      email: this._email as string,
      phone: this._phone as string,
      address: this._address as string,
    };
  }

  clear(): void {
    this._payment = undefined;
    this._email = undefined;
    this._phone = undefined;
    this._address = undefined;
  }

  validateStep1(): Partial<
    Record<keyof Pick<IBuyer, "payment" | "address">, string>
  > {
    const errors: Partial<Record<"payment" | "address", string>> = {};
    if (!this._payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this._address || !this._address.trim()) {
      errors.address = "Введите адресс";
    }
    return errors;
  }

  validation(): BuyerValidate {
    const errors: Partial<
      Record<"payment" | "address" | "email" | "phone", string>
    > = {};
    if (!this._payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this._address || !this._address.trim()) {
      errors.address = "Введите адресс";
    }
    if (!this._email || !this._email.trim()) {
      errors.email = "Введите email";
    }
    if (!this._phone || !this._phone.trim()) {
      errors.phone = "Введите номер телефона";
    }
    return errors;
  }

  isValid(): boolean {
    return Object.keys(this.validation()).length === 0;
  }
}
