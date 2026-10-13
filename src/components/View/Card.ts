import { CardBase } from "./CardBase";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface ICard{
  category: string;
  image: string;
}

export class Card extends CardBase{
  public categoryElement: HTMLElement;
  public imageElement: HTMLImageElement;

  constructor(events: IEvents, container: HTMLElement){
    super(events, container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    this.container.addEventListener('click', ()=> {
      this.events.emit('card: open');
    });
  }

  set category (value: string){
    this.categoryElement.textContent = value;
  }

  set image (value: string){
    this.imageElement.src = value;
  }
}