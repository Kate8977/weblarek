import { IBuyer, TPayment } from "../../../types/index.ts";
export class Buyer {
  private _payment: TPayment | undefined = undefined;
  private _email: string | undefined = undefined;
  private _phone: string | undefined = undefined;
  private _address: string | undefined = undefined;

  saveStep1(data: Partial<Pick<IBuyer, "payment" | "address">>): void {
    if ("payment" in data && data.payment !== undefined)
      this._payment = data.payment;
    if ("address" in data && data.address !== undefined)
      this._address = data.address;
  }

  saveStep2(data: Partial<Pick<IBuyer, "email" | "phone">>): void {
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

  validateStep2(): Partial<
    Record<keyof Pick<IBuyer, "email" | "phone">, string>
  > {
    const errors: Partial<Record<"email" | "phone", string>> = {};
    if (!this._email || !this._email.trim()) {
      errors.email = "Введите email";
    }
    if (!this._phone || !this._phone.trim()) {
      errors.phone = "Введите номер телефона";
    }
    return errors;
  }

  isStep1Valid(): boolean {
    return Object.keys(this.validateStep1()).length === 0;
  }

  isStep2Valid(): boolean {
    return Object.keys(this.validateStep2()).length === 0;
  }
}
