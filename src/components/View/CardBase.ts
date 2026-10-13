import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Component } from "../base/Component";

interface ICardBase{
  title: string;
  price: string;
}

export class CardBase extends Component<ICardBase>{
  public titleElement: HTMLElement;
  public priceElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement){
    super(container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);

  }

  set title(value:string){
    this.titleElement.textContent = value;
  }

  set price(value: string){
    this.priceElement.textContent = value;
  }
}
