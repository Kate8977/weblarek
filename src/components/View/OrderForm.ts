import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IOrderForm{
  payment: string;
  address: string;
}

export class OrderForm extends Form<IOrderForm>{
  public onlineButton: HTMLButtonElement;
  public offlineButton: HTMLButtonElement;
  public addressInput: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement){
    super(events, container);

    this.onlineButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
    this.offlineButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

    this.offlineButton.addEventListener('click', () => {
      this.events.emit('order:payment-change', {payment: 'cash'});
    })

    this.onlineButton.addEventListener('click', () => {
      this.events.emit('order:payment-change', {payment: 'card'});
    })

    this.addressInput.addEventListener('input', () => {
      this.events.emit('order:address-change', {address: this.addressInput.value});
    })
  }
  set payment (payment: string){
    this.offlineButton.classList.toggle('button_alt-active', payment=== 'cash');
    this.onlineButton.classList.toggle('button_alt-active', payment === 'card');
  }

  set address (address: string){
    this.addressInput.value = address;
  }
}