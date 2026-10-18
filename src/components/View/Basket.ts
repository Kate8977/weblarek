import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

interface IBasket {
  basketList: HTMLElement[];
  price: string;
}

export class Basket  extends Component<IBasket>{
  public basketButton: HTMLButtonElement;
  public basketPrice: HTMLElement;
  public listContainer: HTMLElement;

  constructor(protected events: IEvents, public container:HTMLElement){
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);
    this.listContainer = ensureElement<HTMLElement>('.basket__list', this.container);

    this.basketButton.addEventListener('click', ()=>{
      this.events.emit('order:place');
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