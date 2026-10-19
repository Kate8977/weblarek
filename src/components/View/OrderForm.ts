import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { TPayment} from "../../types";
import { IOrderForm } from "../../types";
export class OrderForm extends Form<IOrderForm> {
  protected onlineButton: HTMLButtonElement;
  protected offlineButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.onlineButton = ensureElement<HTMLButtonElement>(
      'button[name="card"]',
      this.container,
    );
    this.offlineButton = ensureElement<HTMLButtonElement>(
      'button[name="cash"]',
      this.container,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container,
    );

    this.offlineButton.addEventListener("click", () => {
      this.events.emit("order:payment-change", { payment: "cash" });
    });

    this.onlineButton.addEventListener("click", () => {
      this.events.emit("order:payment-change", { payment: "online" });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order:address-change", {
        address: this.addressInput.value,
      });
    });
  }
  set payment(payment: TPayment) {
    this.offlineButton.classList.toggle(
      "button_alt-active",
      payment === "cash",
    );
    this.onlineButton.classList.toggle(
      "button_alt-active",
      payment === "online",
    );
  }

  set address(address: string) {
    this.addressInput.value = address;
  }
}
