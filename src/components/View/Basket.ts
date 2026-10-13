import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Modal, IModal } from "./Modal";

interface IBasket extends IModal{
  basketList: HTMLElement[];
  price: string;
}

export class Basket extends Modal {
  public basketButton: HTMLButtonElement;
  public basketPrice: HTMLElement;
  public listContainer: HTMLElement;

  constructor(events: IEvents, container:HTMLElement, template: HTMLTemplateElement){
    super(events, container);

    this.modalContent.replaceChildren(
      template.content.cloneNode(true)
    );

    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);
    this.listContainer = ensureElement<HTMLElement>('.basket__list', this.container);

    this.basketButton.addEventListener('click', ()=>{
      this.events.emit('order: place');
    });
  }
  set price(value:string){
      this.basketPrice.textContent = value;
    }

  set basketList(list: HTMLElement[]){
    this.listContainer.innerHTML = '';

  list.forEach(element => {
    this.listContainer.append(element);
  });
  }
}