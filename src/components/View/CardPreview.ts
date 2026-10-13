import { CardBase } from "./CardBase";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface ICardPreview {
  description: string;
  image: string;
  category: string;
}

export class CardPreview extends CardBase{
  public cardBuyButton: HTMLButtonElement;
  public cardDescription: HTMLElement;
  public categoryElement: HTMLElement;
  public imageElement: HTMLImageElement;

  constructor(events: IEvents, container: HTMLElement){
    super(events, container);

    this.cardBuyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    this.cardBuyButton.addEventListener('click', ()=>{
      this.events.emit('card: basket');
    });
  }

  set description(value: string){
    this.cardDescription.textContent = value;
  }

  set image(value: string){
    this.imageElement.src = value;
  }

  set category(value: string){
    this.categoryElement.textContent = value;
  }
}