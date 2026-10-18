import { Form } from "./Form";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { BuyerValidate } from "../../types";

interface IContactForm{
  phone: string;
  email: string;
  errors:BuyerValidate;
}

export class ContactsForm extends Form <IContactForm>{
  public emailInput: HTMLInputElement;
  public phoneInput: HTMLInputElement;

  constructor (events: IEvents, container: HTMLElement){
    super(events, container);

    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);

    this.phoneInput.addEventListener('input', () => {
      this.events.emit('contacts:phone-change', {phone: this.phoneInput.value});
    })

    this.emailInput.addEventListener('input', () => {
      this.events.emit('contacts:email-change', {email: this.emailInput.value});
    })
  }

  set phone(phone: string){
    this.phoneInput.value = phone;
  }

  set email(email: string){
    this.emailInput.value = email;
  }

  set errors(errors: BuyerValidate){
    this.errorsContainer.textContent = Object.values(errors).join(" ");
    this.submitButton.disabled = Object.keys(errors).length > 0;
  }
}