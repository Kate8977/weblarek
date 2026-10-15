import { CardBase, ICardBase } from "./CardBase";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { CDN_URL } from "../../utils/constants";

export interface ICard extends ICardBase{
  id: string;
  category: string;
  image: string;
}

export class Card extends CardBase<ICard> {
  public categoryElement: HTMLElement;
  public imageElement: HTMLImageElement;
  private productId!: string;

  constructor(events: IEvents, container: HTMLElement){
    super(events, container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    this.container.addEventListener('click', ()=> {
      this.events.emit('card: open', {id: this.productId});
    });
  }

  set category (value: string){
    this.categoryElement.textContent = value;
  }

  set image (value: string){
    this.imageElement.src = `${CDN_URL}${value}`;
  }

  set id(value: string){
    this.productId = value;
  }
}
